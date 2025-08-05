import { resetDB } from "src/lib/db/queries/reset";

export async function handlerResetDB() {
  await resetDB();
  console.log("Database resets successfully.");
}
