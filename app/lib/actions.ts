"use server";

import bcrypt from "bcrypt";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { optional, z } from "zod";
import { isExistEmail, isExistNickname, makeNewAccount, pool } from "./data";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { validateUserAction } from "@/error/Validator";
import { fetchRoom } from "./cache-data";
import { Action, Game, Room } from "./definitions";

export async function authenticate(
  prevState: string | undefined,
  form: FormData
) {
  try {
    await signIn("credentials", form, redirect("/board"));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const CreateAccount = z.object({
  name: z.string().min(3, { message: "Please Name Should be 3~12 letters" }),
  email: z.string().email({ message: "Please Input Correct Email" }),
  password: z
    .string()
    .min(9, { message: "Please password length should be greater than 8" }),
});

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function createAccount(prevState: State, form: FormData) {
  const validateFields = CreateAccount.safeParse({
    name: form.get("nickname"),
    email: form.get("email"),
    password: form.get("password"),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to create Account.",
    };
  }
  const { name, email, password } = validateFields.data;
  const isDupEmail = await isExistEmail(email);
  const isDupName = await isExistNickname(name);
  if (isDupEmail || isDupName) {
    return {
      errors: {
        name: isDupName ? ["The Nickname already taken"] : undefined,
        email: isDupEmail ? ["The Email already taken"] : undefined,
        password: undefined,
      },
      message: "Duplicated Error.",
    };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await makeNewAccount(email, name, hashedPassword);

  redirect("/login");
}

export async function updatePlayerAction(prevState: any, form: FormData) {
  const session = await auth();
  if (!session) return "You don't have a session.";
  const room: Room = await fetchRoom(session.user.roomId);
  const game: Game = room.game!;
  if (game === null) return "Game is not playing.";
  if (session.user.name !== game.players[0]) return "Not your turn";
  const playerLog = room.turnBetMoney.find(
    (log) => log.playerName === game.players[0]
  );
  const playerMoney = session.user.money;
  const action: Action = {
    name: form.get("action") as any,
    size: Number(form.get("amount")),
    playerMoney: playerMoney,
  };
  if (action.name === "CALL") action.size = game.currentBet;
  if (action.name === "CHECK" || action.name === "FOLD") action.size = 0;
  const validateFields = validateUserAction(
    Number(game.currentBet),
    action,
    playerLog?.money!
  );

  if (validateFields.error) {
    return validateFields.error;
  }
  await fetch("http://localhost:3000/api/action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId: session.user.roomId,
      action: action,
      name: session.user.name,
    }),
  });
}
