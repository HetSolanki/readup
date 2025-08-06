import { readConfig } from "src/config";
import {
  createFeed,
  createFeedFollow,
  getAllFeeds,
  getFeedByURL,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feed";
import { getUserById, getUserByName } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 2) throw new Error(`Usage: ${cmdName} <feedName> <url>`);

  const name = args[0];
  const url = args[1];
  const userId = user.id;

  console.log(userId);
  const feed = await createFeed(name, url, userId);
  if (!feed) throw new Error("Failed to create feed.");

  const feedFollow = await createFeedFollow(userId, feed.id);

  printFeedFollow(user.name, feedFollow.feedName);
  console.log("Feed created successfully.");
  printFeed(feed, user);
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

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) throw new Error(`Usage: ${cmdName} <url>`);

  const url = args[0];
  const feed = await getFeedByURL(url);

  if (!feed) throw new Error(`Feed not found: ${url}`);

  const newFeed = await createFeedFollow(user.id, feed.id);
  console.log("Feed follow created!");
  console.log(newFeed);
}

export async function handlerFollowing(_: string, user: User) {
  const followingFeeds = await getFeedFollowsForUser(user.id);

  if (followingFeeds.length === 0) {
    console.log("No feed follow found for this user.");
    return;
  }

  console.log("Feed follows for the user %s", user.id);
  for (const feeds of followingFeeds) {
    console.log(`* ${feeds.feedname}`);
  }
}

export function printFeedFollow(username: string, feedname: string) {
  console.log(`* User:          ${username}`);
  console.log(`* Feed:          ${feedname}`);
}
