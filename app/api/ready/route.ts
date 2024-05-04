import {
    fetchUsers,
    setBoardCard,
    setCurrentBet,
    setGame,
    setNumOfLeftTurn,
    setPlayerTable,
    setUserCard,
    updateBetMoney,
    updateUsers,
} from "../../lib/cache-data";
import { NextResponse } from "next/server";
import { Card, Game, GameStatus, User } from "@/app/lib/definitions";
import { isEveryoneReady, makeUserReady } from "@/newcore/room";
import { makeDeck } from "@/newcore/deck";

export async function POST(req: Request) {
    const { roomId, name, smallBlind, bigBlind } = await req.json();
    const users: User[] = await fetchUsers(roomId);
    if (isEveryoneReady(users)) return NextResponse.json("wrong request.");
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
            await setUserCard(user.name, user.hands);
        });
        const playersName: string[] = users.map((user) => {
            return user.name;
        });
        await updateBetMoney(roomId, firstBet);
        await setNumOfLeftTurn(roomId, users.length);
        await setCurrentBet(roomId, bigBlind);
        await setGame(roomId, game);
        await setBoardCard(roomId, deck);
        await setPlayerTable(roomId, playersName);
        await updateUsers(roomId, users);
    }
    return NextResponse.json("good job");
}
