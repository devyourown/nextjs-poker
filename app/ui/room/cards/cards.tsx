import { Card } from "@/app/lib/definitions";
import PlayingCard from "./card";

interface CardsProps {
  cards: Card[];
}

export default function Cards(props: CardsProps) {
  const { cards } = props;
  return (
    <div className="flex flex-row">
      {cards.map((card) => {
        return (
          <div key={card.number + card.suit}>
            <PlayingCard card={card} />
          </div>
        );
      })}
    </div>
  );
}
