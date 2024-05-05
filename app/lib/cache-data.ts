import { createClient } from "redis";
import { unstable_noStore as noStore } from "next/cache";
import { Card, Game, MoneyLog, User } from "./definitions";

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

export async function isExistsRoom(roomId: string) {
    return await redisClient.sIsMember("empty_room", roomId);
}

export async function findEmptyRoom() {
    if (0 === (await redisClient.exists("empty_room"))) {
        const roomId = Math.random().toString(36);
        await redisClient.sAdd("empty_room", roomId);
        return roomId;
    }
    const id = await redisClient.sPop("empty_room");
    const users: User[] = await fetchUsers(id as unknown as string);
    if (!users || users.length !== 8) await redisClient.sAdd("empty_room", id);
    return id as unknown as string;
}

export async function fetchGameResult(roomId: string) {
    noStore();
    try {
        if (0 === (await redisClient.exists("result"))) return null;
        const data = await redisClient.hGet("result", roomId);
        const names = JSON.parse(data!);
        return names;
    } catch (error) {
        console.error("Database Error.", error);
        return null;
    }
}

export async function setGameResult(roomId: string, result: string[]) {
    try {
        await redisClient.hSet("result", roomId, JSON.stringify(result));
    } catch (error) {
        console.error(error);
    }
}

export async function deleteGameResult(roomId: string) {
    try {
        await redisClient.hDel("result", roomId);
    } catch (error) {
        console.error(error);
    }
}

export async function updateTurnBet(roomId: string, moneyLog: MoneyLog) {
    try {
        const moneyLogs: MoneyLog[] = await fetchTurnBet(roomId);
        const filtered = moneyLogs.filter(
            (log) => log.playerName !== moneyLog.playerName
        );
        filtered.push(moneyLog);
        await redisClient.hSet("turn_bet", roomId, JSON.stringify(filtered));
    } catch (error) {
        console.error("TurnBet DB set error.");
    }
}

export async function fetchTurnBet(roomId: string) {
    try {
        if (0 === (await redisClient.exists(`turn_bet`))) return [];
        const data = await redisClient.hGet(`turn_bet`, roomId);
        return JSON.parse(data!);
    } catch (error) {
        console.error("TurnBet DB fetch Error.", error);
        return 0;
    }
}

export async function fetchBetMoney(roomId: string) {
    try {
        if (0 === (await redisClient.exists("bet_money"))) return [];
        const data = await redisClient.hGet("bet_money", roomId);
        return JSON.parse(data!);
    } catch (error) {
        console.error("Database Error.", error);
        return null;
    }
}

export async function updateBetMoney(roomId: string, betMoney: MoneyLog[]) {
    try {
        await redisClient.hSet("bet_money", roomId, JSON.stringify(betMoney));
    } catch (error) {
        console.error("Database Error.", error);
        return null;
    }
}

export async function fetchUser(roomId: string, userId: string) {
    try {
        const users: User[] = await fetchUsers(roomId);
        if (!users) return null;
        const user = users.filter((user) => user.name === userId);
        if (!user) return null;
        return user[0];
    } catch (error) {
        console.error("Database Error.", error);
        return null;
    }
}

export async function updateUser(roomId: string, user: User) {
    try {
        const users: User[] = await fetchUsers(roomId);
        if (users) {
            const userId = user.name;
            const others = users.filter((other) => userId !== other.name);
            others.push(user);
            await updateUsers(roomId, others);
        } else {
            await updateUsers(roomId, [user]);
        }
    } catch (error) {
        console.error("Database Error.", error);
    }
}

export async function fetchUsers(roomId: string) {
    noStore();
    try {
        if (0 === (await redisClient.exists("users"))) return null;
        const data = await redisClient.hGet("users", roomId);
        if (!data) return null;
        return JSON.parse(data!);
    } catch (error) {
        console.error("Database Error.", error);
        return null;
    }
}

export async function updateUsers(roomId: string, users: User[]) {
    try {
        await redisClient.hSet("users", roomId, JSON.stringify(users));
    } catch (error) {
        console.error("Database Error.", error);
    }
}

export async function deleteUser(roomId: string, userId: string) {
    try {
        const users: User[] = await fetchUsers(roomId);
        if (users) {
            const others = users.filter((other) => userId !== other.name);
            if (others.length === 0) await redisClient.hDel("users", roomId);
            else await updateUsers(roomId, others);
        }
    } catch (error) {
        console.error("Database Error.", error);
    }
}

export async function fetchGame(roomId: string) {
    noStore();
    try {
        if (0 === (await redisClient.exists("game"))) return null;
        const data = await redisClient.hGet("game", roomId);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Database Error.", error);
        return null;
    }
}

export async function setGame(roomId: string, game: Game) {
    try {
        await redisClient.hSet("game", roomId, JSON.stringify(game));
    } catch (error) {
        console.error("Database Error.", error);
    }
}
