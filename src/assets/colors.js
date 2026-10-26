/**
 * Tier-1 palette — Deep Eggplant + Warm Signature Gold + Liquid Glass
 * Mirrors the current BawoSocial mobile app theme:
 *   Primary Gold: #E8B959 / #FFCF6B / #C9922C
 *   Deep Eggplant Canvas: #07050B -> #0E0A14 -> #160F24
 *   Gold CTA Button Text: #0E0A14 (Dark Eggplant Bold)
 */
const BRAND_CTA_GOLD = "#E8B959";

/** Content palette — UI accents & surfaces */
export const contentPalette = {
  pumpkin: "#E8B959",
  peach: "#FFCF6B",
  gold: "#E8B959",
  ink: "#07050B",
  navy: "#0E0A14",
  eggplant: "#160F24",
  eggplantLight: "#2A193D",
};

export const palette = {
  obsidian: {
    /** Deep Eggplant base (#07050B–#0E0A14) */
    canvas: "#0E0A14",
    /** Cards, panels, elevated surfaces — Liquid Glass deep eggplant */
    elevated: "#1C132B",
    depth: "#160F24",
  },
  content: contentPalette,
  copper: {
    base: "#C9922C",
    bright: BRAND_CTA_GOLD,
    deep: "#9A6B1A",
    muted: "#6B4B16",
    highlight: "#FFE29A",
  },
  heritageGold: contentPalette.gold,
  sectionTitleAccent: contentPalette.gold,
  /** Dark Eggplant Bold text on all Gold CTA buttons/pills/tabs */
  textOnCta: "#0E0A14",
  glass: {
    fill: "rgba(28, 19, 43, 0.72)",
    fillRaised: "rgba(38, 24, 58, 0.80)",
    border: "rgba(232, 185, 89, 0.24)",
    borderHairline: "rgba(255, 207, 107, 0.28)",
  },
  brandCtaOrange: BRAND_CTA_GOLD,

  pathwayPillGradient: {
    angle: "135deg",
    stops: [
      "rgba(255, 207, 107, 0.96) 0%",
      "rgba(232, 185, 89, 0.96) 55%",
      "rgba(201, 146, 44, 0.94) 100%",
    ],
  },
  liquidGlass: {
    borderOuter: "rgba(232, 185, 89, 0.36)",
    edgeTop: "rgba(255, 236, 190, 0.34)",
    edgeTopDisabled: "rgba(255, 236, 190, 0.14)",
  },
};
