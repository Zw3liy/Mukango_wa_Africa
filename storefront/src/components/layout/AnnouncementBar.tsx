import React from "react";
import { ShieldCheck, Plane, Award } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  return (
    <aside
      aria-label="Global Announcements"
      className="bg-[#2D2A26] text-[#FAF9F6] text-[11px] font-light py-2 px-4 border-b border-[#4F2607]/40 tracking-wider uppercase"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Plane className="w-3.5 h-3.5 text-[#D4B896]" aria-hidden="true" />
          <span>Phytosanitary Crated Freight to 25+ Countries</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-stone-300">
          <Award className="w-3.5 h-3.5 text-[#D4B896]" aria-hidden="true" />
          <span>Sustainably Sourced Indigenous Zambian Hardwoods</span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4B896]" aria-hidden="true" />
          <span>25-Year Heirloom Structural Warranty</span>
        </div>
      </div>
    </aside>
  );
};
