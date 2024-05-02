import { GameStatus, getNextStatus } from "../game/Game";
import { Player } from "../game/Table";
import { Card } from "./Card";
import { Deck } from "./Deck";

export class Dealer {
  private deck: Deck;
  private board: Card[];
  private gameStatus: GameStatus;
  private players: Player[];

  constructor(
    players: Player[],
    deck: Deck,
    board?: Card[],
    gameStatus?: GameStatus,
    replace?: boolean
  ) {
    if (replace) {
      this.players = players;
      this.deck = deck;
      this.board = board!;
      this.gameStatus = gameStatus!;
      return;
    }
    this.players = players;
    this.deck = deck;
    this.board = [];
    this.distributeCards();
    this.gameStatus = GameStatus.PRE_FLOP;
  }

  private distributeCards(): void {
    this.players.forEach((player) => player.setHands(this.handoutCards()));
  }

  public showDown(): void {
    while (this.gameStatus !== GameStatus.END) this.nextStatus();
  }

  public nextStatus(): void {
    this.gameStatus = getNextStatus(this.gameStatus);
    if (this.gameStatus === GameStatus.FLOP) {
      this.setFlop();
    } else if (this.gameStatus === GameStatus.TURN) {
      this.setTurn();
    } else if (this.gameStatus === GameStatus.RIVER) {
      this.setRiver();
    }
  }

  public reset(players: Player[]): void {
    this.players = players;
    this.deck.reset(players.length);
    this.board = [];
    this.gameStatus = GameStatus.PRE_FLOP;
    this.distributeCards();
  }

  private setFlop(): void {
    this.board.push(...this.getFlopCards());
  }

  private setTurn(): void {
    this.board.push(this.getTurnCard());
  }

  private setRiver(): void {
    this.board.push(this.getRiverCard());
  }

  private handoutCards(): Card[] {
    return [this.deck.draw(), this.deck.draw()];
  }

  private getFlopCards(): Card[] {
    return [this.deck.draw(), this.deck.draw(), this.deck.draw()];
  }

  private getTurnCard(): Card {
    return this.deck.draw();
  }

  private getRiverCard(): Card {
    return this.deck.draw();
  }

  public getBoard(): Card[] {
    return this.board;
  }

  public isAfterPreFlop(): boolean {
    return this.gameStatus > GameStatus.PRE_FLOP;
  }
}
