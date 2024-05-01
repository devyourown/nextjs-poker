"use client";

import { useState } from "react";
import { socket } from "../lib/socket";

interface PlayingButtonProps {
  ready: boolean;
  name: string;
  roomId: string;
}

export function PlayingButton({ ready, name, roomId }: PlayingButtonProps) {
  const [isReady, setReady] = useState(ready);
  function handleReady() {
    setReady(!isReady);
    console.log(roomId + "btn");
    socket.emit(roomId + "btn", name + ":" + ready);
  }
  return (
    <button
      onClick={() => handleReady()}
      className="absolute bg-blue-500 text-white px-6 py-3 rounded-full mt-36"
    >
      {isReady ? "not ready" : "ready"}
    </button>
  );
}
