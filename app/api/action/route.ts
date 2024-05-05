import {
    fetchBetMoney,
    fetchGame,
    fetchTurnBet,
    fetchUser,
    fetchUsers,
    setGame,
    setGameResult,
    updateBetMoney,
    updateTurnBet,
    updateUser,
    updateUsers,
} from "../../lib/cache-data";
import { NextResponse } from "next/server";
import { playWith } from "@/newcore/game";
import {
    Action,
    Game,
    GameStatus,
    MoneyLog,
    User,
} from "@/app/lib/definitions";
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
        const logs: MoneyLog[] = (await fetchTurnBet(roomId))!;
        const money = logs.find((log) => log.playerName === name)?.money;
        user.money! -= action.size;
        await updateUser(roomId, user);
        await updateTurnBet(roomId, {
            playerName: name,
            money: money! + action.size,
        });
    }
}

async function handleGameEnd(roomId: string, game: Game) {
    const betMoney: Map<string, number> = (await fetchBetMoney(roomId))!;
    const users: User[] = await fetchUsers(roomId);
    let result: Map<string, number>;
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

async function updateBet(roomId: string) {
    const betMoney: MoneyLog[] = (await fetchBetMoney(roomId))!;
    const turnBet: MoneyLog[] = (await fetchTurnBet(roomId))!;
    const newLog: MoneyLog[] = [];
    turnBet.forEach((log) => {
        const alreadyBet = betMoney.find(
            (bet) => bet.playerName === log.playerName
        )?.money;
        newLog.push({
            playerName: log.playerName,
            money: log.money + alreadyBet!,
        });
    });
    await updateBetMoney(roomId, newLog);
}

export async function POST(req: Request) {
    const { roomId, action, name } = await req.json();
    const beforeStatus: Game = await fetchGame(roomId);
    const afterStatus = playWith(action, beforeStatus);
    await handlePlayersMoney(roomId, action, name);
    if (beforeStatus.gameStatus !== afterStatus.gameStatus) updateBet(roomId);
    await setGame(roomId, afterStatus);
    if (afterStatus.gameStatus === GameStatus.END) {
        await handleGameEnd(roomId, afterStatus);
    }
    return NextResponse.json("good job");
}
