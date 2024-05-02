import { NextApiRequest } from "next";
import { findRoom, saveRoom } from "../../lib/room";

export default async function POST(req: NextApiRequest) {
  const { roomId, action } = req.body;
  const room = await findRoom(roomId);
  room?.playAction(action);
  saveRoom(room!);
}
