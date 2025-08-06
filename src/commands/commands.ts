import { User } from "src/lib/db/schema";

export type commandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void> | void;

export type commandRegistry = Record<string, commandHandler>;

export function registerCommand(
  registry: commandRegistry,
  cmdName: string,
  handler: commandHandler
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: commandRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknow command: ${cmdName}`);
  }

  await handler(cmdName, ...args);
}
