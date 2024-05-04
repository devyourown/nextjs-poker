import { Room } from "@/core/room/Room";
import { createClient } from "redis";
import { convertRealRoom } from "./JSONConverter";
import { unstable_noStore as noStore } from "next/cache";
import { Card, Game, GameResult, User } from "./definitions";

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

export async function fetchBetMoney(roomId: string) {
    try {
        const data = await redisClient.hGet("bet_money", roomId);
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        console.error("Database Error.");
        return null;
    }
}

export async function updateBetMoney(
    roomId: string,
    betMoney: Map<string, number>
) {
    try {
        await redisClient.hSet("bet_money", roomId, JSON.stringify(betMoney));
    } catch (error) {
        console.error("Database Error.");
        return null;
    }
}

export async function fetchNumOfLeftTurn(roomId: string) {
    try {
        const data = await redisClient.hGet("num_of_left_turn", roomId);
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        console.error("Database Error.");
        return null;
    }
}

export async function setNumOfLeftTurn(roomId: string, turn: number) {
    try {
        await redisClient.hSet("num_of_left_turn", roomId, turn);
    } catch (error) {
        console.error("Database Error.");
    }
}

export async function fetchPlayerTable(roomId: string) {
    noStore();
    try {
        const data = await redisClient.hGet("player_table", roomId);
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        console.error("Database Error.");
        return null;
    }
}

export async function setPlayerTable(roomId: string, playerName: string[]) {
    try {
        await redisClient.hSet(
            "player_table",
            roomId,
            JSON.stringify(playerName)
        );
    } catch (error) {
        console.error("Database Error.");
    }
}

export async function fetchUser(roomId: string, userId: string) {
    try {
        const users: User[] = await fetchUsers(roomId);
        const user = users.filter((user) => user.name === userId);
        if (!user) return null;
        return user;
    } catch (error) {
        console.error("Database Error.");
        return null;
    }
}

export async function updateUser(roomId: string, userId: string, user: User) {
    try {
        const users: User[] = await fetchUsers(roomId);
        const others = users.filter((user) => user.name !== userId);
        others.push(user);
        await redisClient.hSet("users", roomId, JSON.stringify(others));
    } catch (error) {
        console.error("Database Error.");
    }
}

export async function fetchUsers(roomId: string) {
    noStore();
    try {
        const data = await redisClient.hGet("users", roomId);
        if (!data) return null;
        return JSON.parse(data);
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

export async function setGame(roomId: string, game: Game) {
    try {
        await redisClient.hSet("game", roomId, JSON.stringify(game));
    } catch (error) {
        console.error("Database Error.");
    }
}
