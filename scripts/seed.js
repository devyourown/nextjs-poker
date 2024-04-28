const { Client } = require("pg");
const { users, moneys } = require("../app/lib/placeholder-data.js");
const bcrypt = require("bcrypt");

async function seedUsers(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "users" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.query(
          `
        INSERT INTO users (id, name, email, password)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `,
          [user.id, user.name, user.email, hashedPassword]
        );
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedMoneys(client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // Create the "customers" table if it doesn't exist
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS money (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        amount bigint NOT NULL
      );
    `);

    console.log(`Created "money" table`);

    // Insert data into the "customers" table
    const insertedMoneys = await Promise.all(
      moneys.map((money) =>
        client.query(
          `
        INSERT INTO money (user_id, amount)
        VALUES ($1, $2)
        ON CONFLICT (id) DO NOTHING;
      `,
          [money.user_id, money.amount]
        )
      )
    );

    console.log(`Seeded ${insertedMoneys.length} moneys`);

    return {
      createTable,
      customers: insertedMoneys,
    };
  } catch (error) {
    console.error("Error seeding moneys:", error);
    throw error;
  }
}

async function main() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });
  await client.connect();

  await seedUsers(client);
  await seedMoneys(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
