"use client";

import Draggable from "react-draggable";
import { Chat } from "../../lib/definitions";
import { FormEvent, useEffect, useState } from "react";
import { socket } from "@/app/lib/socket";

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

interface ChattingProps {
    roomId: string;
    user: string;
}

export default function Chatting({ roomId, user }: ChattingProps) {
    const [chats, setChats] = useState<Chat[]>([]);
    socket.on(`chat_${roomId}`, (content: string, name: string) => {
        const chatting: Chat = {
            author: name,
            content: content,
        };
        setChats([...chats, chatting]);
    });

    async function sendChat(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const content = (e.nativeEvent.target as any).chat.value;
        socket.emit("chat", roomId, content, user);
    }
    return (
        <Draggable bounds="body" handle=".chattingbar">
            <form
                onSubmit={(e) => sendChat(e)}
                className="chattingbar w-96 h-40 bg-orange-200 overflow-auto border-2 divide-y divide-slate-900 border-stone-500 leading-normal text-base text-justify	"
            >
                {chats.map((chat, index) => {
                    return (
                        <div key={index} className="mb-2 font-mono font-bold ">
                            {chat.author}: {chat.content}
                        </div>
                    );
                })}
                <input className="w-full" type="text" id="chat" name="chat" />
            </form>
        </Draggable>
    );
}
