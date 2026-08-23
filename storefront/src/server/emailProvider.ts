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
   * Checks if an email transport is configured (e.g. Resend, SendGrid, or SMTP).
   */
  public static isConfigured(): boolean {
    return Boolean(process.env.RESEND_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER));
  }

  /**
   * Dispatches email or fails safely with explicit configuration report.
   */
  public static async sendEmail(payload: SendEmailPayload): Promise<EmailDeliveryResult> {
    const resendKey = process.env.RESEND_API_KEY;

    if (!this.isConfigured()) {
      return {
        sent: false,
        isConfigured: false,
        error: "Email delivery provider is not configured. Server environment variable RESEND_API_KEY is missing.",
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
            from: process.env.EMAIL_FROM || "Mukango Wa Africa <enquiries@mukangowaafrica.com>",
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
}
