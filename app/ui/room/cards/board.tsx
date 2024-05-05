import { fetchGame, fetchUser } from "@/app/lib/cache-data";
import { auth } from "@/auth";
import Cards from "./cards";
import { Card, Game, GameStatus, User } from "@/app/lib/definitions";

function getPossibleCommunityCards(board: Card[], gameStatus: GameStatus) {
    if (gameStatus === GameStatus.PREFLOP) return [];
    return board.slice(0, 2 + gameStatus);
}

export default async function Board() {
    const session = await auth();
    const game: Game = await fetchGame(session?.user.roomId!);
    const user: User = (await fetchUser(
        session?.user.roomId!,
        session?.user.name!
    ))!;
    const status = game ? game.gameStatus : GameStatus.PREFLOP;
    const communityCards = getPossibleCommunityCards(
        game ? game.communityCards : [],
        status
    );

    return (
        <>
            {communityCards && (
                <div className="flex flex-row w-screen justify-center content-center">
                    <Cards cards={communityCards} />
                </div>
            )}
            {user?.hands && (
                <div>
                    <span>Your Hands : </span>
                    <Cards cards={user.hands} />
                </div>
            )}
            {game && (
                <div>
                    <span>Bet Size: {game.currentBet}</span>
                </div>
            )}
        </>
    );
}
