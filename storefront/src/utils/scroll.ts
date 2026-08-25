/**
 * Motion-aware scrolling helpers.
 * Honors the user's `prefers-reduced-motion` operating-system setting:
 * smooth scrolling is only used when the visitor has not requested reduced motion.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToTop(): void {
  if (typeof window === "undefined") return;
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}
