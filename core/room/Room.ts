import { User } from "@/app/lib/definitions";
import { Player } from "../game/Table";
import { FormInput } from "@/app/lib/FormInput";
import { UserAction } from "../game/Game";

export class Room {
  private roomId: string;
  private status: RoomStatus;
  private players: Player[];
  private users: User[];
  private numOfReady;
  private input: FormInput | null;

  constructor() {
    this.roomId = Math.random().toString(36);
    this.status = "SPACIOUS";
    this.players = [];
    this.users = [];
    this.numOfReady = 0;
    this.input = null;
  }

  addUser(user: User) {
    this.users.push(user);
  }

  addPlayer(player: Player) {
    if (this.status !== "SPACIOUS") throw new Error("Room Should be Spacious");
    this.players.push(player);
    if (this.players.length == 8) this.status = "FULL";
  }

  getPlayer(id: string): Player {
    return this.players.filter((player) => id === player.getId())[0];
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getUsers(): User[] {
    return this.users;
  }

  canEnter() {
    return this.status === "SPACIOUS";
  }

  isPlaying() {
    return this.status === "PLAYING";
  }

  ready() {
    this.numOfReady += 1;
    if (this.numOfReady == this.players.length) this.status = "PLAYING";
  }

  notReady() {
    this.numOfReady -= 1;
  }

  getId() {
    return this.roomId;
  }

  setAction(action: UserAction) {
    this.input?.setCurrentAction(action);
  }
}

type RoomStatus = "FULL" | "SPACIOUS" | "PLAYING";
