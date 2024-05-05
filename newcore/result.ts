import { Card, User } from "@/app/lib/definitions";
import { Card as PlayCard, Suit } from "@/core/deck/Card";
import { RankingCalculator } from "@/core/rank/RankCalculator";

function convertSuit(suit: string) {
    if (suit === "hearts") {
        return Suit.HEARTS;
    } else if (suit === "diamonds") {
        return Suit.DIAMONDS;
    } else if (suit === "clubs") {
        return Suit.CLUBS;
    }
    return Suit.SPADES;
}

function convertCard(cards: Card[]) {
    return cards.map((card) => {
        return PlayCard.of(card.number, convertSuit(card.suit));
    });
}

export function makeResult(users: User[], board: Card[]) {
    const playerRanks = new Map<string, number>();
    let maxRank = -1;
    users.forEach((user) => {
        board.push(...user.hands!);
        const rank = RankingCalculator.calculateCards(convertCard(board));
        console.log(user.name + "  :  " + rank);
        maxRank = Math.max(rank, maxRank);
        playerRanks.set(user.name, rank);
    });
    const winners: string[] = [];
    const losers: string[] = [];
    playerRanks.forEach((rank, player) => {
        if (rank < maxRank) {
            losers.push(player);
        } else {
            winners.push(player);
        }
    });
    return [winners, losers];
}
