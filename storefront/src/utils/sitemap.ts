import { PRODUCTS } from "../data/products";
import { COLLECTIONS } from "../data/collections";
import { JOURNAL_ARTICLES } from "../data/journal";

export interface SitemapEntry {
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  lastmod?: string;
}

export function getPublicSitemapRoutes(): SitemapEntry[] {
  const currentDate = new Date().toISOString().split("T")[0];

  const staticRoutes: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: 1.0, lastmod: currentDate },
    { path: "/shop", changefreq: "daily", priority: 0.9, lastmod: currentDate },
    { path: "/collections", changefreq: "weekly", priority: 0.8, lastmod: currentDate },
    { path: "/bespoke", changefreq: "weekly", priority: 0.9, lastmod: currentDate },
    { path: "/craftsmanship", changefreq: "monthly", priority: 0.8, lastmod: currentDate },
    { path: "/about", changefreq: "monthly", priority: 0.7, lastmod: currentDate },
    { path: "/journal", changefreq: "weekly", priority: 0.7, lastmod: currentDate },
    { path: "/faq", changefreq: "monthly", priority: 0.5, lastmod: currentDate },
    { path: "/contact", changefreq: "monthly", priority: 0.6, lastmod: currentDate },
    { path: "/shipping", changefreq: "monthly", priority: 0.4, lastmod: currentDate },
    { path: "/returns", changefreq: "monthly", priority: 0.4, lastmod: currentDate },
    { path: "/privacy", changefreq: "yearly", priority: 0.3, lastmod: currentDate },
    { path: "/terms", changefreq: "yearly", priority: 0.3, lastmod: currentDate },
  ];

  const productRoutes: SitemapEntry[] = PRODUCTS.map((product) => ({
    path: `/products/${product.slug}`,
    changefreq: "weekly",
    priority: 0.85,
    lastmod: currentDate,
  }));

  const collectionRoutes: SitemapEntry[] = COLLECTIONS.map((col) => ({
    path: `/collections/${col.slug}`,
    changefreq: "weekly",
    priority: 0.75,
    lastmod: currentDate,
  }));

  const journalRoutes: SitemapEntry[] = JOURNAL_ARTICLES.map((article) => ({
    path: `/journal/${article.slug}`,
    changefreq: "monthly",
    priority: 0.65,
    lastmod: currentDate,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...journalRoutes];
}

export function generateSitemapXml(siteUrl: string): string {
  if (!siteUrl || typeof siteUrl !== "string" || !siteUrl.trim()) {
    throw new Error("SITE_URL is required to generate authoritative sitemap.xml. Refusing to fabricate production domain.");
  }

  const cleanBaseUrl = siteUrl.trim().replace(/\/+$/, "");
  const routes = getPublicSitemapRoutes();

  // STRICT VALIDATION: Ensure no private/cart/checkout routes exist
  const forbiddenPatterns = ["/cart", "/checkout", "/api"];
  for (const route of routes) {
    if (forbiddenPatterns.some((pattern) => route.path.startsWith(pattern))) {
      throw new Error(`Sitemap security violation: Private route ${route.path} cannot be in public sitemap.`);
    }
  }

  const entriesXml = routes
    .map(
      (entry) => `  <url>
    <loc>${cleanBaseUrl}${entry.path}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entriesXml}
</urlset>`;
}
