import { User } from "@/app/lib/definitions";
import { Player } from "../game/Table";
import { FormInput } from "@/app/lib/FormInput";
import { Game, UserAction } from "../game/Game";
import { FormOutput } from "@/app/lib/FormOutput";
import { GameResult } from "../game/GameResult";

export class Room {
  private roomId: string;
  private status: RoomStatus;
  private players: Player[];
  private users: User[];
  private numOfReady;
  private input: FormInput | null;
  private output: FormOutput | null;
  private gameResult: GameResult | null;

  constructor() {
    this.roomId = Math.random().toString(36);
    this.status = "SPACIOUS";
    this.players = [];
    this.users = [];
    this.numOfReady = 0;
    this.input = null;
    this.output = null;
    this.gameResult = null;
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

  isEveryoneReady() {
    return this.status === "PLAYING";
  }

  makePlayerReady(playerId: string) {
    const player = this.getPlayer(playerId);
    player.changeReady();
    if (player.ready()) this.numOfReady += 1;
    else this.numOfReady -= 1;
    if (this.numOfReady > 1 && this.numOfReady == this.players.length)
      this.status = "PLAYING";
  }

  getId() {
    return this.roomId;
  }

  setAction(action: UserAction) {
    this.input?.setCurrentAction(action);
  }

  setGameResult(gameResult: GameResult) {
    this.gameResult = gameResult;
  }

  isPlaying() {
    return this.input !== null;
  }

  setIO(input: FormInput, output: FormOutput) {
    this.input = input;
    this.output = output;
  }

  getIO() {
    return [this.input, this.output];
  }
}

type RoomStatus = "FULL" | "SPACIOUS" | "PLAYING";
