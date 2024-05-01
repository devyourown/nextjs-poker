import { FormInput } from "@/app/lib/FormInput";
import { FormOutput } from "@/app/lib/FormOutput";
import { Card, Chat, User } from "@/app/lib/definitions";
import { Room, findRoom, removeFromCache } from "@/app/lib/room";
import Action from "@/app/ui/action-form";
import Cards from "@/app/ui/cards";
import Chatting from "@/app/ui/chat-form";
import PlayerSeat from "@/app/ui/player-seat";
import { auth } from "@/auth";
import { RandomDeck } from "@/core/deck/Deck";
import { Game } from "@/core/game/Game";
import { useEffect, useState } from "react";

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

const board: Card[] = [
  { number: 12, suit: "diamonds" },
  { number: 14, suit: "clubs" },
  { number: 2, suit: "spades" },
];

const hands: Card[] = [
  { number: 13, suit: "hearts" },
  { number: 7, suit: "clubs" },
];

async function getRoom() {
  const session = await auth();
  const user = session?.user as User;
  return findRoom(user.roomId!) as Room;
}

export default async function Page() {
  const room = await getRoom();
  const [ready, setReady] = useState(false);
  const input = new FormInput();
  const output = new FormOutput();
  const handleReady = () => {
    setReady(!ready);
    if (ready) room.ready();
    else room.notReady();
    if (room.isPlaying()) {
      removeFromCache(room.getId());
      const player = room.getPlayer();
      new Game(
        player,
        100,
        200,
        new RandomDeck(player.length),
        input,
        output
      ).play();
    }
  };
  return (
    <div className="relative h-screen bg-green-500">
      <div className="flex flex-row w-screen justify-center content-center">
        {output.isGameOn() && <Cards cards={output.getBoard()!} />}
      </div>
      {
        <div>
          <span>Your Hands : </span>
          <Cards cards={hands} />
        </div>
      }
      <div className="absolute inset-0 flex justify-center items-center mt-40">
        <PlayerSeat players={room.getUsers()} />

        {!room.isPlaying() && (
          <button
            onClick={handleReady}
            className="absolute bg-blue-500 text-white px-6 py-3 rounded-full mt-36"
          >
            {ready ? "not ready" : "ready"}
          </button>
        )}
      </div>
      <Action actions={actions} />

      <Chatting chattings={chat} />
    </div>
  );
}
