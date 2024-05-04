import { auth } from "@/auth";
import PlayerSeat from "./player-seat";
import { PlayingButton } from "./playing-button";
import { fetchPlayerTable, fetchUsers } from "@/app/lib/cache-data";

export default async function Players() {
    const session = await auth();
    if (!session) return;
    const currentPlayer = (await fetchPlayerTable(session.user.roomId))[0];
    const users = await fetchUsers(session.user.roomId);
    return (
        <>
            {users && (
                <div className="absolute inset-0 flex justify-center items-center mt-40">
                    <PlayerSeat
                        turnPlayerId={currentPlayer ? currentPlayer : ""}
                        users={users}
                    />

                    {!currentPlayer && (
                        <PlayingButton
                            name={session?.user.name!}
                            roomId={session?.user.roomId}
                        />
                    )}
                </div>
            )}
        </>
    );
}
