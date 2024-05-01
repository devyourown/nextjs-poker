"use client";

import { useEffect } from "react";
import { findRoom } from "../lib/room";

interface PlayingButtonProps {
  ready: boolean;
  name: string;
  roomId: string;
}

export function PlayingButton({ ready, name, roomId }: PlayingButtonProps) {
  console.log(findRoom(roomId));
  const player = findRoom(roomId)?.getPlayer(name);
  function handleReady() {
    ready = !ready;
  }
  return (
    <button
      onClick={() => handleReady()}
      className="absolute bg-blue-500 text-white px-6 py-3 rounded-full mt-36"
    >
      {ready ? "not ready" : "ready"}
    </button>
  );
}
