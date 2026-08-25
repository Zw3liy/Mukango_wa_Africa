import React, { useState } from "react";
import { PRODUCTS } from "../data/products";
import { WOOD_FINISHES } from "../data/timbers";
import { WoodFinish } from "../types/product";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { ProductGallery } from "../components/shop/ProductGallery";
import { ProductSpecs } from "../components/shop/ProductSpecs";
import { RelatedProducts } from "../components/shop/RelatedProducts";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { formatPrice } from "../utils/currency";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { generateProductJsonLd } from "../utils/seo";
import { ShoppingBag, ShieldCheck, Clock, Check, Trees, Award } from "lucide-react";

interface ProductDetailPageProps {
  slug: string;
  onNavigate?: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const product = PRODUCTS.find((p) => p.slug === slug || p.id === slug);

  const [selectedFinish, setSelectedFinish] = useState<WoodFinish>(WOOD_FINISHES[0]);
  const [quantity, setQuantity] = useState(1);
  const [engravingText, setEngravingText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4">
        <SEO title="Piece Not Found" description="The requested furniture piece could not be located in our atelier catalogue." />
        <h1 className="font-serif text-3xl text-[#4F2607] mb-4">Piece Not Found</h1>
        <p className="text-sm font-light text-stone-600 mb-8">
          The furniture work you are looking for may have been archived or is temporarily out of active curation.
        </p>
        <Button variant="primary" size="md" onClick={() => onNavigate ? onNavigate("/shop") : window.location.href = "/shop"}>
          Return to Catalogue
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, quantity, selectedFinish, engravingText.trim() || undefined);
    showToast(`Added ${quantity} × ${product.name} to basket.`, "success");
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleBespokeInquiry = () => {
    const bespokeUrl = `/bespoke?piece=${encodeURIComponent(product.name)}&timber=${encodeURIComponent(product.timber)}`;
    if (onNavigate) {
      onNavigate(bespokeUrl);
    } else {
      window.location.href = bespokeUrl;
    }
  };

  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title={`${product.name} — Handcrafted ${product.timber.split("(")[0]}`}
        description={product.description}
        canonicalPath={`/products/${product.slug}`}
        image={product.images.hero}
        type="product"
        jsonLd={generateProductJsonLd(product)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Catalogue", href: "/shop" },
            { label: product.category, href: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
        />

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
          {/* Gallery View */}
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>

          {/* Product Purchasing / Details Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                {product.featured && <Badge variant="teak">Signature Atelier Piece</Badge>}
                {product.isHeirloomCertified && <Badge variant="charcoal">25-Year Guarantee</Badge>}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#4F2607] font-light mb-2">
                {product.name}
              </h1>

              <p className="text-xs uppercase tracking-widest text-[#8B6F47] font-semibold mb-4">
                {product.timber} • SKU: {product.sku}
              </p>

              <div className="text-2xl font-serif font-medium text-[#2D2A26] mb-4">
                {formatPrice(product.basePriceUsd)}
                <span className="text-xs font-light text-stone-500 ml-2 font-sans">
                  (Includes phytosanitary export crate)
                </span>
              </div>

              <p className="text-sm font-light text-stone-700 leading-relaxed pb-6 border-b border-[#D4B896]/30">
                {product.description}
              </p>

              {/* Finish Selection */}
              <div className="py-5 border-b border-[#D4B896]/30">
                <label className="block text-xs uppercase tracking-wider text-[#4F2607] font-semibold mb-2">
                  Selected Wood Finish: <span className="text-[#8B6F47] font-normal">{selectedFinish.name}</span>
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {WOOD_FINISHES.map((finish) => {
                    const isSelected = selectedFinish.id === finish.id;
                    return (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => setSelectedFinish(finish)}
                        className={`p-2.5 rounded text-left flex items-start gap-2.5 transition border ${
                          isSelected
                            ? "bg-[#FAF9F6] border-[#4F2607] ring-1 ring-[#4F2607]"
                            : "bg-white border-[#D4B896]/40 hover:bg-[#F7F5F0]"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full shrink-0 mt-0.5 border border-stone-300"
                          style={{ backgroundColor: finish.colorHex }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#2D2A26] truncate">{finish.name}</p>
                          <p className="text-[10px] text-stone-500 font-light truncate">{finish.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Custom Engraving */}
              <div className="py-5 border-b border-[#D4B896]/30">
                <label htmlFor="pdp-custom-engraving" className="block text-xs uppercase tracking-wider text-[#4F2607] font-semibold mb-1">
                  Custom Atelier Inscription (Optional)
                </label>
                <p className="text-[11px] font-light text-stone-500 mb-2">
                  Hand-engraved on the underside brass plate (e.g. "For the Mwila Estate, 2026").
                </p>
                <input
                  id="pdp-custom-engraving"
                  type="text"
                  maxLength={50}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  placeholder="Enter name, date, or dedication (max 50 chars)..."
                  className="w-full text-xs p-2.5 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                />
              </div>

              {/* Stock / Lead Time Alert */}
              <div className="py-4 flex items-center justify-between text-xs text-stone-600 font-light">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8B6F47]" />
                  <span>
                    {product.inStockCount > 0
                      ? `${product.inStockCount} in quick-ship stock`
                      : `Crafted on order (${product.leadTimeWeeks} weeks lead time)`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <Check className="w-4 h-4" />
                  <span>Insured Global Crated Freight</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity input */}
                <div className="flex items-center border border-[#D4B896] rounded bg-white px-2 py-1.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2 text-stone-600 hover:text-black text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="px-2 text-stone-600 hover:text-black text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 shadow-md"
                  onClick={handleAddToCart}
                  isLoading={isAdding}
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                >
                  Add to Basket
                </Button>
              </div>

              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={handleBespokeInquiry}
              >
                Request Custom Sizing / Wood Variation
              </Button>
            </div>

            {/* Atelier Credibility Icons */}
            <div className="p-4 bg-[#F7F5F0] rounded border border-[#D4B896]/30 grid grid-cols-3 gap-2 text-center text-[10px] text-stone-600 font-light">
              <div className="flex flex-col items-center gap-1">
                <Trees className="w-4 h-4 text-[#8B6F47]" />
                <span>100% Solid Zambezi Teak</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Award className="w-4 h-4 text-[#8B6F47]" />
                <span>Signed Master Certificate</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#8B6F47]" />
                <span>25-Year Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specs, Craft Story, Care */}
        <ProductSpecs product={product} />

        {/* Related Products */}
        <RelatedProducts currentProduct={product} onNavigate={onNavigate} />
      </div>
    </div>
  );
};
