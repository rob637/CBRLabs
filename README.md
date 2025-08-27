# CBR Labs LLC — Multi‑Page Next.js Site

This is a production‑ready Next.js (App Router) website styled with Tailwind CSS.
All pages use local images in `public/images`, so it works fully offline.

## Quickstart
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build & Run
```bash
npm run build
npm start
```

## Pages
- `/` (Home)
- `/services`
- `/industries`
- `/process`
- `/compliance`
- `/contact`

## Notes
- Replace `mailto:sales@cbrlabs.com` in `/app/contact/page.js` with your real address/CRM endpoint.
- Images are locally generated, stock-style abstracts that match each page theme.
- No external tracking or fonts. Images are unoptimized (`next.config.mjs`) for simple static hosting.
