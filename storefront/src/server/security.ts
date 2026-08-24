import crypto from "crypto";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://mukangoafrica.co.za",
  "https://www.mukangoafrica.co.za",
  "https://mukangowaafrica.com",
  "https://www.mukangowaafrica.com",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
];

export function validateOrigin(
  originHeader: string | undefined,
  allowedOrigins: string[] = DEFAULT_ALLOWED_ORIGINS
): boolean {
  if (!originHeader) return true; // Direct same-origin browser request or serverless invocation
  const originClean = originHeader.toLowerCase().trim();

  // Allow configured production/staging origins and preview environments (.e2b.app, .netlify.app)
  return (
    allowedOrigins.some((allowed) => originClean === allowed.toLowerCase()) ||
    originClean.endsWith(".e2b.app") ||
    originClean.endsWith(".netlify.app")
  );
}

export function enforcePayloadSizeLimit(rawBody: string | undefined, maxBytes: number = 64 * 1024): boolean {
  if (!rawBody) return true;
  return Buffer.byteLength(rawBody, "utf8") <= maxBytes;
}

export function verifyHmacSignature(payload: string, signature: string, secret: string): boolean {
  if (!payload || !signature || !secret) return false;
  try {
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
