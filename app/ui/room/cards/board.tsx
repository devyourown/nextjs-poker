import { fetchBoardCard, fetchUserCard } from "@/app/lib/cache-data";
import { auth } from "@/auth";
import Cards from "./cards";

export default async function Board() {
    const session = await auth();
    const boardCard = await fetchBoardCard(session?.user.roomId!);
    const userCard = await fetchUserCard(session?.user.id!);

    return (
        <>
            <div className="flex flex-row w-screen justify-center content-center">
                {boardCard && <Cards cards={boardCard} />}
            </div>
            {userCard && (
                <div>
                    <span>Your Hands : </span>
                    <Cards cards={userCard} />
                </div>
            )}
        </>
    );
}
