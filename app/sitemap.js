const SITE = "https://cbr-labs.com";

export default function sitemap() {
  const routes = ["", "/services", "/security", "/government", "/industries", "/case-studies", "/process", "/about", "/resources", "/compliance", "/faq", "/contact", "/neutered-ipad"];
  return routes.map((r) => ({
    url: `${SITE}${r}`,
    lastModified: new Date(),
    changeFrequency: r === "" ? "monthly" : "yearly",
    priority: r === "" ? 1 : 0.7,
  }));
}
