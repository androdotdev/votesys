import { NextResponse } from "next/server";
import { db } from "@/db";
import { elections } from "@/db/schema";
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

    const deleted = await db
      .delete(elections)
      .where(eq(elections.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Election not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete election" },
      { status: 500 }
    );
  }
}
