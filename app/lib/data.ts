import { Pool } from "pg";
import { Money } from "./definitions";

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

export async function updateMoney(user_id: string, money: number) {
  try {
    console.log("Updateing money data");
    await pool.query(
      `
    UPDATE money SET money = $1 WHERE id = $2`,
      [money, user_id]
    );
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Failed to update money.");
  }
}
