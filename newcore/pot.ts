export function splitMoney(
    winners: string[],
    losers: string[],
    betMoney: Map<string, number>
): Map<string, number> {
    const result = new Map<string, number>();
    payBackToLoser(winners, losers, betMoney, result);
    splitInWinner(winners, betMoney, result);
    return result;
}

function payBackToLoser(
    winners: string[],
    losers: string[],
    betMoney: Map<string, number>,
    result: Map<string, number>
) {
    losers.forEach((loser) => {
        result.set(loser, 0);
    });
    const bigWinner = winners.reduce((prev, cur) => {
        return betMoney.get(prev)! > betMoney.get(cur)! ? prev : cur;
    });
    const bigWinnerMoney = betMoney.get(bigWinner)!;
    const bigLosers = losers.filter((loser) => {
        return betMoney.get(loser)! > bigWinnerMoney;
    });
    bigLosers.forEach((loser) => {
        const moneyToLoser = betMoney.get(loser)! - bigWinnerMoney;
        result.set(loser, moneyToLoser);
        betMoney.set(loser, bigWinnerMoney);
    });
}

function splitInWinner(
    winners: string[],
    betMoney: Map<string, number>,
    result: Map<string, number>
) {
    winners.sort((a, b) => betMoney.get(a)! - betMoney.get(b)!);
    let size = winners.length;
    let alreadySplit = 0;
    winners.forEach((winner) => {
        let takeMoney = takeOutPossibleMoney(winner, betMoney) / size;
        result.set(winner, alreadySplit + takeMoney);
        alreadySplit += takeMoney;
        size -= 1;
    });
}

function takeOutPossibleMoney(winner: string, betMoney: Map<string, number>) {
    let result = 0;
    const winnerBet = betMoney.get(winner)!;
    betMoney.forEach((money, player) => {
        const payMoney = Math.min(money, winnerBet);
        result += payMoney;
        betMoney.set(player, betMoney.get(player)! - payMoney);
        if (betMoney.get(player)! <= 0) betMoney.delete(player);
    });
    return result;
}
