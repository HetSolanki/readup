import { RSSItem } from "src/lib/rss";
import { db } from "..";
import { feedFollows, feeds, Post, posts } from "../schema";
import { getFeedFollowsForUser } from "./feed";
import { desc, eq } from "drizzle-orm";

export async function createPost(post: RSSItem, feedId: string) {
  const [result] = await db
    .insert(posts)
    .values({
      title: post.title,
      url: post.link,
      description: post.description,
      publishedAt: post.pubDate,
      feedId,
    })
    .returning();

  return result;
}

export async function getPostsForUser(userId: string, limit: number) {
  const result = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result;
}
