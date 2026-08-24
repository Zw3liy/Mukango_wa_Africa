import { describe, it, expect, beforeEach, afterEach } from "vitest";
import crypto from "crypto";
import { handleApiRequest } from "../src/server/apiRouter";
import { processCheckoutSession } from "../src/server/checkoutService";
import { orderStore } from "../src/server/orderStore";
import { EmailDeliveryProvider } from "../src/server/emailProvider";
import { validateCartServerSide } from "../src/server/cartValidator";
import { formatPrice, FX_RATES } from "../src/utils/currency";

describe("End-to-End Live Checkout & Webhook Integration Suite", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ALLOW_TEST_MEMORY_STORE: "true",
      NODE_ENV: "test",
      DEFAULT_CURRENCY: "ZAR",
      BANK_NAME: "Standard Chartered Bank Zambia PLC",
      BANK_ACCOUNT_NAME: "Mukango Wa Africa Artisans Ltd",
      BANK_ACCOUNT_NUMBER: "0100123456700",
      BANK_SWIFT_CODE: "SCBLZMLX",
      PAYFAST_MERCHANT_ID: "10000100",
      PAYFAST_MERCHANT_KEY: "46f0cd694581a",
      PAYFAST_PASSPHRASE: "test_payfast_passphrase_2026",
      PAYFAST_SANDBOX: "true",
      STRIPE_SECRET_KEY: "sk_test_mock_secret_key_12345",
      STRIPE_WEBHOOK_SECRET: "whsec_test_secret_67890",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("Scenario 1: Complete Pro-Forma Bank Wire Checkout with Authoritative ZAR Pricing", async () => {
    // 1. Validate cart items with default ZAR currency and promotional code
    const cartValidation = validateCartServerSide({
      items: [
        { productId: "mwa-savannah-throned-chair", quantity: 1, finishId: "natural-wax" },
        { productId: "mwa-cheetah-ottoman", quantity: 2, finishId: "ebonized-charcoal" },
      ],
      promoCode: "HEIRLOOM10",
    });

    expect(cartValidation.isValid).toBe(true);
    expect(cartValidation.pricing.currency).toBe("ZAR");

    // Base USD: 1850 + 2 * 680 = 3210 USD
    // Subtotal in ZAR: 3210 * 18.5 = 59,385 ZAR
    expect(cartValidation.pricing.subtotal).toBe(59385);

    // Shipping in ZAR: (180 + 2 * 80) * 18.5 = 340 * 18.5 = 6,290 ZAR
    expect(cartValidation.pricing.shippingEstimate).toBe(6290);

    // Insurance in ZAR: 1.5% of 59,385 = 891 ZAR
    expect(cartValidation.pricing.insuranceAndHandling).toBe(891);

    // 10% Discount: 5,939 ZAR
    expect(cartValidation.pricing.appliedDiscount?.amount).toBe(5939);

    // Total: 59,385 + 6,290 + 891 - 5,939 = 60,627 ZAR
    expect(cartValidation.pricing.total).toBe(60627);

    // 2. Submit checkout session with promoCode
    const checkoutResult = await processCheckoutSession(
      {
        items: [
          { productId: "mwa-savannah-throned-chair", quantity: 1, finishId: "natural-wax" },
          { productId: "mwa-cheetah-ottoman", quantity: 2, finishId: "ebonized-charcoal" },
        ],
        promoCode: "HEIRLOOM10",
        customer: {
          firstName: "Zwelithini",
          lastName: "Ndlovu",
          email: "zwelithini@example.com",
          phone: "+27 82 555 1234",
          company: "Umzi Safari Reserve",
          notes: "Please pack with extra corner crating.",
        },
        shippingAddress: {
          streetLine1: "15 Kirstenbosch Drive",
          streetLine2: "Suite 4B",
          city: "Cape Town",
          stateProvince: "Western Cape",
          postalCode: "7700",
          country: "South Africa",
        },
        paymentMethod: "wire_transfer",
      },
      "https://mukangoafrica.co.za"
    );

    expect(checkoutResult.status).toBe("invoice_created");
    expect(checkoutResult.orderId).toMatch(/^MWA-/);
    expect(checkoutResult.reference).toBeDefined();
    expect(checkoutResult.invoiceInstructions).toBeDefined();
    expect(checkoutResult.invoiceInstructions?.bankName).toBe("Standard Chartered Bank Zambia PLC");
    expect(checkoutResult.invoiceInstructions?.swiftCode).toBe("SCBLZMLX");
    expect(checkoutResult.invoiceInstructions?.amountDue).toContain("ZAR");

    // 3. Verify order in order store
    const storedOrder = await orderStore.getOrderByReference(checkoutResult.reference);
    expect(storedOrder).not.toBeNull();
    expect(storedOrder?.id).toBe(checkoutResult.orderId);
    expect(storedOrder?.status).toBe("pending_payment");
    expect(storedOrder?.customer.email).toBe("zwelithini@example.com");
    expect(storedOrder?.pricing.currency).toBe("ZAR");
    expect(storedOrder?.pricing.total).toBe(60627);

    // 4. Verify API lookup via /api/checkout/order-status
    const apiRes = await handleApiRequest({
      method: "GET",
      pathname: "/api/checkout/order-status",
      searchParams: new URLSearchParams(`ref=${checkoutResult.reference}`),
      headers: { origin: "https://mukangoafrica.co.za" },
    });

    expect(apiRes.status).toBe(200);
    const parsedApi = JSON.parse(apiRes.body);
    expect(parsedApi.success).toBe(true);
    expect(parsedApi.order.id).toBe(checkoutResult.orderId);
  });

  it("Scenario 2: PayFast Session Creation & ITN Webhook Verification to Paid Status", async () => {
    // 1. Create order for PayFast
    const checkoutRes = await processCheckoutSession(
      {
        items: [{ productId: "mwa-savannah-throned-chair", quantity: 1, finishId: "natural-wax" }],
        customer: {
          firstName: "Lerato",
          lastName: "Moloi",
          email: "lerato@example.co.za",
          phone: "+27 83 999 8888",
        },
        shippingAddress: {
          streetLine1: "44 Oxford Road",
          city: "Johannesburg",
          stateProvince: "Gauteng",
          postalCode: "2196",
          country: "South Africa",
        },
        paymentMethod: "payfast",
      },
      "https://mukangoafrica.co.za"
    );

    expect(checkoutRes.status).toBe("redirect_required");
    expect(checkoutRes.redirectUrl).toBeDefined();
    expect(checkoutRes.redirectUrl).toContain("sandbox.payfast.co.za");
    expect(checkoutRes.redirectUrl).toContain("merchant_id=10000100");
    expect(checkoutRes.redirectUrl).toContain(`m_payment_id=${checkoutRes.reference}`);

    // Verify amount in ZAR: 1850 * 18.5 + 3330 (shipping) + 513 (insurance) = 38,068.00 ZAR
    expect(checkoutRes.redirectUrl).toContain("amount=38068.00");

    // 2. Simulate PayFast ITN Webhook POST
    const passphrase = "test_payfast_passphrase_2026";
    const pfPaymentId = `pf_txn_${Date.now()}`;
    const itnParams: Record<string, string> = {
      m_payment_id: checkoutRes.reference,
      pf_payment_id: pfPaymentId,
      payment_status: "COMPLETE",
      item_name: `Mukango Wa Africa Commission #${checkoutRes.orderId}`,
      amount_gross: "38068.00",
      amount_fee: "-875.56",
      amount_net: "37192.44",
      merchant_id: "10000100",
    };

    // Calculate MD5 signature as PayFast does
    let pfParamString = Object.entries(itnParams)
      .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, "+")}`)
      .join("&");
    pfParamString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
    const signature = crypto.createHash("md5").update(pfParamString).digest("hex");
    itnParams.signature = signature;

    const rawPayload = new URLSearchParams(itnParams).toString();

    const webhookRes = await handleApiRequest({
      method: "POST",
      pathname: "/api/webhooks/payfast",
      searchParams: new URLSearchParams("provider=payfast"),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://mukangoafrica.co.za",
      },
      rawBody: rawPayload,
    });

    expect(webhookRes.status).toBe(200);
    const webhookBody = JSON.parse(webhookRes.body);
    expect(webhookBody.received).toBe(true);
    expect(webhookBody.eventId).toBe(pfPaymentId);
    expect(webhookBody.paymentStatus).toBe("paid");

    // 3. Verify order status has transitioned to 'paid' in durable store
    const updatedOrder = await orderStore.getOrderByReference(checkoutRes.reference);
    expect(updatedOrder).not.toBeNull();
    expect(updatedOrder?.status).toBe("paid");
    expect(updatedOrder?.timeline.some((t) => t.status === "paid")).toBe(true);

    // 4. Duplicate webhook test (Idempotency)
    const duplicateRes = await handleApiRequest({
      method: "POST",
      pathname: "/api/webhooks/payfast",
      searchParams: new URLSearchParams("provider=payfast"),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://mukangoafrica.co.za",
      },
      rawBody: rawPayload,
    });

    expect(duplicateRes.status).toBe(200);
    const dupBody = JSON.parse(duplicateRes.body);
    expect(dupBody.received).toBe(true);
    expect(dupBody.note).toContain("Duplicate");
  });

  it("Scenario 3: Stripe Webhook Verification with HMAC-SHA256 & Idempotency", async () => {
    // 1. Create a draft order
    const draftRes = await processCheckoutSession(
      {
        items: [{ productId: "mwa-village-stories-dining-table", quantity: 1, finishId: "organic-linseed" }],
        customer: {
          firstName: "Victoria",
          lastName: "Sterling",
          email: "v.sterling@mayfair.co.uk",
          phone: "+44 20 7946 0192",
        },
        shippingAddress: {
          streetLine1: "14 Grosvenor Square",
          city: "London",
          stateProvince: "Greater London",
          postalCode: "W1K 6JP",
          country: "United Kingdom",
        },
        paymentMethod: "wire_transfer",
      },
      "https://mukangoafrica.co.za"
    );

    expect(draftRes.orderId).toBeDefined();

    // 2. Simulate Stripe Webhook for checkout.session.completed
    const eventId = `evt_stripe_${Date.now()}`;
    const payload = JSON.stringify({
      id: eventId,
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_12345",
          client_reference_id: draftRes.reference,
          payment_status: "paid",
          currency: "zar",
        },
      },
    });

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto
      .createHmac("sha256", process.env.STRIPE_WEBHOOK_SECRET!)
      .update(`${timestamp}.${payload}`)
      .digest("hex");

    const webhookRes = await handleApiRequest({
      method: "POST",
      pathname: "/api/webhooks/payment",
      searchParams: new URLSearchParams("provider=stripe"),
      headers: {
        "stripe-signature": `t=${timestamp},v1=${signature}`,
        "content-type": "application/json",
        origin: "https://mukangoafrica.co.za",
      },
      rawBody: payload,
    });

    expect(webhookRes.status).toBe(200);

    // 3. Verify order status updated to paid
    const paidOrder = await orderStore.getOrderByReference(draftRes.reference);
    expect(paidOrder?.status).toBe("paid");
  });

  it("Scenario 4: Transactional Email Generation & Validation", () => {
    const mockOrder = {
      id: "MWA-2026-7819",
      reference: "mock_ref_7819",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "pending_payment" as const,
      customer: {
        firstName: "Chileshe",
        lastName: "Banda",
        email: "c.banda@lusaka.zm",
        phone: "+260 97 123 4567",
      },
      shippingAddress: {
        streetLine1: "Plot 24, Leopards Hill Road",
        city: "Lusaka",
        stateProvince: "Lusaka",
        postalCode: "10101",
        country: "Zambia",
      },
      items: [
        {
          id: "mwa-savannah-throned-chair-natural-wax",
          productId: "mwa-savannah-throned-chair",
          product: {
            id: "mwa-savannah-throned-chair",
            slug: "savannah-throned-chair",
            name: "The Savannah Throned Chair",
            tagline: "High-backed sovereign seating",
            description: "Hand-carved from solid Zambezi teak",
            detailedStory: "Crafted in Lusaka",
            basePriceUsd: 1850,
            category: "chairs" as const,
            motif: "savannah" as const,
            timber: "Zambezi Teak (Baikiaea plurijuga)" as const,
            sku: "MWA-CHR-SAV-001",
            dimensions: { widthCm: 72, depthCm: 78, heightCm: 124 },
            leadTimeWeeks: 4,
            isHeirloomCertified: true,
            featured: true,
            inStockCount: 3,
            images: { hero: "/images/hero.jpg", detail: "/images/craftsmanship.jpg", alt: "Chair" },
            highlights: ["Solid Zambezi Teak"],
            careInstructions: ["Beeswax polish"],
            specifications: [{ label: "Timber", value: "Teak" }],
          },
          quantity: 1,
          selectedFinish: { id: "natural-wax", name: "Natural Beeswax", colorHex: "#d4b896", description: "Natural finish" },
          addedAt: new Date().toISOString(),
        },
      ],
      pricing: {
        currency: "ZAR" as const,
        subtotal: 34225,
        shippingEstimate: 3330,
        insuranceAndHandling: 513,
        taxEstimate: 0,
        total: 38068,
        isServerAuthoritative: true,
        validatedAt: new Date().toISOString(),
      },
      payment: {
        method: "wire_transfer" as const,
      },
      timeline: [],
    };

    const html = EmailDeliveryProvider.generateOrderConfirmationHtml(mockOrder);
    expect(html).toContain("MUKANGO WA AFRICA");
    expect(html).toContain("MWA-2026-7819");
    expect(html).toContain("The Savannah Throned Chair");
    expect(html).toContain("R 38,068");
    expect(html).toContain("Standard Chartered Bank Zambia PLC");
    expect(html).toContain("SCBLZMLX");
    expect(html).toContain("25 years");
  });

  it("Scenario 5: Multi-Currency Pricing Consistency across all supported currencies", () => {
    const currencies = ["ZAR", "USD", "EUR", "GBP", "ZMW"] as const;

    currencies.forEach((curr) => {
      const res = validateCartServerSide({
        items: [{ productId: "mwa-savannah-throned-chair", quantity: 1 }],
        currency: curr,
      });

      expect(res.isValid).toBe(true);
      expect(res.pricing.currency).toBe(curr);
      const expectedSubtotal = Math.round(1850 * FX_RATES[curr]);
      expect(res.pricing.subtotal).toBe(expectedSubtotal);
      expect(formatPrice(1850, curr)).toContain(Math.round(expectedSubtotal).toLocaleString("en-US"));
    });
  });
});
