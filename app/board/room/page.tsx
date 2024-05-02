import { FormInput } from "@/app/lib/FormInput";
import { FormOutput } from "@/app/lib/FormOutput";
import { Card as IOCard, Chat, User } from "@/app/lib/definitions";
import { findRoom } from "@/app/lib/room";
import Action from "@/app/ui/room/action-form";
import { Action as IOAction } from "@/core/game/Game";
import Cards from "@/app/ui/room/cards";
import Chatting from "@/app/ui/room/chat-form";
import PlayerSeat from "@/app/ui/room/player-seat";
import { PlayingButton } from "@/app/ui/room/playing-button";
import { auth } from "@/auth";
import { Card } from "@/core/deck/Card";
import { RandomDeck } from "@/core/deck/Deck";
import { Game, UserAction } from "@/core/game/Game";
import { Player } from "@/core/game/Table";
import { Room } from "@/core/room/Room";
import { Server } from "socket.io";

const actions = ["Call", "Check", "Fold", "Bet"];

const chat = [
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
] as Chat[];

async function getRoomAndPlayer() {
  const session = await auth();
  const user = session?.user as User;
  const room = findRoom(user.roomId!);
  const player = room?.getPlayer(user.name);
  return [room, player] as [Room, Player];
}

function makeIOCard(cards: Card[]) {
  return cards.map((card) => {
    return {
      suit: card.getSuit().toString().toLowerCase(),
      number: card.getValue(),
    } as IOCard;
  });
}

function makeUserAction(action: string, size: string): UserAction {
  if (action === "BET") return { action: IOAction.BET, betSize: Number(size) };
  if (action === "FOLD") return { action: IOAction.FOLD, betSize: 0 };
  if (action === "CALL") return { action: IOAction.CALL, betSize: 0 };
  if (action === "CHECK") return { action: IOAction.CHECK, betSize: 0 };
  return { action: IOAction.FOLD, betSize: 0 };
}

export default async function Page() {
  const [room, player] = await getRoomAndPlayer();
  if (!room) return;
  const [input, output] = room.getIO() as [FormInput, FormOutput];
  return (
    <div className="relative h-screen bg-green-500">
      <div className="flex flex-row w-screen justify-center content-center">
        {output && <Cards cards={makeIOCard(output!.getBoard()!)} />}
      </div>
      {player && (
        <div>
          <span>Your Hands : </span>
          <Cards cards={makeIOCard(player.getHands())} />
        </div>
      )}
      {room && (
        <div className="absolute inset-0 flex justify-center items-center mt-40">
          <PlayerSeat players={room.getUsers()} />

          {!room.isPlaying() && (
            <PlayingButton name={player.getId()} roomId={room.getId()} />
          )}
        </div>
      )}
      {player && (
        <Action
          actions={actions}
          currentBet={input ? input.getCurrentBet()! : 0}
          playerMoney={player.getMoney()}
          isPlayerTurn={input ? input.isPlayerTurn(player) : false}
          roomId={room.getId()}
        />
      )}

      <Chatting chattings={chat} />
    </div>
  );
}
