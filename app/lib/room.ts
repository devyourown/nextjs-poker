import { Game } from "@/core/game/Game";
import { Player } from "@/core/game/Table";
import { Room } from "@/core/room/Room";
import { createClient } from "redis";

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

function convertPlayers(data: any) {
  return data.map((player: { id: string; money: number }) => {
    return new Player(player.id, player.money);
  });
}

function convertRealGame(data: any) {
  if (!data) return null;
  const {
    players,
    smallBlind,
    bigBlind,
    deck,
    foldPlayers,
    allInPlayers,
    gameStatus,
    gameResult,
  } = data;
  return new Game(
    convertPlayers(players),
    smallBlind,
    bigBlind,
    deck,
    convertPlayers(foldPlayers),
    convertPlayers(allInPlayers),
    gameStatus,
    gameResult
  );
}

function convertRealRoom(data: any) {
  if (!data) return null;
  const { roomId, status, users, numOfReady, game } = data;
  return Room.of(roomId, status, users, numOfReady, convertRealGame(game));
}

export async function findRoom(roomId: string) {
  const room = (await redisClient.hGet("room", roomId)) as string;
  return convertRealRoom(JSON.parse(room));
}

export async function findEmptyRoom() {
  const rooms = await redisClient.hVals("room");
  for (const room of rooms) {
    if (room.search("SPACIOUS")) {
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
