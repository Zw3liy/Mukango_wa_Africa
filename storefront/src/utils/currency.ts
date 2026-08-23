import { Currency } from "../types/commerce";

// Conversion rates relative to USD baseline for estimated customer display
const FX_RATES: Record<Currency, number> = {
  USD: 1.0,
  ZAR: 18.5,
  EUR: 0.92,
  GBP: 0.78,
  ZMW: 26.5,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  ZAR: "R ",
  EUR: "€",
  GBP: "£",
  ZMW: "K ",
};

export function formatPrice(amountUsd: number, currency: Currency = "USD"): string {
  const rate = FX_RATES[currency] ?? 1.0;
  const converted = amountUsd * rate;
  const symbol = CURRENCY_SYMBOLS[currency] ?? "$";

  // Use standard formatting with comma separation
  const formattedNumber = Math.round(converted).toLocaleString("en-US");
  return `${symbol}${formattedNumber}`;
}

export function formatUsd(amountUsd: number): string {
  return `$${Math.round(amountUsd).toLocaleString("en-US")}`;
}
