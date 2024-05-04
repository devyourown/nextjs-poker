"use client";

import { useState } from "react";

interface PlayingButtonProps {
    name: string;
    roomId: string;
}

export function PlayingButton({ name, roomId }: PlayingButtonProps) {
    const [isReady, setReady] = useState(false);
    async function handleReady() {
        setReady(!isReady);
        await fetch("/api/ready", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomId: roomId,
                name: name,
                smallBlind: 1000,
                bigBlind: 2000,
            }),
        });
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
