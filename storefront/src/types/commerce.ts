import { Product, WoodFinish } from "./product";

export type Currency = "USD" | "ZAR" | "EUR" | "GBP" | "ZMW";

export interface CartItem {
  id: string; // generated unique key: `${productId}-${finishId}`
  productId: string;
  product: Product;
  quantity: number;
  selectedFinish: WoodFinish;
  customEngraving?: string;
  addedAt: string;
}

export interface PricingBreakdown {
  currency: Currency;
  subtotal: number;
  shippingEstimate: number;
  insuranceAndHandling: number;
  taxEstimate: number;
  total: number;
  appliedDiscount?: {
    code: string;
    amount: number;
    description: string;
  };
  isServerAuthoritative: boolean;
  validatedAt: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  carrier: string;
  estimatedDays: string;
  priceUsd: number;
  isInsuredCratedDelivery: boolean;
}

export type PaymentMethod = "stripe" | "payfast" | "wire_transfer" | "bespoke_invoice";

export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "payment_authorized"
  | "paid"
  | "in_production"
  | "carving"
  | "quality_inspection"
  | "crated_for_dispatch"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "refunded";
