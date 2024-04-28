import bcrypt from "bcrypt";
import credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import { z } from "zod";
import { User } from "./app/lib/definitions";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = undefined;
    //await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return undefined;
  } catch (error) {
    console.error("Failed to fetch user: ", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
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
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
