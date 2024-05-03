"use client";

import { CSSProperties, useState } from "react";
import { Card } from "../../../lib/definitions";
import style from "./card.module.css";
import Image from "next/image";
import { Suit } from "@/core/deck/Card";

interface CardProps {
  card: Card;
}

const cardStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
};

const backCardStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  transform: "rotateY(180deg)",
};

function matchSuit(suit: number) {
  if (suit === Suit.CLUBS) return "clubs";
  if (suit === Suit.DIAMONDS) return "diamonds";
  if (suit === Suit.HEARTS) return "hearts";
  if (suit === Suit.SPADES) return "spades";
}

function cardToName(card: Card): string {
  const number = card.number;
  const suit = matchSuit(Number(card.suit));
  if (number <= 10) return `${number}_of_${suit}.png`;
  if (number == 11) return `jack_of_${suit}.png`;
  if (number == 12) return `queen_of_${suit}.png`;
  if (number == 13) return `king_of_${suit}.png`;
  return `ace_of_${suit}.png`;
}

export default function PlayingCard(props: CardProps) {
  const { card } = props;
  const imageSrc = cardToName(card);
  const [isFlipped, setFliped] = useState(false);
  return (
    <div
      className={`${style.flip} ${isFlipped ? style.flipped : ""}`}
      onClick={() => setFliped(!isFlipped)}
    >
      <div className={style.card}>
        <div className={style.front}>
          <Image
            priority={true}
            src={"/card/" + imageSrc}
            alt="card"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className={style.back}>
          <Image
            priority={true}
            style={{ objectFit: "contain" }}
            src="/card/back.png"
            alt="back"
            fill
          />
        </div>
      </div>
    </div>
  );
}
