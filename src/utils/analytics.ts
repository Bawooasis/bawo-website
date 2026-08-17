/**
 * GA4 helpers. The primary tag loads from `index.html` (G-NSB2T654F4).
 * This module only bootstraps if that snippet is missing (e.g. local preview
 * without the HTML tag) and `VITE_GA_MEASUREMENT_ID` is set.
 */
const DEFAULT_GA_ID = "G-NSB2T654F4";

export function initGa4() {
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  // Already installed via index.html — don't double-load.
  if (typeof w.gtag === "function") return;

  const id =
    (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || DEFAULT_GA_ID;
  if (!id.startsWith("G-")) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  };
  w.gtag("js", new Date());
  w.gtag("config", id);
}
