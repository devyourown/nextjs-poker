import Action from "@/app/ui/room/action-form";
import Board from "@/app/ui/room/board";
import Chatting from "@/app/ui/room/chat-form";
import Players from "@/app/ui/room/players";
import GameResult from "@/app/ui/room/result";

export default function Page() {
  return (
    <div className="relative h-screen bg-green-500">
      <Board />
      <GameResult />
      <Players />
      <Action />
      <Chatting />
    </div>
  );
}
