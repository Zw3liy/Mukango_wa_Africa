import crypto from "crypto";
import { OrderRecord } from "../types/order";
import { PaymentMethod } from "../types/commerce";

export interface PaymentCreationResult {
  success: boolean;
  isConfigured: boolean;
  provider: PaymentMethod;
  redirectUrl?: string;
  sessionReference?: string;
  invoiceInstructions?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
    reference: string;
    amountDue: string;
  };
  errorMessage?: string;
}

export interface WebhookVerificationResult {
  verified: boolean;
  isDuplicate: boolean;
  eventId?: string;
  orderReference?: string;
  paymentStatus?: "paid" | "failed" | "pending";
  error?: string;
}

// In-memory idempotency store for processed webhook IDs
const PROCESSED_WEBHOOK_EVENTS = new Set<string>();

export class PaymentProviderManager {
  /**
   * Checks if a provider has all required production credentials in the environment.
   */
  public static getProviderStatus(): Record<PaymentMethod, { available: boolean; reason?: string }> {
    const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_"));
    const hasPayFast = Boolean(process.env.PAYFAST_MERCHANT_ID && process.env.PAYFAST_MERCHANT_KEY);

    return {
      stripe: {
        available: hasStripe,
        reason: hasStripe ? undefined : "STRIPE_SECRET_KEY environment variable is not configured.",
      },
      payfast: {
        available: hasPayFast,
        reason: hasPayFast ? undefined : "PAYFAST_MERCHANT_ID or PAYFAST_MERCHANT_KEY is not configured.",
      },
      wire_transfer: {
        available: true,
        reason: undefined,
      },
      bespoke_invoice: {
        available: true,
        reason: undefined,
      },
    };
  }

