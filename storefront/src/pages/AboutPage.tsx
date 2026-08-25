import React from "react";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { Button } from "../components/common/Button";
import { Trees, Award, Users, HeartHandshake } from "lucide-react";

interface AboutPageProps {
  onNavigate?: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Our Story & Philosophy — Mukango Wa Africa"
        description="Learn the history of Mukango Wa Africa, founded by master carver Chiwama Kennedy Daka to preserve authentic Zambian hardwood craftsmanship."
        canonicalPath="/about"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Our Story", href: "/about" }]} />

        {/* Hero Section */}
        <div className="py-12 max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#7A6039] font-semibold block mb-2">
            Origins & Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#4F2607] font-light mb-6">
            A Legacy Rooted in Zambian Soil
          </h1>
          <p className="text-base font-light text-stone-700 leading-relaxed">
            Mukango Wa Africa was born from a singular conviction: that traditional African woodcarving possesses a spiritual dignity and structural permanence worthy of the world's most distinguished architectural spaces.
          </p>
        </div>

        {/* Master Carver Feature Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 relative aspect-4/3 rounded overflow-hidden shadow-2xl border border-[#D4B896]/40">
            <img
              src="/images/craftsmanship.jpg"
              alt="Chiwama Kennedy Daka carving Zambezi Teak"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-widest text-[#D4B896] block font-light">
                Founder & Master Craftsman
              </span>
              <p className="font-serif text-xl font-normal text-white">Chiwama Kennedy Daka</p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#7A6039] font-medium block">
              The Artisan's Calling
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#4F2607] font-light leading-tight">
              Preserving Living Culture in Solid Hardwood
            </h2>
            <p className="text-sm font-light text-stone-700 leading-relaxed">
              Growing up near the banks of the Zambezi River, Chiwama learned the sacred properties of native timbers from village elders. He observed how indigenous hardwoods like Mukwa and Baikiaea plurijuga could withstand centuries of tropical sunlight and torrential rains when harvested with reverence.
            </p>
            <p className="text-sm font-light text-stone-700 leading-relaxed">
              In 2005, he established Mukango Wa Africa in Lusaka. Rather than pursuing mass production or synthetic veneers, he committed the atelier exclusively to 100% solid indigenous timber, hand joinery, and relief carving that honors Zambian folklore and royal court aesthetics.
            </p>

            <div className="pt-2">
              <blockquote className="p-4 bg-[#F7F5F0] rounded border-l-4 border-[#8B6F47] text-xs italic text-stone-700">
                "When you run your hand across a carved Mukango chair, you are touching the patient labour of human hands and the quiet majesty of our African forests."
              </blockquote>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="py-16 border-t border-[#D4B896]/30 mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#7A6039] font-medium block mb-1">
              Atelier Ethos
            </span>
            <h2 className="font-serif text-3xl text-[#4F2607] font-light">
              Our Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded border border-[#D4B896]/30 shadow-subtle text-center">
              <div className="w-12 h-12 rounded-full bg-[#F7F5F0] text-[#4F2607] flex items-center justify-center mx-auto mb-4">
                <Trees className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-[#4F2607] font-normal mb-2">Sustainable Forestry</h3>
              <p className="text-xs font-light text-stone-600 leading-relaxed">
                100% legally concession-harvested or reclaimed timber. We support rural re-planting initiatives in western Zambia.
              </p>
            </div>

            <div className="p-6 bg-white rounded border border-[#D4B896]/30 shadow-subtle text-center">
              <div className="w-12 h-12 rounded-full bg-[#F7F5F0] text-[#4F2607] flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-[#4F2607] font-normal mb-2">Zero Compromise Joinery</h3>
              <p className="text-xs font-light text-stone-600 leading-relaxed">
                Zero synthetic particle board, screws, or shortcuts. Engineered to survive for generations.
              </p>
            </div>

            <div className="p-6 bg-white rounded border border-[#D4B896]/30 shadow-subtle text-center">
              <div className="w-12 h-12 rounded-full bg-[#F7F5F0] text-[#4F2607] flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-[#4F2607] font-normal mb-2">Artisan Empowerment</h3>
              <p className="text-xs font-light text-stone-600 leading-relaxed">
                We train and employ master woodcarvers and apprentices with fair wages, pension security, and global recognition.
              </p>
            </div>

            <div className="p-6 bg-white rounded border border-[#D4B896]/30 shadow-subtle text-center">
              <div className="w-12 h-12 rounded-full bg-[#F7F5F0] text-[#4F2607] flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-[#4F2607] font-normal mb-2">The Ubuntu Bond</h3>
              <p className="text-xs font-light text-stone-600 leading-relaxed">
                "I am because we are." We view our patrons not merely as customers, but as lifelong custodians of African craft.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-10 bg-[#4F2607] text-[#FAF9F6] rounded text-center max-w-2xl mx-auto shadow-xl mb-16">
          <h3 className="font-serif text-3xl font-light mb-3">Begin Your Heirloom Journey</h3>
          <p className="text-xs font-light text-stone-200 mb-6 max-w-md mx-auto">
            Discover our active catalogue or commission a bespoke work with Master Craftsman Chiwama Kennedy Daka.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigate ? onNavigate("/shop") : window.location.href = "/shop"}
            >
              Explore Catalogue
            </Button>
            <Button
              variant="outline"
              size="md"
              className="text-white border-[#D4B896] hover:bg-white/10"
              onClick={() => onNavigate ? onNavigate("/bespoke") : window.location.href = "/bespoke"}
            >
              Commission Piece
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
