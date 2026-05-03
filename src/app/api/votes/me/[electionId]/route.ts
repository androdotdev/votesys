import { NextResponse } from "next/server";
import { db } from "@/db";
import { voteReceipts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ electionId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { electionId } = await params;

    const receipt = await db.query.voteReceipts.findFirst({
      where: and(
        eq(voteReceipts.userId, session.user.id),
        eq(voteReceipts.electionId, electionId)
      ),
    });

    return NextResponse.json({ hasVoted: !!receipt });
  } catch {
    return NextResponse.json(
      { error: "Failed to check vote status" },
      { status: 500 }
    );
  }
}
