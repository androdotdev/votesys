import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { elections, candidates, voteReceipts, votes, user, account, session } from "@/db/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema: { elections, candidates, voteReceipts, votes, user, account, session } });

async function seed() {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) {
    console.error("ADMIN_PASSWORD_HASH not set in .env");
    process.exit(1);
  }

  // Seed admin user
  const existingAdmin = await db.query.user.findFirst({
    where: eq(user.email, "admin@votesys.in"),
  });

  if (!existingAdmin) {
    const userId = "admin-" + Date.now();

    await db.insert(user).values({
      id: userId,
      name: "Admin",
      email: "admin@votesys.in",
      role: "admin",
      emailVerified: true,
    });

    await db.insert(account).values({
      id: "admin-cred-" + Date.now(),
      userId,
      providerId: "credential",
      accountId: "admin@votesys.in",
      password: passwordHash,
    });

    console.log("Created admin user: admin@votesys.in");
  } else {
    console.log("Admin user already exists");
  }

  // Seed election
  const existing = await db.query.elections.findFirst({
    where: eq(elections.title, "Student Council Election 2025"),
  });

  let election = existing;

  if (!election) {
    const inserted = await db.insert(elections).values({
      title: "Student Council Election 2025",
      status: "open",
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }).returning();
    election = inserted[0];
    console.log("Created election:", election.id);
  } else {
    console.log("Election already exists:", election.id);
  }

  const existingCandidates = await db.query.candidates.findMany({
    where: eq(candidates.electionId, election.id),
  });

  if (existingCandidates.length > 0) {
    console.log("Candidates already exist, skipping.");
    return;
  }

  await db.insert(candidates).values([
    {
      electionId: election.id,
      name: "Aarav Mehta",
      description: "Promises better canteen food and faster WiFi.",
    },
    {
      electionId: election.id,
      name: "Priya Sharma",
      description: "Focused on mental health support and study rooms.",
    },
    {
      electionId: election.id,
      name: "Rohit Verma",
      description: "Wants to organise more cultural fests and hackathons.",
    },
    {
      electionId: election.id,
      name: "Sneha Kapoor",
      description: "Pushing for greener campus and sustainable initiatives.",
    },
  ]);

  console.log("Seed completed successfully");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
