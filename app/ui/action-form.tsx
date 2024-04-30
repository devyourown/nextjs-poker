"use client";

import Draggable from "react-draggable";

interface ActionFormProps {
  actions: string[];
}

export default function Action(props: ActionFormProps) {
  const { actions } = props;
  return (
    <Draggable bounds="body">
      <form className="absolute bottom-0 left-0 p-4 bg-white border border-gray-300 rounded-md">
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
      </form>
    </Draggable>
  );
}
