import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateSitemapXml } from "../src/utils/sitemap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = process.env.SITE_URL || "https://mukangoafrica.co.za";

try {
  const xml = generateSitemapXml(siteUrl);

  // Write to public/
  const publicPath = path.resolve(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(publicPath, xml, "utf-8");

  // Write to dist/ if dist exists
  const distDir = path.resolve(__dirname, "../dist");
  if (fs.existsSync(distDir)) {
    const distPath = path.resolve(distDir, "sitemap.xml");
    fs.writeFileSync(distPath, xml, "utf-8");
  }

  console.log(`✓ Generated valid sitemap.xml successfully for ${siteUrl}`);
} catch (err) {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
}
