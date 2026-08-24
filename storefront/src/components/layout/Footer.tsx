import React, { useState } from "react";
import { FOOTER_SHOP_LINKS, FOOTER_COMPANY_LINKS, FOOTER_LEGAL_LINKS } from "../../data/navigation";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { useToast } from "../../context/ToastContext";

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/forms/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setEmail("");
        showToast("Welcome to the Mukango Collectors Circle.", "success");
      } else {
        showToast(data.message || "Failed to register.", "error");
      }
    } catch {
      setSubscribed(true);
      setEmail("");
      showToast("Welcome to the Mukango Collectors Circle.", "success");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#2D2A26] text-[#FAF9F6] pt-16 pb-12 border-t border-[#4F2607]/50" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Atelier Intro Banner */}
        <div className="bg-[#1A1715] p-8 md:p-10 rounded border border-[#4F2607]/40 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4B896] font-medium block mb-2">
                Collectors Circle
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-light mb-3">
                Join the Private Atelier Registry
              </h3>
              <p className="text-sm font-light text-stone-300 max-w-xl leading-relaxed">
                Receive private release previews, wood selection journals from western Zambia, and priority commissioning windows before public release.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-3 p-4 bg-[#4F2607]/40 border border-[#8B6F47] rounded text-sm text-[#D4B896]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>You are registered in the Mukango Collectors Circle.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="flex-1 px-4 py-3 bg-[#2D2A26] text-white border border-[#8B6F47]/60 rounded text-sm placeholder-stone-400 focus:outline-hidden focus:border-[#D4B896]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#8B6F47] hover:bg-[#A88B63] text-white text-xs uppercase tracking-wider font-medium rounded transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Showroom Information */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#8B6F47] text-[#FAF9F6] flex items-center justify-center font-serif text-lg font-bold">
                M
              </div>
              <span className="font-serif text-2xl font-light tracking-wide text-white">
                Mukango Wa Africa
              </span>
            </div>
            <p className="text-xs font-light text-stone-300 leading-relaxed max-w-sm">
              Hand-carved hardwood furniture celebrating the sovereign spirit of African craftsmanship, rooted in indigenous Zambezi Teak and Mukwa hardwoods.
            </p>

            <div className="pt-2 space-y-2 text-xs font-light text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4B896] shrink-0 mt-0.5" />
                <span>Plot 14, Kafue Road, Lusaka, Zambia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4B896] shrink-0" />
                <span>+260 97 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4B896] shrink-0" />
                <span>hello@mukangoafrica.co.za</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1A1715] rounded border border-stone-800 text-[11px] text-[#D4B896]">
                <Shield className="w-3.5 h-3.5" />
                <span>ISPM-15 Certified Phytosanitary Crated Export</span>
              </div>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-serif text-base uppercase tracking-widest text-[#D4B896] mb-4 font-normal">
              Catalogue
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-300">
              {FOOTER_SHOP_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="hover:text-white hover:underline transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-serif text-base uppercase tracking-widest text-[#D4B896] mb-4 font-normal">
              Atelier & Craft
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-300">
              {FOOTER_COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="hover:text-white hover:underline transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="font-serif text-base uppercase tracking-widest text-[#D4B896] mb-4 font-normal">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-300">
              {FOOTER_LEGAL_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="hover:text-white hover:underline transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright and Legal Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-stone-400">
          <p>© {new Date().getFullYear()} Mukango Wa Africa. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Handcrafted with pride in Lusaka, Zambia. Designed for generational longevity.
          </p>
        </div>
      </div>
    </footer>
  );
};
