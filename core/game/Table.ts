import { Card } from "../deck/Card";

export class Player {
  private readonly id: string;
  private money: number;
  private hands: Card[];
  private ranks: number;
  private possibleTakingAmountOfMoney: number;
  private beforeBetMoney: number;
  private betSize: number;

  constructor(
    id: string,
    money: number,
    beforeBetMoney?: number,
    ranks?: number,
    possibleTakingAmountOfMoney?: number,
    betSize?: number,
    hands?: Card[]
  ) {
    if (hands) {
      this.id = id;
      this.money = money;
      this.beforeBetMoney = beforeBetMoney!;
      this.ranks = ranks!;
      this.possibleTakingAmountOfMoney = possibleTakingAmountOfMoney!;
      this.betSize = betSize!;
      this.hands = hands;
      return;
    }
    this.id = id;
    this.money = money;
    this.beforeBetMoney = money;
    this.ranks = 0;
    this.possibleTakingAmountOfMoney = 0;
    this.betSize = 0;
    this.hands = [];
  }

  dead(): void {
    this.beforeBetMoney = this.money;
    this.possibleTakingAmountOfMoney = 0;
    this.betSize = 0;
  }

  getBeforeBetMoney(): number {
    return this.beforeBetMoney;
  }

  bet(betAmount: number): void {
    this.money -= betAmount;
    this.betSize += betAmount;
  }

  getMoney(): number {
    return this.money;
  }

  plusMoney(pot: number): void {
    this.money += pot;
  }

  setHands(cards: Card[]): void {
    this.hands = [...cards];
  }

  getHands(): Array<Card> {
    return this.hands;
  }

  getId(): string {
    return this.id;
  }

  plusPossibleTakingAmountOfMoney(money: number): void {
    this.possibleTakingAmountOfMoney += money;
  }

  getPossibleTakingAmountOfMoney(): number {
    return this.possibleTakingAmountOfMoney;
  }

  getBetSize(): number {
    return this.betSize;
  }

  hasAllin(): boolean {
    return this.money === 0;
  }

  setRanks(ranks: number): void {
    this.ranks = ranks;
  }

  getRanks(): number {
    return this.ranks;
  }
}

class PNode {
  player: Player;
  prev: PNode | null;
  next: PNode | null;

  constructor(player: Player) {
    this.player = player;
    this.prev = null;
    this.next = null;
  }
}

export class PlayerTable {
  private current: PNode | null = null;
  private size: number = 0;
  private changed: number = 0;

  constructor(players: Player[]) {
    this.sitPlayerToTable(players);
  }

  reset(players: Player[]): void {
    this.sitPlayerToTable(players);
    this.changed = (this.changed + 1) % this.size;
    this.moveTurn();
  }

  private sitPlayerToTable(players: Player[]): void {
    let head: PNode | null = new PNode(players[0]);
    let node: PNode | null = head;
    for (let i = 1; i < players.length; i++) {
      let newNode: PNode = new PNode(players[i]);
      node.next = newNode;
      newNode.prev = node;
      node = newNode;
    }
    if (head) {
      node!.next = head;
      head.prev = node;
      this.current = head;
      this.size = players.length;
    }
  }

  private moveTurn(): void {
    if (!this.current) return;
    for (let i = 0; i < this.changed; i++) {
      if (this.current) {
        this.current = this.current.next;
      }
    }
  }

  removeSelf(): void {
    if (!this.current || !this.current.prev || !this.current.next) return;
    this.current.prev.next = this.current.next;
    this.current.next.prev = this.current.prev;
    this.current = this.current.prev;
    this.size--;
  }

  getCurrentPlayer(): Player {
    return this.current?.player!;
  }

  getSize(): number {
    return this.size;
  }

  moveNext(): void {
    if (this.current) {
      this.current = this.current.next;
    }
  }

  toJSON() {
    const firstOne = this.current;
    const result = [firstOne!.player];
    let next = firstOne!.next;
    while (next != firstOne) {
      result.push(next!.player);
      next = next!.next;
    }
    return JSON.stringify(result);
  }
}
