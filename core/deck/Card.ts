export class Card {
  private static cache: Map<string, Card> = new Map();

  private constructor(
    private readonly value: number,
    private readonly suit: Suit
  ) {}

  static of(value: number, suit: Suit): Card {
    const key: string = suit.toString() + value;
    if (!Card.cache.has(key)) Card.cache.set(key, new Card(value, suit));
    return Card.cache.get(key)!;
  }

  getValue(): number {
    return this.isAce() ? 14 : this.value;
  }

  getSuit(): Suit {
    return this.suit;
  }

  isAce(): boolean {
    return this.value === 1;
  }

  toString(): string {
    return `${this.suit.toString()} ${this.value}`;
  }
}

export enum Suit {
  HEARTS,
  DIAMONDS,
  CLUBS,
  SPADES,
}
