import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { CartItemRow } from "./CartItemRow";
import { Button } from "../common/Button";
import { formatCurrency } from "../../utils/currency";
import { X, ShoppingBag, ShieldCheck, ArrowRight, Tag } from "lucide-react";
import { useToast } from "../../context/ToastContext";

interface CartDrawerProps {
  onNavigate?: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { isCartOpen, closeCart, items, totalItemsCount, pricing, applyPromoCode, isValidating } = useCart();
  const { showToast } = useToast();
  const [promoInput, setPromoInput] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    if (onNavigate) {
      onNavigate("/checkout");
    } else {
      window.location.href = "/checkout";
    }
  };

  const handleExploreShop = () => {
    closeCart();
    if (onNavigate) {
      onNavigate("/shop");
    } else {
      window.location.href = "/shop";
    }
  };

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setIsApplyingPromo(true);
    const res = await applyPromoCode(promoInput);
    setIsApplyingPromo(false);

    if (res.success) {
      showToast(res.message, "success");
      setPromoInput("");
    } else {
      showToast(res.message, "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2A26]/75 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FAF9F6] text-[#2D2A26] shadow-2xl border-l border-[#D4B896] z-10 flex flex-col h-full overflow-hidden animate-fade-in">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#D4B896]/30 bg-[#F7F5F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#4F2607]" />
            <h2 id="cart-drawer-title" className="font-serif text-xl font-normal text-[#4F2607]">
              Enquiry Basket ({totalItemsCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-stone-500 hover:text-[#4F2607] hover:bg-stone-200/50 rounded transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#7A6039] mb-4">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl text-[#4F2607] mb-2">Your basket is empty</h3>
              <p className="text-xs font-light text-stone-600 mb-6 max-w-xs">
                Explore our curated hardwood dining tables, throned armchairs, and credenzas.
              </p>
              <Button variant="primary" size="md" onClick={handleExploreShop}>
                Browse Catalogue
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="divide-y divide-[#D4B896]/20">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>

              {/* Promo code bar */}
              <div className="pt-4 mt-4 border-t border-[#D4B896]/30">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. HEIRLOOM10)"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D4B896] rounded uppercase focus:outline-hidden focus:border-[#4F2607]"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    isLoading={isApplyingPromo}
                    disabled={!promoInput.trim()}
                  >
                    Apply
                  </Button>
                </form>

                {pricing.appliedDiscount && (
                  <div className="mt-2 p-2 bg-emerald-50 text-emerald-800 rounded text-xs flex items-center justify-between">
                    <span>Code {pricing.appliedDiscount.code} applied (10% off)</span>
                    <span className="font-semibold">-{formatCurrency(pricing.appliedDiscount.amount, pricing.currency)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 bg-[#F7F5F0] border-t border-[#D4B896]/40 space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-medium text-[#2D2A26]">{formatCurrency(pricing.subtotal, pricing.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Crated Freight:</span>
                <span className="font-medium text-[#2D2A26]">{formatCurrency(pricing.shippingEstimate, pricing.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance & Transit Handling:</span>
                <span className="font-medium text-[#2D2A26]">{formatCurrency(pricing.insuranceAndHandling, pricing.currency)}</span>
              </div>
              {pricing.appliedDiscount && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Inaugural Privilege:</span>
                  <span>-{formatCurrency(pricing.appliedDiscount.amount, pricing.currency)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#D4B896]/30 flex justify-between text-base font-serif text-[#4F2607] font-semibold">
                <span>Estimated Total:</span>
                <span>{formatCurrency(pricing.total, pricing.currency)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleCheckout}
              isLoading={isValidating}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Commission Checkout
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-light">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7A6039]" />
              <span>ISPM-15 Certified Phytosanitary Crated Freight</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
