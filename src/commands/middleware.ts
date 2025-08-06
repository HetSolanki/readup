import { User } from "src/lib/db/schema";
import { commandHandler, UserCommandHandler } from "./commands";
import { readConfig } from "src/config";
import { getUserByName } from "src/lib/db/queries/users";

type middlewareLoggedIn = (handler: UserCommandHandler) => commandHandler;

export function middlewareLoggedIn(
  handler: UserCommandHandler
): commandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const config = readConfig();
    const username = config.currentUserName;

    if (!username) {
      throw new Error("User not logged in.");
    }

    const user = await getUserByName(username);
    if (!user) {
      throw new Error(`User ${username} not found.`);
    }

    await handler(cmdName, user, ...args);
  };
}
