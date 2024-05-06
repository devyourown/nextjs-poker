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
    const [change, setChange] = useState(false);
    socket.on(`room_${roomId}`, () => {
        setChange(!change);
    });
    useEffect(() => {
        const fetchData = async (roomId: string) => {
            const data = await fetch("/api/game", {
                method: "POST",
                body: JSON.stringify({ roomId: roomId }),
            });
            const { game, users } = await data.json();
            users.sort((a: User, b: User) => a.name.length - b.name.length);
            setSortedUsers(users);
            if (game) setFirstPlayer(game.players[0]);
        };
        fetchData(roomId);
    }, [change]);
    return (
        <>
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
