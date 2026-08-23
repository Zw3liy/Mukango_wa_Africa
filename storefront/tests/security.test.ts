import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { escapeHtml, sanitizeText, isValidEmail, isValidPhone } from "../src/utils/sanitize";
import { validateOrigin, enforcePayloadSizeLimit } from "../src/server/security";
import { PaymentProviderManager } from "../src/server/paymentProvider";
import crypto from "crypto";

describe("Security, Sanitization & Webhook Integrity", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv, ALLOW_TEST_MEMORY_STORE: "true" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("escapes malicious HTML & script tags", () => {
    const malicious = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">';
    const escaped = escapeHtml(malicious);
    expect(escaped).not.toContain("<script>");
    expect(escaped).toContain("&lt;script&gt;");
    expect(escaped).toContain("&lt;img");
  });

  it("sanitizes text inputs by stripping control characters and trimming", () => {
    const inputWithControl = "  Mukango \u0000 Timber \u0007 Suite  ";
    const sanitized = sanitizeText(inputWithControl);
    expect(sanitized).toBe("Mukango  Timber  Suite");
  });

  it("validates emails according to RFC specifications", () => {
    expect(isValidEmail("client@domain.com")).toBe(true);
    expect(isValidEmail("patron.test+safari@mukangowaafrica.com")).toBe(true);
    expect(isValidEmail("plainaddress")).toBe(false);
    expect(isValidEmail("@missingusername.com")).toBe(false);
  });

  it("validates phone formats", () => {
    expect(isValidPhone("+260 97 123 4567")).toBe(true);
    expect(isValidPhone("+27 (0) 82 123-4567")).toBe(true);
    expect(isValidPhone("123")).toBe(false);
    expect(isValidPhone("badphone letters here 1234")).toBe(false);
  });

  it("validates CORS origins securely", () => {
    expect(validateOrigin("https://mukangowaafrica.com")).toBe(true);
    expect(validateOrigin("http://localhost:5173")).toBe(true);
    expect(validateOrigin("https://3000-sandbox-id.e2b.app")).toBe(true);
    expect(validateOrigin("https://malicious-phishing-domain.com")).toBe(false);
  });

  it("enforces request payload size limits", () => {
    expect(enforcePayloadSizeLimit("short body", 1024)).toBe(true);
    expect(enforcePayloadSizeLimit("a".repeat(2000), 1024)).toBe(false);
  });

  it("enforces webhook HMAC signature verification and durable idempotency", async () => {
    const secret = "test_webhook_secret_key_12345";
    process.env.STRIPE_WEBHOOK_SECRET = secret;

    const eventId = `evt_test_${Date.now()}`;
    const payload = JSON.stringify({
      id: eventId,
      type: "checkout.session.completed",
      data: { object: { client_reference_id: "order_ref_1" } },
    });

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto.createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
    const header = `t=${timestamp},v1=${signature}`;

    const verified = await PaymentProviderManager.verifyWebhookEvent("stripe", payload, header);
    expect(verified.verified).toBe(true);
    expect(verified.isDuplicate).toBe(false);
    expect(verified.eventId).toBe(eventId);

    // Test durable duplicate detection
    const duplicateCheck = await PaymentProviderManager.verifyWebhookEvent("stripe", payload, header);
    expect(duplicateCheck.isDuplicate).toBe(true);

    // Test tampering
    const tamperedPayload = payload + " ";
    const badVerify = await PaymentProviderManager.verifyWebhookEvent("stripe", tamperedPayload, header);
    expect(badVerify.verified).toBe(false);
  });
});
