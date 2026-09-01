export type ProductCategory = "chairs" | "tables" | "seating" | "storage" | "accents" | "lighting" | "bedroom";

export type DesignMotif = "savannah" | "village-stories" | "big-five" | "traditional" | "zambezi-flow";

export type WoodSpecies = "Zambezi Teak (Baikiaea plurijuga)" | "Mukwa / Kiaat (Pterocarpus angolensis)" | "African Blackwood (Dalbergia melanoxylon)" | "Acacia (Vachellia)" | "Reclaimed African Hardwood";

export interface ProductDimensions {
  widthCm: number;
  depthCm: number;
  heightCm: number;
  weightKg?: number;
  seatHeightCm?: number;
}

export interface WoodFinish {
  id: string;
  name: string;
  colorHex: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  detailedStory: string;
  basePriceUsd: number;
  category: ProductCategory;
  motif: DesignMotif;
  timber: WoodSpecies;
  sku: string;
  dimensions: ProductDimensions;
  leadTimeWeeks: number;
  isHeirloomCertified: boolean;
  featured: boolean;
  inStockCount: number;
  images: {
    hero: string;
    detail: string;
    inSitu?: string;
    workshop?: string;
    alt: string;
  };
  highlights: string[];
  careInstructions: string[];
  specifications: {
    label: string;
    value: string;
  }[];
  /** Populated only from a verified buyer-feedback provider. Never synthesize ratings. */
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
    source: string;
    verified: true;
  };
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImage: string;
  curatorNote: string;
  motif: DesignMotif;
  productCount: number;
}
