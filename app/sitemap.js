const SITE = "https://cbr-labs.com";

export default function sitemap() {
  const routes = ["", "/services", "/industries", "/process", "/about", "/resources", "/compliance", "/contact"];
  return routes.map((r) => ({
    url: `${SITE}${r}`,
    lastModified: new Date(),
    changeFrequency: r === "" ? "monthly" : "yearly",
    priority: r === "" ? 1 : 0.7,
  }));
}
