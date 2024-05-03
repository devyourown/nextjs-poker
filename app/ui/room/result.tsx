import { fetchGameResult } from "@/app/lib/cache-data";
import { auth } from "@/auth";

export default async function GameResult() {
  const session = await auth();
  if (!session) return;
  const names = await fetchGameResult(session?.user.roomId);
  return (
    <>
      {names && (
        <div>
          {names.map((name: string) => {
            return <div key={name}>the winner is {name}</div>;
          })}
        </div>
      )}
    </>
  );
}