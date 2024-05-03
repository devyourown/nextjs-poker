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
  private allinPlayers: Player[];
  private leftNumOfResponse: number = 0;
  private gameStatus: GameStatus;
  private gameResult: GameResult | null;
  private currentTurnAllin: boolean;
  private isFirstTurnPlayer: boolean;

  constructor(
    players: Player[],
    smallBlind: number,
    bigBlind: number,
    deck?: Deck,
    foldPlayers?: Player[],
    allInPlayers?: Player[],
    gameStatus?: GameStatus,
    gameResult?: GameResult,
    playerTable?: Player[],
    pot?: Pot,
    dealer?: Dealer,
    currentTurnAllin?: boolean,
    isFirstTurnPlayer?: boolean
  ) {
    if (foldPlayers) {
      this.players = [...players];
      this.playerTable = new PlayerTable(playerTable!);
      this.pot = pot!;
      this.dealer = dealer!;
      this.foldPlayers = foldPlayers!;
      this.allinPlayers = allInPlayers ? allInPlayers : [];
      this.gameStatus = gameStatus!;
      this.gameResult = gameResult!;
      this.currentTurnAllin = currentTurnAllin!;
      this.isFirstTurnPlayer = isFirstTurnPlayer!;
      return;
    }
    this.players = [...players];
    this.playerTable = new PlayerTable(players);
    this.pot = new Pot(smallBlind, bigBlind, players);
    this.dealer = new Dealer(players, deck!);
    this.foldPlayers = [];
    this.allinPlayers = [];
    this.gameStatus = GameStatus.PRE_FLOP;
    this.gameResult = null;
    this.currentTurnAllin = false;
    this.isFirstTurnPlayer = true;
  }

  public playWith(userAction: UserAction): void {
    if (this.gameResult !== null) return;
    if (this.isFirstTurnPlayer)
      this.leftNumOfResponse = this.playerTable.getSize();
    this.playAction(userAction.action, userAction.betSize);
    this.isFirstTurnPlayer = false;
    if (
      this.isTurnOver() ||
      this.isAllPlayerAllIn() ||
      this.isFoldExceptOne()
    ) {
      this.dealer.nextStatus();
      this.pot.refresh(this.foldPlayers);
      this.foldPlayers = [];
      this.gameStatus = this.gameStatus + 1;
      if (!this.isFoldExceptOne()) this.currentTurnAllin = false;
      if (this.isFoldExceptOne()) this.gameStatus = GameStatus.END;
      this.isFirstTurnPlayer = true;
    }
    if (
      (this.isEnd() && this.isTurnOver()) ||
      this.gameStatus === GameStatus.END
    ) {
      if (!this.isFoldExceptOne()) this.dealer.showDown();
      let lastPlayers = this.convertTableToList(this.playerTable);
      if (this.allinPlayers)
        lastPlayers = [...lastPlayers, ...this.allinPlayers];
      lastPlayers = lastPlayers.filter(
        (player, index, self) =>
          self.findIndex((p) => p.getId() === player.getId()) === index
      );
      this.setPlayersRanking(lastPlayers, this.dealer.getBoard());
      this.gameResult = new GameResult(lastPlayers, this.players, this.pot);
    }
  }

  public getPlayers() {
    return this.players;
  }

  public getCurrentGame(): [Pot, Dealer, Player] {
    return [this.pot, this.dealer, this.playerTable.getCurrentPlayer()];
  }

  public getResult() {
    return this.gameResult;
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

  private isFoldExceptOne(): boolean {
    return this.playerTable.getSize() === 1 && this.currentTurnAllin === false;
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
      this.currentTurnAllin = true;
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
    if (betSize > this.playerTable.getCurrentPlayer().getMoney())
      betSize = this.playerTable.getCurrentPlayer().getMoney();
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
