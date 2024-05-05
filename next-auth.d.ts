import { DefaultSession } from "next-auth";
import { Card } from "./app/lib/definitions";

declare module "next-auth" {
    interface Session {
        user: {
            roomId: string;
            money: number;
        } & DefaultSession["user"];
    }
}
