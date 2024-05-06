export type User = {
    id: string;
    roomId?: string;
    name: string;
    email: string;
    img_src?: string;
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
    turnBetMoney: MoneyLog[];
    totalBetMoney: MoneyLog[];
    gameResult: PlayerResult[] | null;
    game: Game;
};

export type PlayerOrder = {
    users: User[];
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
    numOfAllinPlayers: number;
    gameStatus: GameStatus;
    numOfLeftTurn: number;
    currentBet: number;
    players: string[];
    communityCards: Card[];
};

export type PlayerResult = {
    name: string;
    rank: string;
};

export type MoneyLog = {
    money: number;
    playerName: string;
};
