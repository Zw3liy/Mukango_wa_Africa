import fs from "fs";
import path from "path";
import { PRODUCTS } from "../src/data/products";
import { JOURNAL_ARTICLES } from "../src/data/journal";
import { generateArticleJsonLd, generateOrganizationJsonLd, generateProductJsonLd } from "../src/utils/seo";

const dist = path.resolve(process.cwd(), "dist");
const templatePath = path.join(dist, "index.html");
const siteUrl = (process.env.SITE_URL || "https://mukangoafrica.co.za").replace(/\/+$/, "");

const escapeAttribute = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

function renderHead(template: string, metadata: {
  title: string;
  description: string;
  path: string;
  image: string;
  type: "product" | "article";
  schemas: string[];
}) {
  const canonical = `${siteUrl}${metadata.path}`;
  const image = metadata.image.startsWith("http") ? metadata.image : `${siteUrl}${metadata.image}`;
  const tags = `
    <link rel="canonical" href="${escapeAttribute(canonical)}" />
    <meta property="og:url" content="${escapeAttribute(canonical)}" />
    <meta property="og:type" content="${metadata.type}" />
    <meta property="og:title" content="${escapeAttribute(metadata.title)}" />
    <meta property="og:description" content="${escapeAttribute(metadata.description)}" />
    <meta property="og:image" content="${escapeAttribute(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(metadata.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(metadata.description)}" />
    <meta name="twitter:image" content="${escapeAttribute(image)}" />
    ${metadata.schemas.map((schema) => `<script type="application/ld+json">${schema.replace(/</g, "\\u003c")}</script>`).join("\n    ")}`;

  const routeTemplate = template
    .replace(/\s*<link rel="canonical"[^>]*\/>/g, "")
    .replace(/\s*<meta property="og:(?:url|type|title|description|image)"[^>]*\/>/g, "")
    .replace(/\s*<meta name="twitter:(?:card|title|description|image)"[^>]*\/>/g, "");

  return routeTemplate
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttribute(metadata.title)}</title>`)
    .replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${escapeAttribute(metadata.description)}" />`)
    .replace("</head>", `${tags}\n  </head>`);
}

function writeRoute(route: string, html: string) {
  const directory = path.join(dist, route.replace(/^\//, ""));
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), html);
}

if (!fs.existsSync(templatePath)) throw new Error("dist/index.html is required before SEO prerendering.");
const template = fs.readFileSync(templatePath, "utf8");
const organization = generateOrganizationJsonLd(siteUrl);

for (const product of PRODUCTS) {
  const route = `/products/${product.slug}`;
  writeRoute(route, renderHead(template, {
    title: `${product.name} — Handcrafted ${product.timber.split("(")[0].trim()} | Mukango Wa Africa`,
    description: product.description,
    path: route,
    image: product.images.hero,
    type: "product",
    schemas: [generateProductJsonLd(product, siteUrl), organization],
  }));
}

for (const article of JOURNAL_ARTICLES) {
  const route = `/journal/${article.slug}`;
  writeRoute(route, renderHead(template, {
    title: `${article.title} | Mukango Wa Africa`,
    description: article.excerpt,
    path: route,
    image: article.image,
    type: "article",
    schemas: [generateArticleJsonLd(article, siteUrl), organization],
  }));
}

console.log(`✓ Pre-rendered crawler-visible metadata for ${PRODUCTS.length + JOURNAL_ARTICLES.length} routes`);
