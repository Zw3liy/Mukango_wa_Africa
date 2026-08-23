import React, { useState, useEffect } from "react";
import { MAIN_NAV } from "../../data/navigation";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { MobileNav } from "./MobileNav";

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = "/", onNavigate }) => {
  const { totalItemsCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const target = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
      if (onNavigate) {
        onNavigate(target);
      } else {
        window.location.href = target;
      }
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF9F6]/95 backdrop-blur-md shadow-xs border-b border-[#D4B896]/30 py-3.5"
            : "bg-[#FAF9F6] border-b border-[#D4B896]/20 py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#4F2607] hover:bg-stone-100 rounded transition"
              aria-label="Open Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, "/")}
              className="flex items-center gap-3 group focus-visible:outline-hidden"
              aria-label="Mukango Wa Africa Homepage"
            >
              <div className="w-10 h-10 rounded-full bg-[#4F2607] text-[#FAF9F6] flex items-center justify-center font-serif text-xl font-bold tracking-tight shadow-xs group-hover:bg-[#6E3B13] transition">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-light tracking-wide text-[#4F2607] leading-tight">
                  Mukango Wa Africa
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase font-light text-[#8B6F47]">
                  Zambian Hardwood Atelier
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
              {MAIN_NAV.map((link) => {
                const isActive = currentPath === link.href || (link.href !== "/" && currentPath.startsWith(link.href));
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`text-sm tracking-wider uppercase transition-colors relative py-1 ${
                      isActive
                        ? "text-[#4F2607] font-semibold"
                        : "text-stone-600 hover:text-[#4F2607] font-light"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8B6F47] rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className="p-2 text-stone-700 hover:text-[#4F2607] hover:bg-stone-100 rounded-full transition relative"
                aria-label="Search Catalogue"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="flex items-center gap-2 px-3 py-2 text-stone-700 hover:text-[#4F2607] hover:bg-stone-100 rounded-full transition relative"
                aria-label={`Shopping Bag (${totalItemsCount} items)`}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-[#4F2607]" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#8B6F47] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline-block text-xs font-medium tracking-wider uppercase text-stone-700">
                  Cart
                </span>
              </button>
            </div>
          </div>

          {/* Expandable Search Input Bar */}
          {isSearchOpen && (
            <div className="mt-3 pt-3 border-t border-[#D4B896]/30 animate-fade-in">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chairs, dining tables, baobab credenza, teak..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#D4B896] rounded text-sm text-[#2D2A26] placeholder-stone-400 focus:outline-hidden focus:border-[#4F2607]"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4F2607] text-[#FAF9F6] text-xs uppercase tracking-wider font-medium rounded hover:bg-[#6E3B13] transition"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-700"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={currentPath}
        onNavigate={onNavigate}
      />
    </>
  );
};
