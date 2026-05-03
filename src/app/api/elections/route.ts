import { NextResponse } from "next/server";
import { db } from "@/db";
import { elections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkAndCloseElections } from "@/lib/elections";

export async function GET() {
  try {
    await checkAndCloseElections();

    const openElections = await db
      .select()
      .from(elections)
      .where(eq(elections.status, "open"))
      .orderBy(elections.createdAt);

    return NextResponse.json(openElections);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch elections" },
      { status: 500 }
    );
  }
}
