import { NextApiRequest } from "next";
import { findRoom } from "../../lib/room";
import { NextResponse } from "next/server";

export default function POST(req: NextApiRequest) {
  const { roomId, action } = req.body;
  console.log(roomId);
  console.log(action);
  const room = findRoom(roomId);
  room?.setAction(action);
  return NextResponse.json("good job");
}
