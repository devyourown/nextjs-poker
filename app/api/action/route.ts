import { Action, UserAction } from "@/core/game/Game";
import { findRoom, saveRoom } from "../../lib/room";
import { NextResponse } from "next/server";

function convertToUserAction({ action, amount }: any): UserAction {
  if (action === "BET") return { action: Action.BET, betSize: amount };
  if (action === "FOLD") return { action: Action.FOLD, betSize: 0 };
  if (action === "CALL") return { action: Action.CALL, betSize: 0 };
  if (action === "CHECK") return { action: Action.CHECK, betSize: 0 };
  return { action: Action.FOLD, betSize: 0 };
}

export async function POST(req: Request) {
  const { roomId, action, betSize } = await req.json();
  const userAction = convertToUserAction({
    action: action.toUpperCase(),
    amount: betSize,
  });
  const room = await findRoom(roomId);
  room?.playAction(userAction);
  saveRoom(room!);
  return NextResponse.json("good job");
}
