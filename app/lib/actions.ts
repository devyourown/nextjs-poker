"use server";

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
    await signIn("credentials", form);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
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
    name: form.get("name"),
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

  try {
    await pool.query(
      `INSERT INTO user (name, email, password)
      VALUES ($1, $2, $3)`,
      [name, email, password]
    );
  } catch (e) {
    return {
      message: "Database Error : Failed to create Account.",
    };
  }

  redirect("/login");
}
