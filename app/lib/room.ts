import { Room } from "@/core/room/Room";

const roomCache: Map<string, Room> = new Map();

export function findRoom(roomId: string) {
  return roomCache.get(roomId);
}

export function findEmptyRoom(): Room {
  roomCache.forEach((room) => {
    if (room.canEnter()) {
      return room;
    }
  });
  const room = new Room();
  roomCache.set(room.getId(), room);
  return room;
}

export function removeFromCache(roomId: string) {
  roomCache.delete(roomId);
}
