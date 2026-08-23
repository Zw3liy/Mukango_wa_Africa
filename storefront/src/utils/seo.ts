import { Product } from "../types/product";

export function getBaseSiteUrl(): string {
  // In browser, window.location.origin can be used; on server / build time, check process.env.SITE_URL
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  if (typeof process !== "undefined" && process.env?.SITE_URL) {
    return process.env.SITE_URL.replace(/\/+$/, "");
  }
  return "https://mukangowaafrica.com";
}

export function generateProductJsonLd(product: Product, siteUrl?: string): string {
  const base = siteUrl || getBaseSiteUrl();
  const productUrl = `${base}/products/${product.slug}`;
  const imageUrl = product.images.hero.startsWith("http")
    ? product.images.hero
    : `${base}${product.images.hero}`;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [imageUrl],
    description: product.description,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      "@type": "Brand",
      name: "Mukango Wa Africa",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: product.basePriceUsd.toFixed(2),
      availability: product.inStockCount > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Mukango Wa Africa",
      },
    },
    material: product.timber,
    countryOfOrigin: {
      "@type": "Country",
      name: "Zambia",
    },
  };

  return JSON.stringify(schema);
}

export function generateBreadcrumbsJsonLd(
  crumbs: { name: string; path: string }[],
  siteUrl?: string
): string {
  const base = siteUrl || getBaseSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${base}${crumb.path}`,
    })),
  };

  return JSON.stringify(schema);
}

export function generateOrganizationJsonLd(siteUrl?: string): string {
  const base = siteUrl || getBaseSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: "Mukango Wa Africa",
    description: "Heirloom handcrafted furniture bridging Zambian artisanal mastery with contemporary design.",
    url: base,
    logo: `${base}/favicon.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot 14, Kafue Road",
      addressLocality: "Lusaka",
      addressCountry: "ZM",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+260-97-123-4567",
      contactType: "customer service",
      email: "hello@mukangowaafrica.com",
    },
  };

  return JSON.stringify(schema);
}
