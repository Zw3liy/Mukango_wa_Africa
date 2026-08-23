import React from "react";
import { Button } from "../common/Button";
import { MapPin, Phone, Mail, Clock, Compass } from "lucide-react";

interface ShowroomSectionProps {
  onNavigate?: (path: string) => void;
}

export const ShowroomSection: React.FC<ShowroomSectionProps> = ({ onNavigate }) => {
  const handleNav = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  return (
    <section className="py-24 bg-[#F7F5F0] border-t border-[#D4B896]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Information & Hours */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-medium block">
              Experience In Person
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#4F2607] leading-tight">
              Visit the Lusaka Showroom & Atelier
            </h2>
            <p className="text-sm font-light text-stone-700 leading-relaxed">
              Step directly inside our active carving studio. Watch master carvers sculpt Zambezi teak, touch raw cured timber slabs, and select custom grain patterns for your private commission.
            </p>

            <div className="space-y-4 pt-4 border-t border-[#D4B896]/30 text-sm font-light text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8B6F47] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-medium text-[#4F2607] block">Flagship Atelier & Gallery</strong>
                  <span>Plot 14, Kafue Road, Lusaka, Zambia</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#8B6F47] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-medium text-[#4F2607] block">Showroom Hours</strong>
                  <span>Monday — Friday: 08:30 – 17:30</span>
                  <br />
                  <span>Saturday: 09:30 – 15:00 (Sunday by private appointment)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8B6F47] shrink-0" />
                <span>+260 97 123 4567</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#8B6F47] shrink-0" />
                <span>hello@mukangowaafrica.com</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleNav("/contact")}
              >
                Schedule Private Atelier Walkthrough
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => handleNav("/bespoke")}
                leftIcon={<Compass className="w-4 h-4" />}
              >
                Commission Bespoke Suite
              </Button>
            </div>
          </div>

          {/* Visual Atelier Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded overflow-hidden shadow-2xl border border-[#D4B896]/40 aspect-4/3 bg-stone-900">
              <img
                src="/images/hero.jpg"
                alt="Mukango Wa Africa Showroom and Atelier Lusaka"
                className="w-full h-full object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4B896] block">
                    Lusaka, Zambia
                  </span>
                  <h4 className="font-serif text-xl font-light text-white">
                    Private Consultations & Wood Library
                  </h4>
                </div>
                <span className="text-xs px-2.5 py-1 bg-[#8B6F47] text-white rounded font-medium">
                  Open Today
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
