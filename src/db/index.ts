import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";

// Initialize a local SQLite database file using @libsql/client
const dbPath = path.join(process.cwd(), "memo.db");
const client = createClient({ url: `file:${dbPath}` });

export const db = drizzle(client, { schema });
