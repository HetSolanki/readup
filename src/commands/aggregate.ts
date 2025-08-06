import {
  getFeedByURL,
  getNextFeedToFetch,
  markFeedFetched,
} from "src/lib/db/queries/feed";
import { createPost } from "src/lib/db/queries/posts";
import { fetchFeed } from "src/lib/rss";

export async function hanlderAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <time_between_reqs>`);
  }

  const timeArg = args[0];
  const timeBetweenRequests = parseDuration(timeArg);

  if (!timeBetweenRequests) {
    throw new Error(
      `invalid duration: ${timeArg} — use format 1h 30m 15s or 3500ms`
    );
  }

  console.log(`Collecting feed after every ${timeArg}...`);

  scrapeFeeds().catch(handleError);
  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) return;

  const time = match[1];
  const unit = match[2];

  switch (unit) {
    case "ms":
      return Number(time);
    case "s":
      return Number(time) * 1000;
    case "m":
      return Number(time) * 60 * 1000;
    case "h":
      return Number(time) * 60 * 60 * 1000;
    default:
      return;
  }
}

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();

  if (!nextFeed) {
    console.log("No Feed to fetch.");
    return;
  }
  console.log("Found a feed to fetch!");

  await markFeedFetched(nextFeed.id);
  const feed = await fetchFeed(nextFeed.url);

  console.log(
    `Feed ${nextFeed.name} collected, ${feed.channel.item.length} posts found`
  );

  const posts = feed.channel.item;
  for (const post of posts) {
    await createPost(post, nextFeed.id);
  }
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`
  );
}
