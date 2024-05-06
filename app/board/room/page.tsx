import { fetchGame, fetchUsers } from "@/app/lib/cache-data";
import { Game, User } from "@/app/lib/definitions";
import Action from "@/app/ui/room/action-form";
import Board from "@/app/ui/room/cards/board";
import Chatting from "@/app/ui/room/chat-form";
import Exit from "@/app/ui/room/exit";
import Players from "@/app/ui/room/player/players";
import GameResult from "@/app/ui/room/result";
import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();
    const roomId = session?.user.roomId!;
    const name = session?.user.name!;
    return (
        <div className="relative h-screen bg-green-500">
            <Exit />
            <Board name={name} roomId={roomId} />
            <GameResult />
            <Players roomId={roomId} name={name} />
            <Action />
            <Chatting roomId={roomId} user={name} />
        </div>
    );
}
