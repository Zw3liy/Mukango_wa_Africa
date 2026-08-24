import React from "react";
import { COLLECTIONS } from "../data/collections";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { ArrowRight } from "lucide-react";

interface CollectionsPageProps {
  onNavigate?: (path: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onNavigate }) => {
  const handleCollectionClick = (slug: string) => {
    const target = `/collections/${slug}`;
    if (onNavigate) {
      onNavigate(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = target;
    }
  };

  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Design Collections — Curated Hardwood Suites"
        description="Explore the design motifs of Mukango Wa Africa: The Savannah Collection, Village Stories, Big Five Icons, and Royal Court traditional woodwork."
        canonicalPath="/collections"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Collections", href: "/collections" }]} />

        <div className="py-8 text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-semibold block mb-2">
            Narrative Curations
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#4F2607] font-light mb-4">
            Curated Design Motifs
          </h1>
          <p className="text-sm font-light text-stone-600 leading-relaxed">
            Every Mukango collection expresses a distinct artistic philosophy — celebrating African wildlife sovereignty, communal memory, and sacred royal court geometry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => handleCollectionClick(col.slug)}
              className="group cursor-pointer bg-white rounded overflow-hidden border border-[#D4B896]/40 shadow-subtle hover:shadow-card transition duration-500 flex flex-col"
            >
              <div className="aspect-16/10 overflow-hidden bg-stone-900 relative">
                <img
                  src={col.heroImage}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26]/80 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#4F2607]/80 text-[#FAF9F6] text-xs uppercase tracking-wider rounded backdrop-blur-xs font-light">
                  {col.productCount} Signature Works
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#8B6F47] font-medium block mb-1">
                    {col.tagline}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#4F2607] group-hover:text-[#8B6F47] transition mb-3">
                    {col.title}
                  </h2>
                  <p className="text-xs font-light text-stone-600 leading-relaxed mb-4">
                    {col.description}
                  </p>
                  <blockquote className="p-3 bg-[#F7F5F0] rounded border-l-2 border-[#8B6F47] text-xs italic text-stone-600 font-light">
                    "{col.curatorNote}"
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs uppercase tracking-wider font-medium text-[#4F2607] group-hover:text-[#8B6F47]">
                  <span>Explore Collection Suites</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
