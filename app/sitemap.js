const SITE = "https://cbr-labs.com";

// Last meaningful content edit. Bump when you ship a public copy change so
// Google sees a real lastmod (not just `new Date()` which looks suspicious).
const LAST_EDIT = "2026-05-31";

// Trailing slashes match `trailingSlash: true` in next.config.mjs so the
// canonical, sitemap URL, and served URL all agree (otherwise GSC reports
// "Duplicate without user-selected canonical").
const routes = [
  { path: "/",               priority: 1.0, changeFrequency: "monthly" },
  { path: "/services/",      priority: 0.9, changeFrequency: "monthly" },
  { path: "/neutered-ipad/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/government/",    priority: 0.9, changeFrequency: "monthly" },
  { path: "/industries/",    priority: 0.8, changeFrequency: "monthly" },
  { path: "/security/",      priority: 0.8, changeFrequency: "monthly" },
  { path: "/process/",       priority: 0.8, changeFrequency: "monthly" },
  { path: "/compliance/",    priority: 0.7, changeFrequency: "monthly" },
  { path: "/about/",         priority: 0.7, changeFrequency: "yearly" },
  { path: "/resources/",     priority: 0.6, changeFrequency: "monthly" },
  { path: "/notes/",         priority: 0.6, changeFrequency: "weekly" },
  { path: "/notes/mdm-vs-hardware-redaction/",            priority: 0.6, changeFrequency: "yearly" },
  { path: "/notes/what-is-in-a-certificate-of-redaction/",priority: 0.6, changeFrequency: "yearly" },
  { path: "/notes/icd-705-tablets-scif/",                 priority: 0.6, changeFrequency: "yearly" },
  { path: "/notes/hipaa-ambient-capture-bedside-tablet/", priority: 0.6, changeFrequency: "yearly" },
  { path: "/faq/",           priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact/",       priority: 0.6, changeFrequency: "yearly" },
];

export default function sitemap() {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE}${path}`,
    lastModified: LAST_EDIT,
    changeFrequency,
    priority,
  }));
}
