import { Card, Suit } from "@/core/deck/Card";
import {
  RankingCalculator,
  RankingString,
  getRank,
} from "@/core/rank/RankCalculator";

describe("poker rank test", () => {
  let cards: Card[];
  let lower: Card[];
  let higher: Card[];
  let rankingCalculator: RankingCalculator;

  beforeEach(() => {
    cards = [];
    lower = [];
    higher = [];
    rankingCalculator = new RankingCalculator();
  });

  it("can calculate one pair", () => {
    cards.push(
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );
    const rank = getRank(rankingCalculator.calculateCards(cards));
    expect(rank).toBe(RankingString.ONE_PAIR);
  });

  it("can compare with same one pair", () => {
    lower.push(
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );
    higher.push(
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(10, Suit.HEARTS)
    );
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );

    lower = [];
    higher = [];
    higher.push(
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );
    lower.push(
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(2, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );
  });

  it("can calculate two pair", () => {
    cards.push(
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(2, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );
    const rank = getRank(rankingCalculator.calculateCards(cards));
    expect(rank).toBe(RankingString.TWO_PAIR);
  });

  it("can compare with same two pair", () => {
    const lower: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(2, Suit.DIAMONDS),
      Card.of(1, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(11, Suit.DIAMONDS),
    ];

    const higher: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(2, Suit.DIAMONDS),
      Card.of(1, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(13, Suit.DIAMONDS),
    ];

    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );

    lower.length = 0;
    higher.length = 0;

    lower.push(
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(2, Suit.DIAMONDS),
      Card.of(1, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    higher.push(
      Card.of(1, Suit.HEARTS),
      Card.of(10, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );

    lower.length = 0;
    higher.length = 0;

    lower.push(
      Card.of(12, Suit.HEARTS),
      Card.of(10, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(10, Suit.CLUBS),
      Card.of(12, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    higher.push(
      Card.of(13, Suit.HEARTS),
      Card.of(10, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(10, Suit.CLUBS),
      Card.of(13, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );
  });

  it("can calculate triple", () => {
    const cards: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(11, Suit.DIAMONDS),
    ];

    const rank = getRank(rankingCalculator.calculateCards(cards));
    expect(rank).toBe(RankingString.TRIPLE);
  });

  it("can compare with same triples", () => {
    const lower: Card[] = [
      Card.of(2, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(2, Suit.DIAMONDS),
      Card.of(1, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(11, Suit.DIAMONDS),
    ];

    const higher: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(2, Suit.DIAMONDS),
      Card.of(1, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(13, Suit.DIAMONDS),
    ];

    let lowerRank = getRank(rankingCalculator.calculateCards(lower));
    let higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.TRIPLE);
    expect(higherRank).toBe(RankingString.TRIPLE);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );

    lower.length = 0;
    higher.length = 0;

    lower.push(
      Card.of(2, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.DIAMONDS),
      Card.of(2, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    higher.push(
      Card.of(2, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(2, Suit.DIAMONDS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    lowerRank = getRank(rankingCalculator.calculateCards(lower));
    higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.TRIPLE);
    expect(higherRank).toBe(RankingString.TRIPLE);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );

    lower.length = 0;
    higher.length = 0;

    lower.push(
      Card.of(2, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(12, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(2, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    higher.push(
      Card.of(2, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(13, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(2, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    lowerRank = getRank(rankingCalculator.calculateCards(lower));
    higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.TRIPLE);
    expect(higherRank).toBe(RankingString.TRIPLE);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );
  });

  it("can calculate straight", () => {
    let cards: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(5, Suit.CLUBS),
      Card.of(3, Suit.DIAMONDS),
      Card.of(3, Suit.HEARTS),
    ];

    let rank = getRank(rankingCalculator.calculateCards(cards));
    expect(rank).toBe(RankingString.STRAIGHT);

    cards = [];

    cards = [
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(5, Suit.CLUBS),
      Card.of(10, Suit.HEARTS),
      Card.of(11, Suit.HEARTS),
    ];

    rank = getRank(rankingCalculator.calculateCards(cards));
    expect(rank).toBe(RankingString.STRAIGHT);
  });

  it("can compare with same straight", () => {
    const lower: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.DIAMONDS),
      Card.of(5, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(11, Suit.DIAMONDS),
    ];

    const higher: Card[] = [
      Card.of(2, Suit.HEARTS),
      Card.of(3, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.DIAMONDS),
      Card.of(5, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(6, Suit.DIAMONDS),
    ];

    let lowerRank = getRank(rankingCalculator.calculateCards(lower));
    let higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.STRAIGHT);
    expect(higherRank).toBe(RankingString.STRAIGHT);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );

    lower.length = 0;
    higher.length = 0;

    lower.push(
      Card.of(13, Suit.HEARTS),
      Card.of(11, Suit.CLUBS),
      Card.of(10, Suit.CLUBS),
      Card.of(4, Suit.DIAMONDS),
      Card.of(12, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    higher.push(
      Card.of(1, Suit.HEARTS),
      Card.of(12, Suit.CLUBS),
      Card.of(11, Suit.CLUBS),
      Card.of(10, Suit.CLUBS),
      Card.of(13, Suit.DIAMONDS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    lowerRank = getRank(rankingCalculator.calculateCards(lower));
    higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.STRAIGHT);
    expect(higherRank).toBe(RankingString.STRAIGHT);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );
  });

  it("can calculate flush", () => {
    const cards: Card[] = [
      Card.of(1, Suit.CLUBS),
      Card.of(2, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(6, Suit.CLUBS),
      Card.of(9, Suit.HEARTS),
      Card.of(4, Suit.SPADES),
    ];

    const rank = getRank(rankingCalculator.calculateCards(cards));
    expect(rank).toBe(RankingString.FLUSH);
  });

  it("can compare with same flush", () => {
    const lower: Card[] = [
      Card.of(13, Suit.HEARTS),
      Card.of(11, Suit.CLUBS),
      Card.of(10, Suit.HEARTS),
      Card.of(4, Suit.HEARTS),
      Card.of(12, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS),
    ];

    const higher: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(12, Suit.HEARTS),
      Card.of(11, Suit.HEARTS),
      Card.of(10, Suit.HEARTS),
      Card.of(13, Suit.DIAMONDS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS),
    ];

    let lowerRank = getRank(rankingCalculator.calculateCards(lower));
    let higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.FLUSH);
    expect(higherRank).toBe(RankingString.FLUSH);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );
  });

  it("can calculate full house", () => {
    const cards: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(10, Suit.HEARTS),
      Card.of(9, Suit.HEARTS),
    ];

    const rank = getRank(rankingCalculator.calculateCards(cards));
    expect(rank).toBe(RankingString.FULL_HOUSE);
  });

  it("can compare with same full house", () => {
    const lower: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(3, Suit.DIAMONDS),
      Card.of(5, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(3, Suit.DIAMONDS),
    ];

    const higher: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(1, Suit.DIAMONDS),
      Card.of(3, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(6, Suit.DIAMONDS),
    ];

    let lowerRank = getRank(rankingCalculator.calculateCards(lower));
    let higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.FULL_HOUSE);
    expect(higherRank).toBe(RankingString.FULL_HOUSE);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );

    lower.length = 0;
    higher.length = 0;

    lower.push(
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(12, Suit.CLUBS),
      Card.of(12, Suit.DIAMONDS),
      Card.of(1, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    higher.push(
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(13, Suit.CLUBS),
      Card.of(13, Suit.CLUBS),
      Card.of(1, Suit.DIAMONDS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    lowerRank = getRank(rankingCalculator.calculateCards(lower));
    higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.FULL_HOUSE);
    expect(higherRank).toBe(RankingString.FULL_HOUSE);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );

    lower.length = 0;
    higher.length = 0;

    lower.push(
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(12, Suit.CLUBS),
      Card.of(12, Suit.DIAMONDS),
      Card.of(12, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    higher.push(
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(13, Suit.CLUBS),
      Card.of(13, Suit.CLUBS),
      Card.of(13, Suit.DIAMONDS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    lowerRank = getRank(rankingCalculator.calculateCards(lower));
    higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.FULL_HOUSE);
    expect(higherRank).toBe(RankingString.FULL_HOUSE);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );
  });

  it("can calculate four cards", () => {
    const cards: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
    ];

    const rank = getRank(rankingCalculator.calculateCards(cards));
    expect(rank).toBe(RankingString.FOUR_CARDS);
  });

  it("can compare with same four cards", () => {
    const lower: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(3, Suit.CLUBS),
      Card.of(3, Suit.DIAMONDS),
      Card.of(5, Suit.CLUBS),
      Card.of(3, Suit.DIAMONDS),
      Card.of(3, Suit.DIAMONDS),
    ];

    const higher: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(1, Suit.DIAMONDS),
      Card.of(3, Suit.CLUBS),
      Card.of(10, Suit.DIAMONDS),
      Card.of(6, Suit.DIAMONDS),
    ];

    let lowerRank = getRank(rankingCalculator.calculateCards(lower));
    let higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.FOUR_CARDS);
    expect(higherRank).toBe(RankingString.FOUR_CARDS);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );

    lower.length = 0;
    higher.length = 0;

    lower.push(
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(12, Suit.CLUBS),
      Card.of(1, Suit.DIAMONDS),
      Card.of(1, Suit.CLUBS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    higher.push(
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(13, Suit.CLUBS),
      Card.of(1, Suit.CLUBS),
      Card.of(1, Suit.DIAMONDS),
      Card.of(7, Suit.HEARTS),
      Card.of(9, Suit.HEARTS)
    );

    lowerRank = getRank(rankingCalculator.calculateCards(lower));
    higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.FOUR_CARDS);
    expect(higherRank).toBe(RankingString.FOUR_CARDS);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );
  });

  it("can calculate Straight Flush", () => {
    const cards: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(2, Suit.DIAMONDS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.CLUBS),
      Card.of(5, Suit.CLUBS),
      Card.of(6, Suit.CLUBS),
      Card.of(7, Suit.CLUBS),
    ];

    const rank = getRank(rankingCalculator.calculateCards(cards));
    expect(rank).toBe(RankingString.STRAIGHT_FLUSH);
  });

  it("can compare with same Straight Flush", () => {
    const lower: Card[] = [
      Card.of(1, Suit.HEARTS),
      Card.of(1, Suit.CLUBS),
      Card.of(2, Suit.HEARTS),
      Card.of(3, Suit.HEARTS),
      Card.of(5, Suit.CLUBS),
      Card.of(4, Suit.HEARTS),
      Card.of(5, Suit.HEARTS),
    ];

    const higher: Card[] = [
      Card.of(2, Suit.HEARTS),
      Card.of(10, Suit.CLUBS),
      Card.of(3, Suit.HEARTS),
      Card.of(5, Suit.HEARTS),
      Card.of(3, Suit.CLUBS),
      Card.of(4, Suit.HEARTS),
      Card.of(6, Suit.HEARTS),
    ];

    let lowerRank = getRank(rankingCalculator.calculateCards(lower));
    let higherRank = getRank(rankingCalculator.calculateCards(higher));
    expect(lowerRank).toBe(RankingString.STRAIGHT_FLUSH);
    expect(higherRank).toBe(RankingString.STRAIGHT_FLUSH);
    expect(rankingCalculator.calculateCards(lower)).toBeLessThan(
      rankingCalculator.calculateCards(higher)
    );
  });
});
