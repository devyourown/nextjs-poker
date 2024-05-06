"use client";

import Replay from "./replay";
import { PlayerResult } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { socket } from "@/app/lib/socket";

export default function GameResult({ roomId }: { roomId: string }) {
    const [change, setChange] = useState(false);
    const [playerResult, setPlayerResult] = useState<null | PlayerResult[]>(
        null
    );
    socket.on(`room_${roomId}`, (data) => {
        if (data === "clean") {
            setPlayerResult(null);
        } else {
            setChange(!change);
        }
    });
    useEffect(() => {
        const fetchData = async (roomId: string) => {
            const data = await fetch("/api/result", {
                method: "POST",
                body: JSON.stringify({ roomId: roomId }),
            });
            const { result } = await data.json();
            if (result) {
                setPlayerResult(result);
            }
        };
        fetchData(roomId);
    }, [change]);
    return (
        <>
            {playerResult && (
                <>
                    <div>
                        {playerResult.map(({ name, rank }) => {
                            return (
                                <div key={name}>
                                    the winner is {name}{" "}
                                    {rank !== "" ? `with ${rank}` : ""}
                                </div>
                            );
                        })}
                    </div>
                    <Replay roomId={roomId} />
                </>
            )}
        </>
    );
}
