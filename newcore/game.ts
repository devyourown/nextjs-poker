import { Action, Game, GameStatus } from "@/app/lib/definitions";

export function playWith(action: Action, status: Game): Game {
    let {
        numOfLeftTurn,
        numOfAllinPlayers,
        numOfFoldPlayers,
        numOfPlayers,
        gameStatus,
    } = status;
    const { name, size, playerMoney } = action;
    if (name === "BET") {
        numOfLeftTurn = numOfPlayers;
        if (size === playerMoney) numOfAllinPlayers += 1;
        if (numOfAllinPlayers === numOfPlayers) gameStatus = GameStatus.END;
    } else if (name === "FOLD") {
        numOfFoldPlayers += 1;
        if (numOfFoldPlayers + 1 == numOfPlayers) gameStatus = GameStatus.END;
    } else if (name === "CALL") {
        if (size === playerMoney) numOfAllinPlayers += 1;
        if (numOfAllinPlayers === numOfPlayers) gameStatus = GameStatus.END;
    }
    numOfLeftTurn -= 1;
    if (numOfLeftTurn == 0 && gameStatus !== GameStatus.END) gameStatus += 1;
    return {
        numOfLeftTurn,
        numOfAllinPlayers,
        numOfFoldPlayers,
        numOfPlayers,
        gameStatus,
    };
}
