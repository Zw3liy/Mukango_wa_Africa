import React, { useState } from "react";
import { FAQS } from "../data/faqs";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export const FaqPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(FAQS[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Frequently Asked Questions — Mukango Wa Africa"
        description="Find answers regarding our indigenous hardwoods, solar kiln seasoning, bespoke commissions, international crated shipping, and 25-year heirloom guarantee."
        canonicalPath="/faq"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Frequently Asked Questions", href: "/faq" }]} />

        <div className="py-12 text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-[0.2em] text-[#7A6039] font-semibold block mb-2">
            Patron Inquiries
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#4F2607] font-light mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm font-light text-stone-600 leading-relaxed">
            Everything you need to know about our craftsmanship, timber stability, bespoke lead times, and global white-glove crated delivery.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-20">
          {FAQS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded border border-[#D4B896]/30 overflow-hidden shadow-subtle transition"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif text-lg text-[#4F2607] hover:text-[#7A6039] transition"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#7A6039] shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-stone-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm font-light text-stone-700 leading-relaxed border-t border-[#D4B896]/20 bg-[#FAF9F6]/50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
