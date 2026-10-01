export function scrollToWaitlist(): void {
  const section = document.getElementById("email-section");
  section?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    document.getElementById("waitlist-email-input")?.focus({ preventScroll: true });
  }, 450);
}
