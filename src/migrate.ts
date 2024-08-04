import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../db/db";

await migrate(db, { migrationsFolder: "./drizzle" });
