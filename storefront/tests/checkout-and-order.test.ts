import { describe, it, expect } from "vitest";
import { processCheckoutSession } from "../src/server/checkoutService";
import { orderStore } from "../src/server/orderStore";
import { PaymentProviderManager } from "../src/server/paymentProvider";

describe("Checkout Boundary & Order Persistence", () => {
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

  it("creates bank wire pro-forma invoice session successfully and persists order", async () => {
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
    expect(validRes.invoiceInstructions?.swiftCode).toBe("FIRNZMLX");

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

  it("checks provider status accurately", () => {
    const status = PaymentProviderManager.getProviderStatus();
    expect(status.wire_transfer.available).toBe(true);
    expect(status.bespoke_invoice.available).toBe(true);
    expect(typeof status.stripe.available).toBe("boolean");
    expect(typeof status.payfast.available).toBe("boolean");
  });
});
