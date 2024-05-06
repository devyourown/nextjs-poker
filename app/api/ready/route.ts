import { fetchRoom, setRoom } from "../../lib/cache-data";
import { NextResponse } from "next/server";
import { Card, Game, GameStatus, MoneyLog, Room } from "@/app/lib/definitions";
import { isEveryoneReady, makeUserReady } from "@/core/room";
import { makeDeck } from "@/core/deck";
import { socket } from "@/app/lib/socket";

//this function has side effect
function makeGame(room: Room, smallBlind: number, bigBlind: number) {
    const users = room.users;
    const deck: Card[] = makeDeck(users.length);
    const firstBet: MoneyLog[] = [];
    users.forEach((user, index) => {
        if (index === users.length - 2) {
            user.money! -= smallBlind;
            firstBet.push({ playerName: user.name, money: smallBlind });
        }
        if (index === users.length - 1) {
            user.money! -= bigBlind;
            firstBet.push({ playerName: user.name, money: bigBlind });
        }
        user.hands = [deck.pop()!, deck.pop()!];
    });
    const playersName: string[] = users.map((user) => {
        return user.name;
    });
    const game: Game = {
        numOfAllinPlayers: 0,
        gameStatus: GameStatus.PREFLOP,
        numOfLeftTurn: users.length,
        currentBet: bigBlind,
        players: playersName,
        communityCards: deck,
    };
    room.game = game;
    room.turnBetMoney = firstBet;
    room.users = users;
}

export async function POST(req: Request) {
    const { roomId, name, smallBlind, bigBlind, replay } = await req.json();
    const room: Room = await fetchRoom(roomId);
    if (replay) {
        makeGame(room, smallBlind, bigBlind);
        room.gameResult = null;
        return NextResponse.json("replay");
    }
    if (isEveryoneReady(room.users)) return NextResponse.json("wrong request.");
    makeUserReady(room.users, name);
    if (isEveryoneReady(room.users)) {
        makeGame(room, smallBlind, bigBlind);
        socket.emit("room_change", roomId, "card");
    } else {
        socket.emit("room_change", roomId);
    }
    await setRoom(roomId, room);
    return NextResponse.json("good job");
}
