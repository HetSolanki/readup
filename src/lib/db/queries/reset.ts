import { db } from "..";
import { users } from "../schema";

export async function resetDB() {
  await db.delete(users);
}
  