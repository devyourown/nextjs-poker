import { findRoom } from "../../lib/room";
import { Game } from "@/core/game/Game";
import { RandomDeck } from "@/core/deck/Deck";
import { FormInput } from "../../lib/FormInput";
import { FormOutput } from "../../lib/FormOutput";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("YEEAY IT comes out!");
  const { roomId, name } = await req.json();
  const room = findRoom(roomId);
  room?.makePlayerReady(name);
  console.log(room);
  console.log(room?.isEveryoneReady());
  if (room?.isEveryoneReady()) {
    if (room.isPlaying()) return;
    const players = room.getPlayers();
    const input = new FormInput();
    const output = new FormOutput();
    console.log(players);
    console.log(input);
    room.setIO(input, output);
    room.setGameResult(
      new Game(
        players,
        1000,
        2000,
        new RandomDeck(players.length),
        input,
        output
      ).play()
    );
  }
  return NextResponse.json("good job");
}
