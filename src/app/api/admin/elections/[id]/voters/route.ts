import { NextResponse } from "next/server";
import { db } from "@/db";
import { voteReceipts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const { id } = await params;

    const voters = await db
      .select({
        userId: voteReceipts.userId,
        votedAt: voteReceipts.createdAt,
      })
      .from(voteReceipts)
      .where(eq(voteReceipts.electionId, id))
      .orderBy(voteReceipts.createdAt);

    return NextResponse.json({ voters, totalVoters: voters.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch voters" },
      { status: 500 }
    );
  }
}
