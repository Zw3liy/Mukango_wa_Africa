import React, { useEffect } from "react";
import { MAIN_NAV } from "../../data/navigation";
import { X, Phone, Mail, MapPin } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentPath = "/",
  onNavigate,
}) => {
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLink = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.href = href;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2A26]/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#FAF9F6] text-[#2D2A26] shadow-2xl border-r border-[#D4B896] z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#D4B896]/30 flex items-center justify-between bg-[#F7F5F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4F2607] text-[#FAF9F6] flex items-center justify-center font-serif text-sm font-bold">
              M
            </div>
            <span className="font-serif text-lg text-[#4F2607] font-medium">Mukango Wa Africa</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-[#4F2607] rounded"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links */}
        <nav className="p-6 space-y-2 flex-1" aria-label="Mobile menu links">
          {MAIN_NAV.map((link) => {
            const isActive = currentPath === link.href || (link.href !== "/" && currentPath.startsWith(link.href));
            return (
              <button
                key={link.href}
                onClick={() => handleLink(link.href)}
                className={`w-full text-left py-3 px-4 rounded text-sm tracking-wider uppercase transition font-medium flex items-center justify-between ${
                  isActive
                    ? "bg-[#4F2607] text-[#FAF9F6]"
                    : "text-stone-700 hover:bg-[#F7F5F0] hover:text-[#4F2607]"
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#D4B896]" />}
              </button>
            );
          })}
        </nav>

        {/* Workshop Contact Box */}
        <div className="p-6 bg-[#F7F5F0] border-t border-[#D4B896]/30 text-xs text-stone-600 space-y-3 font-light">
          <p className="font-serif text-sm font-normal text-[#4F2607] uppercase tracking-wider">
            Lusaka Atelier & Showroom
          </p>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#7A6039] shrink-0 mt-0.5" />
            <span>Plot 14, Kafue Road, Lusaka, Zambia</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#7A6039] shrink-0" />
            <span>+260 97 123 4567</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#7A6039] shrink-0" />
            <span>hello@mukangoafrica.co.za</span>
          </div>
        </div>
      </div>
    </div>
  );
};
