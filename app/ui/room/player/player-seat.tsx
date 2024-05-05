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
        <div className="flex justify-center items-center space-x-14">
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
                        className="flex-col w-30 h-30 items-center justify-items-cente"
                    >
                        <span className="text-black">{user.name}</span>
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
                        <div className="relative bg-gray-300 w-24 h-24 rounded-full overflow-hidden">
                            <Avatar imgSrc={user.img_src!} />
                        </div>
                        <div className="text-black mt-2">money:</div>
                        <div>{user.money}</div>
                    </div>
                );
            })}
        </div>
    );
}
