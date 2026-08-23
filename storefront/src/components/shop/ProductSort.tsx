import React from "react";
import { ArrowUpDown } from "lucide-react";

export type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

interface ProductSortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const ProductSort: React.FC<ProductSortProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-stone-500" />
      <span className="text-xs uppercase tracking-wider text-stone-500 font-medium hidden sm:inline">
        Sort:
      </span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="text-xs py-1.5 px-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
      >
        <option value="featured">Signature & Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
      </select>
    </div>
  );
};
