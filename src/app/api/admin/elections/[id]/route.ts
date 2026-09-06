import { NextResponse } from "next/server";
import { db } from "@/db";
import { elections, candidates, votes, voteReceipts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["draft", "open", "closed"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(elections)
      .set({ status })
      .where(eq(elections.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update election" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const { id } = await params;

    // Check exists first
    const existing = await db.query.elections.findFirst({ where: eq(elections.id, id) });
    if (!existing) {
      return NextResponse.json({ error: "Election not found" }, { status: 404 });
    }

    // Cascade delete dependents in transaction (FK: no action)
    await db.transaction(async (tx) => {
      // votes depends on candidate + election, must go first
      await tx.delete(votes).where(eq(votes.electionId, id));
      await tx.delete(voteReceipts).where(eq(voteReceipts.electionId, id));
      await tx.delete(candidates).where(eq(candidates.electionId, id));
      await tx.delete(elections).where(eq(elections.id, id));
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE election failed", e);
    return NextResponse.json(
      { error: "Failed to delete election" },
      { status: 500 }
    );
  }
}
