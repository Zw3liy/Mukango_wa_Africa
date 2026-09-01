import { Product } from "../types/product";
import { Currency } from "../types/commerce";
import { FX_RATES, DEFAULT_CURRENCY } from "./currency";

export function getBaseSiteUrl(): string {
  if (typeof process !== "undefined" && process.env?.SITE_URL) {
    return process.env.SITE_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://mukangoafrica.co.za";
}

export function generateProductJsonLd(
  product: Product,
  siteUrl?: string,
  currency: Currency = DEFAULT_CURRENCY
): string {
  const base = siteUrl || getBaseSiteUrl();
  const productUrl = `${base}/products/${product.slug}`;
  const imageUrl = product.images.hero.startsWith("http")
    ? product.images.hero
    : `${base}${product.images.hero}`;

  const rate = FX_RATES[currency] ?? 1.0;
  const price = (product.basePriceUsd * rate).toFixed(2);

  const schema: Record<string, unknown> = {
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
      priceCurrency: currency,
      price: price,
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

  if (product.aggregateRating?.verified && product.aggregateRating.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.aggregateRating.ratingValue,
      reviewCount: product.aggregateRating.reviewCount,
      bestRating: product.aggregateRating.bestRating ?? 5,
      worstRating: product.aggregateRating.worstRating ?? 1,
    };
  }

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
    "@type": ["Organization", "LocalBusiness", "FurnitureStore"],
    "@id": `${base}/#organization`,
    name: "Mukango Wa Africa",
    description: "Heirloom handcrafted furniture bridging Zambian artisanal mastery with contemporary architecture.",
    url: base,
    logo: `${base}/favicon.svg`,
    image: `${base}/images/hero.jpg`,
    email: "hello@mukangoafrica.co.za",
    telephone: "+260971234567",
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
      email: "hello@mukangoafrica.co.za",
    },
  };

  return JSON.stringify(schema);
}

export function generateArticleJsonLd(article: {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  publishedDate: string;
  author: { name: string };
}, siteUrl?: string): string {
  const base = siteUrl || getBaseSiteUrl();
  const image = article.image.startsWith("http") ? article.image : `${base}${article.image}`;
  const published = new Date(article.publishedDate);
  const datePublished = Number.isNaN(published.getTime())
    ? article.publishedDate
    : `${published.getFullYear()}-${String(published.getMonth() + 1).padStart(2, "0")}-${String(published.getDate()).padStart(2, "0")}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [image],
    datePublished,
    author: { "@type": "Person", name: article.author.name },
    publisher: { "@id": `${base}/#organization` },
    mainEntityOfPage: `${base}/journal/${article.slug}`,
  });
}
