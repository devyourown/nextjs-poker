import { auth, unstable_update } from "@/auth";
import { Button } from "../button";
import { deleteUser } from "@/app/lib/cache-data";
import { redirect } from "next/navigation";

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
                    await deleteUser(user.roomId, user.name!);
                    redirect("/board");
                }}
            >
                <Button type="submit">Get out of Room</Button>
            </form>
        </div>
    );
}
