"use client";

import { useState } from "react";
import { Card } from "../../../lib/definitions";
import style from "./card.module.css";
import Image from "next/image";

interface CardProps {
    card: Card;
}

function cardToName(card: Card): string {
    const { suit, number } = card;
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
