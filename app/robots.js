export default function robots() {
  return {
    rules: [
      // Block AI training/scraping bots (preserves policy from previous site).
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "Applebot-Extended", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "Amazonbot", disallow: "/" },
      { userAgent: "meta-externalagent", disallow: "/" },
      // Everyone else (search engines included) — full access.
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    ],
    sitemap: "https://cbr-labs.com/sitemap.xml",
    host: "https://cbr-labs.com",
  };
}
