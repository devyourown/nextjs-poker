"use client";

import { CSSProperties, useState } from "react";
import { Card } from "../../lib/definitions";
import style from "./card.module.css";
import Image from "next/image";

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

function cardToName(card: Card): string {
  let number = card.number;
  let suit = card.suit;
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
            objectFit="contain"
            layout="fill"
            src={"/card/" + imageSrc}
            alt="card"
          />
        </div>
        <div className={style.back}>
          <Image
            priority={true}
            objectFit="contain"
            layout="fill"
            src="/card/back.png"
            alt="back"
          />
        </div>
      </div>
    </div>
  );
}
