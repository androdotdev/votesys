import { NextResponse } from "next/server";
import { db } from "@/db";
import { elections } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const body = await request.json();
    const { title, status, startsAt, endsAt } = body;

    if (!title || !startsAt || !endsAt) {
      return NextResponse.json(
        { error: "title, startsAt, and endsAt are required" },
        { status: 400 }
      );
    }

    const newElection = await db.insert(elections).values({
      title,
      status: status || "draft",
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
    }).returning();

    return NextResponse.json(newElection[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create election" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const allElections = await db
      .select()
      .from(elections)
      .orderBy(elections.createdAt);

    return NextResponse.json(allElections);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch elections" },
      { status: 500 }
    );
  }
}
