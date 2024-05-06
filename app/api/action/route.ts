import { fetchRoom, setRoom } from "../../lib/cache-data";
import { NextResponse } from "next/server";
import { playWith } from "@/core/game";
import {
    Action,
    Game,
    GameStatus,
    MoneyLog,
    Room,
    User,
} from "@/app/lib/definitions";
import { giveMoneyTo, splitMoney } from "@/core/pot";
import { makeResult } from "@/core/result";
import { updateMoney } from "@/app/lib/data";
import { socket } from "@/app/lib/socket";

//this function has side effect.
function handleMoneyWithAction(
    action: Action,
    user: User,
    turnLogs: MoneyLog[],
    game: Game
) {
    if (action.name === "BET" || action.name === "CALL") {
        const userLog = turnLogs.find((log) => log.playerName === user.name)!;
        user.money! -= action.size;
        user.money! += userLog.money;
        game.potSize += action.size - userLog.money;
        userLog.money = action.size;
    }
}

//this function has side effect
function updateBetLogs(turnLogs: MoneyLog[], totalLogs: MoneyLog[]) {
    turnLogs.forEach((log) => {
        const totalOne = totalLogs.find(
            (total) => total.playerName === log.playerName
        )!;
        totalOne.money += log.money;
        log.money = 0;
    });
}

//this function has side effect
async function setGameEnd(room: Room) {
    const totalLogs: MoneyLog[] = room.totalBetMoney;
    const turnLogs: MoneyLog[] = room.turnBetMoney;
    totalLogs.forEach((log) => {
        log.money += turnLogs.find(
            (tl) => tl.playerName === log.playerName
        )?.money!;
    });
    const users: User[] = room.users;
    const game = room.game!;
    let result: MoneyLog[];
    if (1 === game.players.length) {
        result = giveMoneyTo(game.players[0], totalLogs);
        room.gameResult = [{ name: game.players[0], rank: "" }];
    } else {
        const [winners, losers, ranks] = makeResult(users, game.communityCards);
        result = splitMoney(winners, losers, totalLogs);
        room.gameResult = ranks;
    }
    users.forEach(async (user) => {
        user.money! += result.find(
            (log) => log.playerName === user.name
        )?.money!;
        await updateMoney(user.id, Number(user.money));
    });
}

export async function POST(req: Request) {
    const { roomId, action, name } = await req.json();
    const room: Room = await fetchRoom(roomId);
    const beforeStatus = room.game?.gameStatus;
    const gameAfterAction = playWith(action, room.game!);
    room.game = gameAfterAction;
    const user = room.users.find((u) => u.name === name)!;
    handleMoneyWithAction(action, user, room.turnBetMoney, room.game);
    let emitMessage = "";
    if (gameAfterAction.gameStatus !== beforeStatus) {
        updateBetLogs(room.turnBetMoney, room.totalBetMoney);
        emitMessage = "card";
        const names: string[] = [];
        room.users.forEach((u) => {
            if (gameAfterAction.players.includes(u.name))
                return names.push(u.name);
        });
        room.game.players = names;
    }
    if (room.game.gameStatus === GameStatus.END) {
        setGameEnd(room);
    }
    socket.emit("room_change", roomId, emitMessage);
    await setRoom(roomId, room);
    return NextResponse.json("good job");
}
