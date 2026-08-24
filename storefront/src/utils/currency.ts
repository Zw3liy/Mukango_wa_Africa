import { Currency } from "../types/commerce";

// Conversion rates relative to USD baseline for estimated customer display
export const FX_RATES: Record<Currency, number> = {
  USD: 1.0,
  ZAR: 18.5,
  EUR: 0.92,
  GBP: 0.78,
  ZMW: 26.5,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  ZAR: "R ",
  EUR: "€",
  GBP: "£",
  ZMW: "K ",
};

// Authoritative default currency is South African Rand (ZAR) for Mukango Wa Africa atelier transactions
export const DEFAULT_CURRENCY: Currency =
  (typeof process !== "undefined" && (process.env?.DEFAULT_CURRENCY as Currency)) || "ZAR";

/**
 * Formats a catalog base USD price into the target display currency.
 * Defaults authoritatively to ZAR (South African Rand).
 */
export function formatPrice(amountUsd: number, currency: Currency = DEFAULT_CURRENCY): string {
  const rate = FX_RATES[currency] ?? 1.0;
  const converted = amountUsd * rate;
  const symbol = CURRENCY_SYMBOLS[currency] ?? "$";

  // Use standard formatting with comma separation
  const formattedNumber = Math.round(converted).toLocaleString("en-US");
  return `${symbol}${formattedNumber}`;
}

/**
 * Formats an amount that is already in the target currency (e.g. from PricingBreakdown).
 */
export function formatCurrency(amountInCurrency: number, currency: Currency = DEFAULT_CURRENCY): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "$";
  const formattedNumber = Math.round(amountInCurrency).toLocaleString("en-US");
  return `${symbol}${formattedNumber}`;
}

/**
 * Explicit helper to format in USD regardless of default.
 */
export function formatUsd(amountUsd: number): string {
  return `$${Math.round(amountUsd).toLocaleString("en-US")}`;
}

/**
 * Explicit helper to format in South African Rand (ZAR).
 */
export function formatZar(amountUsd: number): string {
  return formatPrice(amountUsd, "ZAR");
}

/**
 * Converts a base USD amount to a target currency number.
 */
export function convertFromUsd(amountUsd: number, targetCurrency: Currency = DEFAULT_CURRENCY): number {
  const rate = FX_RATES[targetCurrency] ?? 1.0;
  return Math.round(amountUsd * rate);
}

/**
 * Returns the currency symbol for a given currency code.
 */
export function getCurrencySymbol(currency: Currency = DEFAULT_CURRENCY): string {
  return CURRENCY_SYMBOLS[currency] ?? "R ";
}
