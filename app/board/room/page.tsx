import { socket } from "@/app/lib/socket";
import Action from "@/app/ui/room/action-form";
import Board from "@/app/ui/room/cards/board";
import Chatting from "@/app/ui/room/chat-form";
import Exit from "@/app/ui/room/exit";
import Players from "@/app/ui/room/player/players";
import GameResult from "@/app/ui/room/result";
import { auth } from "@/auth";
import { unstable_noStore } from "next/cache";

export default async function Page() {
    unstable_noStore();
    const session = await auth();
    socket.on(`room_${session?.user.roomId}`, (data) => {
        //should re-render page
    });
    return (
        <div className="relative h-screen bg-green-500">
            <Exit />
            <Board />
            <GameResult />
            <Players />
            <Action />
            <Chatting
                roomId={session?.user.roomId!}
                user={session?.user.name!}
            />
        </div>
    );
}
