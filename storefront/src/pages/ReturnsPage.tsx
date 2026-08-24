import React from "react";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { ShieldCheck, Award, FileCheck } from "lucide-react";

export const ReturnsPage: React.FC = () => {
  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="25-Year Heirloom Guarantee & Returns — Mukango Wa Africa"
        description="Our structural guarantee covers 25 years against joint failure and timber delamination. Read our inspection and returns protocol."
        canonicalPath="/returns"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "25-Year Guarantee & Returns", href: "/returns" }]} />

        <div className="py-12 text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-semibold block mb-2">
            The Mukango Promise
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#4F2607] font-light mb-4">
            25-Year Heirloom Guarantee
          </h1>
          <p className="text-sm font-light text-stone-600 leading-relaxed">
            We build our furniture to outlive its makers. Every piece that leaves our Lusaka studio is backed by our quarter-century structural commitment.
          </p>
        </div>

        <div className="space-y-8 bg-white p-8 md:p-10 rounded border border-[#D4B896]/30 shadow-subtle mb-16 text-sm font-light text-stone-700 leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl text-[#4F2607] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#8B6F47]" />
              <span>What Is Covered</span>
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Structural mortise-and-tenon joint failure or loosening under normal residential and indoor hospitality use.</li>
              <li>Timber delamination, internal wood fractures, or structural cleavage caused by curing or seasoning defects.</li>
              <li>Failure of hand-carved relief panels or through-pegged wooden fasteners.</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-stone-100">
            <h2 className="font-serif text-2xl text-[#4F2607] mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#8B6F47]" />
              <span>Certificate of Authenticity & Registry</span>
            </h2>
            <p>
              Each work is branded with a unique atelier serial number and accompanied by a physical parchment Certificate of Authenticity signed by Founder Chiwama Kennedy Daka. This certificate is transferable across generations and serves as proof of provenance for art appraisers and auction registries.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-100">
            <h2 className="font-serif text-2xl text-[#4F2607] mb-3 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#8B6F47]" />
              <span>Returns & Transit Inspection Protocol</span>
            </h2>
            <p>
              Upon receipt of your crate, we request that you or your white-glove receiving agent inspect the external crate tamper seals. In the rare event of transit damage, notify us within 7 days with photographs. We will arrange on-site artisan restoration or return shipment for complete replacement at our full expense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
