import React, { useEffect } from "react";
import { getBaseSiteUrl } from "../../utils/seo";

interface SEOProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  jsonLd?: string | object;
  type?: "website" | "article" | "product";
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = "Heirloom handcrafted African hardwood furniture bridging Zambian artisanal mastery with contemporary design. Handcrafted from sustainable Zambezi Teak and Mukwa.",
  canonicalPath = "",
  image = "/images/hero.jpg",
  jsonLd,
  type = "website",
}) => {
  const fullTitle = title.includes("Mukango Wa Africa") ? title : `${title} | Mukango Wa Africa`;
  const siteUrl = getBaseSiteUrl();
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // 2. Update Meta Description
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // 3. Update Canonical Link
    let linkCanonical = document.querySelector("link[rel='canonical']");
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonicalUrl);

    // 4. Update OpenGraph Tags
    const updateMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property='${property}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    updateMetaTag("og:title", fullTitle);
    updateMetaTag("og:description", description);
    updateMetaTag("og:url", canonicalUrl);
    updateMetaTag("og:image", fullImageUrl);
    updateMetaTag("og:type", type);

    // 5. Update Twitter Card Tags
    const updateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name='${name}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    updateTwitterTag("twitter:title", fullTitle);
    updateTwitterTag("twitter:description", description);
    updateTwitterTag("twitter:image", fullImageUrl);

    // 6. JSON-LD Schema
    const scriptId = "seo-dynamic-jsonld";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.text = typeof jsonLd === "string" ? jsonLd : JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [fullTitle, description, canonicalUrl, fullImageUrl, type, jsonLd]);

  return null;
};
