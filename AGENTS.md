# AGENTS.md — CBR Labs

Operating notes for AI coding agents working in this repo. Keep this file
short and current. If something here is wrong, fix it.

---

## What this project is

CBR Labs is a Cloudflare **Pages** site (Next.js 14 App Router, static export)
plus **Pages Functions** for the admin/API surface, backed by **D1** (SQLite)
and **R2** (object storage). It is the marketing site + internal admin app
for a device-redaction lab serving government customers.

- Marketing pages, public verification, and public lead/proposal endpoints are open.
- Everything under `/admin/*` and `/api/*` is protected by **Cloudflare Access**.

## Stack & runtime

- Next.js 14 App Router, **static export** (`pages_build_output_dir = "out"`)
- React 18, Tailwind 3, plain JS for app code (no TS in `app/`)
- Cloudflare Pages Functions in `/functions/**` — these **are** TypeScript
- D1 binding: `DB` (database `cbr_labs_admin`)
- R2 binding: `FILES` (bucket `cbr-labs-files`)
- Cloudflare Access provides `cf-access-authenticated-user-email` header

## Repo layout (the parts that matter)

```
app/                  Next.js routes (public + /admin SPA)
  admin/_components/  Shared admin UI + api.js fetch wrapper
components/           Shared marketing components
functions/api/        PROTECTED endpoints (Cloudflare Access required)
functions/public/     PUBLIC endpoints (open)
db/schema.sql         Base schema (applied)
db/schema-v2.sql      Leads/proposals/share-tokens additions (applied)
wrangler.toml         Bindings + non-secret env vars
public/_headers       Edge headers
public/_redirects     Edge redirects
```

## URL conventions (do not get these wrong)

- **PUBLIC pages**: `/`, `/about`, `/services`, `/process`, `/industries`,
  `/government`, `/compliance`, `/security`, `/faq`, `/resources`,
  `/contact`, `/neutered-ipad`, `/p`, `/v`
- **PUBLIC APIs**: live at `/public/*` (NOT `/api/public/*`)
  - `/public/leads` (POST), `/public/proposals/[token]`, `/public/verify/[cert]`
- **PROTECTED**: `/admin/*` and `/api/*` — both behind Access

## Conventions for new code

### Pages Functions (`functions/**/*.ts`)

- Import shared helpers from `functions/api/_utils.ts`:
  `json`, `error`, `requireActor`, `HttpError`, `assertPhoto`, `assertDocument`
- Always call `requireActor(request)` for any write under `/api/*` and record
  it as the `actor` in `device_events` (chain of custody depends on this).
- Use the `Env` interface from `_utils.ts` — add new vars there if you add
  them to `wrangler.toml`.
- Money is stored as **integer cents** (`*_cents` columns). Never use floats.
- Timestamps default to `datetime('now')` / `date('now')` in SQL — let the DB
  set them unless you have a reason not to.
- Use prepared statements: `env.DB.prepare(sql).bind(...).run() / .all() / .first()`.

### Admin UI (`app/admin/**`)

- Client components only (`"use client"`).
- Fetch via the `api` wrapper in `app/admin/_components/api.js` — do not use
  raw `fetch` for `/api/*` calls.
- Reuse `STATES`, `REDACTIONS`, `formatMoney`, `formatDate` from `api.js`.
- Reuse `AdminShell`, `PageHeader`, `StateChip`, `PhotoUpload`, `QRCanvas`,
  `BrandedPDF`, `StickerPDF` rather than rolling new ones.

### Database

- All schema changes go in a new `db/schema-vN.sql` file (idempotent —
  `CREATE TABLE IF NOT EXISTS`, `INSERT OR IGNORE`). Never edit applied files
  in a destructive way.
- Apply with `wrangler d1 execute cbr_labs_admin --remote --file=...`.
- The `device_events` table is the legal chain of custody — append-only.
  Every state transition must write one row.

### Static export caveats

- Next.js is configured for static export. **No** `app/api/*` route handlers,
  **no** server actions, **no** `getServerSideProps`. All dynamic behavior
  lives in `functions/`.
- `next.config.mjs` controls the export; don't add features that require a
  Node server.

## Commands

```bash
npm run dev               # local Next dev (no Functions / D1)
npm run build             # static export to ./out
npm run db:apply          # apply db/schema.sql to remote D1
npm run db:apply:local    # apply to local D1
npm run pages:dev         # full local emulation with Functions + D1 + R2
```

Wrangler env (Codespaces): `CLOUDFLARE_API_TOKEN` is a secret;
`CLOUDFLARE_ACCOUNT_ID=de0f21a1240560e2d3885871e1d174a8` must also be
exported because the token lacks "User Details Read".

## House rules for agents

- **Don't add Node-server-only features** (API routes, server actions, ISR).
- **Don't refactor** files you weren't asked to touch.
- **Don't add comments / JSDoc** to code you didn't change.
- **Don't introduce new dependencies** without flagging it first — the
  bundle ships to the edge.
- Money is cents. State machine is the one in `schema.sql` `CHECK` constraint —
  don't invent new states without updating the constraint.
- Before destructive ops (dropping tables, `git push --force`, deleting
  files you didn't create), confirm with the user.
- Progress / "where we left off" notes live in repo memory at
  `/memories/repo/admin-setup-progress.md` — consult and update it for
  multi-session work.
