import React from "react";
import { DESIGN_MOTIFS } from "../../data/motifs";
import { ArrowRight } from "lucide-react";

interface MotifsSectionProps {
  onNavigate?: (path: string) => void;
}

export const MotifsSection: React.FC<MotifsSectionProps> = ({ onNavigate }) => {
  const handleMotifClick = (motifId: string) => {
    const target = `/shop?motif=${motifId}`;
    if (onNavigate) {
      onNavigate(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = target;
    }
  };

  return (
    <section className="py-20 bg-[#F7F5F0] border-y border-[#D4B896]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-medium block mb-2">
            Artistic Lineage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#4F2607] font-light mb-4">
            Shop By Design Motif
          </h2>
          <p className="text-sm font-light text-stone-600 leading-relaxed">
            Each collection is anchored in an authentic narrative tradition — from the sovereign wildlife of the open savannah to the sacred geometry of the Barotse royal court.
          </p>
        </div>

        {/* Motif Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DESIGN_MOTIFS.slice(0, 3).map((motif) => (
            <div
              key={motif.id}
              onClick={() => handleMotifClick(motif.id)}
              className="group relative overflow-hidden rounded bg-stone-900 cursor-pointer shadow-subtle hover:shadow-card transition duration-500 flex flex-col h-[420px]"
            >
              <img
                src={motif.image}
                alt={motif.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26] via-[#2D2A26]/50 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4B896] mb-1 font-light">
                  {motif.subtitle}
                </span>
                <h3 className="font-serif text-2xl font-normal text-white mb-2 group-hover:text-[#D4B896] transition">
                  {motif.title}
                </h3>
                <p className="text-xs font-light text-stone-200 line-clamp-2 leading-relaxed mb-4">
                  {motif.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#D4B896]">
                  <span>Explore Motif Pieces</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
