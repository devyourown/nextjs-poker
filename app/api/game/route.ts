import { fetchGame, fetchUsers } from "@/app/lib/cache-data";
import { Game, User } from "@/app/lib/definitions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { roomId } = await req.json();
    const game: Game = await fetchGame(roomId);
    const users: User[] = await fetchUsers(roomId);
    return NextResponse.json({ game, users });
}
