// Static RSS 2.0 feed for /notes/feed.xml. Generated at build time
// (`force-static` works with output: 'export'). Update by editing _posts.js.

import { posts, SITE_URL } from "../_posts";

export const dynamic = "force-static";

function xmlEscape(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const now = new Date().toUTCString();
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/notes/${p.slug}/`;
      const pub = new Date(`${p.date}T12:00:00Z`).toUTCString();
      return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pub}</pubDate>
      <description>${xmlEscape(p.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CBR Labs — Notes</title>
    <link>${SITE_URL}/notes/</link>
    <atom:link href="${SITE_URL}/notes/feed.xml" rel="self" type="application/rss+xml" />
    <description>Notes on hardware redaction, SCIF policy, MDM vs. silicon, and tablet program assurance.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
