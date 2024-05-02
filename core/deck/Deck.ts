import { Card, Suit } from "./Card";
import { DeckError, DeckErrorCode } from "@/error/DeckError";

export interface Deck {
  draw(): Card;
  reset(numOfPlayers: number): void;
}

export class DeterminedDeck implements Deck {
  private deck: Card[];

  constructor(cards: Card[]) {
    this.deck = cards;
  }

  draw(): Card {
    if (this.deck.length === 0) throw new DeckError(DeckErrorCode.EMPTY);
    return this.deck.pop()!;
  }
  reset(numOfPlayers: number): void {}
}

export class RandomDeck implements Deck {
  private deck: Card[] = [];

  constructor(numOfPlayers: number) {
    if (numOfPlayers > 9) throw new DeckError(DeckErrorCode.TOO_MANY_PLAYER);
    this.initDeck(numOfPlayers);
  }

  private initDeck(numOfPlayers: number): void {
    const neededNumOfCards: number = numOfPlayers * 2 + 5;
    const cards: Set<Card> = new Set();

    while (cards.size !== neededNumOfCards) cards.add(this.makeRandomCard());
    this.deck = Array.from(cards);
  }

  private makeRandomCard(): Card {
    const value: number = Math.floor(Math.random() * 13) + 1;
    const suit: Suit = Math.floor(Math.random() * 4);
    return Card.of(value, suit);
  }

  draw(): Card {
    if (this.deck.length === 0) throw new DeckError(DeckErrorCode.EMPTY);
    return this.deck.pop()!;
  }

  reset(numOfPlayers: number): void {
    this.initDeck(numOfPlayers);
  }
}
