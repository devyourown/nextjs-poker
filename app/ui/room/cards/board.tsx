import { fetchBoardCard, fetchGame, fetchUserCard } from "@/app/lib/cache-data";
import { auth } from "@/auth";
import Cards from "./cards";
import { Card, Game, GameStatus } from "@/app/lib/definitions";

function getPossibleCommunityCards(board: Card[], gameStatus: GameStatus) {
    if (gameStatus === GameStatus.PREFLOP) return [];
    return board.slice(0, 2 + gameStatus);
}

export default async function Board() {
    const session = await auth();
    const boardCard = await fetchBoardCard(session?.user.roomId!);
    const userCard = await fetchUserCard(session?.user.name!);
    const game: Game = await fetchGame(session?.user.roomId!);
    const status = game ? game.gameStatus : GameStatus.PREFLOP;
    const communityCards = getPossibleCommunityCards(boardCard, status);

    return (
        <>
            {communityCards && (
                <div className="flex flex-row w-screen justify-center content-center">
                    <Cards cards={communityCards} />
                </div>
            )}
            {userCard && (
                <div>
                    <span>Your Hands : </span>
                    <Cards cards={userCard} />
                </div>
            )}
        </>
    );
}
