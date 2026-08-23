import React from "react";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";

export const TermsPage: React.FC = () => {
  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Terms of Service — Mukango Wa Africa"
        description="Terms governing heirloom furniture purchases, bespoke commissions, phytosanitary export crating, and 25-year warranty conditions."
        canonicalPath="/terms"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Terms of Service", href: "/terms" }]} />

        <div className="py-12">
          <h1 className="font-serif text-4xl text-[#4F2607] font-light mb-4">Terms of Service</h1>
          <p className="text-xs text-stone-500 font-mono mb-8">Effective Date: January 1, 2026</p>

          <div className="prose prose-stone space-y-6 text-sm font-light text-stone-700 leading-relaxed bg-white p-8 md:p-10 rounded border border-[#D4B896]/30">
            <h3 className="font-serif text-lg text-[#4F2607]">1. Atelier Scope</h3>
            <p>
              Mukango Wa Africa handcrafts made-to-order solid timber furniture and architectural artworks in Lusaka, Zambia. Every piece is unique; natural grain patterns, color nuances, and carver gouge marks are authentic signatures of hand craftsmanship.
            </p>

            <h3 className="font-serif text-lg text-[#4F2607]">2. Orders & Commission Deposits</h3>
            <p>
              Bespoke commissions require an initial 50% deposit to commence timber selection and carving. The remaining balance plus freight charges is due prior to final crating and dispatch from our atelier.
            </p>

            <h3 className="font-serif text-lg text-[#4F2607]">3. International Customs & Duties</h3>
            <p>
              While Mukango Wa Africa provides complete export phytosanitary documentation and ISPM-15 certification, import duties, tariffs, or local VAT imposed by the destination country remain the responsibility of the consignee unless DDP terms are agreed in writing.
            </p>

            <h3 className="font-serif text-lg text-[#4F2607]">4. Governing Jurisdiction</h3>
            <p>
              These terms are governed by the commercial laws of Zambia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
