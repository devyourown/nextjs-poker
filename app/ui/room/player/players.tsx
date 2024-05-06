"use client";

import PlayerSeat from "./player-seat";
import { PlayingButton } from "./playing-button";
import { Game, User } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { socket } from "@/app/lib/socket";

interface PlayersProps {
    roomId: string;
    name: string;
}

export default function Players({ name, roomId }: PlayersProps) {
    const [sortedUsers, setSortedUsers] = useState<[] | User[]>([]);
    const [firstPlayer, setFirstPlayer] = useState<null | string>();
    const [currentBet, SetCurrentBet] = useState<null | number>(null);
    const [potSize, setPotSize] = useState<null | number>(null);
    const [change, setChange] = useState(false);
    socket.on(`room_${roomId}`, (data) => {
        if (data === "clean") {
            setSortedUsers([]);
            setFirstPlayer(null);
            SetCurrentBet(null);
            setPotSize(null);
        }
        setChange(!change);
    });
    useEffect(() => {
        const fetchData = async (roomId: string) => {
            const data = await fetch("/api/game", {
                method: "POST",
                body: JSON.stringify({ roomId: roomId }),
            });
            if (data === null) return;
            const { game, users }: { game: Game; users: User[] } =
                await data.json();
            users.sort((a: User, b: User) => a.name.length - b.name.length);
            setSortedUsers(users);
            if (game) {
                setFirstPlayer(game.players[0]);
                SetCurrentBet(game.currentBet);
                setPotSize(game.potSize);
            }
        };
        fetchData(roomId);
    }, [change]);
    return (
        <>
            {currentBet !== null && (
                <div>
                    <div>
                        <span>Bet Size: {currentBet}</span>
                    </div>
                    <div>
                        <span>Pot Size: {potSize}</span>
                    </div>
                </div>
            )}
            {sortedUsers && (
                <div className="absolute inset-0 flex justify-center items-center mt-40">
                    <PlayerSeat
                        turnPlayerId={firstPlayer ? firstPlayer : ""}
                        users={sortedUsers}
                    />

                    {!firstPlayer && (
                        <PlayingButton name={name} roomId={roomId} />
                    )}
                </div>
            )}
        </>
    );
}
