import { Card, Suit } from "../deck/Card";

export class RankingCalculator {
  calculateCards(cards: Card[]): number {
    const numbersOfCards: number[] = this.convertToNumber(cards);
    numbersOfCards.sort((a, b) => a - b);
    let score = this.getStraightFlush(cards);
    if (score > 0) return score;
    score = this.getFourCards(numbersOfCards);
    if (score > 0) return score;
    score = this.getFullHouse(numbersOfCards);
    if (score > 0) return score;
    score = this.getFlush(cards);
    if (score > 0) return score;
    score = this.getStraight(numbersOfCards);
    if (score > 0) return score;
    score = this.getTriple(numbersOfCards);
    if (score > 0) return score;
    score = this.getTwoPair(numbersOfCards);
    if (score > 0) return score;
    score = this.getOnePair(numbersOfCards);
    if (score > 0) return score;
    return this.getHighCard(numbersOfCards);
  }

  private getHighCard(numbers: number[]): number {
    numbers.sort((a, b) => b - a);
    let result = 0;
    for (let i = 0; i < 5; i++) {
      result += numbers[i];
    }
    return result;
  }

  private convertToNumber(cards: Card[]): number[] {
    return cards.map((card) => card.getValue());
  }

  private getStraightFlush(cards: Card[]): number {
    const mostSuit = this.getMostSuited(cards);
    const sorted = cards
      .filter((card) => card.getSuit() === mostSuit)
      .sort((a, b) => a.getValue() - b.getValue());
    if (sorted.length < 5) return 0;
    const numbers = this.convertToNumber(sorted);
    for (let i = numbers.length - 5; i >= 0; i--) {
      if (this.isStraight(numbers, i, i + 5))
        return Ranking.STRAIGHT_FLUSH + numbers[i + 4];
    }
    if (numbers[numbers.length - 1] === 14) {
      if (this.isLowAceStraight(numbers)) return Ranking.STRAIGHT_FLUSH + 5;
    }
    return 0;
  }

  private getMostSuited(cards: Card[]): Suit {
    let mostSuit: Suit = Suit.CLUBS;
    let most = 0;
    for (const card of cards) {
      const count = cards.filter((c) => c.getSuit() === card.getSuit()).length;
      if (most < count) {
        most = count;
        mostSuit = card.getSuit();
      }
    }
    return mostSuit;
  }

  private getFourCards(cardNumbers: number[]): number {
    const count = this.sameCountAsExpected(cardNumbers, 4);
    if (count === 0) return 0;
    const highCard = Math.max(...this.getListWithoutSame(cardNumbers, 4));
    return Ranking.FOUR_CARDS + count * 2 + highCard;
  }

  private sameCountAsExpected(cardNumbers: number[], expected: number): number {
    for (const number of cardNumbers) {
      const count = cardNumbers.filter(
        (cardNumber) => cardNumber === number
      ).length;
      if (count === expected) return number;
    }
    return 0;
  }

  private getFullHouse(cardNumbers: number[]): number {
    const leftWithoutTriple = this.getListWithoutSame(cardNumbers, 3);
    if (leftWithoutTriple.length === 0) return 0;
    const triple = this.getHighestTriple(cardNumbers);
    const pairValue = this.getValueOfSamePair(leftWithoutTriple);
    if (pairValue > 0)
      return Ranking.FULL_HOUSE + triple[0] * 3 + pairValue * 2;
    return 0;
  }

  private getValueOfSamePair(numbers: number[]): number {
    let result = 0;
    for (const number of numbers) {
      const count = numbers.filter((n) => n === number).length;
      if (count >= 2) result = Math.max(result, number);
    }
    return result;
  }

  private getHighestTriple(numbers: number[]): number[] {
    let result: number[] = [];
    for (const number of numbers) {
      const count = numbers.filter(
        (cardNumber) => cardNumber === number
      ).length;
      if (count === 3)
        result = numbers.filter((cardNumber) => cardNumber === number);
    }
    return result;
  }

  private getListWithoutSame(numbers: number[], sameCount: number): number[] {
    for (const number of numbers) {
      const count = numbers.filter(
        (cardNumber) => cardNumber === number
      ).length;
      if (count === sameCount)
        return numbers.filter((cardNumber) => cardNumber !== number);
    }
    return [];
  }

