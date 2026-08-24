import React from "react";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { Plane, ShieldCheck, Box } from "lucide-react";

export const ShippingPage: React.FC = () => {
  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Shipping & Crated Freight — Mukango Wa Africa"
        description="Comprehensive phytosanitary ISPM-15 crated freight, customs documentation, maritime & air cargo insurance to 25+ countries."
        canonicalPath="/shipping"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Shipping & Global Freight", href: "/shipping" }]} />

        <div className="py-12 text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-semibold block mb-2">
            Logistics & Freight
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#4F2607] font-light mb-4">
            Global Crated Shipping
          </h1>
          <p className="text-sm font-light text-stone-600 leading-relaxed">
            Delivering solid Zambian hardwood masterpieces with extreme care to private residences, embassies, and safari lodges across the globe.
          </p>
        </div>

        <div className="space-y-8 bg-white p-8 md:p-10 rounded border border-[#D4B896]/30 shadow-subtle mb-16 text-sm font-light text-stone-700 leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl text-[#4F2607] mb-3 flex items-center gap-2">
              <Box className="w-5 h-5 text-[#8B6F47]" />
              <span>ISPM-15 Certified Phytosanitary Wooden Crates</span>
            </h2>
            <p>
              Every piece departing our Lusaka atelier is vacuum-wrapped in moisture-resistant vapor barrier film, padded with high-density archival foam, and bolted securely inside custom-built heat-treated timber crates certified to international ISPM-15 standards.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-100">
            <h2 className="font-serif text-2xl text-[#4F2607] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#8B6F47]" />
              <span>100% Comprehensive Transit Cargo Insurance</span>
            </h2>
            <p>
              All shipments include comprehensive door-to-port or door-to-door transit insurance covering all maritime, air, and overland legs against loss, water ingress, or impact damage.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-100">
            <h2 className="font-serif text-2xl text-[#4F2607] mb-3 flex items-center gap-2">
              <Plane className="w-5 h-5 text-[#8B6F47]" />
              <span>Estimated Delivery Lead Times</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="p-4 bg-[#FAF9F6] rounded border border-[#D4B896]/20">
                <strong className="block text-xs uppercase tracking-wider text-[#4F2607] mb-1">
                  Southern & Eastern Africa (SADC)
                </strong>
                <p className="text-xs text-stone-600">
                  5 to 10 business days via overland specialized furniture carrier.
                </p>
              </div>
              <div className="p-4 bg-[#FAF9F6] rounded border border-[#D4B896]/20">
                <strong className="block text-xs uppercase tracking-wider text-[#4F2607] mb-1">
                  Europe & United Kingdom
                 air freight (5–7 days) or consolidated ocean freight via Walvis Bay / Durban (25–35 days).
                </strong>
              </div>
              <div className="p-4 bg-[#FAF9F6] rounded border border-[#D4B896]/20">
                <strong className="block text-xs uppercase tracking-wider text-[#4F2607] mb-1">
                  North America (USA & Canada)
                </strong>
                <p className="text-xs text-stone-600">
                  Consolidated container freight (30–45 days) or priority air freight (7–10 days).
                </p>
              </div>
              <div className="p-4 bg-[#FAF9F6] rounded border border-[#D4B896]/20">
                <strong className="block text-xs uppercase tracking-wider text-[#4F2607] mb-1">
                  Middle East & Asia-Pacific
                </strong>
                <p className="text-xs text-stone-600">
                  Scheduled sea freight or direct cargo via Emirates / Ethiopian Airlines cargo hubs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
