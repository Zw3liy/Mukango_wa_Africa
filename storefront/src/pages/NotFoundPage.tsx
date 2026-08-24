import React from "react";
import { SEO } from "../components/common/SEO";
import { Button } from "../components/common/Button";
import { Home, ShoppingBag } from "lucide-react";

interface NotFoundPageProps {
  onNavigate?: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-24 bg-[#FAF9F6] min-h-[70vh] flex items-center justify-center">
      <SEO
        title="404 — Page Not Found — Mukango Wa Africa"
        description="The requested page could not be located in the Mukango Wa Africa atelier."
      />

      <div className="max-w-lg mx-auto px-4 text-center">
        <span className="font-serif text-6xl text-[#D4B896] block mb-2 font-light">404</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#4F2607] font-light mb-4">
          Woodland Path Not Found
        </h1>
        <p className="text-sm font-light text-stone-600 mb-8 leading-relaxed">
          The atelier page, product archive, or journal issue you were seeking does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate ? onNavigate("/") : window.location.href = "/"}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Return Home
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate ? onNavigate("/shop") : window.location.href = "/shop"}
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            Browse Catalogue
          </Button>
        </div>
      </div>
    </div>
  );
};
