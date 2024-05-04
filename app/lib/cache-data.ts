import { Room } from "@/core/room/Room";
import { createClient } from "redis";
import { convertRealRoom } from "./JSONConverter";
import { unstable_noStore as noStore } from "next/cache";
import { Card, Game, User } from "./definitions";

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

export async function saveRoom(room: Room) {
    await redisClient.hSet("room", room.getId(), JSON.stringify(room));
}

export async function removeFromCache(roomId: string) {
    await redisClient.hDel("room", roomId);
}

export async function fetchBoardCard(roomId: string) {
    noStore();
    try {
        if (0 === (await redisClient.exists("board"))) return null;
        const data = await redisClient.hGet("board", roomId);
        return JSON.parse(data!);
    } catch (error) {
        console.error("Database Error: ", error);
        return null;
    }
}

export async function setBoardCard(roomId: string, cards: Card[]) {
    try {
        await redisClient.hSet("board", roomId, JSON.stringify(cards));
    } catch (error) {
        console.error("Database Error.", error);
    }
}

export async function fetchUserCard(userId: string) {
    noStore();
    try {
        if (0 === (await redisClient.exists("user_card"))) return null;
        const data = await redisClient.hGet("user_card", userId);
        return JSON.parse(data!);
    } catch (error) {
        console.error("Database Error: ", error);
        return null;
    }
}

export async function setUserCard(userId: string, cards: Card[]) {
    try {
        await redisClient.hSet("user_card", userId, JSON.stringify(cards));
    } catch (error) {
        console.error("Database Error.", error);
    }
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

export async function fetchBetMoney(roomId: string) {
    try {
        if (0 === (await redisClient.exists("bet_money")))
            return new Map<string, number>();
        const data = await redisClient.hGet("bet_money", roomId);
        const result = new Map<string, number>();
        JSON.parse(data!).map((log: any) => {
            result.set(log.name, log.money);
        });
        return result;
    } catch (error) {
        console.error("Database Error.", error);
        return null;
    }
}

export async function updateBetMoney(
    roomId: string,
    betMoney: Map<string, number>
) {
    try {
        const arrForJSON: any[] = [];
        betMoney.forEach((amount, player) => {
            arrForJSON.push({ name: player, money: amount });
        });
        await redisClient.hSet("bet_money", roomId, JSON.stringify(arrForJSON));
    } catch (error) {
        console.error("Database Error.", error);
        return null;
    }
}

export async function fetchNumOfLeftTurn(roomId: string) {
    try {
        if (0 === (await redisClient.exists("num_of_left_turn"))) return null;
        const data = await redisClient.hGet("num_of_left_turn", roomId);
        return JSON.parse(data!);
    } catch (error) {
        console.error("Database Error.", error);
        return null;
    }
}

export async function setNumOfLeftTurn(roomId: string, turn: number) {
    try {
        await redisClient.hSet("num_of_left_turn", roomId, turn);
    } catch (error) {
        console.error("Database Error.", error);
    }
}

export async function fetchPlayerTable(roomId: string) {
    noStore();
    try {
        if (0 === (await redisClient.exists("player_table"))) return null;
        const data = await redisClient.hGet("player_table", roomId);
        return JSON.parse(data!);
    } catch (error) {
        console.error("Database Error.", error);
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
        console.error("Database Error.", error);
    }
}

export async function fetchUser(roomId: string, userId: string) {
    try {
        const users: User[] = await fetchUsers(roomId);
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
            console.log("name", user.name);
            const others = users.filter((other) => {
                console.log("id : ", userId);
                console.log("other : ", other.name);
                return userId !== other.name;
            });
            others.push(user);
            console.log("others: ", others);
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

export async function fetchCurrentBet(roomId: string) {
    noStore();
    try {
        if (0 === (await redisClient.exists("bet"))) return null;
        return await redisClient.hGet("bet", roomId);
    } catch (error) {
        console.error("Database Error.", error);
        return null;
    }
}

export async function setCurrentBet(roomId: string, size: number) {
    try {
        await redisClient.hSet("bet", roomId, size);
    } catch (error) {
        console.error("Database Error.", error);
    }
}

export async function fetchGame(roomId: string) {
    noStore();
    try {
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
