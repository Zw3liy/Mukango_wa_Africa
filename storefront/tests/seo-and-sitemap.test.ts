import { describe, it, expect } from "vitest";
import { generateSitemapXml, getPublicSitemapRoutes } from "../src/utils/sitemap";
import { generateProductJsonLd, generateBreadcrumbsJsonLd, generateOrganizationJsonLd } from "../src/utils/seo";
import { PRODUCTS } from "../src/data/products";

describe("SEO & Sitemap Validation", () => {
  it("generates valid sitemap XML including all public pages, products, collections, journal entries", () => {
    const siteUrl = "https://mukangowaafrica.com";
    const xml = generateSitemapXml(siteUrl);

    expect(xml).toContain("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
    expect(xml).toContain("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
    expect(xml).toContain("<loc>https://mukangowaafrica.com/</loc>");
    expect(xml).toContain("<loc>https://mukangowaafrica.com/shop</loc>");
    expect(xml).toContain("<loc>https://mukangowaafrica.com/collections</loc>");
    expect(xml).toContain("<loc>https://mukangowaafrica.com/bespoke</loc>");
    expect(xml).toContain("<loc>https://mukangowaafrica.com/about</loc>");
    expect(xml).toContain("<loc>https://mukangowaafrica.com/craftsmanship</loc>");
    expect(xml).toContain("<loc>https://mukangowaafrica.com/journal</loc>");
  });

  it("STRICTLY EXCLUDES private routes (/cart, /checkout) from sitemap", () => {
    const routes = getPublicSitemapRoutes();
    const paths = routes.map((r) => r.path);

    expect(paths).not.toContain("/cart");
    expect(paths).not.toContain("/checkout");
    expect(paths).not.toContain("/checkout/confirmation");
    expect(paths).not.toContain("/checkout/cancel");
    expect(paths.some((p) => p.startsWith("/api"))).toBe(false);
  });

  it("fails safely if SITE_URL is not provided or empty", () => {
    expect(() => generateSitemapXml("")).toThrowError(/SITE_URL is required/);
  });

  it("generates valid Product JSON-LD with schema.org specifications", () => {
    const product = PRODUCTS[0];
    const jsonLdStr = generateProductJsonLd(product, "https://mukangowaafrica.com");
    const parsed = JSON.parse(jsonLdStr);

    expect(parsed["@type"]).toBe("Product");
    expect(parsed.name).toBe(product.name);
    expect(parsed.brand.name).toBe("Mukango Wa Africa");
    expect(parsed.offers.price).toBe(product.basePriceUsd.toFixed(2));
    expect(parsed.countryOfOrigin.name).toBe("Zambia");
  });

  it("generates valid Breadcrumbs & Organization JSON-LD schemas", () => {
    const breadcrumbs = generateBreadcrumbsJsonLd([
      { name: "Home", path: "/" },
      { name: "Catalogue", path: "/shop" },
      { name: "Chairs", path: "/shop?category=chairs" },
    ]);
    const parsedCrumbs = JSON.parse(breadcrumbs);
    expect(parsedCrumbs["@type"]).toBe("BreadcrumbList");
    expect(parsedCrumbs.itemListElement.length).toBe(3);

    const org = generateOrganizationJsonLd();
    const parsedOrg = JSON.parse(org);
    expect(parsedOrg["@type"]).toBe("FurnitureStore");
    expect(parsedOrg.address.addressLocality).toBe("Lusaka");
  });
});
