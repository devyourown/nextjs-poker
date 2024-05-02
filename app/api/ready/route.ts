import { findRoom, saveRoom } from "../../lib/room";
import { Game } from "@/core/game/Game";
import { RandomDeck } from "@/core/deck/Deck";
import { FormInput } from "../../lib/FormInput";
import { FormOutput } from "../../lib/FormOutput";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/lib/definitions";
import { Player } from "@/core/game/Table";

function convertUsersToPlayers(users: User[]) {
  const result = [];
  for (const user of users) {
    result.push(new Player(user.name, user.money!));
  }
  return result;
}

export async function POST(req: Request) {
  const { roomId, name } = await req.json();
  const room = await findRoom(roomId);
  if (!room) return;
  room?.ready(name);
  console.log(room?.isEveryoneReady());
  if (room?.isEveryoneReady()) {
    console.log("your game prepared.");
    if (room.isPlaying()) return;
    const players = convertUsersToPlayers(room.getUsers());
    room.setGame(new Game(players, 1000, 2000, new RandomDeck(players.length)));
  }
  saveRoom(room!);
}
