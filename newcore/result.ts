import { Card, Player } from "@/app/lib/definitions";
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

export function makeResult(players: Player[], board: Card[]) {
    const playerRanks = new Map<string, number>();
    let maxRank = -1;
    players.forEach((player) => {
        board.push(...player.hands);
        const rank = RankingCalculator.calculateCards(convertCard(board));
        maxRank = Math.max(rank, maxRank);
        playerRanks.set(player.name, rank);
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
