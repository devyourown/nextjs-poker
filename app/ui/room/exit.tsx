import { auth, unstable_update } from "@/auth";
import { Button } from "../button";
import { fetchRoom, setRoom } from "@/app/lib/cache-data";
import { redirect } from "next/navigation";
import { Room } from "@/app/lib/definitions";

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
                    redirect("/board");
                }}
            >
                <Button type="submit">Get out of Room</Button>
            </form>
        </div>
    );
}
