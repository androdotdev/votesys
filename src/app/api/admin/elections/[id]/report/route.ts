import { NextResponse } from "next/server";
import { db } from "@/db";
import { votes, candidates, elections } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { eq, count } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const { id } = await params;

    const election = await db.query.elections.findFirst({
      where: eq(elections.id, id),
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    const results = await db
      .select({
        candidateId: candidates.id,
        candidateName: candidates.name,
        voteCount: count(votes.id),
      })
      .from(candidates)
      .leftJoin(votes, eq(votes.candidateId, candidates.id))
      .where(eq(candidates.electionId, id))
      .groupBy(candidates.id, candidates.name)
      .orderBy(candidates.name);

    const totalVotes = results.reduce((sum: number, r) => sum + Number(r.voteCount), 0);

    return NextResponse.json({
      election: {
        id: election.id,
        title: election.title,
        status: election.status,
        startsAt: election.startsAt.toISOString(),
        endsAt: election.endsAt.toISOString(),
      },
      candidates: results.map((r) => ({
        candidateId: r.candidateId,
        candidateName: r.candidateName,
        voteCount: Number(r.voteCount),
        percentage: totalVotes > 0 ? (Number(r.voteCount) / totalVotes) * 100 : 0,
      })),
      totalVotes,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
