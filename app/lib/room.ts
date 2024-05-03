import { Room } from "@/core/room/Room";
import { createClient } from "redis";
import { convertRealRoom } from "./JSONConverter";
import { unstable_noStore as noStore } from "next/cache";
import { Card } from "@/core/deck/Card";

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

export async function fetchBoardCard(roomId: string) {
  noStore();
  try {
    const data = await redisClient.hGet("board", roomId);
    const cards = JSON.parse(data!).map((card: any) => {
      return Card.of(card.value, card.suit);
    });
    return cards;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Failed to fetch board card.");
  }
}

export async function fetchUserCard(userId: string) {
  noStore();
  try {
    const data = await redisClient.hGet("user_card", userId);
    const cards = JSON.parse(data!).map((card: any) => {
      return Card.of(card.value, card.suit);
    });
    return cards;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Failed to fetch board card.");
  }
}

export async function fetchGameResult(roomId: string) {
  noStore();
  try {
    const data = await redisClient.hGet("result", roomId);
    if (!data) return null;
    const names = JSON.parse(data);
    return names;
  } catch (error) {
    console.error("Database Error.");
    return null;
  }
}

export async function fetchCurrentPlayer(roomId: string) {
  noStore();
  try {
    const data = await redisClient.hGet("current_player", roomId);
    if (!data) return null;
    return data;
  } catch (error) {
    console.error("Database Error.");
    return null;
  }
}

export async function fetchUsers(roomId: string) {
  noStore();
  try {
    const data = await redisClient.hGet("users", roomId);
    if (!data) return null;
    const names = JSON.parse(data);
    return names;
  } catch (error) {
    console.error("Database Error.");
    return null;
  }
}

export async function fetchCurrentBet(roomId: string) {
  noStore();
  try {
    const data = await redisClient.hGet("bet", roomId);
    return data ? data : null;
  } catch (error) {
    console.error("Database Error.");
    return;
  }
}
