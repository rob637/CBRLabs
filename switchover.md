# CBR Labs — Domain Switchover Plan

Hold this until you're ready to cut DNS from the current cbr-labs.com site
to the new Cloudflare Pages site. Same domain → minimal SEO risk if
redirects are correct.

---

## Already shipped in the codebase (no action needed)
- `app/sitemap.js` — real `lastModified`, per-route priorities.
- `app/robots.js` — robots.txt pointing at sitemap.
- `app/layout.js` — Organization + LocalBusiness JSON-LD with CAGE/UEI/DUNS.
- `app/services/page.js` — `Service` JSON-LD.
- `app/government/page.js` — `GovernmentService` JSON-LD.
- `public/_headers` — `X-Robots-Tag: noindex` on `/admin/*` and `/api/*`.
- `public/_redirects` — 301s for `/case-studies`, common misspellings,
  and `www` → apex.
- `/case-studies` route deleted (was mock data, unlinked from nav).

## Still TODO before cutover

### High priority
1. **Create `/og.png`** — `/workspaces/CBRLabs/public/og.png` (1200×630).
   Referenced by OG/Twitter metadata but file is MISSING. Every social
   share currently has no preview image.
2. **Set up Google Search Console**
   - https://search.google.com/search-console
   - Add **Domain** property (not URL prefix) for `cbr-labs.com`.
   - Verify via Cloudflare DNS TXT record.
3. **Set up Bing Webmaster Tools**
   - https://www.bing.com/webmasters → one-click import from GSC.
4. **Export current cbr-labs.com indexed URLs**
   - From existing GSC if any, or run `site:cbr-labs.com` in Google.
   - Map any URLs that don't exist on new site → add to `public/_redirects`.

### Pre-cutover testing (on `cbr-labs.pages.dev`)
5. https://pagespeed.web.dev/ — fix any red Core Web Vitals scores.
6. https://search.google.com/test/rich-results — verify JSON-LD parses.
7. https://www.opengraph.xyz/ — verify OG image (after #1 done).

### 24 hours before cutover
8. **Lower DNS TTL to 300s** on current cbr-labs.com A/AAAA/CNAME for root.
   Cloudflare DNS → edit record → TTL: Auto → 5 min. Makes the switch
   propagate in minutes instead of hours.

### Cutover day
9. Flip DNS to point cbr-labs.com at the new Cloudflare Pages project.
10. GSC → Sitemaps → submit `https://cbr-labs.com/sitemap.xml`.
11. GSC → URL Inspection → "Request indexing" on:
    - `/` (homepage)
    - `/services`
    - `/government`
    - `/neutered-ipad`
    - `/industries`
    - `/about`
12. Same in Bing Webmaster Tools.

### Post-cutover monitoring (daily for 2 weeks)
13. GSC → **Performance** → watch clicks/impressions for dip+recovery.
14. GSC → **Pages → Why pages aren't indexed** → any "Not found (404)"
    = missing redirect → add to `public/_redirects` and redeploy.
15. Cloudflare Analytics → confirm Googlebot/Bingbot traffic continues.

---

## Files of interest
- `app/layout.js` — root metadata + Organization JSON-LD
- `app/sitemap.js` — sitemap source
- `app/robots.js` — robots.txt source
- `public/_headers` — Cloudflare Pages headers
- `public/_redirects` — 301s (expand based on old URL audit)

## Also pending (unrelated to SEO)
- Wire up Resend for the contact form email notifications — see
  `/memories/repo/resend-setup.md` for the step-by-step.

---
Last updated: 2026-05-29
