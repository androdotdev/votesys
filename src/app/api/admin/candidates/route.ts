import { NextResponse } from "next/server";
import { db } from "@/db";
import { candidates, elections } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const body = await request.json();
    const { electionId, name, description } = body;

    if (!electionId || !name) {
      return NextResponse.json(
        { error: "electionId and name are required" },
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

    const newCandidate = await db.insert(candidates).values({
      electionId,
      name,
      description: description || null,
    }).returning();

    return NextResponse.json(newCandidate[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create candidate" },
      { status: 500 }
    );
  }
}
