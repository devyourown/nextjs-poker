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
  let room: Room;

  beforeEach(() => {
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
    room.playAction(action);
    expect(room.getGameResult()).toBeInstanceOf(GameResult);
  });

  it("should end when everyone allin", () => {
    const players = convertUsersToPlayers(room.getUsers());
    room.setGame(new Game(players, 100, 200, new RandomDeck(players.length)));
    expect(room.isPlaying()).toBe(true);
    const firstAction: UserAction = { action: Action.BET, betSize: 9900 };
    const secondAction: UserAction = { action: Action.CALL, betSize: 0 };
    room.playAction(firstAction);
    expect(room.getGameResult()).toBeNull();
    room.playAction(secondAction);
    expect(room.getGameResult()).toBeInstanceOf(GameResult);
  });

  it("should have correct money with every player", () => {
    const players = convertUsersToPlayers(room.getUsers());
    room.setGame(new Game(players, 100, 200, new RandomDeck(players.length)));
    expect(room.isPlaying()).toBe(true);
    const beforeGameUser = {} as any;
    room.getUsers().forEach((user) => {
      beforeGameUser[user.name] = user.money;
    });
    const firstAction: UserAction = { action: Action.BET, betSize: 9900 };
    const secondAction: UserAction = { action: Action.CALL, betSize: 0 };
    room.playAction(firstAction);
    expect(room.getGameResult()).toBeNull();
    room.playAction(secondAction);
    const winnerName = room.getGameResult()?.getWinnerName();
    winnerName?.forEach((name) => {
      expect(room.getUser(name).money).toBeGreaterThan(beforeGameUser[name]);
    });
  });
});
