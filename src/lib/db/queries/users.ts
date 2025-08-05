import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUserByName(username: string) {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.name, username));
  return result;
}

export async function getUserById(userId: string) {
  const [result] = await db.select().from(users).where(eq(users.id, userId));
  return result;
}

export async function getAllUsers() {
  const results = await db.select().from(users);
  return results;
}
