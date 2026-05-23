export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://cbr-labs.com/sitemap.xml",
    host: "https://cbr-labs.com",
  };
}
