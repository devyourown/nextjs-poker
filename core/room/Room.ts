import { User } from "@/app/lib/definitions";
import { Player } from "../game/Table";
import { Game, UserAction } from "../game/Game";
import { Dealer } from "../deck/Dealer";
import { Pot } from "../game/Pot";

export class Room {
  private roomId: string;
  private status: RoomStatus;
  private users: User[];
  private numOfReady;
  private game: Game | null;

  constructor(
    roomId = "",
    status = "",
    users: any = 0,
    numOfReady = 0,
    game = null
  ) {
    if (roomId !== "") {
      this.roomId = roomId;
      this.status = status as RoomStatus;
      this.users = users;
      this.numOfReady = numOfReady;
      this.game = game;
      return;
    }
    this.roomId = Math.random().toString(36);
    this.status = "SPACIOUS";
    this.users = [];
    this.numOfReady = 0;
    this.game = null;
  }

  static of(
    roomId: string | undefined,
    status: string | undefined,
    users: User[] | undefined,
    numOfReady: number | undefined,
    game: any
  ) {
    return new Room(roomId, status, users, numOfReady, game);
  }

  addUser(user: User) {
    if (this.status !== "SPACIOUS") throw new Error("Room Should be Spacious");
    this.users.push(user);
    if (this.users.length == 8) this.status = "FULL";
  }

  getUser(id: string) {
    return this.users.filter((user) => id === user.name)[0];
  }

  getUsers(): User[] {
    return this.users;
  }

  canEnter() {
    return this.status === "SPACIOUS";
  }

  isEveryoneReady() {
    return this.status === "PLAYING";
  }

  ready(id: string) {
    const user = this.getUser(id);
    user.ready = !user.ready;
    console.log("id", this.users);
    if (user.ready) this.numOfReady += 1;
    else this.numOfReady -= 1;
    if (this.numOfReady > 1 && this.numOfReady === this.users.length)
      this.status = "PLAYING";
  }

  getId() {
    return this.roomId;
  }

  isPlaying() {
    return this.game !== null;
  }

  getCurrentGame(): [Pot | null, Dealer | null, Player | null] {
    if (!this.game) return [null, null, null];
    return this.game?.getCurrentGame()!;
  }

  setGame(game: Game) {
    this.game = game;
  }

  playAction(action: UserAction) {
    this.game?.playWith(action);
  }

  getGameResult() {
    return this.game?.getResult();
  }
}

type RoomStatus = "FULL" | "SPACIOUS" | "PLAYING";
