import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows } from "../schema";

export async function feedUnfollow(userId: string, feedId: string) {
  const [result] = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
    .returning();

  return result;
}
