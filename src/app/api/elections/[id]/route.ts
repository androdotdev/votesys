import { NextResponse } from "next/server";
import { db } from "@/db";
import { elections, candidates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkAndCloseElections } from "@/lib/elections";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await checkAndCloseElections();

    const election = await db.query.elections.findFirst({
      where: eq(elections.id, id),
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    const electionCandidates = await db
      .select()
      .from(candidates)
      .where(eq(candidates.electionId, id))
      .orderBy(candidates.name);

    return NextResponse.json({
      ...election,
      candidates: electionCandidates,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch election" },
      { status: 500 }
    );
  }
}
