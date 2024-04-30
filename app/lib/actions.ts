"use server";

import bcrypt from "bcrypt";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { pool } from "./data";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  form: FormData
) {
  try {
    const user = await signIn("credentials", form);
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
  redirect("/board");
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
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      `INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)`,
      [name, email, hashedPassword]
    );
    const res = await pool.query("SELECT id FROM users WHERE name = $1", [
      name,
    ]);
    const { id } = res.rows[0];
    await pool.query(
      `INSERT INTO money (user_id, amount)
      VALUES ($1, $2)`,
      [id, 100000]
    );
  } catch (e) {
    return {
      message: "Database Error : Failed to create Account.",
    };
  }

  redirect("/login");
}
