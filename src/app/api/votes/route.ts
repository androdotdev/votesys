import { NextResponse } from "next/server";
import { db } from "@/db";
import { elections, voteReceipts, votes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { checkAndCloseElections } from "@/lib/elections";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in to cast your vote" }, { status: 401 });
    }

    await checkAndCloseElections();

    const body = await request.json();
    const { electionId, candidateId } = body;

    if (!electionId || !candidateId) {
      return NextResponse.json(
        { error: "electionId and candidateId are required" },
        { status: 400 }
      );
    }

    const election = await db.query.elections.findFirst({
      where: eq(elections.id, electionId),
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    if (election.status !== "open") {
      return NextResponse.json(
        { error: "Voting is no longer available for this election" },
        { status: 403 }
      );
    }

    const existingReceipt = await db.query.voteReceipts.findFirst({
      where: and(
        eq(voteReceipts.userId, session.user.id),
        eq(voteReceipts.electionId, electionId)
      ),
    });

    if (existingReceipt) {
      return NextResponse.json(
        { error: "You have already voted in this election" },
        { status: 409 }
      );
    }

    await db.transaction(async (tx) => {
      await tx.insert(voteReceipts).values({
        userId: session.user.id,
        electionId,
      });
      await tx.insert(votes).values({
        electionId,
        candidateId,
      });
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to cast vote" },
      { status: 500 }
    );
  }
}
