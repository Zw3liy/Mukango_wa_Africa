import { describe, it, expect, beforeEach, afterEach } from "vitest";
import crypto from "crypto";
import { handleApiRequest } from "../src/server/apiRouter";
import { processCheckoutSession } from "../src/server/checkoutService";
import { orderStore } from "../src/server/orderStore";
import { EmailDeliveryProvider } from "../src/server/emailProvider";
import { OrderRecord } from "../src/types/order";

/**
 * Production commerce hardening suite:
 * PayFast ITN merchant / amount / currency verification, fail-closed signature
 * handling, idempotent checkout (duplicate-submission protection), and
 * transactional email escaping (HTML + text variants).
 */
describe("Commerce Hardening — PayFast ITN, Idempotency & Email Safety", () => {
  const originalEnv = { ...process.env };
  const MERCHANT_ID = "10000100";
  const MERCHANT_KEY = "46f0cd694581a";
  const PASSPHRASE = "hardening_passphrase_2026";

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ALLOW_TEST_MEMORY_STORE: "true",
      NODE_ENV: "test",
      DEFAULT_CURRENCY: "ZAR",
      PAYFAST_MERCHANT_ID: MERCHANT_ID,
      PAYFAST_MERCHANT_KEY: MERCHANT_KEY,
      PAYFAST_PASSPHRASE: PASSPHRASE,
      PAYFAST_SANDBOX: "true",
      BANK_NAME: "Test Bank Zambia PLC",
      BANK_ACCOUNT_NAME: "Mukango Wa Africa Artisans Ltd",
      BANK_ACCOUNT_NUMBER: "999000111222",
      BANK_SWIFT_CODE: "TESTZMLX",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  async function createPayFastOrder(): Promise<{ reference: string; orderId: string; total: number }> {
    const res = await processCheckoutSession(
      {
        items: [{ productId: "mwa-savannah-throned-chair", quantity: 1, finishId: "natural-wax" }],
        customer: {
          firstName: "Thandiwe",
          lastName: "Banda",
          email: "thandiwe@example.zm",
          phone: "+260 97 000 1111",
        },
        shippingAddress: {
          streetLine1: "Plot 22 Cairo Road",
          city: "Lusaka",
          stateProvince: "Lusaka Province",
          postalCode: "10101",
          country: "Zambia",
        },
        paymentMethod: "payfast",
      },
      "https://mukangoafrica.co.za"
    );
    expect(res.status).toBe("redirect_required");
    // Authoritative server-side total (ZAR)
    const order = await orderStore.getOrderByReference(res.reference);
    expect(order).not.toBeNull();
    return { reference: res.reference, orderId: res.orderId, total: order!.pricing.total };
  }

  function buildSignedItn(params: Record<string, string>, passphrase: string = PASSPHRASE): string {
    let paramString = Object.entries(params)
      .filter(([k]) => k !== "signature")
      .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, "+")}`)
      .join("&");
    paramString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
    const signature = crypto.createHash("md5").update(paramString).digest("hex");
    return new URLSearchParams({ ...params, signature }).toString();
  }

  async function postPayFastItn(rawBody: string) {
    return handleApiRequest({
      method: "POST",
      pathname: "/api/webhooks/payfast",
      searchParams: new URLSearchParams("provider=payfast"),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://mukangoafrica.co.za",
      },
      rawBody,
    });
  }

  it("rejects PayFast ITN from a mismatched merchant account (order stays unpaid)", async () => {
    const { reference, total } = await createPayFastOrder();

    const itn = buildSignedItn({
      m_payment_id: reference,
      pf_payment_id: `pf_merchant_mismatch_${Date.now()}`,
      payment_status: "COMPLETE",
      amount_gross: total.toFixed(2),
      currency: "ZAR",
      merchant_id: "99999999", // attacker's merchant account
    });

    const res = await postPayFastItn(itn);
    expect(res.status).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/merchant/i);

    const order = await orderStore.getOrderByReference(reference);
    expect(order?.status).not.toBe("paid");
  });

  it("rejects PayFast ITN whose amount_gross does not match the authoritative order total", async () => {
    const { reference, total } = await createPayFastOrder();

    const itn = buildSignedItn({
      m_payment_id: reference,
      pf_payment_id: `pf_amount_mismatch_${Date.now()}`,
      payment_status: "COMPLETE",
      amount_gross: (total - 1000).toFixed(2), // underpayment attempt
      currency: "ZAR",
      merchant_id: MERCHANT_ID,
    });

    const res = await postPayFastItn(itn);
    expect(res.status).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/amount/i);

    const order = await orderStore.getOrderByReference(reference);
    expect(order?.status).not.toBe("paid");
  });

  it("rejects PayFast ITN with a currency that disagrees with the order currency", async () => {
    const { reference, total } = await createPayFastOrder();

    const itn = buildSignedItn({
      m_payment_id: reference,
      pf_payment_id: `pf_currency_mismatch_${Date.now()}`,
      payment_status: "COMPLETE",
      amount_gross: total.toFixed(2),
      currency: "USD",
      merchant_id: MERCHANT_ID,
    });

    const res = await postPayFastItn(itn);
    expect(res.status).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/currency/i);

    const order = await orderStore.getOrderByReference(reference);
    expect(order?.status).not.toBe("paid");
  });

  it("fails closed when a passphrase is configured but the ITN carries no signature", async () => {
    const { reference, total } = await createPayFastOrder();

    const unsigned = new URLSearchParams({
      m_payment_id: reference,
      pf_payment_id: `pf_unsigned_${Date.now()}`,
      payment_status: "COMPLETE",
      amount_gross: total.toFixed(2),
      currency: "ZAR",
      merchant_id: MERCHANT_ID,
    }).toString();

    const res = await postPayFastItn(unsigned);
    expect(res.status).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/signature/i);

    const order = await orderStore.getOrderByReference(reference);
    expect(order?.status).not.toBe("paid");
  });

  it("rejects PayFast ITN with a forged signature", async () => {
    const { reference, total } = await createPayFastOrder();

    const itn = buildSignedItn(
      {
        m_payment_id: reference,
        pf_payment_id: `pf_forged_${Date.now()}`,
        payment_status: "COMPLETE",
        amount_gross: total.toFixed(2),
        currency: "ZAR",
        merchant_id: MERCHANT_ID,
      },
      "attacker_guessed_passphrase"
    );

    const res = await postPayFastItn(itn);
    expect(res.status).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/signature/i);

    const order = await orderStore.getOrderByReference(reference);
    expect(order?.status).not.toBe("paid");
  });

  it("accepts a fully matching signed PayFast ITN and marks the order paid exactly once", async () => {
    const { reference } = await createPayFastOrder();
    const pfPaymentId = `pf_valid_${Date.now()}`;
    const order = await orderStore.getOrderByReference(reference);
    const total = order!.pricing.total;

    const itn = buildSignedItn({
      m_payment_id: reference,
      pf_payment_id: pfPaymentId,
      payment_status: "COMPLETE",
      amount_gross: total.toFixed(2),
      currency: "ZAR",
      merchant_id: MERCHANT_ID,
    });

    const first = await postPayFastItn(itn);
    expect(first.status).toBe(200);
    expect(JSON.parse(first.body).paymentStatus).toBe("paid");
    expect((await orderStore.getOrderByReference(reference))?.status).toBe("paid");

    // Replay must be detected and must not reprocess
    const replay = await postPayFastItn(itn);
    expect(replay.status).toBe(200);
    expect(JSON.parse(replay.body).note).toMatch(/duplicate/i);
  });

  it("deduplicates repeated checkout submissions via idempotency key (no duplicate orders)", async () => {
    const idempotencyKey = `chk-harden-${crypto.randomBytes(8).toString("hex")}`;
    const baseRequest = {
      items: [{ productId: "mwa-cheetah-ottoman", quantity: 1, finishId: "natural-wax" }],
      customer: {
        firstName: "Kondwani",
        lastName: "Phiri",
        email: "kondwani@example.zm",
        phone: "+260 95 222 3333",
      },
      shippingAddress: {
        streetLine1: "Plot 8 Independence Avenue",
        city: "Lusaka",
        stateProvince: "Lusaka Province",
        postalCode: "10101",
        country: "Zambia",
      },
      paymentMethod: "wire_transfer" as const,
      idempotencyKey,
    };

    const first = await processCheckoutSession(baseRequest, "https://mukangoafrica.co.za");
    expect(first.status).toBe("invoice_created");
    expect(first.orderId).toMatch(/^MWA-/);

    // Double-submission (retry / double click) with the same key
    const second = await processCheckoutSession(baseRequest, "https://mukangoafrica.co.za");
    expect(second.orderId).toBe(first.orderId);
    expect(second.reference).toBe(first.reference);
    expect(second.status).toBe("invoice_created");

    // A genuinely new attempt (fresh key) must still create a distinct order
    const third = await processCheckoutSession(
      { ...baseRequest, idempotencyKey: `chk-harden-${crypto.randomBytes(8).toString("hex")}` },
      "https://mukangoafrica.co.za"
    );
    expect(third.orderId).not.toBe(first.orderId);
  });

  it("ignores malformed idempotency keys instead of failing the checkout", async () => {
    const req = {
      items: [{ productId: "mwa-cheetah-ottoman", quantity: 1, finishId: "natural-wax" }],
      customer: {
        firstName: "Lombe",
        lastName: "Mwale",
        email: "lombe@example.zm",
        phone: "+260 96 444 5555",
      },
      shippingAddress: {
        streetLine1: "Plot 3 Great East Road",
        city: "Lusaka",
        stateProvince: "Lusaka Province",
        postalCode: "10101",
        country: "Zambia",
      },
      paymentMethod: "wire_transfer" as const,
      idempotencyKey: "bad key with spaces! <script>",
    };

    const res = await processCheckoutSession(req, "https://mukangoafrica.co.za");
    expect(res.status).toBe("invoice_created");
    expect(res.orderId).toMatch(/^MWA-/);
  });

  it("escapes user-controlled engraving content in HTML emails and provides a text template", async () => {
    const malicious = '"><script>alert("xss")</script><img src=x onerror=alert(1)>';
    const order: OrderRecord = {
      id: "MWA-2026-9901",
      reference: crypto.randomBytes(16).toString("hex"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "paid",
      customer: {
        firstName: "Security",
        lastName: "Review",
        email: "security@example.com",
        phone: "+27 00 000 0000",
      },
      shippingAddress: {
        streetLine1: "1 Test Lane",
        city: "Cape Town",
        stateProvince: "Western Cape",
        postalCode: "8001",
        country: "South Africa",
      },
      items: [
        {
          id: "mwa-savannah-throned-chair-natural-wax",
          productId: "mwa-savannah-throned-chair",
          product: (await import("../src/data/products")).PRODUCTS.find(
            (p) => p.id === "mwa-savannah-throned-chair"
          )!,
          quantity: 1,
          selectedFinish: (await import("../src/data/timbers")).WOOD_FINISHES[0],
          customEngraving: malicious,
          addedAt: new Date().toISOString(),
        },
      ],
      pricing: {
        currency: "ZAR",
        subtotal: 34225,
        shippingEstimate: 3330,
        insuranceAndHandling: 513,
        taxEstimate: 0,
        total: 38068,
        isServerAuthoritative: true,
        validatedAt: new Date().toISOString(),
      },
      payment: { method: "wire_transfer" },
      timeline: [],
    };

    const html = EmailDeliveryProvider.generateOrderConfirmationHtml(order);
    // No live injection vectors may survive: script and img tags must be entity-escaped.
    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");

    const text = EmailDeliveryProvider.generateOrderConfirmationText(order);
    expect(text).toContain("MUKANGO WA AFRICA");
    expect(text).toContain(order.id);
    expect(text).toContain("R 38,068");
    expect(text).toContain(malicious); // raw value is safe in plain text
  });
});
