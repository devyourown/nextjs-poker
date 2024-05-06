import { Action, Game, GameStatus } from "@/app/lib/definitions";

export function playWith(action: Action, status: Game): Game {
    let {
        numOfAllinPlayers,
        gameStatus,
        numOfLeftTurn,
        currentBet,
        players,
        communityCards,
        potSize,
    } = status;
    const { name, size, playerMoney } = action;
    const first = players.shift()!;
    players.push(first);
    if (name === "BET") {
        numOfLeftTurn = players.length;
        currentBet = action.size;
        if (size === playerMoney) numOfAllinPlayers += 1;
        if (numOfAllinPlayers === players.length) gameStatus = GameStatus.END;
    } else if (name === "FOLD") {
        players.pop();
        if (1 === players.length) gameStatus = GameStatus.END;
    } else if (name === "CALL") {
        if (size === playerMoney) numOfAllinPlayers += 1;
        if (numOfAllinPlayers === players.length) gameStatus = GameStatus.END;
    }
    numOfLeftTurn -= 1;
    if (numOfLeftTurn <= 0 && gameStatus !== GameStatus.END) {
        gameStatus += 1;
        currentBet = 0;
        numOfLeftTurn = players.length;
    }
    return {
        numOfAllinPlayers,
        gameStatus,
        numOfLeftTurn,
        currentBet,
        players,
        communityCards,
        potSize,
    };
}
