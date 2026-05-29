const SITE = "https://cbr-labs.com";

// Last meaningful content edit. Bump when you ship a public copy change so
// Google sees a real lastmod (not just `new Date()` which looks suspicious).
const LAST_EDIT = "2026-05-29";

const routes = [
  { path: "",              priority: 1.0, changeFrequency: "monthly" },
  { path: "/services",     priority: 0.9, changeFrequency: "monthly" },
  { path: "/neutered-ipad",priority: 0.9, changeFrequency: "monthly" },
  { path: "/government",   priority: 0.9, changeFrequency: "monthly" },
  { path: "/industries",   priority: 0.8, changeFrequency: "monthly" },
  { path: "/security",     priority: 0.8, changeFrequency: "monthly" },
  { path: "/process",      priority: 0.8, changeFrequency: "monthly" },
  { path: "/compliance",   priority: 0.7, changeFrequency: "monthly" },
  { path: "/about",        priority: 0.7, changeFrequency: "yearly" },
  { path: "/resources",    priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq",          priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact",      priority: 0.6, changeFrequency: "yearly" },
];

export default function sitemap() {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE}${path}`,
    lastModified: LAST_EDIT,
    changeFrequency,
    priority,
  }));
}