  /**
   * Initiates payment for an order through the chosen payment provider boundary.
   */
  public static async createPaymentSession(
    order: OrderRecord,
    siteBaseUrl: string
  ): Promise<PaymentCreationResult> {
    const { method } = order.payment;
    const amountDue = order.pricing.total;

    // Validate amount
    if (amountDue <= 0 || isNaN(amountDue)) {
      return {
        success: false,
        isConfigured: true,
        provider: method,
        errorMessage: "Invalid order amount. Amount must be greater than zero.",
      };
    }

    if (method === "stripe") {
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        return {
          success: false,
          isConfigured: false,
          provider: "stripe",
          errorMessage: "Stripe payment gateway is not configured. Server environment variable STRIPE_SECRET_KEY is required.",
        };
      }

      // If Stripe credentials are present, invoke Stripe Checkout Session creation
      try {
        const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            "client_reference_id": order.id,
            "success_url": `${siteBaseUrl}/checkout/confirmation?ref=${order.reference}`,
            "cancel_url": `${siteBaseUrl}/checkout/cancel?ref=${order.reference}`,
            "payment_method_types[0]": "card",
            "mode": "payment",
            "customer_email": order.customer.email,
            "line_items[0][price_data][currency]": "usd",
            "line_items[0][price_data][product_data][name]": `Mukango Wa Africa Order #${order.id}`,
            "line_items[0][price_data][unit_amount]": Math.round(amountDue * 100).toString(),
            "line_items[0][quantity]": "1",
          }).toString(),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          return {
            success: false,
            isConfigured: true,
            provider: "stripe",
            errorMessage: errData?.error?.message || `Stripe API error (${response.status})`,
          };
        }

        const session = await response.json();
        return {
          success: true,
          isConfigured: true,
          provider: "stripe",
          redirectUrl: session.url,
          sessionReference: session.id,
        };
      } catch (err) {
        return {
          success: false,
          isConfigured: true,
          provider: "stripe",
          errorMessage: err instanceof Error ? err.message : "Failed to connect to Stripe API.",
        };
      }
    }

    if (method === "payfast") {
      const merchantId = process.env.PAYFAST_MERCHANT_ID;
      const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
      if (!merchantId || !merchantKey) {
        return {
          success: false,
          isConfigured: false,
          provider: "payfast",
          errorMessage: "PayFast payment gateway is not configured. PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY are required.",
        };
      }

      // Prepare PayFast form redirect
      const isSandbox = process.env.PAYFAST_SANDBOX !== "false";
      const baseUrl = isSandbox ? "https://sandbox.payfast.co.za" : "https://www.payfast.co.za";
      const returnUrl = `${siteBaseUrl}/checkout/confirmation?ref=${order.reference}`;
      const cancelUrl = `${siteBaseUrl}/checkout/cancel?ref=${order.reference}`;

      const params = new URLSearchParams({
        merchant_id: merchantId,
        merchant_key: merchantKey,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        m_payment_id: order.id,
        amount: amountDue.toFixed(2),
        item_name: `Mukango Wa Africa Order ${order.id}`,
      });

      return {
        success: true,
        isConfigured: true,
        provider: "payfast",
        redirectUrl: `${baseUrl}/eng/process?${params.toString()}`,
        sessionReference: order.id,
      };
    }

    if (method === "wire_transfer" || method === "bespoke_invoice") {
      // Official Pro-Forma Bank Wire instructions
      return {
        success: true,
        isConfigured: true,
        provider: method,
        sessionReference: `INV-${order.id}`,
        invoiceInstructions: {
          bankName: "First National Bank Zambia (FNB) / Standard Chartered Lusaka",
          accountName: "Mukango Wa Africa Artisans Ltd",
          accountNumber: "6289-4019-2041",
          swiftCode: "FIRNZMLX",
          reference: `ORD-${order.id}`,
          amountDue: `$${amountDue.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD`,
        },
      };
    }

    return {
      success: false,
      isConfigured: false,
      provider: method,
      errorMessage: `Unsupported payment provider '${method}'.`,
    };
  }

  /**
   * Handles webhook verification with strict HMAC signature & idempotency checking.
   */
  public static verifyWebhookEvent(
    provider: PaymentMethod,
    rawPayload: string,
    signatureHeader: string | undefined
  ): WebhookVerificationResult {
    if (!rawPayload) {
      return { verified: false, isDuplicate: false, error: "Empty webhook payload." };
    }

    if (provider === "stripe") {
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!secret) {
        return {
          verified: false,
          isDuplicate: false,
          error: "STRIPE_WEBHOOK_SECRET is not configured on the server.",
        };
      }

      if (!signatureHeader) {
        return {
          verified: false,
          isDuplicate: false,
          error: "Missing Stripe-Signature header.",
        };
      }

      // Parse Stripe signature header format: t=timestamp,v1=signature
      const parts = signatureHeader.split(",").reduce((acc, curr) => {
        const [k, v] = curr.split("=");
        if (k && v) acc[k.trim()] = v.trim();
        return acc;
      }, {} as Record<string, string>);

      const timestamp = parts["t"];
      const signature = parts["v1"];

      if (!timestamp || !signature) {
        return {
          verified: false,
          isDuplicate: false,
          error: "Malformed Stripe-Signature header.",
        };
      }

      // Prevent replay attacks (tolerance 5 minutes)
      const nowSec = Math.floor(Date.now() / 1000);
      const timeDiff = Math.abs(nowSec - parseInt(timestamp, 10));
      if (isNaN(timeDiff) || timeDiff > 300) {
        return {
          verified: false,
          isDuplicate: false,
          error: "Webhook signature timestamp is outside acceptable tolerance window.",
        };
      }

      const signedPayload = `${timestamp}.${rawPayload}`;
      const expectedSignature = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

      if (expectedSignature !== signature) {
        return {
          verified: false,
          isDuplicate: false,
          error: "Invalid webhook HMAC signature.",
        };
      }

      try {
        const event = JSON.parse(rawPayload);
        const eventId = event.id;

        if (PROCESSED_WEBHOOK_EVENTS.has(eventId)) {
          return {
            verified: true,
            isDuplicate: true,
            eventId,
            orderReference: event.data?.object?.client_reference_id,
          };
        }

        PROCESSED_WEBHOOK_EVENTS.add(eventId);

        const paymentStatus = event.type === "checkout.session.completed" ? "paid" : "pending";
        return {
          verified: true,
          isDuplicate: false,
          eventId,
          orderReference: event.data?.object?.client_reference_id,
          paymentStatus,
        };
      } catch {
        return { verified: false, isDuplicate: false, error: "Failed to parse webhook JSON payload." };
      }
    }

    return {
      verified: false,
      isDuplicate: false,
      error: `Webhook verification not supported for provider '${provider}'.`,
    };
  }
}
