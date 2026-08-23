import React, { useEffect, useState } from "react";
import { SEO } from "../components/common/SEO";
import { Button } from "../components/common/Button";
import { OrderRecord } from "../types/order";
import { CheckCircle2, Building2, Copy, Check, Printer } from "lucide-react";
import { formatPrice } from "../utils/currency";

interface OrderConfirmationPageProps {
  reference?: string;
  orderId?: string;
  onNavigate?: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  reference,
  orderId,
  onNavigate,
}) => {
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const activeRef = reference || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("ref") : null);
  const activeOrderId = orderId || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("orderId") : null);

  useEffect(() => {
    if (!activeRef) {
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/checkout/order-status?ref=${encodeURIComponent(activeRef)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.order) {
            setOrder(json.order);
          }
        }
      } catch {
        // ignore
      }
    };

    fetchOrder();
  }, [activeRef]);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const displayOrderId = order?.id || activeOrderId || "MWA-2026-7782";

  return (
    <div className="py-16 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Commission Confirmation — Mukango Wa Africa"
        description="Your heirloom commission has been registered in the Mukango Wa Africa atelier records."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded border border-[#8B6F47]/50 shadow-card text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-semibold block mb-1">
            Order Reference Established
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#4F2607] font-light mb-3">
            Your Commission Is Registered
          </h1>

          <p className="text-sm font-light text-stone-600 max-w-md mx-auto leading-relaxed mb-6">
            Thank you for commissioning an heirloom with Mukango Wa Africa. Your order has been placed in our atelier production queue.
          </p>

          <div className="inline-block p-3 px-6 bg-[#F7F5F0] rounded border border-[#D4B896] font-mono text-sm text-[#4F2607] mb-8">
            Order ID: <strong>{displayOrderId}</strong>
          </div>

          {/* Pro-Forma Wire Instructions Box */}
          <div className="text-left bg-[#FAF9F6] p-6 sm:p-8 rounded border border-[#D4B896]/40 mb-8 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D4B896]/30">
              <Building2 className="w-5 h-5 text-[#8B6F47]" />
              <h3 className="font-serif text-lg text-[#4F2607] font-normal">
                SWIFT International Bank Wire Instructions
              </h3>
            </div>

            <p className="text-xs font-light text-stone-600">
              Please execute your bank wire transfer referencing your Order ID. Once funds clear into our primary treasury account, our woodcarvers begin timber selection.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Bank Name</span>
                  <span className="font-medium text-[#2D2A26]">First National Bank Zambia (FNB)</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Beneficiary Account</span>
                  <span className="font-medium text-[#2D2A26]">Mukango Wa Africa Artisans Ltd</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Account Number</span>
                  <span className="font-mono font-medium text-[#2D2A26]">6289-4019-2041</span>
                </div>
                <button
                  onClick={() => copyToClipboard("6289-4019-2041", "acc")}
                  className="p-1.5 text-stone-400 hover:text-[#4F2607]"
                  aria-label="Copy account number"
                >
                  {copiedField === "acc" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 bg-white rounded border border-stone-200 flex justify-between items-center">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">SWIFT / BIC Code</span>
                  <span className="font-mono font-medium text-[#2D2A26]">FIRNZMLX</span>
                </div>
                <button
                  onClick={() => copyToClipboard("FIRNZMLX", "swift")}
                  className="p-1.5 text-stone-400 hover:text-[#4F2607]"
                  aria-label="Copy SWIFT code"
                >
                  {copiedField === "swift" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900">
              <strong>Mandatory Reference:</strong> <code>{displayOrderId}</code>
            </div>
          </div>

          {order && (
            <div className="text-left bg-white p-6 rounded border border-stone-200 text-xs text-stone-700 space-y-2 mb-8">
              <h4 className="font-serif text-base text-[#4F2607] mb-2">Order Summary</h4>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold text-[#4F2607]">{formatPrice(order.pricing.total)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print Pro-Forma Invoice
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate ? onNavigate("/shop") : window.location.href = "/shop"}
            >
              Return to Atelier Catalogue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
