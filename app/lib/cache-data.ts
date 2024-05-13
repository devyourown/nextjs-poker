import { createClient } from "redis";
import { Room } from "./definitions";

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

export async function saveSecretKey(email: string, key: string) {
    try {
        await redisClient.hSet("email", email, key);
    } catch (error) {
        console.error("Saving Key Error : ", error);
    }
}

export async function getSecretKey(email: string) {
    try {
        const data = await redisClient.hGet("email", email);
        if (data) return data;
        return null;
    } catch (error) {
        console.error("Getting Key Error : ", error);
        return null;
    }
}

function makeEmptyRoom(roomId: string): Room {
    return {
        users: [],
        roomId: roomId,
        turnBetMoney: [],
        totalBetMoney: [],
        gameResult: null,
        game: null,
    };
}

export async function findEmptyRoom() {
    if (0 === (await redisClient.exists("empty_room"))) {
        const roomId = Math.random().toString(36);
        await redisClient.sAdd("empty_room", roomId);
        await redisClient.hSet(
            "room",
            roomId,
            JSON.stringify(makeEmptyRoom(roomId))
        );
        return roomId;
    }
    const id = await redisClient.sPop("empty_room");
    const room = await fetchRoom(id as unknown as string);
    if (room === null) {
        return await findEmptyRoom();
    }
    if (!room.users || room.users.length !== 8)
        await redisClient.sAdd("empty_room", id);
    return id as unknown as string;
}

export async function fetchRoom(roomId: string) {
    try {
        if (0 === (await redisClient.exists("room"))) return null;
        const data = await redisClient.hGet("room", roomId);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Database Fetch Room Error : ", error);
        return null;
    }
}

export async function setRoom(roomId: string, room: Room) {
    try {
        if (room.users.length === 0) {
            await redisClient.hDel("room", roomId);
            return;
        }
        await redisClient.hSet("room", roomId, JSON.stringify(room));
    } catch (error) {
        console.error("Database Set Room Error.", error);
    }
}
