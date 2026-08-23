/**
 * Security and sanitization utilities for client and server form inputs
 */
/* eslint-disable no-control-regex */

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizeText(input: unknown, maxLength: number = 2000): string {
  if (typeof input !== "string") {
    return "";
  }
  // Strip control characters, normalize whitespace, trim, escape
  const cleaned = input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
    .trim()
    .slice(0, maxLength);

  return escapeHtml(cleaned);
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  // RFC 5322 compliant regex simplified for practical production validation
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim()) && email.length <= 254;
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Phone might be optional
  // Allow digits, spaces, plus sign, parentheses, dashes
  const re = /^\+?[0-9\s\-()]{7,25}$/;
  return re.test(phone.trim());
}

export function isValidPostalCode(postalCode: string): boolean {
  if (!postalCode) return false;
  return postalCode.trim().length >= 2 && postalCode.trim().length <= 15;
}
