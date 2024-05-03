import { fetchGame } from "../../lib/cache-data";
import { NextResponse } from "next/server";
import { playWith } from "@/newcore/game";
import { Action } from "@/app/lib/definitions";

export async function POST(req: Request) {
    const { roomId, action, betSize, playerMoney } = await req.json();
    const beforeStatus = await fetchGame(roomId);
    const afterStatus = playWith(
        { action, betSize, playerMoney } as unknown as Action,
        beforeStatus
    );
    //afterStatus를 보고 게임을 진행함
    //const room = await findRoom(roomId);
    //room?.playAction(userAction);
    //saveRoom(room!);
    return NextResponse.json("good job");
}
