"use client";

import Draggable from "react-draggable";
import { SyntheticEvent, useEffect, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { validateUserAction } from "@/error/Validator";
import { socket } from "../lib/socket";

interface ActionFormProps {
  actions: string[];
  currentBet: number;
  playerMoney: number;
  isPlayerTurn: boolean;
  roomId: string;
}

function convertToUserAction(action: any) {
  if (action.action === "FOLD") return `FOLD:0`;
  else if (action.action === "CHECK") return `CHECK:0`;
  else if (action.action === "CALL") return `CALL:0`;
  return `BET:${action.amount}`;
}

export function createUserAction(
  currentBet: number,
  playerMoney: number,
  action: any
) {
  const validated = validateUserAction(currentBet, playerMoney, action);
  if (validated.error === null) return convertToUserAction(validated.success);
  return validated;
}

export default function Actions({
  actions,
  currentBet,
  playerMoney,
  isPlayerTurn,
  roomId,
}: ActionFormProps) {
  const [error, setError] = useState("");
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPlayerTurn) return;
    const action = (e.nativeEvent as any).submitter.value;
    const betSize = ((e.target as HTMLFormElement).elements as any).amount
      .value;
    const validated = validateUserAction(currentBet, playerMoney, {
      action: action,
      betSize: betSize,
    });
    if (validated.error !== null) {
      setError(validated.error!);
    } else {
      socket.emit(roomId, convertToUserAction(validated.success));
    }
  };
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
