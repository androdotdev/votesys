import { db } from "@/db";
import { elections } from "@/db/schema";
import { eq, lt, and } from "drizzle-orm";

export async function checkAndCloseElections() {
  const now = new Date();

  await db
    .update(elections)
    .set({ status: "closed" })
    .where(
      and(
        eq(elections.status, "open"),
        lt(elections.endsAt, now)
      )
    );
}
