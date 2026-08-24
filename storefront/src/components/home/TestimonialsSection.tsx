import React from "react";
import { TESTIMONIALS } from "../../data/testimonials";
import { Quote, Star } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#F7F5F0] border-t border-[#D4B896]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-medium block mb-2">
            Patron Reflections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#4F2607] font-light">
            Loved Across the World
          </h2>
          <p className="text-sm font-light text-stone-600 mt-2">
            From private residences in Lisbon and London to safari lodges on the Zambezi.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-8 bg-white rounded border border-[#D4B896]/30 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Quote className="w-8 h-8 text-[#D4B896]" />
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm font-light text-stone-700 leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <p className="font-serif text-base font-normal text-[#4F2607]">{item.author}</p>
                <p className="text-xs text-stone-500 font-light">{item.roleOrLocation}</p>
                <span className="inline-block mt-2 text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#F7F5F0] text-[#8B6F47] rounded">
                  {item.commissionType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
