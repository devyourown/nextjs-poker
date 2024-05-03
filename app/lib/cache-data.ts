import { Room } from "@/core/room/Room";
import { createClient } from "redis";
import { convertRealRoom } from "./JSONConverter";
import { unstable_noStore as noStore } from "next/cache";
import { Card, GameResult, User } from "./definitions";

const redisClient = createClient({
    password: process.env.REDIS_PW,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
});

const DEFAULT_EXPIRATION = 3600;

redisClient.on("error", (err: any) => console.error(err));

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
            return { number: card.value, suit: card.suit } as Card;
        });
        return cards;
    } catch (error) {
        console.error("Database Error: ", error);
        throw new Error("Failed to fetch board card.");
    }
}

export async function setBoardCard(roomId: string, cards: Card[]) {
    try {
        await redisClient.hSet("board", roomId, JSON.stringify(cards));
    } catch (error) {
        console.error("Database Error.");
    }
}

export async function fetchUserCard(userId: string) {
    noStore();
    try {
        const data = await redisClient.hGet("user_card", userId);
        const cards = JSON.parse(data!).map((card: any) => {
            return { number: card.value, suit: card.suit } as Card;
        });
        return cards;
    } catch (error) {
        console.error("Database Error: ", error);
        throw new Error("Failed to fetch board card.");
    }
}

export async function setUserCard(userId: string, cards: Card[]) {
    try {
        await redisClient.hSet("user_card", userId, JSON.stringify(cards));
    } catch (error) {
        console.error("Database Error.");
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

export async function setGameResult(roomId: string, result: GameResult) {
    try {
        await redisClient.hSet("result", roomId, JSON.stringify(result));
    } catch (error) {
        console.error(error);
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

export async function setCurrentPlayer(roomId: string, playerName: string) {
    try {
        await redisClient.hSet("current_player", roomId, playerName);
    } catch (error) {
        console.error("Database Error.");
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

export async function updateUsers(roomdId: string, users: User[]) {
    try {
        await redisClient.hSet("users", roomdId, JSON.stringify(users));
    } catch (error) {
        console.error("Database Error.");
    }
}

export async function fetchCurrentBet(roomId: string) {
    noStore();
    try {
        const data = await redisClient.hGet("bet", roomId);
        return data ? data : null;
    } catch (error) {
        console.error("Database Error.");
        return null;
    }
}

export async function setCurrentBet(roomId: string, size: number) {
    try {
        await redisClient.hSet("bet", roomId, size);
    } catch (error) {
        console.error("Database Error.");
    }
}

export async function fetchGame(roomId: string) {
    noStore();
    try {
        const data = await redisClient.hGet("game", roomId);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Database Error.");
        return null;
    }
}
