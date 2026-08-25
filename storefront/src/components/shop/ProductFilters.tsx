import React from "react";
import { ProductCategory, DesignMotif } from "../../types/product";
import { SlidersHorizontal, X } from "lucide-react";

export interface FilterState {
  category: ProductCategory | "all";
  motif: DesignMotif | "all";
  timber: string | "all";
  maxPrice: number;
  inStockOnly: boolean;
  searchQuery: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalResultsCount: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResultsCount,
}) => {
  const CATEGORIES: { label: string; value: ProductCategory | "all" }[] = [
    { label: "All Works", value: "all" },
    { label: "Chairs & Seating", value: "chairs" },
    { label: "Tables", value: "tables" },
    { label: "Storage & Credenzas", value: "storage" },
    { label: "Accents & Panels", value: "accents" },
    { label: "Lighting", value: "lighting" },
    { label: "Bedroom", value: "bedroom" },
  ];

  const MOTIFS: { label: string; value: DesignMotif | "all" }[] = [
    { label: "All Motifs", value: "all" },
    { label: "The Savannah", value: "savannah" },
    { label: "Village Stories", value: "village-stories" },
    { label: "Big Five Icons", value: "big-five" },
    { label: "Traditional Court", value: "traditional" },
    { label: "Zambezi Flow", value: "zambezi-flow" },
  ];

  const TIMBERS = [
    { label: "All Timbers", value: "all" },
    { label: "Zambezi Teak", value: "Zambezi Teak" },
    { label: "Mukwa / Kiaat", value: "Mukwa" },
  ];

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.motif !== "all" ||
    filters.timber !== "all" ||
    filters.inStockOnly ||
    filters.searchQuery !== "" ||
    filters.maxPrice < 10000;

  return (
    <div className="bg-[#F7F5F0] p-6 rounded border border-[#D4B896]/30 mb-8 space-y-6">
      {/* Category Pills Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-widest text-[#7A6039] font-semibold flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Category</span>
          </span>
          <span className="text-xs font-light text-stone-500">
            {totalResultsCount} {totalResultsCount === 1 ? "piece" : "pieces"} found
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onChange({ category: cat.value })}
                className={`text-xs uppercase tracking-wider px-3.5 py-2 rounded transition font-medium ${
                  isSelected
                    ? "bg-[#4F2607] text-[#FAF9F6] shadow-xs"
                    : "bg-white text-stone-700 hover:bg-[#EFE6DA] border border-[#D4B896]/30"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#D4B896]/20">
        {/* Motif Filter */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-1.5">
            Design Motif
          </label>
          <select
            value={filters.motif}
            onChange={(e) => onChange({ motif: e.target.value as DesignMotif | "all" })}
            className="w-full text-xs py-2 px-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
          >
            {MOTIFS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Timber Filter */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-1.5">
            Wood Species
          </label>
          <select
            value={filters.timber}
            onChange={(e) => onChange({ timber: e.target.value })}
            className="w-full text-xs py-2 px-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
          >
            {TIMBERS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              Max Price
            </label>
            <span className="text-xs font-semibold text-[#4F2607]">
              ${filters.maxPrice.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={400}
            max={8000}
            step={200}
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            className="w-full accent-[#4F2607]"
          />
        </div>

        {/* Stock Toggle & Clear */}
        <div className="flex flex-col justify-end gap-2">
          <label className="flex items-center gap-2 text-xs font-light text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onChange({ inStockOnly: e.target.checked })}
              className="rounded text-[#4F2607] focus:ring-[#8B6F47] accent-[#4F2607]"
            />
            <span>Quick-ship stock only</span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs text-[#7A6039] hover:text-[#4F2607] flex items-center gap-1 font-medium transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear all filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
