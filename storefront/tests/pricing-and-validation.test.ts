import { describe, it, expect } from "vitest";
import { validateCartServerSide } from "../src/server/cartValidator";
import { formatPrice, formatUsd, formatZar, formatCurrency } from "../src/utils/currency";

describe("Pricing & Server-Authoritative Cart Validation", () => {
  it("computes accurate authoritative ZAR pricing by default", () => {
    const result = validateCartServerSide({
      items: [
        { productId: "mwa-savannah-throned-chair", quantity: 2 },
        { productId: "mwa-cheetah-ottoman", quantity: 1 },
      ],
    });

    expect(result.isValid).toBe(true);
    expect(result.authoritativeItems.length).toBe(2);
    expect(result.pricing.currency).toBe("ZAR");

    // Baseline USD: 2 * 1850 + 1 * 680 = 4380 USD
    // Authoritative ZAR: 4380 * 18.5 = 81,030 ZAR
    expect(result.pricing.subtotal).toBe(81030);

    // Total items = 3. Base shipping (180 USD) + 2 * 80 USD = 340 USD -> 340 * 18.5 = 6,290 ZAR
    expect(result.pricing.shippingEstimate).toBe(6290);

    // 1.5% insurance of 81030 = 1,215 ZAR
    expect(result.pricing.insuranceAndHandling).toBe(1215);

    // Total = 81030 + 6290 + 1215 = 88,535 ZAR
    expect(result.pricing.total).toBe(88535);
    expect(result.pricing.isServerAuthoritative).toBe(true);
  });

  it("computes accurate pricing when explicit currency is requested (e.g. USD)", () => {
    const result = validateCartServerSide({
      items: [
        { productId: "mwa-savannah-throned-chair", quantity: 2 },
        { productId: "mwa-cheetah-ottoman", quantity: 1 },
      ],
      currency: "USD",
    });

    expect(result.isValid).toBe(true);
    expect(result.pricing.currency).toBe("USD");
    expect(result.pricing.subtotal).toBe(4380);
    expect(result.pricing.shippingEstimate).toBe(340);
    expect(result.pricing.insuranceAndHandling).toBe(66);
    expect(result.pricing.total).toBe(4786);
  });

  it("applies promotional code HEIRLOOM10 correctly in ZAR and USD", () => {
    // Default ZAR
    const zarResult = validateCartServerSide({
      items: [{ productId: "mwa-savannah-throned-chair", quantity: 1 }],
      promoCode: "HEIRLOOM10",
    });

    expect(zarResult.isValid).toBe(true);
    expect(zarResult.pricing.appliedDiscount).toBeDefined();
    expect(zarResult.pricing.appliedDiscount?.code).toBe("HEIRLOOM10");
    // 1850 * 18.5 = 34,225 ZAR; 10% discount = 3,423 ZAR
    expect(zarResult.pricing.appliedDiscount?.amount).toBe(3423);

    // USD
    const usdResult = validateCartServerSide({
      items: [{ productId: "mwa-savannah-throned-chair", quantity: 1 }],
      currency: "USD",
      promoCode: "HEIRLOOM10",
    });

    expect(usdResult.isValid).toBe(true);
    expect(usdResult.pricing.appliedDiscount?.amount).toBe(185);
    expect(usdResult.pricing.total).toBe(1873);
  });

  it("handles empty or non-existent items safely", () => {
    const emptyResult = validateCartServerSide({ items: [] });
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.errors.length).toBeGreaterThan(0);

    const nonExistentResult = validateCartServerSide({
      items: [{ productId: "fake-nonexistent-sku", quantity: 1 }],
    });
    expect(nonExistentResult.isValid).toBe(false);
    expect(nonExistentResult.errors[0]).toContain("fake-nonexistent-sku");
  });

  it("clamps quantities to reasonable bounds (1 to 10)", () => {
    const result = validateCartServerSide({
      items: [{ productId: "mwa-savannah-throned-chair", quantity: 999 }],
    });

    expect(result.isValid).toBe(true);
    expect(result.authoritativeItems[0].quantity).toBe(10);
  });

  it("formats currencies correctly with ZAR as primary default", () => {
    expect(formatPrice(1000)).toBe("R 18,500");
    expect(formatZar(1850)).toBe("R 34,225");
    expect(formatUsd(1850)).toBe("$1,850");
    expect(formatPrice(1000, "USD")).toBe("$1,000");
    expect(formatPrice(1000, "ZAR")).toBe("R 18,500");
    expect(formatPrice(1000, "GBP")).toBe("£780");
    expect(formatCurrency(34225, "ZAR")).toBe("R 34,225");
    expect(formatCurrency(1850, "USD")).toBe("$1,850");
  });
});