  private getFlush(cards: Card[]): number {
    if (this.isFlush(cards)) {
      const mostSuit = this.getMostSuited(cards);
      const highValue = Math.max(
        ...cards
          .filter((card) => card.getSuit() === mostSuit)
          .map((card) => card.getValue())
      );
      return Ranking.FLUSH + highValue;
    }
    return 0;
  }

  private isFlush(cards: Card[]): boolean {
    for (const card of cards) {
      const count = cards.filter((c) => c.getSuit() === card.getSuit()).length;
      if (count >= 5) return true;
    }
    return false;
  }

  private getStraight(cardNumbers: number[]): number {
    cardNumbers = Array.from(new Set(cardNumbers));
    for (let i = cardNumbers.length - 5; i >= 0; i--) {
      if (this.isStraight(cardNumbers, i, i + 5))
        return Ranking.STRAIGHT + cardNumbers[i + 4];
    }
    if (cardNumbers[cardNumbers.length - 1] === 14) {
      if (this.isLowAceStraight(cardNumbers)) return Ranking.STRAIGHT + 5;
    }
    return 0;
  }

  private isStraight(numbers: number[], start: number, end: number): boolean {
    for (let i = start + 1; i < end; i++) {
      if (numbers[i - 1] + 1 !== numbers[i]) return false;
    }
    return true;
  }

  private isLowAceStraight(cards: number[]): boolean {
    if (cards[0] !== 2) return false;
    for (let i = 1; i < 4; i++) {
      if (cards[i - 1] + 1 !== cards[i]) return false;
    }
    return true;
  }

  private getTriple(cardNumbers: number[]): number {
    const count = this.sameCountAsExpected(cardNumbers, 3);
    if (count === 0) return 0;
    const sorted = cardNumbers.filter((c) => c !== count).sort((a, b) => b - a);
    return Ranking.TRIPLE + count * 3 + sorted[0] * 2 + sorted[1];
  }

  private getTwoPair(cardNumbers: number[]): number {
    const result: number[] = [];
    let highCard = 0;
    for (const number of cardNumbers) {
      const count = cardNumbers.filter(
        (cardNumber) => cardNumber === number
      ).length;
      if (count === 2) result.push(number);
      else {
        if (highCard < number) highCard = number;
      }
    }
    if (result.length < 4) return 0;
    const sorted = result.sort((a, b) => b - a);
    return Ranking.TWO_PAIR + sorted[0] * 3 + sorted[2] * 2 + highCard;
  }

  private getOnePair(cardNumbers: number[]): number {
    for (const number of cardNumbers) {
      const count = cardNumbers.filter(
        (cardNumber) => cardNumber === number
      ).length;
      if (count === 2) {
        let leftOver = 0;
        let numOfLeft = 0;
        for (let i = cardNumbers.length - 1; i >= 0; i--) {
          if (number !== cardNumbers[i]) {
            leftOver += cardNumbers[i];
            numOfLeft += 1;
          }
          if (numOfLeft === 3) break;
        }
        return Ranking.ONE_PAIR + number * 3 + leftOver;
      }
    }
    return 0;
  }
}

enum Ranking {
  FOLD = 0,
  HIGH_CARD = 1,
  ONE_PAIR = 15 ** 2,
  TWO_PAIR = 15 ** 3,
  TRIPLE = 15 ** 4,
  STRAIGHT = 15 ** 5,
  FLUSH = 15 ** 6,
  FULL_HOUSE = 15 ** 7,
  FOUR_CARDS = 15 ** 8,
  STRAIGHT_FLUSH = 15 ** 9,
}

export enum RankingString {
  FOLD = "FOLD",
  HIGH_CARD = "HIGH_CARD",
  ONE_PAIR = "ONE_PAIR",
  TWO_PAIR = "TWO_PAIR",
  TRIPLE = "TRIPLE",
  STRAIGHT = "STRAIGHT",
  FLUSH = "FLUSH",
  FULL_HOUSE = "FULL_HOUSE",
  FOUR_CARDS = "FOUR_CARDS",
  STRAIGHT_FLUSH = "STRAIGHT_FLUSH",
}

export function getRank(value: number): RankingString {
  const numbers = Object.values(Ranking).filter((v) => !isNaN(Number(v)));
  const strings = Object.values(RankingString).filter((v) => isNaN(Number(v)));
  for (let i = 0; i < 10; i++) {
    const rankValue = Number(numbers[i]);
    if (value < rankValue) {
      return strings[i - 1];
    }
  }
  return RankingString.STRAIGHT_FLUSH;
}
