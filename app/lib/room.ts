import { Card } from "@/core/deck/Card";
import { DeterminedDeck } from "@/core/deck/Deck";
import { Game } from "@/core/game/Game";
import { Player } from "@/core/game/Table";
import { Room } from "@/core/room/Room";
import { createClient } from "redis";
import { convertRealRoom } from "./JSONConverter";

const redisClient = createClient({
  password: process.env.REDIS_PW,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

const DEFAULT_EXPIRATION = 3600;

redisClient.on("error", (err) => console.error(err));

if (!redisClient.isOpen) redisClient.connect();

export async function findRoom(roomId: string) {
  const room = (await redisClient.hGet("room", roomId)) as string;
  return convertRealRoom(JSON.parse(room));
}

export async function findEmptyRoom() {
  const rooms = await redisClient.hVals("room");
  for (const room of rooms) {
    if (room.search("SPACIOUS") !== -1) {
      return convertRealRoom(JSON.parse(room))!;
    }
  }
  const room = new Room();
  await saveRoom(room);
  return room;
}

export async function saveRoom(room: Room) {
  await redisClient.hSet("room", room.getId(), JSON.stringify(room));
}

export async function removeFromCache(roomId: string) {
  await redisClient.hDel("room", roomId);
}
