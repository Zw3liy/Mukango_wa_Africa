import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { processCheckoutSession } from "../src/server/checkoutService";
import { orderStore, ProductionOrderStore } from "../src/server/orderStore";
import { PaymentProviderManager } from "../src/server/paymentProvider";

describe("Checkout Boundary & Order Persistence", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv, ALLOW_TEST_MEMORY_STORE: "true" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("validates required customer and shipping address fields", async () => {
    const invalidRes = await processCheckoutSession(
      {
        items: [{ productId: "mwa-savannah-throned-chair", quantity: 1, finishId: "natural-wax" }],
        customer: { firstName: "", lastName: "", email: "notanemail", phone: "" },
        shippingAddress: { streetLine1: "", city: "", stateProvince: "", postalCode: "", country: "" },
        paymentMethod: "wire_transfer",
      },
      "http://localhost:5173"
    );

    expect(invalidRes.status).toBe("validation_error");
    expect(invalidRes.errorMessage).toBeDefined();
  });

  it("fails explicitly when bank wire instructions are unconfigured in environment (No fabricated details)", async () => {
    delete process.env.BANK_NAME;
    delete process.env.BANK_ACCOUNT_NAME;
    delete process.env.BANK_ACCOUNT_NUMBER;
    delete process.env.BANK_SWIFT_CODE;

    const res = await processCheckoutSession(
      {
        items: [{ productId: "mwa-savannah-throned-chair", quantity: 1, finishId: "natural-wax" }],
        customer: {
          firstName: "Amelia",
          lastName: "Duarte",
          email: "amelia.duarte@example.com",
          phone: "+351 912 345 678",
        },
        shippingAddress: {
          streetLine1: "Avenida da Liberdade 120",
          city: "Lisbon",
          stateProvince: "Lisbon",
          postalCode: "1250-142",
          country: "Portugal",
        },
        paymentMethod: "wire_transfer",
      },
      "https://mukangowaafrica.com"
    );

    expect(res.status).toBe("config_error");
    expect(res.errorMessage).toContain("BANK_NAME");
    expect(res.invoiceInstructions).toBeUndefined();
  });

  it("creates bank wire pro-forma invoice session when configured with official bank details", async () => {
    process.env.BANK_NAME = "Stanbic Bank Zambia";
    process.env.BANK_ACCOUNT_NAME = "Mukango Wa Africa Artisans";
    process.env.BANK_ACCOUNT_NUMBER = "913000482910";
    process.env.BANK_SWIFT_CODE = "SBICZMLX";

    const validRes = await processCheckoutSession(
      {
        items: [{ productId: "mwa-savannah-throned-chair", quantity: 1, finishId: "natural-wax" }],
        customer: {
          firstName: "Amelia",
          lastName: "Duarte",
          email: "amelia.duarte@example.com",
          phone: "+351 912 345 678",
        },
        shippingAddress: {
          streetLine1: "Avenida da Liberdade 120",
          city: "Lisbon",
          stateProvince: "Lisbon",
          postalCode: "1250-142",
          country: "Portugal",
        },
        paymentMethod: "wire_transfer",
      },
      "https://mukangowaafrica.com"
    );

    expect(validRes.status).toBe("invoice_created");
    expect(validRes.orderId).toMatch(/^MWA-/);
    expect(validRes.reference).toBeDefined();
    expect(validRes.invoiceInstructions).toBeDefined();
    expect(validRes.invoiceInstructions?.swiftCode).toBe("SBICZMLX");
    expect(validRes.invoiceInstructions?.amountDue).toContain("USD");

    // Verify order was saved into orderStore
    const retrieved = await orderStore.getOrderByReference(validRes.reference);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.customer.email).toBe("amelia.duarte@example.com");
    expect(retrieved?.status).toBe("pending_payment");
  });

  it("fails explicitly when unconfigured Stripe credentials are used (No fake commerce)", async () => {
    delete process.env.STRIPE_SECRET_KEY;

    const res = await processCheckoutSession(
      {
        items: [{ productId: "mwa-savannah-throned-chair", quantity: 1, finishId: "natural-wax" }],
        customer: {
          firstName: "James",
          lastName: "Whitfield",
          email: "james@example.com",
          phone: "+27 82 123 4567",
        },
        shippingAddress: {
          streetLine1: "12 Victoria Road",
          city: "Cape Town",
          stateProvince: "Western Cape",
          postalCode: "8005",
          country: "South Africa",
        },
        paymentMethod: "stripe",
      },
      "https://mukangowaafrica.com"
    );

    expect(res.status).toBe("config_error");
    expect(res.errorMessage).toContain("STRIPE_SECRET_KEY");
  });

  it("reports database configuration readiness honestly", () => {
    delete process.env.DATABASE_URL;
    const dbStatus = ProductionOrderStore.isDatabaseConfigured();
    expect(dbStatus.configured).toBe(false);
    expect(dbStatus.message).toContain("DATABASE_URL is not configured");
  });

  it("checks provider status accurately based on configuration", () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.PAYFAST_MERCHANT_ID;
    delete process.env.BANK_NAME;

    const status = PaymentProviderManager.getProviderStatus();
    expect(status.stripe.available).toBe(false);
    expect(status.payfast.available).toBe(false);
    expect(status.wire_transfer.available).toBe(false);
  });
});
