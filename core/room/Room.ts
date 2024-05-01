import { User } from "@/app/lib/definitions";
import { Player } from "../game/Table";

export class Room {
  private roomId: string;
  private status: RoomStatus;
  private players: Player[];
  private users: User[];
  private numOfReady;

  constructor() {
    this.roomId = Math.random().toString(36);
    this.status = "SPACIOUS";
    this.players = [];
    this.users = [];
    this.numOfReady = 0;
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
}

type RoomStatus = "FULL" | "SPACIOUS" | "PLAYING";
