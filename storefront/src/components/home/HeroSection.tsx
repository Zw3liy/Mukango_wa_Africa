import React from "react";
import { Button } from "../common/Button";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { scrollToTop } from "../../utils/scroll";

interface HeroSectionProps {
  onNavigate?: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const handleNav = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
      scrollToTop();
    } else {
      window.location.href = href;
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-[#2D2A26] text-white overflow-hidden">
      {/* Background Hero Image with Subtle Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero.jpg"
          alt="Mukango Wa Africa Handcrafted Hardwood Furniture"
          className="w-full h-full object-cover object-center scale-105 animate-fade-in filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26] via-[#2D2A26]/40 to-[#2D2A26]/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F6]/15 backdrop-blur-md border border-[#D4B896]/30 text-xs font-light tracking-[0.25em] uppercase text-[#D4B896] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#D4B896]" />
          <span>Curated Collections & Bespoke Commissions</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight leading-[1.1] mb-6 text-[#FAF9F6]">
          Where Heritage Meets Modern Living
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg font-light text-stone-200 leading-relaxed mb-10">
          Hand-carved solid Zambezi Teak and Mukwa furniture bridging generational Zambian craftsmanship with timeless contemporary architectural design.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleNav("/shop")}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-lg"
          >
            Explore Catalogue
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => handleNav("/bespoke")}
            leftIcon={<Compass className="w-4 h-4" />}
            className="w-full sm:w-auto text-white border-[#D4B896] hover:bg-white/10 hover:border-white"
          >
            Commission Bespoke Piece
          </Button>
        </div>

        {/* Hero Bottom Credibility Badges */}
        <div className="mt-16 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-light text-stone-300">
          <div>
            <span className="font-serif text-2xl text-[#D4B896] block mb-1">100% Solid</span>
            <span>Indigenous Hardwoods</span>
          </div>
          <div>
            <span className="font-serif text-2xl text-[#D4B896] block mb-1">Zero Screws</span>
            <span>Interlocking Hand Joinery</span>
          </div>
          <div>
            <span className="font-serif text-2xl text-[#D4B896] block mb-1">25-Year</span>
            <span>Heirloom Warranty</span>
          </div>
          <div>
            <span className="font-serif text-2xl text-[#D4B896] block mb-1">25+ Nations</span>
            <span>Insured Global Freight</span>
          </div>
        </div>
      </div>
    </section>
  );
};
