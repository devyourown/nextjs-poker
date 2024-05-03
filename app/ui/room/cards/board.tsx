import { fetchBoardCard, fetchUserCard } from "@/app/lib/cache-data";
import { auth } from "@/auth";
import Cards from "./cards";
import { Card } from "@/core/deck/Card";
import { Card as IOCard } from "@/app/lib/definitions";

function makeIOCard(cards: Card[]) {
  return cards.map((card) => {
    return {
      suit: card.getSuit().toString().toLowerCase(),
      number: card.getValue(),
    } as IOCard;
  });
}

export default async function Board() {
  const session = await auth();
  const boardCard = await fetchBoardCard(session?.user.roomId!);
  const userCard = await fetchUserCard(session?.user.id!);

  return (
    <>
      <div className="flex flex-row w-screen justify-center content-center">
        {boardCard && <Cards cards={makeIOCard(boardCard)} />}
      </div>
      {userCard && (
        <div>
          <span>Your Hands : </span>
          <Cards cards={makeIOCard(userCard)} />
        </div>
      )}
    </>
  );
}
