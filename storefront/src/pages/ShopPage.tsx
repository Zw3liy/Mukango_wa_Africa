import React, { useState, useMemo, useEffect } from "react";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { PRODUCTS } from "../data/products";
import { ProductGrid } from "../components/shop/ProductGrid";
import { ProductFilters, FilterState } from "../components/shop/ProductFilters";
import { ProductSort, SortOption } from "../components/shop/ProductSort";
import { ProductCategory, DesignMotif } from "../types/product";

interface ShopPageProps {
  initialSearch?: string;
  initialCategory?: ProductCategory | "all";
  initialMotif?: DesignMotif | "all";
  onNavigate?: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialSearch = "",
  initialCategory = "all",
  initialMotif = "all",
  onNavigate,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    motif: initialMotif,
    timber: "all",
    maxPrice: 8000,
    inStockOnly: false,
    searchQuery: initialSearch,
  });

  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Keep filters in sync if incoming initial props change
  useEffect(() => {
    if (initialCategory) setFilters((prev) => ({ ...prev, category: initialCategory }));
    if (initialMotif) setFilters((prev) => ({ ...prev, motif: initialMotif }));
    if (initialSearch) setFilters((prev) => ({ ...prev, searchQuery: initialSearch }));
  }, [initialCategory, initialMotif, initialSearch]);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: "all",
      motif: "all",
      timber: "all",
      maxPrice: 8000,
      inStockOnly: false,
      searchQuery: "",
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (filters.category !== "all" && product.category !== filters.category) {
        return false;
      }
      // Motif filter
      if (filters.motif !== "all" && product.motif !== filters.motif) {
        return false;
      }
      // Timber filter
      if (filters.timber !== "all" && !product.timber.toLowerCase().includes(filters.timber.toLowerCase())) {
        return false;
      }
      // Max price filter
      if (product.basePriceUsd > filters.maxPrice) {
        return false;
      }
      // In-stock filter
      if (filters.inStockOnly && product.inStockCount <= 0) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesTimber = product.timber.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTimber && !matchesCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.basePriceUsd - b.basePriceUsd;
      if (sortBy === "price-desc") return b.basePriceUsd - a.basePriceUsd;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filters, sortBy]);

  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Atelier Catalogue — Solid African Hardwood Furniture"
        description="Explore hand-carved dining tables, throned armchairs, credenzas, and canopy beds. Crafted from certified Zambezi Teak and Mukwa hardwoods."
        canonicalPath="/shop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Catalogue", href: "/shop" }]} />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-8 border-b border-[#D4B896]/30 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#7A6039] font-semibold block mb-2">
              Atelier Collections
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#4F2607] font-light">
              Curated Furniture Works
            </h1>
            <p className="text-sm font-light text-stone-600 mt-2 max-w-xl">
              Each piece is individually sculpted in our Lusaka studio from seasoned Zambian hardwood logs. Numbered, certified, and guaranteed for 25 years.
            </p>
          </div>

          <ProductSort currentSort={sortBy} onSortChange={setSortBy} />
        </div>

        {/* Filters */}
        <ProductFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          totalResultsCount={filteredProducts.length}
        />

        {/* Products Grid */}
        <ProductGrid
          products={filteredProducts}
          onNavigate={onNavigate}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
};
