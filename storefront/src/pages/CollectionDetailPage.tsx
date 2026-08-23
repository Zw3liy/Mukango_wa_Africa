import React from "react";
import { COLLECTIONS } from "../data/collections";
import { PRODUCTS } from "../data/products";
import { ProductGrid } from "../components/shop/ProductGrid";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { Button } from "../components/common/Button";

interface CollectionDetailPageProps {
  slug: string;
  onNavigate?: (path: string) => void;
}

export const CollectionDetailPage: React.FC<CollectionDetailPageProps> = ({ slug, onNavigate }) => {
  const collection = COLLECTIONS.find((c) => c.slug === slug || c.id === slug);

  if (!collection) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <SEO title="Collection Not Found" description="The requested collection could not be located." />
        <h1 className="font-serif text-3xl text-[#4F2607] mb-4">Collection Not Found</h1>
        <p className="text-sm font-light text-stone-600 mb-8">
          The collection you are searching for is unavailable or has been re-curated.
        </p>
        <Button variant="primary" size="md" onClick={() => onNavigate ? onNavigate("/collections") : window.location.href = "/collections"}>
          Return to Collections
        </Button>
      </div>
    );
  }

  // Filter products by collection motif
  const matchingProducts = PRODUCTS.filter((p) => p.motif === collection.motif);

  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title={`${collection.title} — Curated African Hardwood Furniture`}
        description={collection.description}
        canonicalPath={`/collections/${collection.slug}`}
        image={collection.heroImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Collections", href: "/collections" },
            { label: collection.title },
          ]}
        />

        {/* Collection Hero Banner */}
        <div className="relative rounded overflow-hidden shadow-xl border border-[#D4B896]/40 aspect-21/9 my-8 bg-stone-900">
          <img
            src={collection.heroImage}
            alt={collection.title}
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26] via-[#2D2A26]/40 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 text-white max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4B896] font-medium block mb-2">
              {collection.tagline}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light mb-3 text-[#FAF9F6]">
              {collection.title}
            </h1>
            <p className="text-sm font-light text-stone-200 leading-relaxed">
              {collection.description}
            </p>
          </div>
        </div>

        {/* Curator Note Box */}
        <div className="p-6 bg-[#F7F5F0] rounded border border-[#D4B896]/30 mb-12 flex items-start gap-4">
          <div className="w-1.5 h-12 bg-[#8B6F47] rounded-full shrink-0" />
          <div>
            <h3 className="font-serif text-sm uppercase tracking-wider text-[#4F2607] font-semibold mb-1">
              Curator's Atelier Note
            </h3>
            <p className="text-xs font-light text-stone-700 italic leading-relaxed">
              "{collection.curatorNote}"
            </p>
          </div>
        </div>

        {/* Matching Works */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D4B896]/30">
            <h2 className="font-serif text-2xl text-[#4F2607] font-light">
              Pieces in this Collection ({matchingProducts.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate ? onNavigate("/shop") : window.location.href = "/shop"}
            >
              View Full Catalogue
            </Button>
          </div>

          <ProductGrid products={matchingProducts} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};
