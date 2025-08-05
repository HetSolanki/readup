import { readConfig } from "src/config";
import {
  createFeed,
  createFeedFollow,
  getAllFeeds,
  getFeedByURL,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed";
import { getUserById, getUserByName } from "src/lib/db/queries/users";
import { Feed, feeds, User, users } from "src/lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) throw new Error(`Usage: ${cmdName} <feedName> <url>`);

  const currentUserName = readConfig().currentUserName;
  const currentUser = await getUserByName(currentUserName);

  if (!currentUser) {
    throw new Error(`User ${currentUserName} not found.`);
  }

  const name = args[0];
  const url = args[1];
  const userId = currentUser.id;

  console.log(userId);
  const feed = await createFeed(name, url, userId);
  if (!feed) throw new Error("Failed to create feed.");

  console.log("Feed created successfully.");
  await createFeedFollow(userId, feed.id);
  printFeed(feed, currentUser);
}

export async function handlerFeeds(_: string) {
  const feeds = await getAllFeeds();

  if (!feeds) throw new Error("No feeds found.");

  console.log(`Found %d feeds.\n`, feeds.length);
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.id}`);
    }
    printFeed(feed, user);
  }
}

export async function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
  console.log();
}

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) throw new Error(`Usage: ${cmdName} <url>`);

  const url = args[0];
  const feed = await getFeedByURL(url);
  const config = readConfig();
  const user = await getUserByName(config.currentUserName);

  const newFeed = await createFeedFollow(user.id, feed.id);
  console.log(newFeed);
}

export async function handlerFollowing() {
  const config = readConfig();
  const user = await getUserByName(config.currentUserName);
  const followingFeeds = await getFeedFollowsForUser(user.id);

  for (const feeds of followingFeeds) {
    console.log(`name: ${feeds.feedName}`);
  }
}
