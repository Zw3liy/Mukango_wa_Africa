import React from "react";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { TIMBER_REGISTRY } from "../data/timbers";
import { Sun, Hammer, Flame } from "lucide-react";

export const CraftsmanshipPage: React.FC = () => {
  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Craftsmanship & Zambian Hardwoods — Mukango Wa Africa"
        description="Discover our timber registry: Zambezi Teak, Mukwa, African Blackwood, and reclaimed hardwoods. Kiln seasoning, mortise-and-tenon joinery, and organic wax finishes."
        canonicalPath="/craftsmanship"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Craftsmanship & Materials", href: "/craftsmanship" }]} />

        {/* Page Header */}
        <div className="py-12 max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#7A6039] font-semibold block mb-2">
            The Science & Spirit of Wood
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#4F2607] font-light mb-6">
            Mastery in Every Grain
          </h1>
          <p className="text-base font-light text-stone-700 leading-relaxed">
            True luxury furniture begins in the soil and seasons of Africa. Explore the indigenous timber species, scientific solar curing protocols, and traditional hand-joinery that define Mukango Wa Africa.
          </p>
        </div>

        {/* The 4 Craft Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 bg-white rounded border border-[#D4B896]/30 shadow-subtle flex flex-col justify-between">
            <div>
              <Sun className="w-8 h-8 text-[#7A6039] mb-4" />
              <h3 className="font-serif text-xl text-[#4F2607] font-normal mb-3">
                Solar Kiln Seasoning
              </h3>
              <p className="text-xs font-light text-stone-600 leading-relaxed">
                Raw timber contains up to 45% moisture. We cure our boards in specialized solar-assisted kilns for 120 days until core moisture stabilizes at 8–10%. This prevents splitting, shrinking, or warping in European heating or tropical humidity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] font-medium text-[#7A6039] uppercase tracking-wider">
              8–10% Equilibrium Moisture
            </div>
          </div>

          <div className="p-8 bg-white rounded border border-[#D4B896]/30 shadow-subtle flex flex-col justify-between">
            <div>
              <Hammer className="w-8 h-8 text-[#7A6039] mb-4" />
              <h3 className="font-serif text-xl text-[#4F2607] font-normal mb-3">
                All-Wood Mortise & Tenon
              </h3>
              <p className="text-xs font-light text-stone-600 leading-relaxed">
                We reject metal screws and mechanical brackets in all load-bearing frames. Interlocking through-tenons pegged with African Blackwood move naturally with the wood fibers over centuries.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] font-medium text-[#7A6039] uppercase tracking-wider">
              100% Structural Wood Joinery
            </div>
          </div>

          <div className="p-8 bg-white rounded border border-[#D4B896]/30 shadow-subtle flex flex-col justify-between">
            <div>
              <Flame className="w-8 h-8 text-[#7A6039] mb-4" />
              <h3 className="font-serif text-xl text-[#4F2607] font-normal mb-3">
                Organic Beeswax & Linseed
              </h3>
              <p className="text-xs font-light text-stone-600 leading-relaxed">
                Rather than suffocating the wood under thick synthetic plastics, we rub each piece with five coats of cold-pressed linseed oil and pure Zambian wild honey beeswax. The wood breathes, self-heals minor scratches, and matures gracefully.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] font-medium text-[#7A6039] uppercase tracking-wider">
              Non-Toxic Natural Patina
            </div>
          </div>
        </div>

        {/* Indigenous Timber Registry */}
        <div className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#7A6039] font-medium block mb-1">
              Botanical Registry
            </span>
            <h2 className="font-serif text-3xl text-[#4F2607] font-light">
              Our Certified Indigenous Hardwoods
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TIMBER_REGISTRY.map((timber) => (
              <div
                key={timber.id}
                className="p-8 bg-white rounded border border-[#D4B896]/40 shadow-subtle flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-serif text-2xl text-[#4F2607] font-normal">
                        {timber.name}
                      </h3>
                      <p className="text-xs font-mono text-[#7A6039] italic">
                        {timber.botanicalName}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#F7F5F0] rounded text-[11px] font-medium text-[#4F2607]">
                      {timber.jankaHardness.split(" ")[0]} Janka
                    </span>
                  </div>

                  <p className="text-xs font-light text-stone-700 leading-relaxed mb-4">
                    {timber.character}
                  </p>

                  <div className="space-y-2 text-xs font-light text-stone-600 pt-3 border-t border-stone-100">
                    <p>
                      <strong className="font-medium text-[#4F2607]">Provenance:</strong> {timber.origin}
                    </p>
                    <p>
                      <strong className="font-medium text-[#4F2607]">Sustainability:</strong> {timber.sustainability}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium block mb-2">
                    Standard Atelier Finishes Available:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {timber.finishes.map((f) => (
                      <span
                        key={f.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF9F6] border border-[#D4B896]/30 rounded text-[11px] text-[#2D2A26]"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: f.colorHex }}
                        />
                        <span>{f.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
