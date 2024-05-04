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
            await setNumOfLeftTurn(
                roomId,
                (await fetchNumOfLeftTurn(roomId)) + 1
            );
        }
        const betMoney: Map<string, number> = await fetchBetMoney(roomId);
        user.money! -= action.size;
        betMoney.set(name, action.size);
        await updateUser(roomId, name, user);
        await updateBetMoney(roomId, betMoney);
    } else if (action.name === "FOLD") {
        players.pop();
    }
    await setPlayerTable(roomId, players);
}

export async function POST(req: Request) {
    const { roomId, action, name } = await req.json();
    const beforeStatus = await fetchGame(roomId);
    const afterStatus = playWith(action, beforeStatus);
    dealAction(roomId, action, name);
    if (afterStatus.gameStatus == GameStatus.END) {
        const playersName: string[] = await fetchPlayerTable(roomId);
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
        }
        users.forEach(async (user) => {
            user.money! += result.get(user.name)!;
            await updateMoney(user.id, Number(user.money));
        });
        await updateUsers(roomId, users);
    }
    await setGame(roomId, afterStatus);
    //afterStatus를 보고 게임을 진행함
    //const room = await findRoom(roomId);
    //room?.playAction(userAction);
    //saveRoom(room!);
    return NextResponse.json("good job");
}
