import React from "react";
import { Product } from "../../types/product";
import { formatPrice } from "../../utils/currency";
import { Badge } from "../common/Badge";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onNavigate?: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addItem } = useCart();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = `/products/${product.slug}`;
    if (onNavigate) {
      onNavigate(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = target;
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <article className="group flex flex-col bg-white rounded overflow-hidden border border-[#D4B896]/30 shadow-subtle hover:shadow-card hover:border-[#8B6F47]/50 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer" onClick={handleCardClick}>
        <img
          src={product.images.hero}
          alt={product.images.alt || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && <Badge variant="teak">Signature</Badge>}
          {product.isHeirloomCertified && <Badge variant="charcoal">Heirloom</Badge>}
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-[#2D2A26]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
          <button
            onClick={handleCardClick}
            className="p-3 rounded-full bg-[#FAF9F6] text-[#4F2607] hover:bg-white hover:scale-110 transition shadow-md"
            aria-label={`View details of ${product.name}`}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={handleQuickAdd}
            className="p-3 rounded-full bg-[#4F2607] text-[#FAF9F6] hover:bg-[#6E3B13] hover:scale-110 transition shadow-md"
            aria-label={`Add ${product.name} to basket`}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 text-xs font-light text-[#8B6F47] uppercase tracking-wider mb-1.5">
          <span>{product.category}</span>
          <span>{product.timber.split(" ")[0]}</span>
        </div>

        <h3
          className="font-serif text-lg font-normal text-[#4F2607] group-hover:text-[#8B6F47] transition mb-1 cursor-pointer"
          onClick={handleCardClick}
        >
          {product.name}
        </h3>

        <p className="text-xs font-light text-stone-600 line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.tagline || product.description}
        </p>

        <div className="pt-3 border-t border-[#D4B896]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-light">
              From
            </span>
            <span className="font-serif text-lg font-medium text-[#2D2A26]">
              {formatPrice(product.basePriceUsd)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="text-xs uppercase tracking-wider font-medium text-[#4F2607] hover:text-[#8B6F47] border-b border-[#4F2607] hover:border-[#8B6F47] pb-0.5 transition"
          >
            Inquire / Add
          </button>
        </div>
      </div>
    </article>
  );
};
