export type User = {
  id: string;
  roomId?: string;
  name: string;
  email: string;
  imageSrc?: string;
  money?: number;
  password?: string;
  hands?: Card[];
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

export type StringSuit = "hearts" | "diamonds" | "clubs" | "spades";

export type Card = {
  suit: StringSuit;
  number: number;
};

export type Room = {
  roomId: string;
  roomStatus: "playing" | "fulled" | "spacious";
};

export type GameResult = {
  winnersNames: string[];
};
