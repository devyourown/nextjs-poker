"use client";

import { useCallback, useRef } from "react";
import Avatar from "./avatar";

interface ImageUploadProps {
    imageSrc: string;
}

export default function ImageUpload({ imageSrc }: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const sendImage = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            console.log("hey");
            if (!e.target.files) {
                return;
            }

            const form = new FormData();
            form.append("image", e.target.files[0]);

            await fetch("/api/image", {
                method: "POST",
                body: form,
            });
        },
        []
    );
    const handleClickImage = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }, []);
    return (
        <div
            className="relative bg-gray-300 w-24 h-24 rounded-full overflow-hidden"
            onClick={handleClickImage}
        >
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={sendImage}
            />
            <Avatar imgSrc={imageSrc} />
        </div>
    );
}
