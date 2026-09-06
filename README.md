# PollForge — Secure Polling Platform

> ⚠️ **Not political:** PollForge is for *internal polls* (teams, classrooms, communities). **Not affiliated with any government or political election.**

**Forge polls people trust.** PollForge is a secure, anonymous polling platform — not just for elections. Create polls, collect votes, and share results with end-to-end anonymity and transaction safety. Built for classrooms, teams, communities, and organizations that need *better secure pooling*.

> **Live Demo:** `https://pollforge-app.vercel.app` · **Repo:** `https://github.com/androdotdev/pollforge-app`

## Why PollForge (not just an election app)?

Traditional voting tools lock you into "elections." PollForge treats everything as a **poll** — quick team decisions, classroom quizzes, community proposals, or formal elections — with the same security guarantees:

- **Anonymous by design** — no link between *who* voted and *what* they voted for
- **One person, one vote** — enforced without breaking anonymity
- **Tamper-resistant** — atomic writes, no partial votes
- **Time-aware** — polls auto-close when time expires

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Auth | Better Auth (email + password, scrypt) |
| Styling | Tailwind CSS 4 |
| Language | TypeScript 5 |

## Quick Start

### Prerequisites
- Node.js 18+
- Neon PostgreSQL DB (free tier works)

### Setup
```bash
npm install
cp .env.example .env
# Edit .env:
# DATABASE_URL=postgresql://...
# BETTER_AUTH_SECRET=your-random-secret
# BETTER_AUTH_URL=http://localhost:3000  # or https://pollforge-app.vercel.app for prod
# ADMIN_PASSWORD_HASH=...

npm run db:push
npm run db:seed
npm run dev
# open http://localhost:3000
```

### Admin Access
Seed creates `admin@pollforge-app.vercel.app` (role `admin`). Use it to create/manage polls. Never commit `.env`.

## Usage

- **Create a poll** (Admin): `/admin` → *Create New Poll* → set title, open/close dates → Add options (candidates)
- **Vote** (Authenticated): `/elections` → pick a poll → choose option → *Confirm Your Vote*
- **Results**: `/results/[id]` shows counts & percentages; admin report adds voter list (IDs only, no choice linkage)

Polls auto-close: `GET /api/elections`, `GET /api/elections/:id`, and `POST /api/votes` all run `checkAndCloseElections()` — expired `open` polls flip to `closed`.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/       # Better Auth
│   │   ├── elections/            # Public poll listing (kept as "elections" for route stability)
│   │   ├── votes/                # Authenticated voting (transaction-safe)
│   │   ├── session/              # Role-aware session
│   │   └── admin/                # Poll management (admin only)
│   ├── election/[id]/            # Vote page (poll ballot)
│   ├── results/[id]/             # Live results (anonymized)
│   ├── admin/                    # PollForge dashboard
│   │   └── election/[id]/        # Poll detail & report
│   ├── sign-in/ / sign-up/       # Auth flows
│   ├── page.tsx                  # Home — auth-aware hero (PollForge)
│   └── layout.tsx                # Root + PollForge indigo/slate theme
├── db/
│   ├── schema.ts                 # Drizzle tables (elections→polls, candidates→options, votes, voteReceipts)
│   ├── index.ts                  # Neon + drizzle client
│   └── seed.ts                   # Seeds admin@pollforge-app.vercel.app + sample poll
├── lib/
│   ├── auth.ts / admin.ts        # Auth + RBAC
│   └── elections.ts              # Auto-close logic
└── components/
    ├── Header.tsx                # Responsive, server-initialized nav (no flash)
    └── BallotIllustration.tsx    # Indigo ballot hero
proxy.ts                         # Route guard (/election, /results, /admin)
```

> **Naming note:** DB/routes still use `elections/candidates/votes` for stability. Conceptually they are `polls/options/votes` — secure pooling for any decision, not just formal elections.

## API Routes

### Public (poll discovery)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/elections` | List open polls (auto-closes expired) |
| `GET` | `/api/elections/:id` | Poll + options |
| `GET` | `/api/elections/:id/results` | Counts/percentages per option |

### Authenticated
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/votes` | Cast vote (receipt check + transaction) |
| `GET` | `/api/votes/me/:electionId` | Has current user voted? |

### Admin Only
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/elections` | Create poll |
| `PATCH` | `/api/admin/elections/:id` | Set status `draft/open/closed` |
| `DELETE` | `/api/admin/elections/:id` | Delete poll (cascade-safe) |
| `POST` | `/api/admin/candidates` | Add option |
| `DELETE` | `/api/admin/candidates/:id` | Remove option (cascade-safe) |
| `GET` | `/api/admin/elections/:id/voters` | Who voted (IDs only) |
| `GET` | `/api/admin/elections/:id/report` | Full report |

## Security — How Secure Pooling Works

- **Vote Anonymity:** `votes` stores `electionId + candidateId` only. `voteReceipts` stores `userId + electionId`. No table links a user to their choice.
- **Atomic Pooling:** `POST /api/votes` wraps `insert voteReceipts` + `insert votes` in `db.transaction()` — prevents *receipt without vote* or *vote without receipt*.
- **One-vote enforcement:** `voteReceipts` PK `(userId, electionId)` + pre-insert check → `409 Already voted`.
- **RBAC:** `requireAdmin()` gates all `/api/admin/*`.
- **Auto-close:** expired polls→`closed` via single `update ... where status=open and endsAt<now()`.

## Branding & Theme

PollForge brand: **PollForge** display, `pollforge-app` slug. Theme: `indigo-600/700` + `slate` (rebranded from teal), responsive (mobile hamburger, card vs table in admin), SVG ballot favicon (`/icon.svg`, `/favicon.ico`, `/apple-touch-icon.png`).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (Turbopack) |
| `npm run start` | Start prod |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync schema to DB |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed admin + sample poll |

## Repository

- **GitHub:** `https://github.com/androdotdev/pollforge-app` (renamed `votesys` → `pollforge` → `pollforge-app`)
- Previous `votesys`/`VoteSys`/`voting-sys` refs replaced with `PollForge`/`pollforge-app`.
