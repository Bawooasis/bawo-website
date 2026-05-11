/**
 * Tier-1 palette — primitive hex/rgba only (mirrors native `src/assets/colors.js` dark).
 * UI consumes Tier-2 semantic tokens in `theme.js`, not these keys directly.
 */
const BRAND_CTA_ORANGE = "#ff6b00";

export const palette = {
  obsidian: {
    canvas: "#1A0A28",
    elevated: "#2A1438",
    depth: "#3A1D48",
  },
  copper: {
    /** CORE.primaryAction / `signal.action` */
    base: "#C47B44",
    /** CTA / pressed — same as `brandCtaOrange` */
    bright: BRAND_CTA_ORANGE,
    deep: "#7A4E2E",
    /** `primaryMuted` — liquidGlassCTADisabled fill */
    muted: "#5C3D26",
    highlight: "#F0A878",
  },
  heritageGold: "#D4AF37",
  /**
   * Headline / stats accent on web — aligned with `--bawo-brand-cta-orange` (pumpkin), not muted copper-brown.
   */
  sectionTitleAccent: "#ff6b00",
  /** `textOnCta` — `recipes.liquidGlassCTAText` on Copper */
  textOnCta: "#06030C",
  glass: {
    fill: "rgba(255, 255, 255, 0.06)",
    fillRaised: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.08)",
    borderHairline: "rgba(255, 255, 255, 0.14)",
  },
  /** Solid fill for primary CTAs + top promo bar */
  brandCtaOrange: BRAND_CTA_ORANGE,

  /**
   * PathWay / TestFlight pill — diagonal wash anchored on `#ff6b00` (no heavy brown left stop).
   */
  pathwayPillGradient: {
    angle: "135deg",
    stops: [
      "rgba(255, 107, 0, 0.52) 0%",
      "rgba(255, 107, 0, 0.82) 38%",
      "rgba(255, 132, 58, 0.55) 62%",
      "rgba(14, 8, 12, 0.85) 100%",
    ],
  },
  liquidGlass: {
    /** Hairline outer ring — dusty copper (not bright peach) */
    borderOuter: "rgba(210, 175, 148, 0.42)",
    /** Top-edge illumination — warm but not peach / pumpkin */
    edgeTop: "rgba(255, 242, 235, 0.42)",
    edgeTopDisabled: "rgba(255, 235, 215, 0.18)",
  },
};
