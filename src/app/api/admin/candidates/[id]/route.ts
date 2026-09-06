import { NextResponse } from "next/server";
import { db } from "@/db";
import { candidates, votes } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const { id } = await params;

    const existing = await db.query.candidates.findFirst({ where: eq(candidates.id, id) });
    if (!existing) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    await db.transaction(async (tx) => {
      // votes references candidateId
      await tx.delete(votes).where(eq(votes.candidateId, id));
      await tx.delete(candidates).where(eq(candidates.id, id));
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE candidate failed", e);
    return NextResponse.json(
      { error: "Failed to delete candidate" },
      { status: 500 }
    );
  }
}
