import { OrderRecord } from "../types/order";
import { formatCurrency } from "../utils/currency";

export interface SendEmailPayload {
  to: string;
  subject: string;
  htmlContent: string;
  replyTo?: string;
}

export interface EmailDeliveryResult {
  sent: boolean;
  isConfigured: boolean;
  messageId?: string;
  error?: string;
}

export class EmailDeliveryProvider {
  /**
   * Checks if an email transport is configured (e.g. Resend or SMTP).
   */
  public static isConfigured(): boolean {
    const resendKey = process.env.RESEND_API_KEY;
    const hasValidKey = Boolean(resendKey && resendKey.startsWith("re_") && resendKey !== "re_...");
    return hasValidKey || Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
  }

  /**
   * Dispatches email or fails safely with explicit configuration report.
   */
  public static async sendEmail(payload: SendEmailPayload): Promise<EmailDeliveryResult> {
    const resendKey = process.env.RESEND_API_KEY;
    const isConfigured = this.isConfigured();

    if (!isConfigured) {
      // In test mode or when ALLOW_TEST_MEMORY_STORE is set, simulate successful delivery
      if (process.env.NODE_ENV === "test" || process.env.ALLOW_TEST_MEMORY_STORE === "true") {
        return {
          sent: true,
          isConfigured: false,
          messageId: `sim_msg_${Date.now()}`,
        };
      }
      return {
        sent: false,
        isConfigured: false,
        error: "Email delivery provider is not configured. Server environment variable RESEND_API_KEY is missing or contains placeholder.",
      };
    }

    if (resendKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "Mukango Wa Africa <orders@mukangowaafrica.com>",
            to: payload.to,
            subject: payload.subject,
            html: payload.htmlContent,
            reply_to: payload.replyTo,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          return {
            sent: false,
            isConfigured: true,
            error: err?.message || `Resend API rejected transmission (${response.status})`,
          };
        }

        const resData = await response.json();
        return {
          sent: true,
          isConfigured: true,
          messageId: resData.id,
        };
      } catch (err) {
        return {
          sent: false,
          isConfigured: true,
          error: err instanceof Error ? err.message : "Network error contacting email provider API.",
        };
      }
    }

    return {
      sent: false,
      isConfigured: false,
      error: "No supported email provider configured.",
    };
  }

  /**
   * Generates a branded HTML email for order confirmation and pro-forma invoice.
   */
  public static generateOrderConfirmationHtml(order: OrderRecord): string {
    const currency = order.pricing.currency || "ZAR";
    const itemsHtml = order.items
      .map(
        (item) => `
          <tr style="border-bottom: 1px solid #e7e5e4;">
            <td style="padding: 12px 0;">
              <strong style="color: #4F2607;">${item.product.name}</strong><br />
              <span style="font-size: 12px; color: #78716c;">Finish: ${item.selectedFinish.name}${
                item.customEngraving ? ` • Engraving: "${item.customEngraving}"` : ""
              }</span>
            </td>
            <td style="padding: 12px 0; text-align: center; color: #44403c;">${item.quantity}</td>
            <td style="padding: 12px 0; text-align: right; color: #4F2607; font-weight: 600;">
              ${formatCurrency(item.product.basePriceUsd * (currency === "ZAR" ? 18.5 : 1) * item.quantity, currency)}
            </td>
          </tr>
        `
      )
      .join("");

    const isWire = order.payment.method === "wire_transfer" || order.payment.method === "bespoke_invoice";
    const bankSection = isWire
      ? `
        <div style="background-color: #FAF9F6; border: 1px solid #D4B896; border-radius: 6px; padding: 16px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #4F2607; font-family: Georgia, serif; font-size: 16px;">Bank Wire / Pro-Forma Instructions</h3>
          <p style="font-size: 13px; color: #57534e; margin-bottom: 8px;">Please arrange swift transfer with the following details:</p>
          <table style="width: 100%; font-size: 13px; color: #292524;">
            <tr><td><strong>Bank:</strong></td><td>${process.env.BANK_NAME || "Stanbic Bank Zambia"}</td></tr>
            <tr><td><strong>Account Name:</strong></td><td>${process.env.BANK_ACCOUNT_NAME || "Mukango Wa Africa Artisans"}</td></tr>
            <tr><td><strong>Account Number:</strong></td><td>${process.env.BANK_ACCOUNT_NUMBER || "913000482910"}</td></tr>
            <tr><td><strong>SWIFT Code:</strong></td><td>${process.env.BANK_SWIFT_CODE || "SBICZMLX"}</td></tr>
            <tr><td><strong>Payment Reference:</strong></td><td>ORD-${order.id}</td></tr>
            <tr><td><strong>Amount Due:</strong></td><td><strong>${formatCurrency(order.pricing.total, currency)}</strong></td></tr>
          </table>
        </div>
      `
      : "";

    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 24px; color: #292524;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #D4B896;">
          <div style="background-color: #4F2607; padding: 28px; text-align: center;">
            <h1 style="color: #FAF9F6; font-family: Georgia, serif; font-size: 24px; margin: 0; letter-spacing: 1px;">MUKANGO WA AFRICA</h1>
            <p style="color: #D4B896; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 4px 0 0 0;">Zambian Hardwood Atelier</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #4F2607; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">Commission Confirmation #${order.id}</h2>
            <p style="font-size: 14px; color: #57534e; line-height: 1.6;">
              Dear ${order.customer.firstName} ${order.customer.lastName},<br /><br />
              Thank you for commissioning an heirloom piece with Mukango Wa Africa. Your order has been recorded in our master register.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="border-bottom: 2px solid #4F2607; text-align: left; font-size: 12px; text-transform: uppercase; color: #8B6F47;">
                  <th style="padding-bottom: 8px;">Piece & Specifications</th>
                  <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                  <th style="padding-bottom: 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div style="text-align: right; font-size: 13px; color: #57534e; margin-top: 12px;">
              <p style="margin: 4px 0;">Subtotal: <strong>${formatCurrency(order.pricing.subtotal, currency)}</strong></p>
              <p style="margin: 4px 0;">Phytosanitary Crated Freight: <strong>${formatCurrency(order.pricing.shippingEstimate, currency)}</strong></p>
              <p style="margin: 4px 0;">Transit Insurance: <strong>${formatCurrency(order.pricing.insuranceAndHandling, currency)}</strong></p>
              ${
                order.pricing.appliedDiscount
                  ? `<p style="margin: 4px 0; color: #047857;">Privilege (${order.pricing.appliedDiscount.code}): <strong>-${formatCurrency(
                      order.pricing.appliedDiscount.amount,
                      currency
                    )}</strong></p>`
                  : ""
              }
              <h3 style="font-size: 18px; color: #4F2607; margin: 12px 0 0 0; font-family: Georgia, serif;">Total: ${formatCurrency(order.pricing.total, currency)}</h3>
            </div>
            ${bankSection}
            <div style="border-top: 1px solid #e7e5e4; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #78716c; line-height: 1.5;">
              <p><strong>Delivery Destination:</strong> ${order.shippingAddress.streetLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}</p>
              <p><strong>Heirloom Guarantee:</strong> All timber pieces are certified for 25 years against structural joinery failure.</p>
              <p>Questions? Contact our master craftsman atelier directly at <a href="mailto:enquiries@mukangowaafrica.com" style="color: #8B6F47;">enquiries@mukangowaafrica.com</a>.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Dispatches order confirmation email to patron.
   */
  public static async sendOrderConfirmation(order: OrderRecord): Promise<EmailDeliveryResult> {
    const htmlContent = this.generateOrderConfirmationHtml(order);
    return this.sendEmail({
      to: order.customer.email,
      subject: `[Mukango Wa Africa] Heirloom Commission Confirmation #${order.id}`,
      htmlContent,
    });
  }
}
