import React from "react";
import { Button } from "../common/Button";
import { Trees, Hammer, Shield, Sun } from "lucide-react";

interface CraftsmanshipSectionProps {
  onNavigate?: (path: string) => void;
}

export const CraftsmanshipSection: React.FC<CraftsmanshipSectionProps> = ({ onNavigate }) => {
  const handleNav = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  return (
    <section className="py-24 bg-[#FAF9F6] text-[#2D2A26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase with Workshop Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded overflow-hidden shadow-2xl border border-[#D4B896]/40 aspect-4/3">
              <img
                src="/images/craftsmanship.jpg"
                alt="Master craftsman hand-carving Zambezi teak furniture in Lusaka atelier"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <blockquote className="font-serif text-lg italic text-[#FAF9F6] font-light">
                  "Every carving carries a whisper of home."
                </blockquote>
                <p className="text-xs font-light tracking-wider text-[#D4B896] uppercase mt-1">
                  — Chiwama Kennedy Daka, Founder & Master Woodcarver
                </p>
              </div>
            </div>

            {/* Inset Badge */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 p-6 bg-[#4F2607] text-[#FAF9F6] rounded shadow-xl max-w-xs border border-[#8B6F47]">
              <span className="font-serif text-3xl font-light text-[#D4B896] block mb-1">20+ Years</span>
              <p className="text-xs font-light text-stone-200">
                Preserving ancient Barotse woodcarving techniques in contemporary heirlooms.
              </p>
            </div>
          </div>

          {/* Editorial Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-medium block">
              About The Art
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#4F2607] leading-tight">
              A Legacy Carved in Wood
            </h2>
            <p className="text-sm font-light text-stone-700 leading-relaxed">
              Founded in Lusaka by master craftsman Chiwama Kennedy Daka, Mukango Wa Africa transforms reclaimed and sustainably harvested indigenous Zambian timber into generational heirloom pieces.
            </p>

            {/* Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#D4B896]/30">
              <div className="flex items-start gap-3">
                <Trees className="w-5 h-5 text-[#8B6F47] shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-base text-[#4F2607]">Indigenous Timbers</h4>
                  <p className="text-xs font-light text-stone-600 mt-1">
                    Seasoned Zambezi Teak and Mukwa with Janka hardness ratings up to 2,050 lbf.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sun className="w-5 h-5 text-[#8B6F47] shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-base text-[#4F2607]">Solar Kiln Seasoned</h4>
                  <p className="text-xs font-light text-stone-600 mt-1">
                    Kiln-dried down to 8% moisture content to prevent warping across global climates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hammer className="w-5 h-5 text-[#8B6F47] shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-base text-[#4F2607]">Hand Joinery</h4>
                  <p className="text-xs font-light text-stone-600 mt-1">
                    Mortise and tenon assemblies pegged with African Blackwood. Zero metal screws.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#8B6F47] shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-base text-[#4F2607]">25-Year Guarantee</h4>
                  <p className="text-xs font-light text-stone-600 mt-1">
                    Every piece signed, dated, and registered in our permanent atelier archive.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleNav("/craftsmanship")}
              >
                Discover Our Craftsmanship Philosophy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
