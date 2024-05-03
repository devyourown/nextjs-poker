"use client";

import Draggable from "react-draggable";
import { Chat } from "../../lib/definitions";

const chattings = [
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
  { author: "ww", content: "HI buddy" },
  { author: "zz", content: "quiet" },
  { author: "wee", content: "oh.." },
] as Chat[];

export default function Chatting() {
  return (
    <Draggable bounds="body" handle=".chattingbar">
      <form
        className="chattingbar absolute bottom-0 left-0 p-4 rounded-md max-h-2"
        style={{
          maxWidth: "200px",
          maxHeight: "calc(100% - 250px)",
          overflowY: "auto",
        }}
      >
        {chattings.map((chat, index) => {
          return (
            <div key={index} className="mb-2">
              {chat.author}: {chat.content}
            </div>
          );
        })}
        <div className="flex">
          <input type="text" id="chat" name="chat" />
          <button type="submit" id="chat_btn" name="chat_btn" />
        </div>
      </form>
    </Draggable>
  );
}
