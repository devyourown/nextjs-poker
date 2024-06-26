import { Action } from "@/app/lib/definitions";

export function validateUserAction(
    currentBet: number,
    action: Action,
    betLog: number
) {
    const { name, playerMoney, size } = action;
    const inputAction = validateAction(currentBet, name, betLog);
    if (inputAction) return inputAction;
    if (name === "BET") {
        const inputMoney = validateMoney(currentBet, playerMoney, size);
        if (inputMoney) return inputMoney;
    }
    return { success: action, error: null };
}

function validateAction(currentBet: number, action: string, betLog: number) {
    if (!isOneOfAction(action))
        return { error: "You can do only existing actions." };
    if (action === "CHECK" && currentBet > 0 && betLog !== currentBet)
        return { error: "You cannot check now." };
    if (action === "CALL" && currentBet == 0)
        return { error: "You cannot call now." };
    return null;
}

function isOneOfAction(action: string) {
    if (action === "FOLD") return true;
    if (action === "CHECK") return true;
    if (action === "CALL") return true;
    if (action === "BET") return true;
    return false;
}

function validateMoney(
    currentBet: number,
    playerMoney: number,
    amount: number
) {
    if (isNaN(Number(amount))) return { error: "You can only input number." };
    const money = Number(amount);
    if (currentBet > money) return { error: "Too Small To Bet." };
    if (money % 100 != 0) return { error: "Bet Size Should be 100 unit." };
    if (playerMoney < money) return { error: "Money is No Enough." };
    return {};
}

function isNumber() {}
