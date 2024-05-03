import { User } from "@/app/lib/definitions";
import { RandomDeck } from "@/core/deck/Deck";
import { Action, Game, UserAction } from "@/core/game/Game";
import { GameResult } from "@/core/game/GameResult";
import { Player } from "@/core/game/Table";
import { Room } from "@/core/room/Room";

function convertUsersToPlayers(users: User[]) {
  const result = [];
  for (const user of users) {
    result.push(new Player(user.name, user.money!));
  }
  return result;
}

describe("poker game test", () => {
  const user1: User = {
    id: "1",
    name: "kyuho",
    email: "kyuho@naver.com",
    money: 10000,
    ready: false,
  };

  const user2: User = {
    id: "2",
    name: "junseob",
    email: "junsik@naver.com",
    money: 100000,
    ready: false,
  };

  let room: Room;

  beforeEach(() => {
    room = new Room();
    room.addUser(user1);
    user1.roomId = room.getId();
    room.addUser(user2);
    user2.roomId = room.getId();
    room.ready(user1.name);
    room.ready(user2.name);
  });

  it("should be isEveryoneReady when all ready", () => {
    expect(room.isEveryoneReady()).toBe(true);
    expect(room.isPlaying()).toBe(false);
  });

  it("should be playing when game set", () => {
    const players = convertUsersToPlayers(room.getUsers());
    room.setGame(new Game(players, 100, 200, new RandomDeck(players.length)));
    expect(room.isPlaying()).toBe(true);
  });

  it("should end normally", () => {
    const players = convertUsersToPlayers(room.getUsers());
    room.setGame(new Game(players, 100, 200, new RandomDeck(players.length)));
    expect(room.isPlaying()).toBe(true);
    const action: UserAction = { action: Action.FOLD, betSize: 0 };
    const isFirstPlayer = true;
    room.playAction(action, isFirstPlayer);
    expect(room.getGameResult()).toBeInstanceOf(GameResult);
  });
});
