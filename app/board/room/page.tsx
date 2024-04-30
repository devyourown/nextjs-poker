import { Chat, User } from "@/app/lib/definitions";
import Action from "@/app/ui/action-form";
import Chatting from "@/app/ui/chat-form";
import PlayerSeat from "@/app/ui/player-seat";

const players = [
  { name: "ww" } as User,
  { name: "zz" } as User,
  { name: "wee" } as User,
];

const actions = ["Call", "Check", "Fold", "Bet"];

const chat = [
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
] as Chat[];

export default function Page() {
  return (
    <div className="relative h-screen bg-green-500">
      <div className="absolute inset-0 flex justify-center items-center mt-40">
        <PlayerSeat players={players} />

        <button className="absolute bg-blue-500 text-white px-6 py-3 rounded-full mt-36">
          Ready
        </button>
      </div>
      <Action actions={actions} />

      <Chatting chattings={chat} />
    </div>
  );
}
