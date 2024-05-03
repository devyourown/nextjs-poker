import { Player } from "./Table";

export class Pot {
  private playerBetLog: Map<Player, number>;
  private smallBlind: number;
  private bigBlind: number;
  private currentBet: number = 0;
  private totalAmount: number = 0;
  private turnAmount: number = 0;
  private foldAmount: number = 0;

  constructor(
    smallBlind: number,
    bigBlind: number,
    players?: Player[],
    currentBet?: number,
    turnAmount?: number,
    totalAmount?: number,
    foldAmount?: number,
    playerBetLog?: Map<Player, number>,
    replace?: boolean
  ) {
    if (replace) {
      this.smallBlind = smallBlind;
      this.bigBlind = bigBlind;
      this.turnAmount = turnAmount!;
      this.playerBetLog = playerBetLog!;
      this.totalAmount = totalAmount!;
      this.foldAmount = foldAmount!;
      this.currentBet = currentBet!;
      return;
    }
    this.smallBlind = smallBlind;
    this.bigBlind = bigBlind;
    this.playerBetLog = new Map();
    this.reset(players!);
  }

  reset(players: Player[]): void {
    this.currentBet = this.bigBlind;
    this.totalAmount = this.smallBlind + this.bigBlind;
    this.turnAmount = this.smallBlind + this.bigBlind;
    this.foldAmount = 0;
    this.paySmallBig(players[players.length - 2], players[players.length - 1]);
  }

  private paySmallBig(smallBlinder: Player, bigBlinder: Player): void {
    smallBlinder.bet(this.smallBlind);
    bigBlinder.bet(this.bigBlind);
    this.playerBetLog.set(smallBlinder, this.smallBlind);
    this.playerBetLog.set(bigBlinder, this.bigBlind);
  }

  refresh(foldPlayers: Player[]): void {
    for (const player of foldPlayers) {
      this.foldAmount += this.playerBetLog.get(player) || 0;
      this.playerBetLog.delete(player);
      player.dead();
    }
    this.calculatePossibleMoney();
    this.playerBetLog.clear();
    this.currentBet = 0;
    this.turnAmount = 0;
    this.foldAmount = 0;
  }

  private calculatePossibleMoney(): void {
    this.playerBetLog.forEach((betAmount, player) => {
      const canTakeMoney = betAmount * this.playerBetLog.size + this.foldAmount;
      player.plusPossibleTakingAmountOfMoney(
        Math.min(this.turnAmount, canTakeMoney)
      );
    });
  }

  splitMoney(winners: Player[], losers: Player[]): void {
    winners.sort(
      (a, b) =>
        a.getPossibleTakingAmountOfMoney() - b.getPossibleTakingAmountOfMoney()
    );
    this.giveMoneyTo(winners);
    if (this.hasMoneyLeftOver() && losers.length > 0) {
      const chopped = this.getChopped(losers);
      const bestBet = winners
        .map((winner) => winner.getBeforeBetMoney())
        .reduce((a, b) => Math.max(a, b), 0);
      this.payBack(chopped, bestBet);
      if (this.hasMoneyLeftOver()) {
        this.splitLeftOver(chopped);
      }
    }
  }

  private splitLeftOver(losers: Player[]): void {
    const split = Math.floor(this.totalAmount / losers.length);
    losers.forEach((player) => player.plusMoney(split));
    this.takeOutMoney(this.totalAmount);
  }

  private payBack(players: Player[], alreadyTaken: number): void {
    for (const player of players) {
      player.plusMoney(this.takeOutMoney(player.getBetSize() - alreadyTaken));
    }
  }

  private hasMoneyLeftOver(): boolean {
    return this.totalAmount > 0;
  }

  private getChopped(players: Player[]): Player[] {
    return players
      .filter((player) => player.getRanks() === players[0].getRanks())
      .sort((a, b) => a.getBeforeBetMoney() - b.getBeforeBetMoney());
  }

  private giveMoneyTo(players: Player[]): void {
    if (players.length > 1) {
      this.payBack(players, 0);
      this.takeMoneyWhenChopped(players);
      return;
    }
    this.takeMoneyOnePerson(players[0]!);
  }

  private takeMoneyWhenChopped(players: Player[]): void {
    let size = players.length;
    for (const player of players) {
      let possibleMoney = Math.floor(player.getBetSize() / size);
      if (possibleMoney > Math.floor(this.totalAmount / size)) {
        possibleMoney = Math.floor(this.totalAmount / size);
      }
      player.plusMoney(this.takeOutMoney(possibleMoney));
      size -= 1;
    }
  }

  private takeMoneyOnePerson(player: Player): void {
    const money = player.getPossibleTakingAmountOfMoney();
    const possibleMoney = this.takeOutMoney(money);
    player.plusMoney(possibleMoney);
  }

  call(player: Player): void {
    const callAmount = this.getSizeToCall(player);
    player.bet(callAmount);
    this.raiseMoney(callAmount);
    this.playerBetLog.delete(player);
    this.playerBetLog.set(player, this.currentBet);
  }

  private raiseMoney(money: number): void {
    this.totalAmount += money;
    this.turnAmount += money;
  }

  getSizeToCall(player: Player): number {
    const alreadyPayed = this.playerBetLog.get(player) || 0;
    return this.currentBet - alreadyPayed;
  }

  bet(player: Player, betSize: number): void {
    player.bet(betSize);
    this.raiseMoney(betSize);
    betSize += this.playerBetLog.get(player) || 0;
    this.currentBet = betSize;
    this.playerBetLog.set(player, betSize);
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getCurrentBet(): number {
    return this.currentBet;
  }

  getBigBlind(): number {
    return this.bigBlind;
  }

  private takeOutMoney(money: number): number {
    if (money <= this.totalAmount) {
      this.totalAmount -= money;
      return money;
    }
    const takenMoney = this.totalAmount;
    this.totalAmount = 0;
    return takenMoney;
  }

  toJSON() {
    const newBetLog: any[] = [];
    this.playerBetLog.forEach((amount, player) => {
      newBetLog.push({ id: player.getId(), amount: amount });
    });
    console.log(newBetLog);
    return {
      playerBetLog: newBetLog,
      smallBlind: this.smallBlind,
      bigBlind: this.bigBlind,
      turnAmount: this.turnAmount,
      totalAmount: this.totalAmount,
      foldAmount: this.foldAmount,
      currentBet: this.currentBet,
    };
  }
}
