import { NextResponse } from "next/server";
import { io } from "socket.io-client";

export async function POST(req: Request) {
    const { roomId } = await req.json();
    const socket = io("http://localhost:3000", { transports: ["websocket"] });
    socket.on("connect", () => {
        socket.emit(`room_message`, roomId);
    });
    return NextResponse.json("YES");
}
