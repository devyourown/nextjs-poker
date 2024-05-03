import { Pot } from "./Pot";
import { Player } from "./Table";

export class GameResult {
  private readonly winner: Player[];
  private readonly players: Player[];

  constructor(survivor: Player[], wholePlayer: Player[], pot: Pot) {
    survivor.sort((a, b) => b.getRanks() - a.getRanks());
    this.winner = this.getWinners(survivor);
    pot.splitMoney(this.winner, this.getRest(survivor));
    this.players = wholePlayer;
  }

  private getWinners(players: Player[]): Player[] {
    const result: Player[] = [];
    for (const player of players) {
      if (player.getRanks() === players[0].getRanks()) {
        result.push(player);
      } else {
        break;
      }
    }
    return result;
  }

  private getRest(players: Player[]): Player[] {
    const result: Player[] = [];
    for (const player of players) {
      if (player.getRanks() !== players[0].getRanks()) {
        result.push(player);
      }
    }
    return result;
  }

  public getPlayers() {
    return this.players;
  }

  public getWinnerName() {
    return this.winner.map((player) => player.getId());
  }
}
