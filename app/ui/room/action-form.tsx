"use client";

import Draggable from "react-draggable";
import { SyntheticEvent, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { validateUserAction } from "@/error/Validator";

interface ActionFormProps {
  actions: string[];
  currentBet: number;
  playerMoney: number;
  isPlayerTurn: boolean;
  roomId: string;
}

export default function Actions({
  actions,
  currentBet,
  playerMoney,
  isPlayerTurn,
  roomId,
}: ActionFormProps) {
  const [error, setError] = useState("");
  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isPlayerTurn) return;
    const action = (e.nativeEvent as any).submitter.id;
    const betSize = ((e.target as HTMLFormElement).elements as any).amount
      .value;
    const validated = validateUserAction(currentBet, playerMoney, {
      action: action.toUpperCase(),
      betSize: betSize,
    });
    if (validated.error !== null) {
      setError(validated.error!);
    } else {
      await fetch("/api/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: roomId,
          action: action,
          betSize: betSize,
        }),
      });
    }
  }
  return (
    <Draggable bounds="body">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="absolute bottom-0 left-0 p-4 bg-white border border-gray-300 rounded-md"
      >
        <label className="block mb-2">Bet Amount:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          className="block w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
        />
        {actions.map((action) => {
          return (
            <button
              key={action}
              type="submit"
              name={action}
              id={action}
              className="block w-full bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
            >
              {action}
            </button>
          );
        })}
        {error && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </>
        )}
      </form>
    </Draggable>
  );
}
