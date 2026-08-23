import { CartItem, PricingBreakdown, PaymentMethod, OrderStatus } from "./commerce";

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
}

export interface Address {
  streetLine1: string;
  streetLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export interface OrderRecord {
  id: string; // e.g. "MWA-2026-8941"
  reference: string; // internal UUID or hash
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  customer: CustomerDetails;
  shippingAddress: Address;
  billingAddress?: Address;
  items: CartItem[];
  pricing: PricingBreakdown;
  payment: {
    method: PaymentMethod;
    providerTransactionId?: string;
    paidAt?: string;
    gatewayStatus?: string;
    requiresManualVerification?: boolean;
  };
  specialInstructions?: string;
  timeline: {
    timestamp: string;
    status: OrderStatus;
    note: string;
  }[];
}

export interface CreateCheckoutSessionRequest {
  items: {
    productId: string;
    quantity: number;
    finishId: string;
    customEngraving?: string;
  }[];
  customer: CustomerDetails;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  shippingRateId?: string;
  idempotencyKey?: string;
}

export interface CreateCheckoutSessionResponse {
  orderId: string;
  reference: string;
  status: "redirect_required" | "invoice_created" | "config_error" | "validation_error";
  redirectUrl?: string;
  invoiceInstructions?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
    reference: string;
    amountDue: string;
  };
  errorMessage?: string;
  pricingAuthoritative: PricingBreakdown;
}
