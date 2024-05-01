import { FormInput } from "@/app/lib/FormInput";
import { FormOutput } from "@/app/lib/FormOutput";
import { Card as IOCard, Chat, User } from "@/app/lib/definitions";
import { findRoom, removeFromCache } from "@/app/lib/room";
import Action from "@/app/ui/action-form";
import { Action as IOAction } from "@/core/game/Game";
import Cards from "@/app/ui/cards";
import Chatting from "@/app/ui/chat-form";
import PlayerSeat from "@/app/ui/player-seat";
import { PlayingButton } from "@/app/ui/playing-button";
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
  const input = new FormInput();
  const output = new FormOutput();
  const io = new Server();
  io.on(room.getId(), (value) => {
    const [id, action, size] = value.split(":");

    if (id !== player.getId()) return;
    input.setCurrentAction(makeUserAction(action, size));
  });
  console.log(room.getId() + "btn");
  io.on(room.getId() + "btn", (value) => {
    console.log(value);
    const [name, ready] = value.split(":");
    if (name !== player.getId()) return;
    player.changeReady();
    if (player.ready()) room.ready();
    else room.notReady();
    if (room.isPlaying()) {
      const players = room.getPlayers();
      const result = new Game(
        players,
        100,
        200,
        new RandomDeck(players.length),
        input,
        output
      ).play();
    }
  });
  return (
    <div className="relative h-screen bg-green-500">
      <div className="flex flex-row w-screen justify-center content-center">
        {output.isGameOn() && <Cards cards={makeIOCard(output.getBoard()!)} />}
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
            <PlayingButton
              name={player.getId()}
              ready={player.ready()}
              roomId={room.getId()}
            />
          )}
        </div>
      )}
      {player && (
        <Action
          actions={actions}
          currentBet={input.getCurrentBet()!}
          playerMoney={player.getMoney()}
          isPlayerTurn={input.isPlayerTurn(player)}
          roomId={room.getId()}
        />
      )}

      <Chatting chattings={chat} />
    </div>
  );
}
