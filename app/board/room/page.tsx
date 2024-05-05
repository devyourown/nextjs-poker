import { deleteUser } from "@/app/lib/cache-data";
import { Button } from "@/app/ui/button";
import Action from "@/app/ui/room/action-form";
import Board from "@/app/ui/room/cards/board";
import Chatting from "@/app/ui/room/chat-form";
import Players from "@/app/ui/room/player/players";
import GameResult from "@/app/ui/room/result";
import { auth, unstable_update } from "@/auth";
import { redirect } from "next/navigation";

export default function Page() {
    return (
        <div className="relative h-screen bg-green-500">
            <div>
                <form
                    action={async () => {
                        "use server";
                        const session = await auth();
                        const user = session!.user;
                        unstable_update({
                            user: { ...user, roomId: undefined },
                        });
                        deleteUser(user.roomId, user.name!);
                        redirect("/board");
                    }}
                >
                    <Button type="submit">Get out of Room</Button>
                </form>
            </div>
            <Board />
            <GameResult />
            <Players />
            <Action />
            <Chatting />
        </div>
    );
}
