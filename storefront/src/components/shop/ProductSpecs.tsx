import React, { useState } from "react";
import { Product } from "../../types/product";
import { ShieldCheck, Trees, Hammer, Sparkles } from "lucide-react";

interface ProductSpecsProps {
  product: Product;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<"specs" | "craft" | "care">("specs");

  return (
    <div className="mt-12 bg-white rounded border border-[#D4B896]/30 overflow-hidden shadow-xs">
      {/* Navigation Tabs */}
      <div className="flex border-b border-[#D4B896]/30 bg-[#F7F5F0]">
        <button
          onClick={() => setActiveTab("specs")}
          className={`flex-1 py-3.5 px-4 text-xs uppercase tracking-wider font-medium text-center transition border-b-2 ${
            activeTab === "specs"
              ? "border-[#4F2607] text-[#4F2607] bg-white"
              : "border-transparent text-stone-500 hover:text-[#4F2607]"
          }`}
        >
          Specifications & Dimensions
        </button>

        <button
          onClick={() => setActiveTab("craft")}
          className={`flex-1 py-3.5 px-4 text-xs uppercase tracking-wider font-medium text-center transition border-b-2 ${
            activeTab === "craft"
              ? "border-[#4F2607] text-[#4F2607] bg-white"
              : "border-transparent text-stone-500 hover:text-[#4F2607]"
          }`}
        >
          Timber & Artisanal Story
        </button>

        <button
          onClick={() => setActiveTab("care")}
          className={`flex-1 py-3.5 px-4 text-xs uppercase tracking-wider font-medium text-center transition border-b-2 ${
            activeTab === "care"
              ? "border-[#4F2607] text-[#4F2607] bg-white"
              : "border-transparent text-stone-500 hover:text-[#4F2607]"
          }`}
        >
          Care & Heirloom Warranty
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-6 md:p-8">
        {activeTab === "specs" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="p-3 bg-[#FAF9F6] rounded border border-[#D4B896]/20">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-light">
                    {spec.label}
                  </span>
                  <span className="text-sm font-medium text-[#2D2A26] mt-0.5 block">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs uppercase tracking-wider text-[#8B6F47] font-semibold mb-3">
                Key Architectural Highlights
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-light text-stone-700">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B6F47] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "craft" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-[#F7F5F0] rounded border border-[#D4B896]/30">
              <Trees className="w-6 h-6 text-[#4F2607] shrink-0 mt-1" />
              <div>
                <h4 className="font-serif text-base text-[#4F2607] mb-1">{product.timber}</h4>
                <p className="text-xs font-light text-stone-600 leading-relaxed">
                  Harvested responsibly in western and central Zambia. Naturally resistant to termites, humidity swings, and dry climates due to dense heartwood grain.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#F7F5F0] rounded border border-[#D4B896]/30">
              <Hammer className="w-6 h-6 text-[#4F2607] shrink-0 mt-1" />
              <div>
                <h4 className="font-serif text-base text-[#4F2607] mb-1">Traditional Joinery</h4>
                <p className="text-xs font-light text-stone-600 leading-relaxed">
                  Joined with mortise and tenon assemblies and wedged wooden dowels. Free of weak mechanical metal fasteners in all primary load-bearing joints.
                </p>
              </div>
            </div>

            <p className="text-sm font-light text-stone-700 leading-relaxed">
              {product.detailedStory}
            </p>
          </div>
        )}

        {activeTab === "care" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-[#FAF9F6] rounded border border-[#8B6F47]/30">
              <ShieldCheck className="w-6 h-6 text-[#8B6F47] shrink-0 mt-1" />
              <div>
                <h4 className="font-serif text-base text-[#4F2607] mb-1">25-Year Heirloom Warranty</h4>
                <p className="text-xs font-light text-stone-600 leading-relaxed">
                  Mukango Wa Africa guarantees the structural integrity of this piece against joint failure or structural timber splitting for a quarter century.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#8B6F47] font-semibold mb-3">
                Timber Maintenance Protocol
              </h4>
              <ul className="space-y-2 text-xs font-light text-stone-700">
                {product.careInstructions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B6F47] shrink-0 mt-1.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
