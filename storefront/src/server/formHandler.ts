import { ContactFormData, BespokeCommissionFormData, NewsletterFormData, FormSubmissionResult } from "../types/forms";
import { isValidEmail, isValidPhone, sanitizeText } from "../utils/sanitize";
import { formRateLimiter } from "./rateLimiter";
import { EmailDeliveryProvider } from "./emailProvider";
import crypto from "crypto";

export async function handleContactFormSubmission(
  rawInput: Partial<ContactFormData>,
  clientIp: string = "anonymous"
): Promise<FormSubmissionResult> {
  // 1. Rate limiting check
  const rateLimit = formRateLimiter.check(`contact_${clientIp}`);
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Too many submissions. Please wait ${rateLimit.retryAfterSec} seconds before sending another message.`,
    };
  }

  // 2. Honeypot check
  if (rawInput.botField && rawInput.botField.trim() !== "") {
    return {
      success: false,
      message: "Spam bot submission rejected.",
    };
  }

  // 3. Validation
  const errors: Record<string, string> = {};
  const name = sanitizeText(rawInput.name, 100);
  const email = (rawInput.email || "").trim();
  const message = sanitizeText(rawInput.message, 3000);
  const subject = sanitizeText(rawInput.subject || "General Enquiry", 150);
  const phone = sanitizeText(rawInput.phone, 30);

  if (!name || name.length < 2) {
    errors.name = "Full name is required (minimum 2 characters).";
  }

  if (!isValidEmail(email)) {
    errors.email = "A valid email address is required.";
  }

  if (!message || message.length < 10) {
    errors.message = "Please include a detailed message (minimum 10 characters).";
  }

  if (phone && !isValidPhone(phone)) {
    errors.phone = "Invalid phone number format.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors,
    };
  }

  const submissionId = `MWA-ENQ-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "enquiries@mukangoafrica.co.za";

  // 4. Dispatch email to receiver
  const emailHtml = `
    <h2>New Customer Enquiry [${submissionId}]</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <blockquote>${message}</blockquote>
  `;

  const emailResult = await EmailDeliveryProvider.sendEmail({
    to: receiverEmail,
    subject: `[Mukango Wa Africa] ${subject} (${submissionId})`,
    htmlContent: emailHtml,
    replyTo: email,
  });

  if (!emailResult.isConfigured) {
    // Honest reporting: notify client that form was validated but email transport is not configured in sandbox
    return {
      success: true,
      isConfigurationFailure: true,
      submissionId,
      receivedAt: new Date().toISOString(),
      message: `Thank you, ${name}. Your enquiry #${submissionId} was validated. Note: In this deployment environment, email delivery provider (RESEND_API_KEY) is unconfigured; please reach us directly at ${receiverEmail}.`,
    };
  }

  if (!emailResult.sent) {
    return {
      success: false,
      message: `Failed to deliver message: ${emailResult.error || "Email provider error"}`,
    };
  }

  return {
    success: true,
    submissionId,
    receivedAt: new Date().toISOString(),
    message: `Thank you, ${name}. Your enquiry (#${submissionId}) has been received. Our atelier team will respond within 24 to 48 hours.`,
  };
}

