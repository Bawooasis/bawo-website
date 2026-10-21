/**
 * Tier-1 palette — primitive hex/rgba only (mirrors native app build 165).
 * UI consumes Tier-2 semantic tokens in `theme.js`, not these keys directly.
 *
 * Brand system (app build 165):
 *   pumpkin #FF6B00 (primary), light orange #FF8C42, gold #FFBC42,
 *   copper #B87333 (accent only), background #08060C (near-black), card #221525, text #F4F4F5
 */
const BRAND_CTA_ORANGE = "#FF6B00";

/** Content palette — UI accents & surfaces */
export const contentPalette = {
  pumpkin: "#FF6B00",
  peach: "#FF8C42",
  gold: "#FFBC42",
  ink: "#08060C",
  navy: "#14081C",
  eggplant: "#24122E",
  eggplantLight: "#32183C",
};

export const palette = {
  obsidian: {
    /** Near-black canvas (#07050B–#0A0710 range; deeper than prior #0E0A14) */
    canvas: "#08060C",
    /** Cards, panels, elevated surfaces — keep readable lift off canvas */
    elevated: "#221525",
    depth: "#120A18",
  },
  content: contentPalette,
  copper: {
    /** Accent only — never primary CTA fill */
    base: "#B87333",
    /** CTA / pressed — same as brand pumpkin */
    bright: BRAND_CTA_ORANGE,
    deep: "#7A4E2E",
    muted: "#5C3D26",
    highlight: "#F0A878",
  },
  heritageGold: contentPalette.gold,
  sectionTitleAccent: contentPalette.pumpkin,
  /** Text on solid pumpkin / copper fills */
  textOnCta: "#08060C",
  glass: {
    fill: "rgba(34, 21, 37, 0.72)",
    fillRaised: "rgba(42, 20, 56, 0.78)",
    border: "rgba(255, 188, 66, 0.18)",
    borderHairline: "rgba(255, 140, 66, 0.22)",
  },
  /** Solid fill for primary CTAs + top promo bar */
  brandCtaOrange: BRAND_CTA_ORANGE,

  /**
   * PathWay / TestFlight pill — diagonal wash anchored on pumpkin.
   */
  pathwayPillGradient: {
    angle: "135deg",
    stops: [
      "rgba(255, 107, 0, 0.88) 0%",
      "rgba(255, 140, 66, 0.92) 38%",
      "rgba(58, 29, 72, 0.75) 62%",
      "rgba(8, 6, 12, 0.92) 100%",
    ],
  },
  liquidGlass: {
    /** Hairline outer ring — copper accent */
    borderOuter: "rgba(184, 115, 51, 0.42)",
    /** Top-edge illumination */
    edgeTop: "rgba(255, 242, 235, 0.42)",
    edgeTopDisabled: "rgba(255, 235, 215, 0.18)",
  },
};
