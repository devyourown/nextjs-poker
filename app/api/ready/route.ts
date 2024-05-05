import {
    fetchUsers,
    setGame,
    updateBetMoney,
    updateUsers,
} from "../../lib/cache-data";
import { NextResponse } from "next/server";
import { Card, Game, GameStatus, User } from "@/app/lib/definitions";
import { isEveryoneReady, makeUserReady } from "@/newcore/room";
import { makeDeck } from "@/newcore/deck";

async function makeGame(
    roomId: string,
    users: User[],
    smallBlind: number,
    bigBlind: number
) {
    const deck: Card[] = makeDeck(users.length);
    const firstBet = new Map<string, number>();
    users.forEach(async (user, index) => {
        if (index === users.length - 2) {
            user.money! -= smallBlind;
            firstBet.set(user.name, smallBlind);
        }
        if (index === users.length - 1) {
            user.money! -= bigBlind;
            firstBet.set(user.name, bigBlind);
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
    await updateBetMoney(roomId, firstBet);
    await setGame(roomId, game);
    await updateUsers(roomId, users);
}

export async function POST(req: Request) {
    const { roomId, name, smallBlind, bigBlind } = await req.json();
    const users: User[] = await fetchUsers(roomId);
    if (isEveryoneReady(users)) return NextResponse.json("wrong request.");
    makeUserReady(users, name);
    await updateUsers(roomId, users);
    if (isEveryoneReady(users)) {
        console.log("your game prepared.");
        await makeGame(roomId, users, smallBlind, bigBlind);
    }
    return NextResponse.json("good job");
}
