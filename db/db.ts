import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = import.meta.env.DATABASE_URL || "";

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString);
export const db = drizzle(client);
