import bcrypt from "bcrypt";
import credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import { z } from "zod";
import { Money, User } from "./app/lib/definitions";
import { pool } from "./app/lib/data";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await pool.query<User>(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user: ", error);
    throw new Error("Failed to fetch user.");
  }
}

async function getPlayer(email: string): Promise<User | undefined> {
  try {
    const user = await pool.query<User>(
      `SELECT id, name FROM users WHERE email=$1`,
      [email]
    );
    const money = await pool.query<Money>(
      `SELECT amount FROM money WHERE user_id=$1`,
      [user.rows[0].id]
    );
    return {
      money: money.rows[0].amount,
      ...user.rows[0],
    } as User;
  } catch (error) {
    console.error("Failed to fetch player.", error);
    throw new Error("Failed to fetch player.");
  }
}

export const { auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  providers: [
    credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordMatch = await bcrypt.compare(password, user.password!);
          if (passwordMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      if (!session.user.money)
        session.user = (await getPlayer(session.user.email)) as any;
      if (token.roomId) session.user.roomId = token.roomId as string;
      return session;
    },
    async jwt({ session, trigger, token }) {
      if (trigger === "update") token.roomId = session.user.roomId;
      return token;
    },
  },
});
