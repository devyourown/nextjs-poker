export function splitMoney(
    winners: string[],
    losers: string[],
    possibleMoney: Map<string, number>,
    betMoney: Map<string, number>,
    totalAmount: number
): Map<string, number> {
    const result = new Map<string, number>();
    totalAmount -= payBackToLoser(winners, losers, betMoney, result);
    totalAmount -= payBackToWinner(winners, betMoney, result);
    splitInWinner(winners, possibleMoney, totalAmount, result);
    return result;
}

function payBackToLoser(
    winners: string[],
    losers: string[],
    betMoney: Map<string, number>,
    result: Map<string, number>
) {
    let howMuchPayBack = 0;
    const bigWinner = winners.reduce((prev, cur) => {
        return betMoney.get(prev)! > betMoney.get(cur)! ? prev : cur;
    });
    const bigWinnerMoney = betMoney.get(bigWinner)!;
    const bigLosers = losers.filter((loser) => {
        betMoney.get(loser)! > bigWinnerMoney;
    });
    bigLosers.forEach((loser) => {
        const moneyToLoser = betMoney.get(loser)! - bigWinnerMoney;
        result.set(loser, betMoney.get(loser)! - bigWinnerMoney);
        howMuchPayBack += moneyToLoser;
    });
    return howMuchPayBack;
}

function payBackToWinner(
    winners: string[],
    betMoney: Map<string, number>,
    result: Map<string, number>
) {
    let howMuchPayBack = 0;
    winners.forEach((winner) => {
        howMuchPayBack += betMoney.get(winner)!;
        result.set(winner, betMoney.get(winner)!);
    });
    return howMuchPayBack;
}

function splitInWinner(
    winners: string[],
    possibleMoney: Map<string, number>,
    totalAmount: number,
    result: Map<string, number>
) {
    winners.sort((a, b) => possibleMoney.get(a)! - possibleMoney.get(b)!);
    let size = winners.length;
    winners.forEach((winner) => {
        let takeMoney = Math.ceil(possibleMoney.get(winner)! / size);
        if (takeMoney > totalAmount) takeMoney = totalAmount;
        result.set(winner, result.get(winner) || 0 + takeMoney);
        totalAmount -= takeMoney;
        size -= 1;
    });
    return totalAmount;
}
