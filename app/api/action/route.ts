import { NextApiRequest } from "next";
import { findRoom, saveRoom } from "../../lib/room";
import { NextResponse } from "next/server";

export default async function POST(req: NextApiRequest) {
  const { roomId, action } = req.body;
  const room = await findRoom(roomId);
  room?.playAction(action);
  saveRoom(room!);
  return NextResponse.json("good job");
}
