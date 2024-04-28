import { RandomDeck } from "@/core/deck/Deck";

describe("poker deck test", () => {
  it("should be specific number of cards", () => {
    const deck = new RandomDeck(4);
    for (let i = 0; i < 13; i++) {
      deck.draw();
    }
    expect(() => deck.draw()).toThrow("Empty Deck Error");
  });

  it("should be different cards of each", () => {
    const deck = new RandomDeck(6);
    const cards = new Set();
    for (let i = 0; i < 17; i++) {
      cards.add(deck.draw().toString());
    }
    expect(cards.size).toBe(17);
  });

  it("should be less people than 10", () => {
    expect(() => new RandomDeck(10)).toThrow("Too Many Player Error");
    expect(() => new RandomDeck(14)).toThrow("Too Many Player Error");
  });
});
