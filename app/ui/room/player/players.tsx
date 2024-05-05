import { auth } from "@/auth";
import PlayerSeat from "./player-seat";
import { PlayingButton } from "./playing-button";
import { fetchGame, fetchUsers } from "@/app/lib/cache-data";
import { Game } from "@/app/lib/definitions";

export default async function Players() {
    const session = await auth();
    if (!session) return;
    console.log("In Players : ", session.user.roomId);
    const game: Game = await fetchGame(session.user.roomId);
    const users = await fetchUsers(session.user.roomId);
    return (
        <>
            {users && (
                <div className="absolute inset-0 flex justify-center items-center mt-40">
                    <PlayerSeat
                        turnPlayerId={game ? game.players[0] : ""}
                        users={users}
                    />

                    {!game && (
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
