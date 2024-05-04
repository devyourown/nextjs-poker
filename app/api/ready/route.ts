import {
    fetchUsers,
    setBoardCard,
    setCurrentBet,
    setGame,
    setNumOfLeftTurn,
    setPlayerTable,
    updateUsers,
} from "../../lib/cache-data";
import { NextResponse } from "next/server";
import { Card, Game, GameStatus, User } from "@/app/lib/definitions";
import { isEveryoneReady, makeUserReady } from "@/newcore/room";
import { makeDeck } from "@/newcore/deck";

export async function POST(req: Request) {
    const { roomId, name, smallBlind, bigBlind } = await req.json();
    const users: User[] = await fetchUsers(roomId);
    if (isEveryoneReady(users)) return;
    makeUserReady(users, name);
    await updateUsers(roomId, users);
    if (isEveryoneReady(users)) {
        console.log("your game prepared.");
        const deck: Card[] = makeDeck(users.length);
        const game: Game = {
            numOfAllinPlayers: 0,
            numOfFoldPlayers: 0,
            numOfPlayers: users.length,
            gameStatus: GameStatus.PREFLOP,
        };
        users.forEach((user, index) => {
            if (index === length - 2) user.money! -= smallBlind;
            if (index === length - 1) user.money! -= bigBlind;
            user.hands = [deck.pop()!, deck.pop()!];
        });
        const playersName: string[] = users.map((user) => {
            return user.name;
        });
        await setNumOfLeftTurn(roomId, users.length);
        await setCurrentBet(roomId, bigBlind);
        await setGame(roomId, game);
        await setBoardCard(roomId, deck);
        await setPlayerTable(roomId, playersName);
        await updateUsers(roomId, users);
    }
    return NextResponse.json("good job");
}
