// Lightweight SEO helpers. Renders schema.org JSON-LD inline.
// Server component — no client JS shipped.

const SITE_URL = "https://cbr-labs.com";

/**
 * BreadcrumbList JSON-LD. `items` is [{ name, path }, ...] where path is the
 * site-relative URL (e.g. "/services/"). The home crumb is prepended automatically.
 */
export function Breadcrumbs({ items = [] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
