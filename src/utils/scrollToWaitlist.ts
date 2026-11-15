/** Scroll to the on-site Join BawoSocial email signup. */
export function scrollToWaitlist(): void {
  const target =
    document.getElementById("join") ||
    document.getElementById("early-access") ||
    document.getElementById("email-section");
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    (
      document.getElementById("join-email-input") ||
      document.getElementById("waitlist-email-input")
    )?.focus({ preventScroll: true });
  }, 450);
}
