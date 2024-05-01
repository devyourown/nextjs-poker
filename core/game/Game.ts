import { Card } from "../deck/Card";
import { Dealer } from "../deck/Dealer";
import { Deck } from "../deck/Deck";
import { RankingCalculator } from "../rank/RankCalculator";
import { GameResult } from "./GameResult";
import { Input, Output } from "./IO";
import { Pot } from "./Pot";
import { Player, PlayerTable } from "./Table";

export class Game {
  private players: Player[];
  private playerTable: PlayerTable;
  private foldPlayers: Player[];
  private dealer: Dealer;
  private pot: Pot;
  private gameId: string;
  private allinPlayers: Player[];
  private leftNumOfResponse: number = 0;
  private input: Input;
  private output: Output;

  constructor(
    players: Player[],
    smallBlind: number,
    bigBlind: number,
    deck: Deck,
    input: Input,
    output: Output
  ) {
    this.gameId = Math.random().toString(36).substring(7);
    this.players = [...players];
    this.playerTable = new PlayerTable(players);
    this.pot = new Pot(players, smallBlind, bigBlind);
    this.dealer = new Dealer(players, deck);
    this.foldPlayers = [];
    this.allinPlayers = [];
    this.input = input;
    this.output = output;
  }

  public play(): GameResult {
    for (const gameStatus of Object.values(GameStatus)) {
      if (gameStatus === GameStatus.END || this.isEnd()) break;
      this.leftNumOfResponse = this.playerTable.getSize();
      this.playUntilTurnOver();
    }
    this.dealer.showDown();
    let lastPlayers = this.convertTableToList(this.playerTable);
    lastPlayers = [...lastPlayers, ...this.allinPlayers];
    lastPlayers = lastPlayers.filter(
      (player, index, self) =>
        self.findIndex((p) => p.getId() === player.getId()) === index
    );
    this.setPlayersRanking(lastPlayers, this.dealer.getBoard());
    return new GameResult(lastPlayers, this.players, this.pot);
  }

  private convertTableToList(playerTable: PlayerTable): Player[] {
    const result: Player[] = [playerTable.getCurrentPlayer()];
    playerTable.moveNext();
    let player = playerTable.getCurrentPlayer();
    while (result[0] !== player) {
      result.push(player);
      playerTable.moveNext();
      player = playerTable.getCurrentPlayer();
    }
    return result;
  }

  private playUntilTurnOver(): void {
    while (!this.isTurnOver() && !this.isAllPlayerAllIn()) {
      this.output.sendCurrentGame(
        this.pot,
        this.dealer,
        this.playerTable.getCurrentPlayer()
      );
      const userAction: UserAction = this.input.getUserAction(
        this.playerTable.getCurrentPlayer(),
        this.pot
      );
      this.playAction(userAction.action, userAction.betSize);
    }
    this.dealer.nextStatus();
    this.pot.refresh(this.foldPlayers);
    this.foldPlayers = [];
  }

  private isTurnOver(): boolean {
    return this.leftNumOfResponse <= 0;
  }

  public resetGame(): void {
    this.removeNoMoneyPlayer();
    this.playerTable.reset(this.players);
    this.dealer.reset(this.players);
    this.pot.reset(this.convertTableToList(this.playerTable));
    this.allinPlayers = [];
    this.players.forEach((player) => player.dead());
  }

  private removeNoMoneyPlayer(): void {
    this.players = this.players.filter(
      (player) => player.getMoney() >= this.pot.getBigBlind()
    );
  }

  private playAction(action: Action, betSize: number): void {
    if (action === Action.FOLD) this.actFold();
    else if (action === Action.CALL) this.actCall();
    else if (action === Action.BET) this.actBet(betSize);
    if (this.playerTable.getCurrentPlayer().hasAllin()) {
      this.allinPlayers.push(this.playerTable.getCurrentPlayer());
      this.playerTable.removeSelf();
    }
    this.playerTable.moveNext();
    this.leftNumOfResponse--;
  }

  private actFold(): void {
    this.foldPlayers.push(this.playerTable.getCurrentPlayer());
    this.playerTable.removeSelf();
  }

  private actCall(): void {
    this.pot.call(this.playerTable.getCurrentPlayer());
  }

  private actBet(betSize: number): void {
    this.pot.bet(this.playerTable.getCurrentPlayer(), betSize);
    this.leftNumOfResponse = this.playerTable.getSize();
  }

  private isAllPlayerAllIn(): boolean {
    return this.playerTable.getSize() === 0;
  }

  private setPlayersRanking(players: Player[], cards: Card[]): void {
    for (const player of players) {
      const totalCards = [...cards, ...player.getHands()];
      player.setRanks(RankingCalculator.calculateCards(totalCards));
    }
  }

  public isEnd(): boolean {
    return this.playerTable.getSize() < 2;
  }

  public getGameId(): string {
    return this.gameId;
  }
}

export enum Action {
  FOLD,
  CALL,
  CHECK,
  BET,
}

export type UserAction = {
  action: Action;
  betSize: number;
};

export enum GameStatus {
  PRE_FLOP,
  FLOP,
  RIVER,
  TURN,
  END,
}

export function getNextStatus(status: number): GameStatus {
  if (status >= 3) return GameStatus.END;
  return Object.values(GameStatus).indexOf(Object.values(GameStatus)[status]);
}
