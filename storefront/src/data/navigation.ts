export interface NavLinkItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export const MAIN_NAV: NavLinkItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Craftsmanship", href: "/craftsmanship" },
  { label: "Our Story", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_SHOP_LINKS: NavLinkItem[] = [
  { label: "All Furniture", href: "/shop" },
  { label: "Chairs & Seating", href: "/shop?category=chairs" },
  { label: "Dining & Coffee Tables", href: "/shop?category=tables" },
  { label: "Storage & Credenzas", href: "/shop?category=storage" },
  { label: "Lighting & Accents", href: "/shop?category=accents" },
  { label: "Bespoke Commissions", href: "/bespoke" },
];

export const FOOTER_COMPANY_LINKS: NavLinkItem[] = [
  { label: "Our Story & Atelier", href: "/about" },
  { label: "Zambian Hardwoods", href: "/craftsmanship" },
  { label: "Journal & Stories", href: "/journal" },
  { label: "Showroom Lusaka", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export const FOOTER_LEGAL_LINKS: NavLinkItem[] = [
  { label: "Shipping & Crated Freight", href: "/shipping" },
  { label: "25-Year Guarantee & Returns", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
