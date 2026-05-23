# CBR Labs Admin — one-time Cloudflare setup

This is what *you* have to do in the Cloudflare dashboard / CLI before the
admin section at `/admin` will work end-to-end. The code is already in place;
these steps wire it to real infrastructure.

Estimated time: **20 minutes.**

---

## 0. Install Wrangler locally (one time)

```bash
npm i -D wrangler
npx wrangler login    # opens browser, grants this machine access to your CF account
```

Add to `package.json` scripts (already done if you ran the install above):

```json
"scripts": {
  "wrangler": "wrangler",
  "db:apply":  "wrangler d1 execute cbr-labs-db --remote --file=./db/schema.sql",
  "db:apply:local": "wrangler d1 execute cbr-labs-db --local --file=./db/schema.sql",
  "pages:dev": "wrangler pages dev out --d1=DB=cbr-labs-db --r2=FILES=cbr-labs-files"
}
```

---

## 1. Create the D1 database

```bash
npx wrangler d1 create cbr-labs-db
```

Wrangler prints something like:

```
✅ Successfully created DB 'cbr-labs-db'
[[d1_databases]]
binding = "DB"
database_name = "cbr-labs-db"
database_id = "abcd1234-...-aaaa"
```

**Copy that `database_id`** and paste it into `wrangler.toml` over the
`REPLACE_WITH_D1_ID_FROM_WRANGLER` placeholder.

Apply the schema to the remote database:

```bash
npm run db:apply
```

---

## 2. Create the R2 bucket

```bash
npx wrangler r2 bucket create cbr-labs-files
```

(Free tier covers 10 GB storage and millions of reads — way more than you'll need.)

---

## 3. Bind D1 + R2 to the Cloudflare Pages project

The bindings in `wrangler.toml` work for *local dev*. For the deployed site,
you also have to attach them on the Pages project once:

1. Open https://dash.cloudflare.com → **Workers & Pages** → your `cbr-labs` Pages project
2. Go to **Settings → Functions → Bindings**
3. **D1 database bindings → Add**: variable name `DB`, database `cbr-labs-db`
4. **R2 bucket bindings → Add**: variable name `FILES`, bucket `cbr-labs-files`
5. Click **Save**, then **Deployments → Retry deployment** so the running build
   picks up the new bindings.

Set environment variables (same screen, **Environment variables → Production**):

| Variable            | Value                                |
| ------------------- | ------------------------------------ |
| `COMPANY_NAME`      | `CBR Labs LLC`                       |
| `COMPANY_EMAIL`     | `sales@cbrlabs.com`                  |
| `COMPANY_ADDRESS_1` | *(your street address)*              |
| `COMPANY_ADDRESS_2` | *(city, state, ZIP)*                 |
| `INVOICE_PREFIX`    | `CBR`                                |
| `TAG_YEAR_PREFIX`   | `CBR`                                |

---

## 4. Lock down `/admin/*` with Cloudflare Access

This is the real security. Anyone reaching `/admin/*` or `/api/*` must
authenticate with an email magic-link or Google account *you* approve.

1. https://dash.cloudflare.com → **Zero Trust** (in the left rail). First time you
   enter Zero Trust it'll ask you to pick a team name — pick anything, e.g.
   `cbr-labs`. Free plan covers up to 50 users.
2. **Access → Applications → Add an application → Self-hosted**
3. **Application configuration:**
   - Name: `CBR Labs Admin`
   - Session duration: `24 hours`
   - Application domain: `cbr-labs.pages.dev` *(or your custom domain)*
   - Path: `/admin` (add a second app entry for `/api` with the same policy)
4. **Identity providers:** enable **One-time PIN** at minimum. Add Google/GitHub
   if you want SSO.
5. **Policies → Add a policy:**
   - Action: **Allow**
   - Include: **Emails** → list `you@cbrlabs.com` and any technician's email
6. Save. Repeat steps 2–6 for path `/api` so the underlying data endpoints are
   also gated.

Test by opening `https://cbr-labs.pages.dev/admin` in a private window — you
should see Cloudflare's login page, *not* the admin UI.

When logged in via Access, every request to `/api/*` carries a verified header
`Cf-Access-Authenticated-User-Email` that the server uses to attribute every
chain-of-custody event to a real human.

---

## 5. Local development

```bash
npm run build         # produces ./out
npm run pages:dev     # serves /out at http://localhost:8788, with D1+R2
```

Local dev does *not* enforce Cloudflare Access. The `accessUser` field in
`/api/health` will be `null`. That's expected — never expose local dev to the
internet.

---

## 6. Sanity check

After steps 1–4 are done:

- Visit `/api/health` (through Access) → should return
  `{ ok: true, db: "ok", filesBound: true, accessUser: "you@..." }`
- Visit `/admin` → green "healthy" dot in the top bar

You're now ready for Phase 2 (intake + devices + QR codes) and Phase 3
(invoices + receipts + expenses).
