"use client";

import Cards from "./cards";
import { Card, GameStatus, User } from "@/app/lib/definitions";
import { socket } from "@/app/lib/socket";
import { useEffect, useState } from "react";

interface BoardProps {
    roomId: string;
    name: string;
}

function getPossibleCommunityCards(board: Card[], gameStatus: GameStatus) {
    if (gameStatus === GameStatus.PREFLOP) return [];
    return board.slice(0, 2 + gameStatus);
}

export default function Board({ roomId, name }: BoardProps) {
    const [hands, setHands] = useState<[] | Card[]>([]);
    const [communityCards, setCommunityCards] = useState<[] | Card[]>([]);
    const [change, setChange] = useState(false);
    socket.on(`room_${roomId}`, (data) => {
        if (data === "clean") {
            setHands([]);
            setCommunityCards([]);
            setChange(false);
        }
        if (data === "card") setChange(!change);
    });
    useEffect(() => {
        const fetchData = async (roomId: string) => {
            const data = await fetch("/api/game", {
                method: "POST",
                body: JSON.stringify({ roomId: roomId }),
            });
            const { game, users } = await data.json();
            if (game) {
                const user = users.find((u: User) => u.name === name);
                if (user.hands) setHands(user.hands);
                setCommunityCards(
                    getPossibleCommunityCards(
                        game.communityCards,
                        game.gameStatus
                    )
                );
            }
        };
        fetchData(roomId);
    }, [change]);

    return (
        <>
            {communityCards && (
                <div className="flex flex-row w-screen justify-center content-center">
                    <Cards cards={communityCards} />
                </div>
            )}
            {hands && (
                <div>
                    <span>Your Hands : </span>
                    <Cards cards={hands} />
                </div>
            )}
        </>
    );
}
