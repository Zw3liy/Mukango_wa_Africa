import { describe, it, expect } from "vitest";
import { validateCartServerSide } from "../src/server/cartValidator";
import { formatPrice, formatUsd } from "../src/utils/currency";

describe("Pricing & Server-Authoritative Cart Validation", () => {
  it("computes accurate subtotal, crated freight, and total for valid items", () => {
    const result = validateCartServerSide({
      items: [
        { productId: "mwa-savannah-throned-chair", quantity: 2 },
        { productId: "mwa-cheetah-ottoman", quantity: 1 },
      ],
    });

    expect(result.isValid).toBe(true);
    expect(result.authoritativeItems.length).toBe(2);

    // 2 * 1850 + 1 * 680 = 3700 + 680 = 4380
    expect(result.pricing.subtotal).toBe(4380);

    // Total items = 3. Base shipping (180) + 2 * 80 = 340
    expect(result.pricing.shippingEstimate).toBe(340);

    // 1.5% insurance of 4380 = 65.7 -> 66
    expect(result.pricing.insuranceAndHandling).toBe(66);

    // Total = 4380 + 340 + 66 = 4786
    expect(result.pricing.total).toBe(4786);
    expect(result.pricing.isServerAuthoritative).toBe(true);
  });

  it("applies promotional code HEIRLOOM10 correctly", () => {
    const result = validateCartServerSide({
      items: [{ productId: "mwa-savannah-throned-chair", quantity: 1 }],
      promoCode: "HEIRLOOM10",
    });

    expect(result.isValid).toBe(true);
    expect(result.pricing.appliedDiscount).toBeDefined();
    expect(result.pricing.appliedDiscount?.code).toBe("HEIRLOOM10");

    // 10% of 1850 = 185
    expect(result.pricing.appliedDiscount?.amount).toBe(185);

    // subtotal (1850) + shipping (180) + insurance (28) - discount (185) = 1873
    expect(result.pricing.total).toBe(1873);
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

  it("formats currencies correctly", () => {
    expect(formatUsd(1850)).toBe("$1,850");
    expect(formatPrice(1000, "USD")).toBe("$1,000");
    expect(formatPrice(1000, "ZAR")).toBe("R 18,500");
    expect(formatPrice(1000, "GBP")).toBe("£780");
  });
});
