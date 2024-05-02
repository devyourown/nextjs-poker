import { Card as IOCard, Chat, User } from "@/app/lib/definitions";
import { findRoom } from "@/app/lib/room";
import Action from "@/app/ui/room/action-form";
import Cards from "@/app/ui/room/cards";
import Chatting from "@/app/ui/room/chat-form";
import PlayerSeat from "@/app/ui/room/player-seat";
import { PlayingButton } from "@/app/ui/room/playing-button";
import { auth } from "@/auth";
import { Card } from "@/core/deck/Card";
import { Player } from "@/core/game/Table";
import { Room } from "@/core/room/Room";

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

async function getRoomAndUser() {
  const session = await auth();
  const sessionUser = session?.user as User;
  const room = await findRoom(sessionUser.roomId!);
  const user = room?.getUser(sessionUser.name);
  return [room, user] as [Room, User];
}

function makeIOCard(cards: Card[]) {
  return cards.map((card) => {
    return {
      suit: card.getSuit().toString().toLowerCase(),
      number: card.getValue(),
    } as IOCard;
  });
}

export default async function Page() {
  const [room, user] = await getRoomAndUser();
  if (!room) return;
  const [pot, dealer, currentPlayer] = room.getCurrentGame();
  console.log("cc", currentPlayer);
  let isGameOn = false;
  if (pot) {
    isGameOn = true;
  }
  return (
    <div className="relative h-screen bg-green-500">
      <div className="flex flex-row w-screen justify-center content-center">
        {isGameOn && <Cards cards={makeIOCard(dealer!.getBoard())} />}
      </div>
      {currentPlayer && (
        <div>
          <span>Your Hands : </span>
          <Cards cards={makeIOCard(currentPlayer.getHands())} />
        </div>
      )}
      {room && (
        <div className="absolute inset-0 flex justify-center items-center mt-40">
          <PlayerSeat users={room.getUsers()} />

          {!room.isPlaying() && (
            <PlayingButton name={user.name} roomId={room.getId()} />
          )}
        </div>
      )}
      {currentPlayer && currentPlayer?.getId() === user.name && (
        <Action
          actions={actions}
          currentBet={isGameOn ? pot!.getCurrentBet() : 0}
          playerMoney={currentPlayer.getMoney()}
          isPlayerTurn={isGameOn ? user.name === currentPlayer.getId() : false}
          roomId={room.getId()}
        />
      )}

      <Chatting chattings={chat} />
    </div>
  );
}
