import { auth } from "@/auth";
import PlayerSeat from "./player-seat";
import { PlayingButton } from "./playing-button";
import { fetchPlayerTable, fetchUsers } from "@/app/lib/cache-data";

export default async function Players() {
    const session = await auth();
    if (!session) return;
    const playerTable = await fetchPlayerTable(session.user.roomId);
    const users = await fetchUsers(session.user.roomId);
    return (
        <>
            {users && (
                <div className="absolute inset-0 flex justify-center items-center mt-40">
                    <PlayerSeat
                        turnPlayerId={playerTable ? playerTable[0] : ""}
                        users={users}
                    />

                    {!playerTable && (
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
