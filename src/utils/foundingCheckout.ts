import { CONTENT } from "../constants/content";

export function buildFoundingCheckoutUrl(): string {
  const baseUrl = CONTENT.revenue.foundingStripeCheckoutUrl;
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source") || "direct";
  const utmMedium = params.get("utm_medium") || "";
  const utmCampaign = params.get("utm_campaign") || "";
  const ref = [utmSource, utmMedium, utmCampaign].filter(Boolean).join("_");
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}client_reference_id=${encodeURIComponent(ref)}`;
}

export function openFoundingCheckout(eventLabel = "stripe_payment"): void {
  window.open(buildFoundingCheckoutUrl(), "_blank", "noopener,noreferrer");
  const win = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof win.gtag !== "undefined") {
    win.gtag("event", "founding_member_checkout_click", {
      event_category: "conversion",
      event_label: eventLabel,
    });
  }
}

export function scrollToWaitlist(): void {
  const section = document.getElementById("email-section");
  section?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    document.getElementById("waitlist-email-input")?.focus({ preventScroll: true });
  }, 450);
}
