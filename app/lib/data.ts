import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

export async function isExistNickname(nickname: string) {
  try {
    const data = await pool.query(
      "SELECT COUNT(*) FROM users WHERE name = $1",
      [nickname]
    );
    return data.rowCount === 1;
  } catch (error) {
    console.log("Database Error: ", error);
  }
}

export async function isExistEmail(email: string) {
  try {
    const data = await pool.query(
      "SELECT COUNT(*) FROM users WHERE email = $1",
      [email]
    );
    return data.rowCount === 1;
  } catch (error) {
    console.log("Database Error: ", error);
  }
}

export async function makeNewAccount(
  email: string,
  name: string,
  hashedPassword: string
) {
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
    console.log("Database Error: ", e);
  }
}

export async function updateMoney(user_id: string, money: number) {
  try {
    console.log("Updateing money data");
    await pool.query(
      `
    UPDATE money SET amount = $1 WHERE user_id = $2`,
      [money, user_id]
    );
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Failed to update money.");
  }
}

export async function updateImageUrl(user_id: string, url: string) {
  try {
    console.log("Updateing user image src");
    await pool.query(
      `
    UPDATE users SET img_src = $1 WHERE name = $2`,
      [url, user_id]
    );
  } catch (error) {
    console.log("Database Error: ", error);
    throw new Error("Failed to update user image src.");
  }
}
