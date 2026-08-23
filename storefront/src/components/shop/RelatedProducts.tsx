import React from "react";
import { Product } from "../../types/product";
import { PRODUCTS } from "../../data/products";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  currentProduct: Product;
  onNavigate?: (path: string) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, onNavigate }) => {
  // Find related products matching motif or category, excluding current product
  const related = PRODUCTS.filter(
    (p) => p.id !== currentProduct.id && (p.motif === currentProduct.motif || p.category === currentProduct.category)
  ).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-20 pt-16 border-t border-[#D4B896]/30">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-medium block mb-2">
          Curated Harmonies
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#4F2607] font-light">
          Complementary Atelier Works
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
};
