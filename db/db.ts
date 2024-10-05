import dotenv from "dotenv";
dotenv.config();
import { getEnv } from "../src/utils/getEnv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = getEnv("DATABASE_URL") || "";

export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);
