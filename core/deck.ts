import { Card } from "@/app/lib/definitions";

export function makeDeck(numOfPlayers: number) {
    const neededNumOfCards: number = numOfPlayers * 2 + 5;
    const cards: Set<string> = new Set();

    while (cards.size !== neededNumOfCards)
        cards.add(JSON.stringify(makeRandomCard()));
    const arrCards: Card[] = [];
    cards.forEach((value) => {
        arrCards.push(JSON.parse(value));
    });
    return arrCards;
}

function makeSuitString(suit: number) {
    if (suit === 0) return "hearts";
    else if (suit === 1) return "diamonds";
    else if (suit === 2) return "clubs";
    return "spades";
}

function makeRandomCard(): Card {
    const number: number = Math.floor(Math.random() * 13) + 1;
    const suit = Math.floor(Math.random() * 4);
    return { number: number !== 1 ? number : 14, suit: makeSuitString(suit) };
}
