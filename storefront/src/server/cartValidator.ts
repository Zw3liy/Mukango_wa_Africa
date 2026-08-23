import { PRODUCTS } from "../data/products";
import { WOOD_FINISHES } from "../data/timbers";
import { CartItem, PricingBreakdown, Currency } from "../types/commerce";

export interface CartValidationInput {
  items: {
    productId: string;
    quantity: number;
    finishId?: string;
    customEngraving?: string;
  }[];
  currency?: Currency;
  shippingCountry?: string;
  promoCode?: string;
}

export interface CartValidationResult {
  isValid: boolean;
  authoritativeItems: CartItem[];
  pricing: PricingBreakdown;
  warnings: string[];
  errors: string[];
}

export function validateCartServerSide(input: CartValidationInput): CartValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const authoritativeItems: CartItem[] = [];

  if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
    return {
      isValid: false,
      authoritativeItems: [],
      pricing: {
        currency: input.currency || "USD",
        subtotal: 0,
        shippingEstimate: 0,
        insuranceAndHandling: 0,
        taxEstimate: 0,
        total: 0,
        isServerAuthoritative: true,
        validatedAt: new Date().toISOString(),
      },
      warnings: [],
      errors: ["Cart is empty."],
    };
  }

  let subtotalUsd = 0;

  for (const itemInput of input.items) {
    const product = PRODUCTS.find((p) => p.id === itemInput.productId || p.slug === itemInput.productId);
    if (!product) {
      errors.push(`Item '${itemInput.productId}' does not exist in the authoritative catalogue.`);
      continue;
    }

    const qty = Math.max(1, Math.min(10, Math.floor(Number(itemInput.quantity) || 1)));
    if (qty > product.inStockCount) {
      warnings.push(
        `Requested quantity (${qty}) for ${product.name} exceeds available quick-ship stock (${product.inStockCount}). Item will be crafted on bespoke lead time (${product.leadTimeWeeks} weeks).`
      );
    }

    const finish = WOOD_FINISHES.find((f) => f.id === itemInput.finishId) || WOOD_FINISHES[0];

    const cartItem: CartItem = {
      id: `${product.id}-${finish.id}`,
      productId: product.id,
      product: product,
      quantity: qty,
      selectedFinish: finish,
      customEngraving: itemInput.customEngraving ? String(itemInput.customEngraving).slice(0, 50) : undefined,
      addedAt: new Date().toISOString(),
    };

    authoritativeItems.push(cartItem);
    subtotalUsd += product.basePriceUsd * qty;
  }

  if (authoritativeItems.length === 0) {
    return {
      isValid: false,
      authoritativeItems: [],
      pricing: {
        currency: input.currency || "USD",
        subtotal: 0,
        shippingEstimate: 0,
        insuranceAndHandling: 0,
        taxEstimate: 0,
        total: 0,
        isServerAuthoritative: true,
        validatedAt: new Date().toISOString(),
      },
      warnings,
      errors,
    };
  }

  // Authoritative shipping & crating calculation
  // For luxury handcrafted furniture, crating and insured freight scale with item weight/dimensions
  const totalItemsCount = authoritativeItems.reduce((acc, i) => acc + i.quantity, 0);
  const baseShippingRate = 180; // Insured baseline crate shipment
  const perAdditionalItemShipping = 80;
  const shippingEstimate = baseShippingRate + (totalItemsCount - 1) * perAdditionalItemShipping;

  // Insurance & white glove handling (1.5% of value)
  const insuranceAndHandling = Math.round(subtotalUsd * 0.015);

  // International export tax estimate (0% export duty from Zambia with SADC/AGOA duty exemptions)
  const taxEstimate = 0;

  // Promo code validation
  let appliedDiscount: PricingBreakdown["appliedDiscount"] = undefined;
  if (input.promoCode) {
    const code = input.promoCode.trim().toUpperCase();
    if (code === "HEIRLOOM10") {
      const discountAmount = Math.round(subtotalUsd * 0.1);
      appliedDiscount = {
        code: "HEIRLOOM10",
        amount: discountAmount,
        description: "Collectors Circle 10% Inaugural Commission Privilege",
      };
    } else {
      warnings.push(`Promotional code '${input.promoCode}' is invalid or expired.`);
    }
  }

  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const total = Math.max(0, subtotalUsd + shippingEstimate + insuranceAndHandling + taxEstimate - discountAmount);

  const pricing: PricingBreakdown = {
    currency: "USD",
    subtotal: subtotalUsd,
    shippingEstimate,
    insuranceAndHandling,
    taxEstimate,
    appliedDiscount,
    total,
    isServerAuthoritative: true,
    validatedAt: new Date().toISOString(),
  };

  return {
    isValid: errors.length === 0,
    authoritativeItems,
    pricing,
    warnings,
    errors,
  };
}
