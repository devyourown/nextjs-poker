import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      roomId: string;
      money: number;
    } & DefaultSession["user"];
  }
}
