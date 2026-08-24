import { describe, it, expect } from "vitest";
import { PRODUCTS } from "../src/data/products";
import { COLLECTIONS } from "../src/data/collections";
import { DESIGN_MOTIFS } from "../src/data/motifs";
import { TIMBER_REGISTRY, WOOD_FINISHES } from "../src/data/timbers";
import { JOURNAL_ARTICLES } from "../src/data/journal";
import { FAQS } from "../src/data/faqs";

describe("Catalogue & Source Data Integrity", () => {
  it("contains all authoritative products with complete specifications and pricing", () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(12);

    PRODUCTS.forEach((product) => {
      expect(product.id).toBeDefined();
      expect(product.slug).toBeDefined();
      expect(product.name.length).toBeGreaterThan(3);
      expect(product.basePriceUsd).toBeGreaterThan(0);
      expect(product.category).toBeDefined();
      expect(product.motif).toBeDefined();
      expect(product.timber).toBeDefined();
      expect(product.sku).toMatch(/^MWA-/);
      expect(product.dimensions.widthCm).toBeGreaterThan(0);
      expect(product.dimensions.heightCm).toBeGreaterThan(0);
      expect(product.images.hero).toBeDefined();
      expect(product.highlights.length).toBeGreaterThan(0);
      expect(product.careInstructions.length).toBeGreaterThan(0);
      expect(product.specifications.length).toBeGreaterThan(0);
    });
  });

  it("contains valid collections and motifs", () => {
    expect(COLLECTIONS.length).toBeGreaterThanOrEqual(5);
    expect(DESIGN_MOTIFS.length).toBeGreaterThanOrEqual(5);

    COLLECTIONS.forEach((c) => {
      expect(c.title).toBeDefined();
      expect(c.heroImage).toBeDefined();
      expect(c.curatorNote).toBeDefined();
    });
  });

  it("registers certified indigenous timbers and finishes", () => {
    expect(TIMBER_REGISTRY.length).toBeGreaterThanOrEqual(4);
    expect(WOOD_FINISHES.length).toBeGreaterThanOrEqual(4);

    const teak = TIMBER_REGISTRY.find((t) => t.id === "zambezi-teak");
    expect(teak).toBeDefined();
    expect(teak?.botanicalName).toBe("Baikiaea plurijuga");

    const mukwa = TIMBER_REGISTRY.find((t) => t.id === "mukwa-kiaat");
    expect(mukwa).toBeDefined();
    expect(mukwa?.botanicalName).toBe("Pterocarpus angolensis");
  });

  it("contains journal chronicles and FAQ entries", () => {
    expect(JOURNAL_ARTICLES.length).toBeGreaterThanOrEqual(3);
    expect(FAQS.length).toBeGreaterThanOrEqual(6);
  });
});
