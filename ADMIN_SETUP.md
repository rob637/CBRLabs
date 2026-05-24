# CBR Labs Admin — go-live checklist

You're a one-person company. This is the entire to-do list. ~20 minutes, all in the Cloudflare dashboard at https://dash.cloudflare.com — no terminal, no Wrangler, no local browser.

Open the dashboard in another tab and walk top to bottom.

---

### ☐ 1. Create the database (3 min)

**Workers & Pages → D1 → Create**

- **Name:** `cbr_labs_admin`
- After it's created, click into it → **Console** tab
- Open [db/schema.sql](db/schema.sql) here in VS Code, **Select All**, **Copy**
- Paste into the D1 console, click **Execute**
- Then open [db/schema-v2.sql](db/schema-v2.sql), **Select All**, **Copy**, paste, **Execute**. (Adds leads + proposals + share_tokens tables. Safe to re-run.)

Done when the **Tables** tab lists `customers`, `purchase_orders`, `devices`, `device_events`, `invoices`, `proposals`, `leads`, `share_tokens`, etc.

---

### ☐ 2. Create the file bucket (1 min)

**R2 → Create bucket**

- **Name:** `cbr-labs-files`
- Location: **Automatic**
- Leave public access **off**

Done. Nothing else to configure on the bucket. It holds intake photos, document vault uploads, and any other binary assets.

---

### ☐ 3. Wire database + bucket + env vars to the site (5 min)

**Workers & Pages → `cbr-labs` (your Pages project) → Settings**

**Bindings → Add binding** (do this twice):

| Type        | Variable name | Resource          |
| ----------- | ------------- | ----------------- |
| D1 database | `DB`          | `cbr_labs_admin`  |
| R2 bucket   | `FILES`       | `cbr-labs-files`  |

**Variables and Secrets → Add variable** (Production, one row each — paste exactly):

| Name                  | Value                          |
| --------------------- | ------------------------------ |
| `COMPANY_NAME`        | `CBR Labs LLC`                 |
| `COMPANY_EMAIL`       | `rob@cbr-labs.com`             |
| `COMPANY_PHONE`       | `703-623-8835`                 |
| `COMPANY_ADDRESS_1`   | `5927 Tilbury Rd`              |
| `COMPANY_ADDRESS_2`   | `Alexandria, VA 22310`         |
| `COMPANY_CAGE`        | `14Y35`                        |
| `COMPANY_UEI`         | `K4MZG4KC1MY9`                 |
| `INVOICE_PREFIX`      | `CBR`                          |
| `TAG_YEAR_PREFIX`     | `CBR`                          |

**Deployments → ⋯ on the latest → Retry deployment.** This restart is what makes the new bindings active.

---

### ☐ 4. Lock the door with Cloudflare Access (10 min)

**Zero Trust** (left rail). First time, pick any team name like `cbr-labs`.

**Access → Applications → Add application → Self-hosted**

- **Name:** `CBR Labs Admin`
- **Session:** 24 hours
- **Domain:** `cbr-labs.pages.dev` (or your custom domain)
- **Path:** `admin`
- **Identity provider:** turn on **One-time PIN** (it emails you a magic link)
- **Policies → Add policy → Action: Allow → Include → Emails:** `rob@cbr-labs.com`
- Save.

**Now do it again** — same wizard, same settings, but **Path: `api`**. This locks the data endpoints too.

**⚠ Important — keep `/public/*` open.** The lead form (`/public/leads`) and customer proposal-accept page (`/public/proposals/{token}`) MUST be reachable without login. Do NOT create an Access app covering `/public/*`. If you ever add a broader `/*` rule, add a **Bypass** policy first for `Path: public/*`.

---

### ☐ 5. Verify it all works (2 min)

Open a private/incognito window:

