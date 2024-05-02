import { User } from "../../lib/definitions";
import Avatar from "../avatar";

interface PlayerSeatProps {
  players: User[];
}

export default function PlayerSeat(props: PlayerSeatProps) {
  const { players } = props;
  while (players.length < 8) players.push({ name: "", money: -1 } as any);
  return (
    <div className="flex justify-center items-center space-x-8">
      {players.map((player: User, index) => {
        if (player.name === "")
          return (
            <div
              key={index}
              className="bg-gray-300 w-24 h-24 flex justify-center items-center rounded-full"
            ></div>
          );
        return (
          <div
            key={player.name}
            className="bg-gray-300 w-24 h-24 flex-col justify-items-center items-center rounded-full"
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full ml-10"></div>
            <span className="absolute text-black ml-5 mt-4">{player.name}</span>
            <div className="ml-7 mt-8">
              <Avatar imgSrc={player.imageSrc!} />
            </div>
            <div className="text-black mt-2">money:</div>
            <div>{player.money}</div>
          </div>
        );
      })}
    </div>
  );
}
