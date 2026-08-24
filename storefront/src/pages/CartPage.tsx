import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { Button } from "../components/common/Button";
import { CartItemRow } from "../components/cart/CartItemRow";
import { formatCurrency } from "../utils/currency";
import { useToast } from "../context/ToastContext";
import { ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";

interface CartPageProps {
  onNavigate?: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, totalItemsCount, pricing, applyPromoCode, isValidating, clearCart } = useCart();
  const { showToast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    const res = await applyPromoCode(promoCode);
    setIsApplyingPromo(false);
    if (res.success) {
      showToast(res.message, "success");
      setPromoCode("");
    } else {
      showToast(res.message, "error");
    }
  };

  const handleProceedCheckout = () => {
    if (onNavigate) {
      onNavigate("/checkout");
    } else {
      window.location.href = "/checkout";
    }
  };

  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Enquiry Basket — Mukango Wa Africa"
        description="Review your selected handcrafted African hardwood furniture pieces and estimated crated freight."
        canonicalPath="/cart"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Enquiry Basket", href: "/cart" }]} />

        <div className="py-8 border-b border-[#D4B896]/30 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-semibold block mb-1">
              Review Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#4F2607] font-light">
              Your Commission Basket ({totalItemsCount})
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-stone-500 hover:text-[#C02B0A] transition"
            >
              Clear Basket
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto bg-white p-10 rounded border border-[#D4B896]/30 shadow-subtle my-8">
            <div className="w-16 h-16 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#8B6F47] mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-2xl text-[#4F2607] mb-2">Your basket is empty</h2>
            <p className="text-xs font-light text-stone-600 mb-6 leading-relaxed">
              Explore our catalogue to discover hand-carved dining tables, chairs, and credenzas.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => (onNavigate ? onNavigate("/shop") : (window.location.href = "/shop"))}
            >
              Browse Catalogue
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
            {/* Left: Items List */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded border border-[#D4B896]/30 shadow-subtle divide-y divide-[#D4B896]/20">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Right: Authoritative Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded border border-[#D4B896]/30 shadow-subtle space-y-6">
                <h3 className="font-serif text-xl text-[#4F2607] font-normal pb-4 border-b border-[#D4B896]/30">
                  Commission Breakdown
                </h3>

                <div className="space-y-3 text-xs text-stone-700 font-light">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="font-medium text-[#2D2A26]">{formatCurrency(pricing.subtotal, pricing.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phytosanitary Crated Freight:</span>
                    <span className="font-medium text-[#2D2A26]">{formatCurrency(pricing.shippingEstimate, pricing.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maritime/Air Transit Insurance:</span>
                    <span className="font-medium text-[#2D2A26]">{formatCurrency(pricing.insuranceAndHandling, pricing.currency)}</span>
                  </div>

                  {pricing.appliedDiscount && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Inaugural Privilege:</span>
                      <span>-{formatCurrency(pricing.appliedDiscount.amount, pricing.currency)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#D4B896]/30 flex justify-between text-base font-serif text-[#4F2607] font-semibold">
                    <span>Estimated Total:</span>
                    <span>{formatCurrency(pricing.total, pricing.currency)}</span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2 border-t border-stone-100">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (HEIRLOOM10)"
                      className="w-full pl-8 pr-2 py-2 text-xs bg-[#FAF9F6] border border-[#D4B896] rounded uppercase focus:outline-hidden focus:border-[#4F2607]"
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm" isLoading={isApplyingPromo}>
                    Apply
                  </Button>
                </form>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full shadow-md"
                  onClick={handleProceedCheckout}
                  isLoading={isValidating}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Checkout
                </Button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-light text-center">
                  <ShieldCheck className="w-4 h-4 text-[#8B6F47]" />
                  <span>25-Year Heirloom Warranty & Phytosanitary Export</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
