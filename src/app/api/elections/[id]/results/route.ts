import { NextResponse } from "next/server";
import { db } from "@/db";
import { votes, candidates } from "@/db/schema";
import { eq, count } from "drizzle-orm";
      
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
      candidates: results.map((r) => ({
        candidateId: r.candidateId,
        candidateName: r.candidateName,
        voteCount: Number(r.voteCount),
        percentage: totalVotes > 0 ? (Number(r.voteCount) / totalVotes) * 100 : 0,
      })),
      totalVotes,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
