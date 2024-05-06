import { fetchRoom } from "@/app/lib/cache-data";
import { Room } from "@/app/lib/definitions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { roomId } = await req.json();
    const room: Room = await fetchRoom(roomId);
    if (room === null) return null;
    return NextResponse.json({ result: room.gameResult });
}
