# CBR Labs Admin — go-live checklist

You're a one-person company. This is the entire to-do list. ~20 minutes, all in the Cloudflare dashboard at https://dash.cloudflare.com — no terminal, no Wrangler, no local browser.

Open the dashboard in another tab and walk top to bottom.

---

### ☐ 1. Create the database (2 min)

**Workers & Pages → D1 → Create**

- **Name:** `cbr_labs_admin`
- After it's created, click into it → **Console** tab
- Open [db/schema.sql](db/schema.sql) here in VS Code, **Select All**, **Copy**
- Paste into the D1 console, click **Execute**

Done when you see a green confirmation and the **Tables** tab lists `customers`, `purchase_orders`, `devices`, `device_events`, etc.

---

### ☐ 2. Create the photo bucket (1 min)

**R2 → Create bucket**

- **Name:** `cbr-labs-photos`
- Location: **Automatic**
- Leave public access **off**

Done. Nothing else to configure on the bucket.

---

### ☐ 3. Wire database + bucket + env vars to the site (5 min)

**Workers & Pages → `cbr-labs` (your Pages project) → Settings**

**Bindings → Add binding** (do this twice):

| Type        | Variable name | Resource           |
| ----------- | ------------- | ------------------ |
| D1 database | `DB`          | `cbr_labs_admin`   |
| R2 bucket   | `PHOTOS`      | `cbr-labs-photos`  |

**Variables and Secrets → Add variable** (Production, one row each — paste exactly):

| Name              | Value                                  |
| ----------------- | -------------------------------------- |
| `COMPANY_NAME`    | `CBR Labs LLC`                         |
| `COMPANY_EMAIL`   | `rob@cbr-labs.com`                     |
| `COMPANY_PHONE`   | `703-623-8835`                         |
| `COMPANY_ADDRESS` | `5927 Tilbury Rd, Alexandria, VA 22310`|
| `CAGE_CODE`       | `14Y35`                                |
| `UEI`             | `K4MZG4KC1MY9`                         |
| `INVOICE_PREFIX`  | `CBR`                                  |
| `TAG_YEAR_PREFIX` | `CBR`                                  |

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
