import React, { useState } from "react";
import { PRODUCTS } from "../../data/products";
import { ProductCard } from "../shop/ProductCard";
import { ProductCategory } from "../../types/product";
import { ArrowRight } from "lucide-react";

interface FeaturedCollectionProps {
  onNavigate?: (path: string) => void;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<ProductCategory | "all">("all");

  const categories: { label: string; value: ProductCategory | "all" }[] = [
    { label: "All Curations", value: "all" },
    { label: "Chairs", value: "chairs" },
    { label: "Tables", value: "tables" },
    { label: "Storage", value: "storage" },
    { label: "Accents", value: "accents" },
  ];

  const filtered = activeTab === "all"
    ? PRODUCTS.slice(0, 6)
    : PRODUCTS.filter((p) => p.category === activeTab).slice(0, 6);

  const handleViewAll = () => {
    if (onNavigate) {
      onNavigate("/shop");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/shop";
    }
  };

  return (
    <section className="py-20 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-medium block mb-2">
              Featured Works
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4F2607] font-light">
              Curated Furniture Collections
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = activeTab === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveTab(cat.value)}
                  className={`text-xs uppercase tracking-wider px-3.5 py-1.5 rounded transition ${
                    isSelected
                      ? "bg-[#4F2607] text-[#FAF9F6] font-medium shadow-xs"
                      : "bg-[#F7F5F0] text-stone-600 hover:text-[#4F2607] border border-[#D4B896]/30 font-light"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>

        {/* View Full Catalogue Link */}
        <div className="text-center">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-medium text-[#4F2607] hover:text-[#8B6F47] border-b-2 border-[#4F2607] hover:border-[#8B6F47] pb-1 transition"
          >
            <span>Explore Complete {PRODUCTS.length}-Piece Atelier Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
