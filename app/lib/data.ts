import { Pool } from "pg";

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
    UPDATE users SET amount = $1 WHERE name = $2`,
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
