import clsx from "clsx";
import { User } from "../../../lib/definitions";
import Avatar from "../../avatar";

interface PlayerSeatProps {
  users: User[];
  turnPlayerId: string;
}

export default function PlayerSeat(props: PlayerSeatProps) {
  const { users, turnPlayerId } = props;
  while (users.length < 8) users.push({ name: "", money: -1 } as any);
  return (
    <div className="flex justify-center items-center space-x-8">
      {users.map((user: User, index) => {
        if (user.name === "")
          return (
            <div
              key={index}
              className="bg-gray-300 w-24 h-24 flex justify-center items-center rounded-full"
            ></div>
          );
        return (
          <div
            key={user.name}
            className="bg-gray-300 w-24 h-24 flex-col justify-items-center items-center rounded-full"
          >
            <div
              className={clsx(
                user.ready
                  ? clsx(
                      user.name === turnPlayerId
                        ? "animate-ping w-4 h-4 bg-blue-500 rounded-full ml-10"
                        : " w-4 h-4 bg-blue-500 rounded-full ml-10"
                    )
                  : "w-4 h-4 bg-red-500 rounded-full ml-10"
              )}
            ></div>
            <span className="absolute text-black ml-5 mt-4">{user.name}</span>
            <div className="ml-7 mt-8">
              <Avatar imgSrc={user.imageSrc!} />
            </div>
            <div className="text-black mt-2">money:</div>
            <div>{user.money}</div>
          </div>
        );
      })}
    </div>
  );
}
