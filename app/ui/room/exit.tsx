import { auth, unstable_update } from "@/auth";
import { Button } from "../button";
import { fetchRoom, setRoom } from "@/app/lib/cache-data";
import { redirect } from "next/navigation";
import { Room } from "@/app/lib/definitions";
import { socket } from "@/app/lib/socket";

export default function Exit() {
    return (
        <div>
            <form
                action={async () => {
                    "use server";
                    const session = await auth();
                    const user = session!.user;
                    unstable_update({
                        user: { ...user, roomId: undefined },
                    });
                    const room: Room = await fetchRoom(user.roomId);
                    const filtered = room.users.filter(
                        (u) => u.name !== user.name
                    );
                    room.users = filtered;
                    await setRoom(user.roomId, room);
                    if (room.users.length !== 0)
                        socket.emit("room_change", user.roomId);
                    redirect("/board");
                }}
            >
                <Button type="submit">Get out of Room</Button>
            </form>
        </div>
    );
}
