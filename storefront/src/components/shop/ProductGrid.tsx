import React from "react";
import { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "../common/Skeleton";
import { EmptyState } from "../common/EmptyState";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onNavigate?: (path: string) => void;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onNavigate,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white rounded p-4 border border-stone-200 space-y-4">
            <Skeleton className="w-full aspect-4/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No pieces match your selection"
        description="Try adjusting your category, design motif, or timber filters to explore other works from our atelier."
        actionLabel="Reset All Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
      ))}
    </div>
  );
};
