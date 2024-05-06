import { fetchRoom } from "@/app/lib/cache-data";
import { Game, User } from "@/app/lib/definitions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { roomId } = await req.json();
    const room = await fetchRoom(roomId);
    const game: Game = room.game;
    const users: User[] = room.users;
    return NextResponse.json({ game, users });
}
