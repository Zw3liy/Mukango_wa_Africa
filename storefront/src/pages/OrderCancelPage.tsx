import React from "react";
import { SEO } from "../components/common/SEO";
import { Button } from "../components/common/Button";
import { AlertCircle, ShoppingBag, MessageSquare } from "lucide-react";

interface OrderCancelPageProps {
  onNavigate?: (path: string) => void;
}

export const OrderCancelPage: React.FC<OrderCancelPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Commission Payment Cancelled — Mukango Wa Africa"
        description="Checkout payment was not completed."
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-10 rounded border border-[#D4B896]/40 shadow-subtle text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h1 className="font-serif text-3xl text-[#4F2607] font-light mb-3">
            Payment Cancelled
          </h1>

          <p className="text-sm font-light text-stone-600 leading-relaxed mb-8">
            Your transaction was not completed. No charges were made to your account. Your items remain saved in your enquiry basket.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate ? onNavigate("/cart") : window.location.href = "/cart"}
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              Return to Basket
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate ? onNavigate("/contact") : window.location.href = "/contact"}
              leftIcon={<MessageSquare className="w-4 h-4" />}
            >
              Contact Atelier Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
