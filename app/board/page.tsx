import Avatar from "../ui/avatar";
import { auth, signOut, unstable_update } from "@/auth";
import { PowerIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";
import { User } from "../lib/definitions";
import { findEmptyRoom, saveRoom } from "../lib/cache-data";

export default async function Page() {
  const session = await auth();
  const user = session!.user as User;
  return (
    session && (
      <div className="flex h-full w-full">
        <div className="flex content-between">
          <div className="content-center">
            <Avatar imgSrc={user.imageSrc!} />
          </div>
          <div className="content-center">
            <p>Welcome to Board {user.name}!</p>
            <p>Your Money : ${Number(user.money)}</p>
          </div>
          <div className="content-center">
            <form
              action={async () => {
                "use server";
                const room = await findEmptyRoom();
                user.ready = false;
                room.addUser(user);
                user.roomId = room.getId();
                unstable_update({ user: { roomId: room.getId(), ...user } });
                await saveRoom(room);
                redirect("/board/room");
              }}
            >
              <button>Go to Play</button>
            </form>
          </div>
          <div className="content-center">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                <PowerIcon className="w-6" />
                <div className="hidden md:block">Sign Out</div>
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
