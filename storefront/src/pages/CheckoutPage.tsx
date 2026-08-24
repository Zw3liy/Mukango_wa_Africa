import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { Button } from "../components/common/Button";
import { formatPrice, formatCurrency } from "../utils/currency";
import { PaymentMethod } from "../types/commerce";
import { useToast } from "../context/ToastContext";
import { ShieldCheck, CreditCard, Building2, Lock, AlertCircle, ArrowRight } from "lucide-react";

interface CheckoutPageProps {
  onNavigate?: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, pricing, clearCart } = useCart();
  const { showToast } = useToast();

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    streetLine1: "",
    streetLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "South Africa",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wire_transfer");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <SEO title="Checkout — Mukango Wa Africa" description="Commission checkout" />
        <h1 className="font-serif text-3xl text-[#4F2607] mb-4">Your Basket Is Empty</h1>
        <p className="text-sm font-light text-stone-600 mb-8">
          Please add items to your basket before proceeding to checkout.
        </p>
        <Button variant="primary" size="md" onClick={() => onNavigate ? onNavigate("/shop") : window.location.href = "/shop"}>
          Browse Catalogue
        </Button>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    const payload = {
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        finishId: i.selectedFinish.id,
        customEngraving: i.customEngraving,
      })),
      customer,
      shippingAddress,
      paymentMethod,
    };

    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status === "redirect_required" && data.redirectUrl) {
        // Redirect to external Stripe / PayFast gateway
        window.location.href = data.redirectUrl;
        return;
      }

      if (response.ok && data.status === "invoice_created") {
        // Wire transfer / Invoice Pro-forma
        clearCart();
        const confirmUrl = `/checkout/confirmation?ref=${data.reference}&orderId=${data.orderId}`;
        if (onNavigate) {
          onNavigate(confirmUrl);
        } else {
          window.location.href = confirmUrl;
        }
        return;
      }

      // Handle configuration or validation error honestly
      setErrorMessage(
        data.errorMessage ||
          (data.status === "config_error"
            ? `Payment provider '${paymentMethod}' is not configured in this environment.`
            : "Failed to create checkout session.")
      );
      showToast(data.errorMessage || "Checkout error encountered.", "error");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Network error during checkout.");
      showToast("Checkout connection failed.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Commission Checkout — Mukango Wa Africa"
        description="Complete your order for handcrafted African hardwood furniture with international freight crating."
        canonicalPath="/checkout"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Basket", href: "/cart" },
            { label: "Checkout" },
          ]}
        />

        <div className="py-8 border-b border-[#D4B896]/30 mb-8">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-semibold block mb-1">
            Authoritative Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#4F2607] font-light">
            Finalize Your Atelier Commission
          </h1>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          {/* Left Column: Customer & Shipping & Payment Options */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Information */}
            <div className="bg-white p-6 sm:p-8 rounded border border-[#D4B896]/40 shadow-subtle space-y-4">
              <h3 className="font-serif text-xl text-[#4F2607] font-normal pb-3 border-b border-[#D4B896]/20">
                1. Patron Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.firstName}
                    onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                    className="w-full text-xs p-3 bg-[#FAF9F6] border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.lastName}
                    onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                    className="w-full text-xs p-3 bg-[#FAF9F6] border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full text-xs p-3 bg-[#FAF9F6] border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="For freight delivery driver coordination"
                    className="w-full text-xs p-3 bg-[#FAF9F6] border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                  Estate / Lodge / Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={customer.company}
                  onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                  className="w-full text-xs p-3 bg-[#FAF9F6] border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                />
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white p-6 sm:p-8 rounded border border-[#D4B896]/40 shadow-subtle space-y-4">
              <h3 className="font-serif text-xl text-[#4F2607] font-normal pb-3 border-b border-[#D4B896]/20">
                2. Phytosanitary Freight Destination
              </h3>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                  Street Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.streetLine1}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, streetLine1: e.target.value })}
                  placeholder="Street name and building / villa number"
                  className="w-full text-xs p-3 bg-[#FAF9F6] border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full text-xs p-3 bg-[#FAF9F6] border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                    State / Province / Region
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.stateProvince}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, stateProvince: e.target.value })}
                    className="w-full text-xs p-3 bg-[#FAF9F6] border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                    Postal / ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full text-xs p-3 bg-[#FAF9F6] border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-600 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full text-xs p-3 bg-[#FAF9F6] border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="bg-white p-6 sm:p-8 rounded border border-[#D4B896]/40 shadow-subtle space-y-4">
              <h3 className="font-serif text-xl text-[#4F2607] font-normal pb-3 border-b border-[#D4B896]/20">
                3. Payment Gateway Boundary
              </h3>

              <div className="space-y-3">
                {/* Wire Transfer Option */}
                <label
                  className={`p-4 rounded border flex items-start gap-3 cursor-pointer transition ${
                    paymentMethod === "wire_transfer"
                      ? "bg-[#FAF9F6] border-[#4F2607] ring-1 ring-[#4F2607]"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wire_transfer"
                    checked={paymentMethod === "wire_transfer"}
                    onChange={() => setPaymentMethod("wire_transfer")}
                    className="mt-1 text-[#4F2607] accent-[#4F2607]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#8B6F47]" />
                      <span className="font-medium text-xs text-[#2D2A26] uppercase tracking-wider">
                        Direct Bank Wire / SWIFT Pro-Forma Invoice (Preferred)
                      </span>
                    </div>
                    <p className="text-xs font-light text-stone-600 mt-1">
                      Generates an official Pro-Forma invoice with First National Bank / Standard Chartered Lusaka SWIFT coordinates.
                    </p>
                  </div>
                </label>

                {/* Stripe Option */}
                <label
                  className={`p-4 rounded border flex items-start gap-3 cursor-pointer transition ${
                    paymentMethod === "stripe"
                      ? "bg-[#FAF9F6] border-[#4F2607] ring-1 ring-[#4F2607]"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="mt-1 text-[#4F2607] accent-[#4F2607]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#8B6F47]" />
                      <span className="font-medium text-xs text-[#2D2A26] uppercase tracking-wider">
                        Credit / Debit Card (Stripe Gateway)
                      </span>
                    </div>
                    <p className="text-xs font-light text-stone-600 mt-1">
                      Secure international credit card processing. Requires server STRIPE_SECRET_KEY.
                    </p>
                  </div>
                </label>

                {/* PayFast Option */}
                <label
                  className={`p-4 rounded border flex items-start gap-3 cursor-pointer transition ${
                    paymentMethod === "payfast"
                      ? "bg-[#FAF9F6] border-[#4F2607] ring-1 ring-[#4F2607]"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="payfast"
                    checked={paymentMethod === "payfast"}
                    onChange={() => setPaymentMethod("payfast")}
                    className="mt-1 text-[#4F2607] accent-[#4F2607]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#8B6F47]" />
                      <span className="font-medium text-xs text-[#2D2A26] uppercase tracking-wider">
                        PayFast (South Africa / SADC Instant EFT)
                      </span>
                    </div>
                    <p className="text-xs font-light text-stone-600 mt-1">
                      Regional African payment gateway. Requires PAYFAST_MERCHANT_ID.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-4 bg-red-50 rounded border border-red-200 text-[#C02B0A] text-xs flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="block font-semibold mb-0.5">Integration Report:</strong>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Authoritative Total */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded border border-[#D4B896]/40 shadow-subtle space-y-6 sticky top-28">
              <h3 className="font-serif text-xl text-[#4F2607] font-normal pb-4 border-b border-[#D4B896]/30">
                Order Review ({items.length} pieces)
              </h3>

              {/* Items Miniature List */}
              <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto space-y-2 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.product.images.hero}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover rounded border shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-medium text-[#2D2A26] block truncate">{item.product.name}</span>
                        <span className="text-[10px] text-stone-400">Qty: {item.quantity} • {item.selectedFinish.name}</span>
                      </div>
                    </div>
                    <span className="font-medium shrink-0">{formatPrice(item.product.basePriceUsd * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2.5 text-xs text-stone-700 font-light pt-4 border-t border-[#D4B896]/30">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-[#2D2A26]">{formatCurrency(pricing.subtotal, pricing.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phytosanitary Crated Freight:</span>
                  <span className="font-medium text-[#2D2A26]">{formatCurrency(pricing.shippingEstimate, pricing.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transit Insurance:</span>
                  <span className="font-medium text-[#2D2A26]">{formatCurrency(pricing.insuranceAndHandling, pricing.currency)}</span>
                </div>
                {pricing.appliedDiscount && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({pricing.appliedDiscount.code}):</span>
                    <span>-{formatCurrency(pricing.appliedDiscount.amount, pricing.currency)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#D4B896]/30 flex justify-between text-lg font-serif text-[#4F2607] font-semibold">
                  <span>Authoritative Total:</span>
                  <span>{formatCurrency(pricing.total, pricing.currency)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-lg"
                isLoading={isProcessing}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Confirm Commission & Place Order
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-light text-center">
                <ShieldCheck className="w-4 h-4 text-[#8B6F47]" />
                <span>Strict Security Boundary • 25-Year Heirloom Warranty</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
