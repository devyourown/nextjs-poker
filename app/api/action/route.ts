import {
    fetchBetMoney,
    fetchBoardCard,
    fetchGame,
    fetchNumOfLeftTurn,
    fetchPlayerTable,
    fetchUser,
    fetchUserCard,
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
import { Action, Card, GameStatus, Player, User } from "@/app/lib/definitions";
import { giveMoneyTo, splitMoney } from "@/newcore/pot";
import { makeResult } from "@/newcore/result";
import { updateMoney } from "@/app/lib/data";

async function dealAction(roomId: string, action: Action, name: string) {
    const players: string[] = await fetchPlayerTable(roomId);
    const user: User = (await fetchUser(roomId, name)) as any;
    const first = players.shift()!;
    players.push(first);
    if (action.name === "BET" || action.name === "CALL") {
        if (action.name === "BET") {
            await setCurrentBet(roomId, action.size);
            await setNumOfLeftTurn(roomId, players.length);
        }
        const betMoney: Map<string, number> = await fetchBetMoney(roomId);
        user.money! -= action.size;
        betMoney.set(name, action.size);
        await updateUser(roomId, user);
        await updateBetMoney(roomId, betMoney);
    } else if (action.name === "FOLD") {
        players.pop();
    }
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
        const betMoney: Map<string, number> = await fetchBetMoney(roomId);
        const users: User[] = await fetchUsers(roomId);
        const board = await fetchBoardCard(roomId);
        const players: Player[] = [];
        playersName.forEach(async (name) => {
            const hands: Card[] = await fetchUserCard(name);
            players.push({
                name: name,
                hands: hands,
            });
        });
        let result: Map<string, number>;
        if (afterStatus.numOfFoldPlayers + 1 == afterStatus.numOfPlayers) {
            result = giveMoneyTo(players[0].name, betMoney);
        } else {
            const [winners, losers] = makeResult(players, board);
            result = splitMoney(winners, losers, betMoney);
            await setGameResult(roomId, winners);
        }
        users.forEach(async (user) => {
            user.money! += result.get(user.name)!;
            await updateMoney(user.id, Number(user.money));
        });
        await updateUsers(roomId, users);
    } else if (numOfLeftTurn <= 0) {
        await setCurrentBet(roomId, 0);
        await setNumOfLeftTurn(roomId, playersName.length);
    }
    await setGame(roomId, afterStatus);
    return NextResponse.json("good job");
}
