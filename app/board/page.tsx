import Avatar from "../ui/avatar";
import { auth, signOut, unstable_update } from "@/auth";
import { PowerIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";
import { Room, User } from "../lib/definitions";
import { fetchRoom, findEmptyRoom, setRoom } from "../lib/cache-data";
import { socket } from "../lib/socket";
import { Button } from "../ui/button";
import ImageUpload from "../ui/image-upload";

export default async function Page() {
  const session = await auth();
  const user = session!.user as User;
  return (
    session && (
      <main className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <div className="flex flex-col content-between">
            <ImageUpload imageSrc={user.img_src!} />
            <div className="content-center">
              <p>Welcome to Board {user.name}!</p>
              <p>Your Money : ${Number(user.money)}</p>
            </div>
            <div className="content-center">
              <form
                action={async () => {
                  "use server";
                  user.ready = false;
                  const id = await findEmptyRoom();
                  user.roomId = id;
                  user.ready = false;
                  const room: Room = await fetchRoom(user.roomId);
                  room.users.push(user);
                  await setRoom(user.roomId, room);
                  await unstable_update({
                    user: { roomId: id, ...user },
                  });
                  socket.emit("room_change", user.roomId);
                  redirect("/board/room");
                }}
              >
                <Button>Go to Play</Button>
              </form>
            </div>
            <div className="content-center">
              <form
                action={async () => {
                  "use server";
                  await signOut(redirect("/"));
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
      </main>
    )
  );
}
