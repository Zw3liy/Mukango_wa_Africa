import type { HandlerEvent, HandlerContext } from "@netlify/functions";
import { describe, it, expect } from "vitest";
import { handleApiRequest } from "../src/server/apiRouter";
import { orderStore } from "../src/server/orderStore";
import { handler as netlifyHandler } from "../netlify/functions/api";

describe("Server API Boundaries & Routing", () => {
  it("GET /api/health returns 200 with service info and authoritative currency", async () => {
    const res = await handleApiRequest({
      method: "GET",
      pathname: "/api/health",
      searchParams: new URLSearchParams(),
      headers: {},
    });

    expect(res.status).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe("healthy");
    expect(body.service).toContain("Mukango");
    expect(body.authoritativeCurrency).toBe("ZAR");
  });

  it("POST /api/cart/validate returns authoritative ZAR pricing by default", async () => {
    const res = await handleApiRequest({
      method: "POST",
      pathname: "/api/cart/validate",
      searchParams: new URLSearchParams(),
      headers: { "content-type": "application/json" },
      rawBody: JSON.stringify({
        items: [{ productId: "mwa-savannah-throned-chair", quantity: 1 }],
      }),
    });

    expect(res.status).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.result.pricing.currency).toBe("ZAR");
    // 1850 * 18.5 = 34,225 ZAR
    expect(body.result.pricing.subtotal).toBe(34225);
  });

  it("GET /api/checkout/order-status returns 404 for unknown reference and 200 for stored order", async () => {
    const notFoundRes = await handleApiRequest({
      method: "GET",
      pathname: "/api/checkout/order-status",
      searchParams: new URLSearchParams("ref=unknown_ref_1234"),
      headers: {},
    });
    expect(notFoundRes.status).toBe(404);

    // Save a mock order
    await orderStore.saveOrder({
      id: "MWA-2026-9999",
      reference: "test_ref_9999",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "paid",
      customer: { firstName: "Chloe", lastName: "Anderson", email: "chloe@example.com", phone: "+44 7123" },
      shippingAddress: { streetLine1: "1 High St", city: "London", stateProvince: "Greater London", postalCode: "SW1", country: "UK" },
      items: [],
      pricing: { currency: "ZAR", subtotal: 34225, shippingEstimate: 3330, insuranceAndHandling: 513, taxEstimate: 0, total: 38068, isServerAuthoritative: true, validatedAt: "" },
      payment: { method: "stripe" },
      timeline: [],
    });

    const foundRes = await handleApiRequest({
      method: "GET",
      pathname: "/api/checkout/order-status",
      searchParams: new URLSearchParams("ref=test_ref_9999"),
      headers: {},
    });
    expect(foundRes.status).toBe(200);
    const foundBody = JSON.parse(foundRes.body);
    expect(foundBody.order.id).toBe("MWA-2026-9999");
    expect(foundBody.order.pricing.currency).toBe("ZAR");
  });

  it("handles CORS preflight OPTIONS requests securely for permitted origin", async () => {
    const res = await handleApiRequest({
      method: "OPTIONS",
      pathname: "/api/cart/validate",
      searchParams: new URLSearchParams(),
      headers: { origin: "https://mukangowaafrica.com" },
    });

    expect(res.status).toBe(204);
    expect(res.headers["Access-Control-Allow-Origin"]).toBe("https://mukangowaafrica.com");
  });

  it("rejects CORS preflight OPTIONS requests from forbidden origins (403 Forbidden)", async () => {
    const res = await handleApiRequest({
      method: "OPTIONS",
      pathname: "/api/cart/validate",
      searchParams: new URLSearchParams(),
      headers: { origin: "https://malicious-phishing-site.com" },
    });

    expect(res.status).toBe(403);
  });

  it("executes Netlify serverless function entrypoint successfully", async () => {
    const netlifyEvent: HandlerEvent = {
      rawUrl: "https://mukangowaafrica.com/.netlify/functions/api/health",
      rawQuery: "",
      path: "/.netlify/functions/api/health",
      httpMethod: "GET",
      headers: { host: "mukangowaafrica.com" },
      multiValueHeaders: {},
      queryStringParameters: {},
      multiValueQueryStringParameters: {},
      body: null,
      isBase64Encoded: false,
    };

    const netlifyRes = await netlifyHandler(netlifyEvent, {} as HandlerContext);
    expect(netlifyRes).toBeDefined();
    expect(netlifyRes?.statusCode).toBe(200);
    const parsed = JSON.parse(netlifyRes?.body || "{}");
    expect(parsed.status).toBe("healthy");
  });

  it("rejects oversized request bodies (413 Payload Too Large)", async () => {
    const hugeBody = "X".repeat(70 * 1024); // 70 KB > 64 KB limit
    const res = await handleApiRequest({
      method: "POST",
      pathname: "/api/forms/contact",
      searchParams: new URLSearchParams(),
      headers: {},
      rawBody: hugeBody,
    });

    expect(res.status).toBe(413);
  });
});
