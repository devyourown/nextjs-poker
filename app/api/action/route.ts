import {
    fetchBetMoney,
    fetchBoardCard,
    fetchGame,
    fetchNumOfLeftTurn,
    fetchPlayerTable,
    fetchUser,
    fetchUsers,
    setCurrentBet,
    setGame,
    setGameResult,
    setNumOfLeftTurn,
    setPlayerTable,
    updateBetMoney,
    updateUser,
    updateUsers,
} from "../../lib/cache-data";
import { NextResponse } from "next/server";
import { playWith } from "@/newcore/game";
import { Action, GameStatus, User } from "@/app/lib/definitions";
import { giveMoneyTo, splitMoney } from "@/newcore/pot";
import { makeResult } from "@/newcore/result";
import { updateMoney } from "@/app/lib/data";

async function dealAction(roomId: string, action: Action, name: string) {
    const players: string[] = await fetchPlayerTable(roomId);
    const user: User = (await fetchUser(roomId, name))!;
    const first = players.shift()!;
    players.push(first);
    let numOfLeftTurn = await fetchNumOfLeftTurn(roomId);
    if (action.name === "BET" || action.name === "CALL") {
        if (action.name === "BET") {
            await setCurrentBet(roomId, action.size);
            numOfLeftTurn = players.length;
        }
        const betMoney: Map<string, number> = (await fetchBetMoney(roomId))!;
        console.log("deal action m : ", user.money);
        user.money! -= action.size;
        betMoney.set(name, action.size);
        console.log("deal action : ", user);
        await updateUser(roomId, user);
        await updateBetMoney(roomId, betMoney);
    } else if (action.name === "FOLD") {
        players.pop();
    }
    numOfLeftTurn -= 1;
    await setNumOfLeftTurn(roomId, numOfLeftTurn);
    await setPlayerTable(roomId, players);
}

export async function POST(req: Request) {
    const { roomId, action, name } = await req.json();
    const beforeStatus = await fetchGame(roomId);
    const playersName: string[] = await fetchPlayerTable(roomId);
    const numOfLeftTurn: number = await fetchNumOfLeftTurn(roomId);
    const afterStatus = playWith(action, beforeStatus, numOfLeftTurn);
    dealAction(roomId, action, name);
    if (afterStatus.gameStatus == GameStatus.END) {
        const betMoney: Map<string, number> = (await fetchBetMoney(roomId))!;
        const users: User[] = await fetchUsers(roomId);
        const board = await fetchBoardCard(roomId);
        let result: Map<string, number>;
        console.log("players: in POST", users);
        console.log("betMoney", betMoney);
        if (afterStatus.numOfFoldPlayers + 1 == afterStatus.numOfPlayers) {
            result = giveMoneyTo(playersName[1], betMoney);
        } else {
            const [winners, losers] = makeResult(users, board);
            result = splitMoney(winners, losers, betMoney);
            await setGameResult(roomId, winners);
        }
        users.forEach(async (user) => {
            user.money! += result.get(user.name)!;
            await updateMoney(user.id, Number(user.money));
        });
        await updateUsers(roomId, users);
    } else if (numOfLeftTurn <= 0) {
        console.log("turn over !!");
        await setCurrentBet(roomId, 0);
        await setNumOfLeftTurn(roomId, playersName.length);
    }
    console.log(afterStatus);
    await setGame(roomId, afterStatus);
    return NextResponse.json("good job");
}
