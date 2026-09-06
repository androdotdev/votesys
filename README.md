# PollForge

Online voting system MVP built with Next.js 16, Neon PostgreSQL, Drizzle ORM, and Better Auth.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | Neon PostgreSQL |
| ORM | Drizzle ORM |
| Auth | Better Auth (email + password) |
| Styling | Tailwind CSS |
| Language | TypeScript |

## Live Demo

> `https://pollforge-app.vercel.app` (auto-generated from repo name)

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon PostgreSQL database (free tier works)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:
   ```
   DATABASE_URL=postgresql://...
   BETTER_AUTH_SECRET=your-random-secret
   BETTER_AUTH_URL=http://localhost:3000
   ```

3. **Push database schema**
   ```bash
   npm run db:push
   ```

4. **Seed initial data**
   ```bash
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

### Admin Access

An admin account is created automatically by the seed script (`admin@pollforge-app.vercel.app`). Contact the system administrator for credentials.

> The `ADMIN_PASSWORD_HASH` in `.env` is required for seeding. Never commit `.env` to version control.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes directly to database (dev) |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Apply migration files |
| `npm run db:seed` | Seed admin user and sample election |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/       # Better Auth catch-all
│   │   ├── elections/            # Public election endpoints
│   │   ├── votes/                # Authenticated voting
│   │   ├── session/              # Session check (role-aware)
│   │   └── admin/                # Admin-only endpoints
│   ├── election/[id]/            # Election voting page
│   ├── results/[id]/             # Live results page
│   ├── admin/                    # Admin dashboard
│   │   └── election/[id]/        # Admin election detail
│   ├── sign-in/                  # Sign-in page
│   ├── sign-up/                  # Sign-up page
│   ├── page.tsx                  # Home (marketing + CTA)
│   └── layout.tsx                # Root layout with PollForge branding
├── db/
│   ├── schema.ts                 # All Drizzle table definitions
│   ├── index.ts                  # Drizzle client
│   └── seed.ts                   # Seed script (creates admin@pollforge-app.vercel.app)
├── lib/
│   ├── auth.ts                   # Better Auth configuration
│   ├── admin.ts                  # Admin role guard helper
│   └── elections.ts              # Auto-close expired elections
└── components/
    └── Header.tsx                # Nav with role-based links (PollForge brand)
proxy.ts                         # Route protection (auth guard for /election, /results, /admin)
```

## API Routes

### Public

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/elections` | List all open elections (auto-closes expired) |
| `GET` | `/api/elections/:id` | Get election with candidates |
| `GET` | `/api/elections/:id/results` | Get vote counts per candidate |

### Authenticated

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/votes` | Cast a vote (checks receipt, transaction-safe) |
| `GET` | `/api/votes/me/:electionId` | Check if user has voted |

### Admin Only

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/elections` | Create election |
| `PATCH` | `/api/admin/elections/:id` | Update status (draft/open/closed) |
| `DELETE` | `/api/admin/elections/:id` | Delete election |
| `POST` | `/api/admin/candidates` | Add candidate |
| `DELETE` | `/api/admin/candidates/:id` | Remove candidate |
| `GET` | `/api/admin/elections/:id/voters` | List who voted (user IDs) |
| `GET` | `/api/admin/elections/:id/report` | Full vote report |

## Security

- **Vote Anonymity**: The `votes` table stores no user identity. The `voteReceipts` table tracks who voted (for enforcement) without linking to what they voted for.
- **Atomic Voting**: Vote casting uses a Drizzle transaction — the receipt and vote are inserted together, preventing partial failures.
- **Role-Based Access**: Admin routes enforce `role === "admin"` via `requireAdmin()` helper.
- **Auto-Close**: Expired elections are automatically closed on every request to `GET /api/elections`, `GET /api/elections/:id`, and `POST /api/votes`.

## Repository

- GitHub: `https://github.com/androdotdev/pollforge-app` (renamed from `votesys` → `pollforge` → `pollforge-app`)
- Previous name references (`votesys`, `VoteSys`, `voting-sys`) have been replaced with `PollForge` / `pollforge-app`. See `git log` for rename commits.

