import Action from "@/app/ui/room/action-form";
import Board from "@/app/ui/room/cards/board";
import Chatting from "@/app/ui/room/chat-form";
import Exit from "@/app/ui/room/exit";
import Players from "@/app/ui/room/player/players";
import GameResult from "@/app/ui/room/result";
import { auth } from "@/auth";
import { unstable_noStore } from "next/cache";
import { io } from "socket.io-client";

export default async function Page() {
    unstable_noStore();
    const session = await auth();
    const socket = io("http://localhost:3000", { transports: ["websocket"] });
    socket.on("connect", () => {
        socket.on(`room_${session?.user.roomId}`, (data) => {});
    });
    return (
        <div className="relative h-screen bg-green-500">
            <Exit />
            <Board />
            <GameResult />
            <Players />
            <Action />
            <Chatting />
        </div>
    );
}
