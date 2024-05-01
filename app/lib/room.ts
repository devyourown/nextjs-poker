import { auth } from "@/auth";
import { Player } from "@/core/game/Table";
import { redirect } from "next/navigation";
import { User } from "./definitions";

const roomCache: Map<string, Room> = new Map();

async function setSessionWith(room: Room) {
  const session = await auth();
  const user: User = {
    ...session?.user,
    roomId: room.getId(),
  } as User;
  session!.user = user;
  room.addUser(user);
}

function connect(room: Room, player: Player, needToSet = true) {
  room.addPlayer(player);
  if (needToSet) roomCache.set(room.getId(), room);
  setSessionWith(room);
}

export function findRoom(roomId: string) {
  return roomCache.get(roomId);
}

export function findEmptyRoom(player: Player) {
  if (roomCache.size == 0) {
    connect(new Room(), player);
    redirect("/board/room/");
  }
  roomCache.forEach((room) => {
    if (room.canEnter()) {
      connect(room, player, false);
      redirect("/board/room");
    }
  });
  connect(new Room(), player);
  redirect("/board/room");
}

export function removeFromCache(roomId: string) {
  roomCache.delete(roomId);
}

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

  getPlayer(): Player[] {
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
