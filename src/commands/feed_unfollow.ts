import { getFeedByURL } from "src/lib/db/queries/feed";
import { feedUnfollow } from "src/lib/db/queries/feed_unfollow";
import { User } from "src/lib/db/schema";

export async function handlerFeedUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <feedUrl>`);
  }

  const feedUrl = args[0];
  const feed = await getFeedByURL(feedUrl);

  if (!feed) {
    throw new Error(`Not feed found: ${feedUrl}`);
  }

  const result = await feedUnfollow(user.id, feed.id);
  if (!result) {  
    throw new Error(`Failed to unfollow feed: ${feedUrl}`);
  }
  console.log(`${feed.name} unfollowed successfully!`);
}
