const MOBILE_MAX_WIDTH_MQ = "(max-width: 767px)";

/** Sticky header height (includes safe-area when present on the fixed bar). */
function measureStickyHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>(".bawo-site-header");
  if (header) {
    return Math.ceil(header.getBoundingClientRect().height);
  }
  // Fallback: --bawo-header-height (3.5rem) on the narrowest breakpoint
  return 56;
}

/**
 * Scroll so the waitlist email field + Join Waitlist control are clearly in view.
 * Targets the form (not just #email-section), accounts for the fixed header, and
 * overshoots on mobile so the form isn't left under the fold or tight under chrome.
 */
export function scrollToWaitlist(): void {
  const target =
    document.getElementById("waitlist-form") ??
    document.getElementById("waitlist-email-input") ??
    document.getElementById("email-section");

  if (!target) return;

  const isMobile = window.matchMedia(MOBILE_MAX_WIDTH_MQ).matches;
  const headerOffset = measureStickyHeaderOffset();

  // Extra top gap below the sticky header. Mobile overshoots more so the email
  // input and submit button sit clearly in the usable viewport (above the
  // fixed mobile sticky CTA at --bawo-mobile-sticky-cta-height).
  const breathRoom = isMobile ? 64 : 24;

  const absoluteTop = target.getBoundingClientRect().top + window.scrollY;
  const nextY = Math.max(0, absoluteTop - headerOffset - breathRoom);

  window.scrollTo({ top: nextY, behavior: "smooth" });

  window.setTimeout(() => {
    document
      .getElementById("waitlist-email-input")
      ?.focus({ preventScroll: true });
  }, 500);
}
