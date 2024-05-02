export type User = {
  id: string;
  roomId?: string;
  name: string;
  email: string;
  imageSrc?: string;
  money?: number;
  password?: string;
  ready: boolean;
};

export type Money = {
  id: string;
  user_id: string;
  amount: number;
};

export type Chat = {
  author: string;
  content: string;
};

export type Card = {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  number: number;
};

export type Room = {
  roomId: string;
  roomStatus: "playing" | "fulled" | "spacious";
};
