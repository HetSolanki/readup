import {
  createUser,
  getAllUsers,
  getUserByName,
} from "src/lib/db/queries/users";
import { readConfig, setUser } from "../config";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <username>`);
  }

  const username = args[0];

  const isExits = await getUserByName(username);
  if (!isExits)
    throw new Error("User not exits. try 'register' to create new user");

  setUser(username);
  console.log(`Logged in successfully.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) throw new Error(`usage: ${cmdName} <username>`);

  const username = args[0];

  const isExits = await getUserByName(username);
  if (isExits) throw new Error("user already exits.");

  const result = await createUser(username);
  setUser(result.name);
  console.log("user create successfully");
}

export async function handlerUser() {
  const users = await getAllUsers();

  const currentUser = readConfig().currentUserName;

  users.map((user) => {
    if (user.name === currentUser) console.log(`* ${user.name} (current)`);
    else console.log(`* ${user.name}`);
  });
}
