/**
 * Tier-1 palette — primitive hex/rgba only (mirrors native `src/assets/colors.js` dark).
 * UI consumes Tier-2 semantic tokens in `theme.js`, not these keys directly.
 */
const BRAND_CTA_ORANGE = "#ff6b00";

/** Content palette — UI accents & surfaces (background mesh stays on obsidian). */
export const contentPalette = {
  pumpkin: "#ff6b00",
  peach: "#ff8c42",
  ink: "#0e0a14",
  forest: "#1f493c",
  forestBright: "#6db896",
  navy: "#1a0a28",
  eggplant: "#2a1438",
  eggplantLight: "#3a1d48",
};

export const palette = {
  obsidian: {
    /** Pitch-deck slide canvas — deep eggplant near-black */
    canvas: "#06030C",
    elevated: "#0E0A14",
    depth: "#1A0A28",
  },
  content: contentPalette,
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
  heritageGold: contentPalette.peach,
  sectionTitleAccent: contentPalette.pumpkin,
  /** `textOnCta` — `recipes.liquidGlassCTAText` on Copper */
  textOnCta: "#06030C",
  glass: {
    fill: "rgba(42, 20, 56, 0.32)",
    fillRaised: "rgba(58, 29, 72, 0.38)",
    border: "rgba(58, 29, 72, 0.48)",
    borderHairline: "rgba(255, 140, 66, 0.22)",
  },
  /** Solid fill for primary CTAs + top promo bar */
  brandCtaOrange: BRAND_CTA_ORANGE,

  /**
   * PathWay / TestFlight pill — diagonal wash anchored on `#ff6b00` (no heavy brown left stop).
   */
  pathwayPillGradient: {
    angle: "135deg",
    stops: [
      "rgba(255, 107, 0, 0.88) 0%",
      "rgba(255, 140, 66, 0.92) 38%",
      "rgba(58, 29, 72, 0.75) 62%",
      "rgba(26, 10, 40, 0.92) 100%",
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
