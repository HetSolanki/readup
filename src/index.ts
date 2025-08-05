import {
  commandRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { hanlderAgg } from "./commands/aggregate";
import { handlerResetDB } from "./commands/reset";
import { handlerLogin, handlerRegister, handlerUser } from "./commands/users";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandRegistry: commandRegistry = {};

  registerCommand(commandRegistry, "login", handlerLogin);
  registerCommand(commandRegistry, "register", handlerRegister);
  registerCommand(commandRegistry, "reset", handlerResetDB);
  registerCommand(commandRegistry, "users", handlerUser);
  registerCommand(commandRegistry, "agg", hanlderAgg);

  try {
    await runCommand(commandRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.log(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
