"use client";

import { useEffect, useState } from "react";

interface ReplayProps {
    roomId: string;
}

export default function Replay({ roomId }: ReplayProps) {
    const [leftSeconds, setLeftSeconds] = useState(3);
    useEffect(() => {
        async function handleReplay() {
            await fetch("/api/ready", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomId: roomId,
                    smallBlind: 1000,
                    bigBlind: 2000,
                    replay: true,
                }),
            });
        }
        const timer = setTimeout(handleReplay, 5000);
        const interval = setInterval(
            () => setLeftSeconds(leftSeconds - 1),
            1000
        );
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [leftSeconds, roomId]);
    return (
        <button>
            <svg className="animate-spin h-5 w-5 mr-3"></svg>
            Replay...{leftSeconds <= 0 ? 0 : leftSeconds}
        </button>
    );
}