export async function handleBespokeFormSubmission(
  rawInput: Partial<BespokeCommissionFormData>,
  clientIp: string = "anonymous"
): Promise<FormSubmissionResult> {
  const rateLimit = formRateLimiter.check(`bespoke_${clientIp}`);
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Too many submissions. Please wait ${rateLimit.retryAfterSec} seconds.`,
    };
  }

  if (rawInput.botField && rawInput.botField.trim() !== "") {
    return { success: false, message: "Spam bot rejected." };
  }

  const errors: Record<string, string> = {};
  const fullName = sanitizeText(rawInput.fullName, 100);
  const email = (rawInput.email || "").trim();
  const phone = sanitizeText(rawInput.phone, 30);
  const country = sanitizeText(rawInput.country, 60);
  const pieceType = sanitizeText(rawInput.pieceType, 50);
  const preferredTimber = sanitizeText(rawInput.preferredTimber, 100);
  const description = sanitizeText(rawInput.projectDescription, 4000);

  if (!fullName || fullName.length < 2) errors.fullName = "Full name is required.";
  if (!isValidEmail(email)) errors.email = "Valid email is required.";
  if (!country) errors.country = "Country of delivery is required.";
  if (!pieceType) errors.pieceType = "Please select the type of piece.";
  if (!description || description.length < 15) errors.projectDescription = "Please provide details about your space, dimensions, or design vision (min 15 characters).";

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the errors in the commission form.",
      errors,
    };
  }

  const submissionId = `MWA-BESPOKE-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "bespoke@mukangoafrica.co.za";

  const emailHtml = `
    <h2>New Bespoke Commission Request [${submissionId}]</h2>
    <p><strong>Client:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "N/A"}</p>
    <p><strong>Delivery Destination:</strong> ${country}</p>
    <p><strong>Piece Type:</strong> ${pieceType}</p>
    <p><strong>Preferred Timber:</strong> ${preferredTimber || "Artisan Recommendation"}</p>
    <p><strong>Budget Range (ZAR):</strong> ${rawInput.budgetRangeZar || "Flexible"}</p>
    <p><strong>Space / Setting:</strong> ${rawInput.intendedSpace || "Residential"}</p>
    <p><strong>Project Vision & Requirements:</strong></p>
    <blockquote>${description}</blockquote>
  `;

  const emailResult = await EmailDeliveryProvider.sendEmail({
    to: receiverEmail,
    subject: `[Bespoke Commission] ${pieceType} for ${fullName} (${submissionId})`,
    htmlContent: emailHtml,
    replyTo: email,
  });

  if (!emailResult.isConfigured) {
    return {
      success: true,
      isConfigurationFailure: true,
      submissionId,
      receivedAt: new Date().toISOString(),
      message: `Thank you, ${fullName}. Your bespoke commission #${submissionId} was validated. Note: Live email transport is unconfigured in this environment.`,
    };
  }

  return {
    success: true,
    submissionId,
    receivedAt: new Date().toISOString(),
    message: `Thank you, ${fullName}! Your bespoke commission enquiry (#${submissionId}) has been registered. Chiwama Kennedy Daka and our design team will review your specifications and contact you with initial concept sketches.`,
  };
}

export async function handleNewsletterSubmission(
  rawInput: Partial<NewsletterFormData>,
  clientIp: string = "anonymous"
): Promise<FormSubmissionResult> {
  const rateLimit = formRateLimiter.check(`news_${clientIp}`);
  if (!rateLimit.allowed) {
    return { success: false, message: "Please slow down." };
  }

  if (rawInput.botField && rawInput.botField.trim() !== "") {
    return { success: false, message: "Spam rejected." };
  }

  const email = (rawInput.email || "").trim();
  if (!isValidEmail(email)) {
    return { success: false, message: "Please provide a valid email address." };
  }

  const endpoint = process.env.NEWSLETTER_SUBSCRIBE_URL?.trim();
  if (!endpoint) {
    return {
      success: false,
      isConfigurationFailure: true,
      message: "The Private Atelier Registry is not configured in this deployment. Please contact hello@mukangoafrica.co.za.",
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEWSLETTER_API_KEY ? { Authorization: `Bearer ${process.env.NEWSLETTER_API_KEY}` } : {}),
      },
      body: JSON.stringify({ email, interests: rawInput.interests || [], source: "private-atelier-registry" }),
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) {
      return { success: false, message: "The Private Atelier Registry could not accept the subscription. Please try again." };
    }
  } catch (error) {
    console.error("Newsletter provider failed:", error);
    return { success: false, message: "The Private Atelier Registry is temporarily unavailable. Please try again." };
  }

  return {
    success: true,
    receivedAt: new Date().toISOString(),
    message: `Welcome to the Mukango Collectors Circle. You will receive private previews of new releases and atelier journals.`,
  };
}