1. Go to https://cbr-labs.pages.dev/admin
2. You see Cloudflare's login screen → enter `rob@cbr-labs.com` → check email → click magic link
3. Admin dashboard loads with KPI tiles (all zeros — that's correct)
4. Go to **Intake**, create a test customer "Test Co", a PO "PO-TEST", and 1 device with model "iPad Air"
5. You should land on a success screen with tag `CBR-2026-0001` and a **Print 1 label** button
6. Click it → PDF downloads → open it → point your iPhone camera at the QR → tap the banner → it walks you through Access and lands on that device's detail page

If all 6 steps pass, you're live.

---

### Already done (you don't need to touch any of this)

- Marketing site, admin UI, all 11 API endpoints, intake → QR labels → photo upload → chain of custody → state machine
- Sticker sheets for Avery 22805 (1.5″ device tags, 24/sheet) and Avery 5163 (4×2″ box labels, 10/sheet)
- PWA manifest + iPhone icons — add admin site to Home Screen for full-screen field use
- Federal credentials in footer (CAGE 14Y35, UEI K4MZG4KC1MY9, SAM.gov registered)
- `/neutered-ipad` SEO landing page

---

### If anything goes wrong

Re-run the build by pushing any commit (even an empty one) — Pages rebuilds in ~60 seconds. The admin UI shows a useful error message instead of a blank screen if a binding is missing.

---

# DNS + Email Notifications — paused mid-session (resume here)

**Critical context discovered:** `cbr-labs.com` is still pointing at the OLD Apache/GoDaddy site, NOT the new Cloudflare Pages app. Until DNS is moved, the contact form on the apex domain is going to the dead site and `cbr-labs.com/admin/leads` 404s. The new app only works at `cbr-labs.pages.dev`.

- Domain registrar: **GoDaddy**
- Current nameservers: `ns73.domaincontrol.com`, `ns74.domaincontrol.com` (GoDaddy)
- Current `A` record: `208.109.65.209` (GoDaddy shared hosting / Apache)
- GoDaddy account email shown in dashboard: `joleuterio@sagecg.com`
- Hosting product: GoDaddy cPanel

Email situation is **unknown** — must be checked before touching nameservers. The GoDaddy dashboard shows an Email panel; need to confirm whether `rob@cbr-labs.com` or any other `@cbr-labs.com` mailbox exists and where MX records point.

---

## STEP 1 — Repoint `cbr-labs.com` to Cloudflare Pages

### 1a. Check what email is hosted on the domain (do this FIRST)
1. https://dashboard.godaddy.com → left sidebar **Email** → screenshot the page.
2. Note any mailboxes (e.g. `rob@cbr-labs.com`, `info@cbr-labs.com`) and any forwarding rules.
3. Also note in GoDaddy DNS what the current MX records are — these MUST be preserved when nameservers move.

### 1b. Add the domain to Cloudflare (SAFE — does not affect live site yet)
1. https://dash.cloudflare.com → top right **Add a domain** → type `cbr-labs.com` → Free plan → Continue.
2. Cloudflare scans GoDaddy's existing records and shows them. **Verify these are present before continuing:**
   - All `MX` records for email
   - `TXT` records (SPF `v=spf1...`, DKIM, DMARC, any Google/Microsoft verification strings)
   - `A` record for `cbr-labs.com` (currently `208.109.65.209`)
   - `CNAME` records for `www`, `mail`, `email`, `cpanel`, `webmail`, etc.
3. If anything is missing, add it manually in Cloudflare DNS before proceeding.
4. Cloudflare will then display **two assigned nameservers** like `ada.ns.cloudflare.com` + `bob.ns.cloudflare.com`. Copy both.

### 1c. Switch nameservers at GoDaddy
1. https://dashboard.godaddy.com → **Domain** → click `cbr-labs.com` → **Manage DNS** (or three-dot menu → Manage DNS).
2. Scroll to **Nameservers** → **Change**.
3. Choose **I'll use my own nameservers** → delete the two GoDaddy ones → paste Cloudflare's two → Save.
4. GoDaddy sends a confirmation email. Activation takes 5 min – 1 hour.

### 1d. Attach domain to Pages project
1. Cloudflare dashboard → **Workers & Pages** → click `cbr-labs` project → **Custom domains** tab → **Set up a custom domain**.
2. Enter `cbr-labs.com` → Continue → Activate. Repeat for `www.cbr-labs.com`.
3. Both rows should show **Active** within a few minutes once nameservers are live.

### 1e. Verify
```bash
curl -sI https://cbr-labs.com/ | grep -iE 'server|cf-ray'
```
Want to see `server: cloudflare`. Then `https://cbr-labs.com/admin/leads/` should show the Cloudflare Access login, not 404.

### 1f. Old hosting cleanup
Once cbr-labs.com is verified pointing at Pages:
- Old GoDaddy hosting can be cancelled at next renewal.
- **Before cancelling**, log into the old cPanel and check the contact-form inbox / submissions for any stranded leads from before the switch.

---

## STEP 2 — Wire up Resend email notifications

Code is already shipped (`functions/public/leads.ts`). It's dormant until `RESEND_API_KEY` is set in Cloudflare Pages env vars. Once the key is set, every contact-form submission emails `rob@cbr-labs.com` with the submitter as Reply-To.

### 2a. Sign up at Resend
https://resend.com — free plan: 3,000 emails/month, 100/day.

### 2b. Verify `cbr-labs.com` in Resend
1. Resend dashboard → **Domains** → **Add Domain** → `cbr-labs.com` → US East region.
2. Resend shows 3 DNS records to add (SPF TXT, DKIM TXT/CNAME, DMARC TXT).
3. In Cloudflare → `cbr-labs.com` → **DNS** → add each record exactly as Resend specified. **Proxy OFF (grey cloud)** for all three.
4. Click **Verify DNS Records** in Resend. All three should turn green.

### 2c. Create API key
1. Resend → **API Keys** → **Create API Key** → name: `cbr-labs-pages` → permission: **Sending access** → domain: `cbr-labs.com`.
2. Copy the key (`re_...`) — only shown once.

### 2d. Add key to Cloudflare Pages
1. Cloudflare → Pages project `cbr-labs` → **Settings** → **Variables and Secrets** → **Production**.
2. Add variable:
   - Name: `RESEND_API_KEY`
   - Value: `re_...`
   - Type: **Secret** (encrypted)
3. (Optional overrides — plain text, not secrets):
   - `LEADS_TO_EMAIL` — default `rob@cbr-labs.com`. To send to multiple recipients, code currently only accepts one address; ask Claude to add comma-list support.
   - `LEADS_FROM_EMAIL` — default `CBR Labs <no-reply@cbr-labs.com>`. Must use a verified domain.

### 2e. Redeploy so env vars load
Cloudflare → Pages project → Deployments → latest → ⋯ → **Retry deployment**. (Or push any commit.)

### 2f. Test
1. Submit the form at `https://cbr-labs.com/contact/` with a real name + your own email.
2. Email should arrive at `rob@cbr-labs.com` within seconds.
3. The row should also appear in `https://cbr-labs.com/admin/leads/`.
4. If no email arrives within 2 min: Cloudflare → Pages project → Deployments → latest → **Functions logs** → search for `lead email failed:` — the error tells you what's wrong.

---

## Open question for next session
User said: "all emails should go to rob@cbr-labs.com or rob@sagecg.com no leads@cbr-labs.com".
- FROM default is fixed: `no-reply@cbr-labs.com` (committed in `0dc2870`).
- TO default is `rob@cbr-labs.com`. If both addresses are wanted, modify `sendLeadEmail()` in `functions/public/leads.ts` so `LEADS_TO_EMAIL` accepts a comma-separated list and is split into `to: [...]` for Resend.

## Quick checklist
- [ ] Screenshotted GoDaddy email settings
- [ ] Added cbr-labs.com to Cloudflare, verified all DNS records imported
- [ ] Switched nameservers at GoDaddy
- [ ] Added `cbr-labs.com` + `www.cbr-labs.com` as Pages custom domains
- [ ] `curl -sI https://cbr-labs.com/` returns `server: cloudflare`
- [ ] `https://cbr-labs.com/admin/leads/` shows Access login
- [ ] Resend domain verified (3 DNS records green)
- [ ] `RESEND_API_KEY` secret added to Pages production
- [ ] Retried deployment after adding key
- [ ] Test submission delivered to rob@cbr-labs.com
- [ ] Checked old GoDaddy cPanel inbox for stranded leads
