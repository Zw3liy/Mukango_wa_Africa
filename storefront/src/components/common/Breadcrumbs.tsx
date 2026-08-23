import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { generateBreadcrumbsJsonLd } from "../../utils/seo";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const jsonLdData = generateBreadcrumbsJsonLd(
    [{ name: "Home", path: "/" }, ...items.map((i) => ({ name: i.label, path: i.href || "" }))]
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdData }}
      />
      <nav aria-label="Breadcrumb" className="py-4 text-xs font-light text-stone-500">
        <ol className="flex items-center flex-wrap gap-2">
          <li className="flex items-center">
            <a
              href="/"
              className="flex items-center gap-1 hover:text-[#4F2607] transition"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </a>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" aria-hidden="true" />
                {isLast || !item.href ? (
                  <span className="text-[#4F2607] font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <a href={item.href} className="hover:text-[#4F2607] transition">
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
