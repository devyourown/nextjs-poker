"use client";

import Draggable from "react-draggable";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-dom";
import { updatePlayerAction } from "@/app/lib/actions";

export default function Actions() {
    const [state, dispatch] = useFormState(updatePlayerAction, "");
    const actions = ["CALL", "CHECK", "FOLD", "BET"];

    return (
        <Draggable bounds="body">
            <form
                action={dispatch}
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
                            name="action"
                            id={action}
                            value={action}
                            className="block w-full bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
                        >
                            {action}
                        </button>
                    );
                })}
                {state && (
                    <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{state}</p>
                    </>
                )}
            </form>
        </Draggable>
    );
}
