import { sql } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function resetDB() {
  await db.execute(sql`TRUNCATE TABLE ${users}`);
}

