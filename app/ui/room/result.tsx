import { fetchRoom } from "@/app/lib/cache-data";
import { auth } from "@/auth";
import Replay from "./replay";
import { PlayerResult, Room } from "@/app/lib/definitions";
import { unstable_noStore } from "next/cache";

export default async function GameResult() {
    unstable_noStore();
    const session = await auth();
    if (!session) return;
    const room: Room = await fetchRoom(session.user.roomId);
    const playerResult: PlayerResult[] | null =
        room.gameResult !== null ? room.gameResult : null;
    return (
        <>
            {playerResult && (
                <>
                    <div>
                        {playerResult.map(({ name, rank }) => {
                            return (
                                <div key={name}>
                                    the winner is {name}{" "}
                                    {rank !== "" ? `with ${rank}` : ""}
                                </div>
                            );
                        })}
                    </div>
                    <Replay roomId={session.user.roomId} />
                </>
            )}
        </>
    );
}
