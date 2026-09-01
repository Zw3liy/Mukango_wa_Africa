import { PRODUCTS } from "../data/products";

export interface VerifiedAggregateRating {
  productSlug: string;
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
  source: string;
  verified: true;
}

function validateRating(value: unknown, slug: string): VerifiedAggregateRating | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<VerifiedAggregateRating>;
  const ratingValue = Number(candidate.ratingValue);
  const reviewCount = Number(candidate.reviewCount);
  if (
    candidate.productSlug !== slug ||
    candidate.verified !== true ||
    !candidate.source ||
    !Number.isFinite(ratingValue) ||
    ratingValue < 1 ||
    ratingValue > 5 ||
    !Number.isInteger(reviewCount) ||
    reviewCount < 1
  ) return null;

  return {
    productSlug: slug,
    ratingValue,
    reviewCount,
    bestRating: 5,
    worstRating: 1,
    source: candidate.source,
    verified: true,
  };
}

export async function getVerifiedAggregateRating(slug: string): Promise<VerifiedAggregateRating | null> {
  if (!PRODUCTS.some((product) => product.slug === slug)) return null;
  const endpoint = process.env.VERIFIED_REVIEWS_API_URL?.trim();
  if (!endpoint) return null;

  const response = await fetch(`${endpoint.replace(/\/+$/, "")}/products/${encodeURIComponent(slug)}/aggregate`, {
    headers: process.env.VERIFIED_REVIEWS_API_KEY
      ? { Authorization: `Bearer ${process.env.VERIFIED_REVIEWS_API_KEY}` }
      : undefined,
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Verified review provider returned HTTP ${response.status}.`);
  return validateRating(await response.json(), slug);
}
