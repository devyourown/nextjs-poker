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

export type Card = {
    suit: "hearts" | "diamonds" | "clubs" | "spades";
    number: number;
};

export type Room = {
    roomId: string;
    users: User[];
    isPlaying: boolean;
};

export type GameResult = {
    winnersNames: string[];
};

export type Action = {
    name: "CALL" | "BET" | "CHECK" | "FOLD";
    size: number;
    playerMoney: number;
};

export enum GameStatus {
    PREFLOP = 0,
    FLOP,
    TURN,
    LIVER,
    END,
}

export type Game = {
    numOfLeftTurn: number;
    numOfAllinPlayers: number;
    numOfFoldPlayers: number;
    numOfPlayers: number;
    gameStatus: GameStatus;
};

export type Player = {
    name: string;
    hands: Card[];
};
