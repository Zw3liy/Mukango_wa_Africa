import { ApiServerRequest, ApiServerResponse } from "../types/api";
import { validateCartServerSide } from "./cartValidator";
import { processCheckoutSession } from "./checkoutService";
import { orderStore, ProductionOrderStore } from "./orderStore";
import { PaymentProviderManager } from "./paymentProvider";
import { EmailDeliveryProvider } from "./emailProvider";
import { handleContactFormSubmission, handleBespokeFormSubmission, handleNewsletterSubmission } from "./formHandler";
import { validateOrigin, enforcePayloadSizeLimit } from "./security";
import { globalRateLimiter } from "./rateLimiter";
import { PaymentMethod } from "../types/commerce";

function jsonResponse(status: number, data: unknown, originHeader?: string): ApiServerResponse {
  const isAllowed = validateOrigin(originHeader);
  const allowedOrigin = isAllowed && originHeader ? originHeader : "https://mukangoafrica.co.za";

  return {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Stripe-Signature, X-PayFast-Signature",
      "X-Content-Type-Options": "nosniff",
      "Vary": "Origin",
    },
    body: JSON.stringify(data),
  };
}

export async function handleApiRequest(req: ApiServerRequest): Promise<ApiServerResponse> {
  const originHeader = Array.isArray(req.headers["origin"]) ? req.headers["origin"][0] : req.headers["origin"];
  const clientIp = Array.isArray(req.headers["x-forwarded-for"])
    ? req.headers["x-forwarded-for"][0]
    : req.headers["x-forwarded-for"] || "127.0.0.1";

  // Strict CORS origin check for ALL requests including OPTIONS preflight
  const isOriginPermitted = validateOrigin(originHeader);
  if (!isOriginPermitted) {
    return {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
      },
      body: JSON.stringify({ error: "Forbidden: Origin not permitted." }),
    };
  }

  // Handle CORS preflight for permitted origins
  if (req.method === "OPTIONS") {
    return {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": originHeader || "https://mukangoafrica.co.za",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Stripe-Signature, X-PayFast-Signature",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin",
      },
      body: "",
    };
  }

  if (!enforcePayloadSizeLimit(req.rawBody)) {
    return jsonResponse(413, { error: "Payload Too Large: Request entity exceeds limit." }, originHeader);
  }

  const rateCheck = globalRateLimiter.check(`api_${clientIp}`);
  if (!rateCheck.allowed) {
    return jsonResponse(429, { error: `Too many requests. Retry after ${rateCheck.retryAfterSec}s.` }, originHeader);
  }

  const { pathname, searchParams } = req;

  // --- GET /api/health ---
  if (pathname === "/api/health" && req.method === "GET") {
    const paymentStatus = PaymentProviderManager.getProviderStatus();
    const dbStatus = ProductionOrderStore.isDatabaseConfigured();
    const dbPing = dbStatus.configured ? await ProductionOrderStore.getInstance().pingDatabase() : undefined;
    const emailConfigured = EmailDeliveryProvider.isConfigured();

    return jsonResponse(200, {
      status: "healthy",
      service: "Mukango Wa Africa Storefront API",
      authoritativeCurrency: "ZAR",
      timestamp: new Date().toISOString(),
      providers: paymentStatus,
      database: {
        ...dbStatus,
        ping: dbPing,
      },
      email: {
        configured: emailConfigured,
      },
    }, originHeader);
  }

  // --- POST /api/cart/validate ---
  if (pathname === "/api/cart/validate" && req.method === "POST") {
    try {
      const payload = JSON.parse(req.rawBody || "{}");
      const result = validateCartServerSide(payload);
      return jsonResponse(200, { success: true, result }, originHeader);
    } catch {
      return jsonResponse(400, { success: false, error: "Invalid JSON payload in cart validation." }, originHeader);
    }
  }

  // --- POST /api/checkout/create-session ---
  if (pathname === "/api/checkout/create-session" && req.method === "POST") {
    try {
      const payload = JSON.parse(req.rawBody || "{}");
      const host = Array.isArray(req.headers["host"]) ? req.headers["host"][0] : req.headers["host"];
      const protocol = req.headers["x-forwarded-proto"] || "http";
      const siteBaseUrl = `${protocol}://${host || "localhost:5173"}`;

      const sessionResponse = await processCheckoutSession(payload, siteBaseUrl);
      const statusCode = sessionResponse.status === "validation_error" ? 400 : sessionResponse.status === "config_error" ? 503 : 200;

      return jsonResponse(statusCode, sessionResponse, originHeader);
    } catch (err) {
      // Log the details server-side; return a safe generic message to the client.
      console.error("Checkout session processing failed:", err);
      return jsonResponse(500, {
        status: "config_error",
        errorMessage: "Internal error processing checkout session. Please try again or contact the atelier.",
      }, originHeader);
    }
  }

  // --- GET /api/checkout/order-status ---
  if (pathname === "/api/checkout/order-status" && req.method === "GET") {
    const ref = searchParams.get("ref") || searchParams.get("reference");
    if (!ref) {
      return jsonResponse(400, { error: "Missing order reference parameter." }, originHeader);
    }

    const order = await orderStore.getOrderByReference(ref);
    if (!order) {
      return jsonResponse(404, { error: "Order not found." }, originHeader);
    }

    return jsonResponse(200, { success: true, order }, originHeader);
  }

  // --- POST /api/webhooks/payment or /api/webhooks/payfast ---
  if ((pathname === "/api/webhooks/payment" || pathname === "/api/webhooks/payfast") && req.method === "POST") {
    const requestedProvider = (searchParams.get("provider") || (pathname.includes("payfast") ? "payfast" : "stripe")) as PaymentMethod;
    
    let signature: string | undefined;
    if (requestedProvider === "stripe") {
      signature = Array.isArray(req.headers["stripe-signature"])
        ? req.headers["stripe-signature"][0]
        : req.headers["stripe-signature"];
    } else {
      signature = Array.isArray(req.headers["x-payfast-signature"])
        ? req.headers["x-payfast-signature"][0]
        : req.headers["x-payfast-signature"];
    }

    const verification = await PaymentProviderManager.verifyWebhookEvent(requestedProvider, req.rawBody || "", signature);

    if (!verification.verified) {
      return jsonResponse(400, { error: verification.error || "Webhook verification failed." }, originHeader);
    }

    if (verification.isDuplicate) {
      return jsonResponse(200, { received: true, note: "Duplicate webhook event ignored." }, originHeader);
    }

    if (verification.orderReference && verification.paymentStatus === "paid") {
      await orderStore.updateStatus(verification.orderReference, "paid", `Payment verified via ${requestedProvider} webhook [${verification.eventId}]`);

      // Dispatch order confirmation email on successful payment
      const order = await orderStore.getOrderByReference(verification.orderReference);
      if (order) {
        EmailDeliveryProvider.sendOrderConfirmation(order).catch((err) => {
          console.warn("Could not dispatch paid order confirmation email:", err);
        });
      }
    }

    return jsonResponse(200, { received: true, eventId: verification.eventId, paymentStatus: verification.paymentStatus }, originHeader);
  }

  // --- POST /api/forms/contact ---
  if (pathname === "/api/forms/contact" && req.method === "POST") {
    try {
      const payload = JSON.parse(req.rawBody || "{}");
      const result = await handleContactFormSubmission(payload, clientIp);
      return jsonResponse(result.success ? 200 : 400, result, originHeader);
    } catch {
      return jsonResponse(400, { success: false, message: "Invalid contact form submission payload." }, originHeader);
    }
  }

  // --- POST /api/forms/bespoke ---
  if (pathname === "/api/forms/bespoke" && req.method === "POST") {
    try {
      const payload = JSON.parse(req.rawBody || "{}");
      const result = await handleBespokeFormSubmission(payload, clientIp);
      return jsonResponse(result.success ? 200 : 400, result, originHeader);
    } catch {
      return jsonResponse(400, { success: false, message: "Invalid bespoke form submission payload." }, originHeader);
    }
  }

  // --- POST /api/forms/newsletter ---
  if (pathname === "/api/forms/newsletter" && req.method === "POST") {
    try {
      const payload = JSON.parse(req.rawBody || "{}");
      const result = await handleNewsletterSubmission(payload, clientIp);
      return jsonResponse(result.success ? 200 : 400, result, originHeader);
    } catch {
      return jsonResponse(400, { success: false, message: "Invalid newsletter submission payload." }, originHeader);
    }
  }

  return jsonResponse(404, { error: `Endpoint '${pathname}' not found.` }, originHeader);
}
