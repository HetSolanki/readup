import { resetDB } from "src/lib/db/queries/reset";

export async function handlerResetDB(_: string) {
  await resetDB();
  console.log("Database resets successfully.");
}
