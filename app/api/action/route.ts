import {
    fetchBetMoney,
    fetchGame,
    fetchUser,
    fetchUsers,
    setGame,
    setGameResult,
    updateBetMoney,
    updateUser,
    updateUsers,
} from "../../lib/cache-data";
import { NextResponse } from "next/server";
import { playWith } from "@/newcore/game";
import { Action, Game, GameStatus, User } from "@/app/lib/definitions";
import { giveMoneyTo, splitMoney } from "@/newcore/pot";
import { makeResult } from "@/newcore/result";
import { updateMoney } from "@/app/lib/data";

async function handlePlayersMoney(
    roomId: string,
    action: Action,
    name: string
) {
    const user: User = (await fetchUser(roomId, name))!;
    if (action.name === "BET" || action.name === "CALL") {
        const betMoney: Map<string, number> = (await fetchBetMoney(roomId))!;
        user.money! -= action.size;
        betMoney.set(name, action.size);
        await updateUser(roomId, user);
        await updateBetMoney(roomId, betMoney);
    }
}

async function handleGameEnd(roomId: string, game: Game) {
    const betMoney: Map<string, number> = (await fetchBetMoney(roomId))!;
    const users: User[] = await fetchUsers(roomId);
    let result: Map<string, number>;
    console.log("players: in POST", users);
    console.log("betMoney", betMoney);
    if (1 === game.players.length) {
        result = giveMoneyTo(game.players[0], betMoney);
        await setGameResult(roomId, game.players);
    } else {
        const [winners, losers] = makeResult(users, game.communityCards);
        result = splitMoney(winners, losers, betMoney);
        await setGameResult(roomId, winners);
    }
    users.forEach(async (user) => {
        user.money! += result.get(user.name)!;
        await updateMoney(user.id, Number(user.money));
    });
    await updateUsers(roomId, users);
}

export async function POST(req: Request) {
    const { roomId, action, name } = await req.json();
    const beforeStatus = await fetchGame(roomId);
    const afterStatus = playWith(action, beforeStatus);
    handlePlayersMoney(roomId, action, name);
    console.log(afterStatus);
    await setGame(roomId, afterStatus);
    if (afterStatus.gameStatus === GameStatus.END) {
        handleGameEnd(roomId, afterStatus);
    }
    return NextResponse.json("good job");
}
