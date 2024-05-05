import { fetchGameResult } from "@/app/lib/cache-data";
import { auth } from "@/auth";
import Replay from "./replay";
import { PlayerResult } from "@/app/lib/definitions";

export default async function GameResult() {
    const session = await auth();
    if (!session) return;
    const playerResult: PlayerResult[] = await fetchGameResult(
        session?.user.roomId
    );
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
