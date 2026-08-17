/**
 * GA4 bootstrap — only loads when `VITE_GA_MEASUREMENT_ID` is set (e.g. G-XXXXXXXX).
 * Existing waitlist/checkout calls already use `window.gtag` when present.
 */
export function initGa4() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  if (!id || !id.startsWith("G-")) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  };
  w.gtag("js", new Date());
  w.gtag("config", id, { anonymize_ip: true });
}
