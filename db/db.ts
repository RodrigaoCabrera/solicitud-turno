import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = import.meta.env.DATABASE_URL || "";
console.log("Database Connection String:", connectionString);

export const client = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  max: 1,
});
export const db = drizzle(client);
