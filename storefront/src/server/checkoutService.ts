import crypto from "crypto";
import { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse, OrderRecord } from "../types/order";
import { validateCartServerSide } from "./cartValidator";
import { orderStore } from "./orderStore";
import { PaymentProviderManager } from "./paymentProvider";
import { isValidEmail, isValidPhone, sanitizeText } from "../utils/sanitize";

export async function processCheckoutSession(
  request: CreateCheckoutSessionRequest,
  siteBaseUrl: string
): Promise<CreateCheckoutSessionResponse> {
  // 1. Authoritative Cart Validation
  const cartValidation = validateCartServerSide({
    items: request.items,
  });

  if (!cartValidation.isValid || cartValidation.authoritativeItems.length === 0) {
    return {
      orderId: "",
      reference: "",
      status: "validation_error",
      errorMessage: cartValidation.errors.join("; ") || "Invalid cart contents.",
      pricingAuthoritative: cartValidation.pricing,
    };
  }

  // 2. Validate Customer Details
  const customer = request.customer;
  const firstName = sanitizeText(customer?.firstName, 50);
  const lastName = sanitizeText(customer?.lastName, 50);
  const email = (customer?.email || "").trim();
  const phone = sanitizeText(customer?.phone, 30);

  if (!firstName || !lastName) {
    return {
      orderId: "",
      reference: "",
      status: "validation_error",
      errorMessage: "First name and last name are required.",
      pricingAuthoritative: cartValidation.pricing,
    };
  }

  if (!isValidEmail(email)) {
    return {
      orderId: "",
      reference: "",
      status: "validation_error",
      errorMessage: "A valid customer email address is required.",
      pricingAuthoritative: cartValidation.pricing,
    };
  }

  if (phone && !isValidPhone(phone)) {
    return {
      orderId: "",
      reference: "",
      status: "validation_error",
      errorMessage: "A valid contact phone number is required for freight delivery coordination.",
      pricingAuthoritative: cartValidation.pricing,
    };
  }

  // 3. Validate Shipping Address
  const addr = request.shippingAddress;
  const streetLine1 = sanitizeText(addr?.streetLine1, 100);
  const city = sanitizeText(addr?.city, 50);
  const country = sanitizeText(addr?.country, 50);
  const postalCode = sanitizeText(addr?.postalCode, 20);

  if (!streetLine1 || !city || !country || !postalCode) {
    return {
      orderId: "",
      reference: "",
      status: "validation_error",
      errorMessage: "Complete shipping address (street, city, country, postal code) is required.",
      pricingAuthoritative: cartValidation.pricing,
    };
  }

  // 4. Generate Order Identity
  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  const orderId = `MWA-${new Date().getFullYear()}-${orderNumber}`;
  const reference = crypto.randomBytes(16).toString("hex");

  const orderRecord: OrderRecord = {
    id: orderId,
    reference,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: request.paymentMethod === "wire_transfer" || request.paymentMethod === "bespoke_invoice" ? "pending_payment" : "draft",
    customer: {
      firstName,
      lastName,
      email,
      phone,
      company: sanitizeText(customer?.company, 100),
      notes: sanitizeText(customer?.notes, 500),
    },
    shippingAddress: {
      streetLine1,
      streetLine2: sanitizeText(addr.streetLine2, 100),
      city,
      stateProvince: sanitizeText(addr.stateProvince, 50),
      postalCode,
      country,
    },
    items: cartValidation.authoritativeItems,
    pricing: cartValidation.pricing,
    payment: {
      method: request.paymentMethod,
    },
    timeline: [
      {
        timestamp: new Date().toISOString(),
        status: "draft",
        note: `Order initiated via ${request.paymentMethod}`,
      },
    ],
  };

  // 5. Save Order to Durable Store
  const saveResult = await orderStore.saveOrder(orderRecord);
  if (!saveResult.success) {
    return {
      orderId: "",
      reference: "",
      status: "config_error",
      errorMessage: `Database persistence failed: ${saveResult.error || "Unable to save order"}`,
      pricingAuthoritative: cartValidation.pricing,
    };
  }

  // 6. Invoke Payment Provider Boundary
  const paymentResult = await PaymentProviderManager.createPaymentSession(orderRecord, siteBaseUrl);

  if (!paymentResult.isConfigured) {
    return {
      orderId,
      reference,
      status: "config_error",
      errorMessage: paymentResult.errorMessage || `Payment gateway '${request.paymentMethod}' is not configured in this environment.`,
      pricingAuthoritative: cartValidation.pricing,
    };
  }

  if (!paymentResult.success) {
    return {
      orderId,
      reference,
      status: "config_error",
      errorMessage: paymentResult.errorMessage || "Payment initiation failed.",
      pricingAuthoritative: cartValidation.pricing,
    };
  }

  if (request.paymentMethod === "wire_transfer" || request.paymentMethod === "bespoke_invoice") {
    return {
      orderId,
      reference,
      status: "invoice_created",
      invoiceInstructions: paymentResult.invoiceInstructions,
      pricingAuthoritative: cartValidation.pricing,
    };
  }

  return {
    orderId,
    reference,
    status: "redirect_required",
    redirectUrl: paymentResult.redirectUrl,
    pricingAuthoritative: cartValidation.pricing,
  };
}
