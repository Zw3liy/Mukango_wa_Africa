import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CartProvider, useCart } from "../src/context/CartContext";
import { PRODUCTS } from "../src/data/products";
import { WOOD_FINISHES } from "../src/data/timbers";
import { validateCartServerSide } from "../src/server/cartValidator";

const STORAGE_KEY = "mukango_cart_v1";

const PersistenceProbe: React.FC = () => {
  const { items, addItem, clearCart } = useCart();
  return (
    <div>
      <div data-testid="persist-count">{items.length}</div>
      <div data-testid="persist-names">{items.map((i) => i.product.name).join("|")}</div>
      <button onClick={() => addItem(PRODUCTS[1], 1, WOOD_FINISHES[1])} data-testid="persist-add">
        Add
      </button>
      <button onClick={() => clearCart()} data-testid="persist-clear">
        Clear
      </button>
    </div>
  );
};

describe("Cart Persistence & Server Price Authority", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists the cart to storage and restores it after a page reload (remount)", async () => {
    const user = userEvent.setup();

    // First "visit"
    const first = render(
      <CartProvider>
        <PersistenceProbe />
      </CartProvider>
    );
    await user.click(screen.getByTestId("persist-add"));
    expect(screen.getByTestId("persist-count").textContent).toBe("1");
    const storedRaw = localStorage.getItem(STORAGE_KEY);
    expect(storedRaw).toBeTruthy();
    first.unmount();

    // Simulated reload: fresh provider instance reads persisted storage
    render(
      <CartProvider>
        <PersistenceProbe />
      </CartProvider>
    );
    expect(screen.getByTestId("persist-count").textContent).toBe("1");
    expect(screen.getByTestId("persist-names").textContent).toBe(PRODUCTS[1].name);
  });

  it("clearing the cart also removes the persisted record", async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <PersistenceProbe />
      </CartProvider>
    );
    await user.click(screen.getByTestId("persist-add"));
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
    await user.click(screen.getByTestId("persist-clear"));
    expect(screen.getByTestId("persist-count").textContent).toBe("0");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("recovers safely from corrupted persisted cart data", () => {
    localStorage.setItem(STORAGE_KEY, "{not-valid-json");
    render(
      <CartProvider>
        <PersistenceProbe />
      </CartProvider>
    );
    expect(screen.getByTestId("persist-count").textContent).toBe("0");
  });

  it("ignores client-supplied price fields entirely (price manipulation rejected)", () => {
    const attempted = {
      items: [
        {
          productId: PRODUCTS[0].id,
          quantity: 1,
          finishId: WOOD_FINISHES[0].id,
          // Attacker-supplied pricing fields must have zero effect:
          price: 0.01,
          basePriceUsd: 0.01,
          unitAmount: 1,
          total: 0.01,
        },
      ],
    } as unknown as Parameters<typeof validateCartServerSide>[0];

    const result = validateCartServerSide(attempted);
    expect(result.isValid).toBe(true);

    const honest = validateCartServerSide({
      items: [{ productId: PRODUCTS[0].id, quantity: 1, finishId: WOOD_FINISHES[0].id }],
    });

    // Totals must match the authoritative catalogue computation exactly
    expect(result.pricing.subtotal).toBe(honest.pricing.subtotal);
    expect(result.pricing.total).toBe(honest.pricing.total);
    expect(result.pricing.total).toBeGreaterThan(0);
    expect(result.pricing.isServerAuthoritative).toBe(true);
  });

  it("rejects malformed item payloads (non-array items)", () => {
    const result = validateCartServerSide({ items: "one chair please" as unknown as { productId: string; quantity: number }[] });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Cart is empty.");
  });

  it("fails closed for durable persistence when no database is configured in production mode", async () => {
    // Simulate the production serverless environment: no test fallback allowed.
    const prevNodeEnv = process.env.NODE_ENV;
    const prevAllow = process.env.ALLOW_TEST_MEMORY_STORE;
    const prevDb = process.env.DATABASE_URL;
    process.env.NODE_ENV = "production";
    delete process.env.ALLOW_TEST_MEMORY_STORE;
    delete process.env.DATABASE_URL;

    try {
      // Fresh module graph for this environment so the singleton is constructed
      // without the in-memory test fallback.
      const { ProductionOrderStore } = await import("../src/server/orderStore?case=production-boundary");

      expect(ProductionOrderStore.isDatabaseConfigured().configured).toBe(false);

      const store = ProductionOrderStore.getInstance();
      const saveResult = await store.saveOrder({
        id: "MWA-2026-0001-AAAA",
        reference: "ref-boundary-check",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft",
        customer: { firstName: "A", lastName: "B", email: "a@b.co", phone: "+2600000000" },
        shippingAddress: { streetLine1: "1", city: "L", stateProvince: "L", postalCode: "1", country: "ZM" },
        items: [],
        pricing: {
          currency: "ZAR",
          subtotal: 0,
          shippingEstimate: 0,
          insuranceAndHandling: 0,
          taxEstimate: 0,
          total: 0,
          isServerAuthoritative: true,
          validatedAt: new Date().toISOString(),
        },
        payment: { method: "wire_transfer" },
        timeline: [],
      });

      expect(saveResult.success).toBe(false);
      expect(saveResult.error).toMatch(/DATABASE_URL/);

      // Webhook idempotency must also fail closed rather than silently allowing replays
      await expect(store.hasProcessedWebhookEvent("evt_x")).rejects.toThrow(/DATABASE_URL/);

      const ping = await store.pingDatabase();
      expect(ping.ok).toBe(false);
    } finally {
      process.env.NODE_ENV = prevNodeEnv;
      if (prevAllow !== undefined) process.env.ALLOW_TEST_MEMORY_STORE = prevAllow;
      if (prevDb !== undefined) process.env.DATABASE_URL = prevDb;
    }
  });
});
