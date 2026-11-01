/**
 * Tier-1 palette — Deep Eggplant + App Gold + Liquid Glass
 * Mirrors the BawoSocial mobile app gold:
 *   Primary Gold: #D6B26A / light #F7E7C4 / glow #E9CF94 / deep #A07636
 *   Deep Eggplant Canvas: #07050B -> #0E0A14 -> #160F24
 *   Gold CTA Button Text: #0E0A14 (Dark Eggplant Bold)
 */
const BRAND_CTA_GOLD = "#D6B26A";
const GOLD_LIGHT = "#F7E7C4";
const GOLD_GLOW = "#E9CF94";
const GOLD_DEEP = "#A07636";

/** Content palette — UI accents & surfaces */
export const contentPalette = {
  pumpkin: BRAND_CTA_GOLD,
  peach: GOLD_LIGHT,
  gold: BRAND_CTA_GOLD,
  goldGlow: GOLD_GLOW,
  goldDeep: GOLD_DEEP,
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
    base: GOLD_DEEP,
    bright: BRAND_CTA_GOLD,
    deep: "#7A5A28",
    muted: "#5C4420",
    highlight: GOLD_LIGHT,
  },
  heritageGold: contentPalette.gold,
  sectionTitleAccent: contentPalette.gold,
  /** Dark Eggplant Bold text on all Gold CTA buttons/pills/tabs */
  textOnCta: "#0E0A14",
  glass: {
    fill: "rgba(28, 19, 43, 0.72)",
    fillRaised: "rgba(38, 24, 58, 0.80)",
    border: "rgba(214, 178, 106, 0.24)",
    borderHairline: "rgba(233, 207, 148, 0.28)",
  },
  brandCtaOrange: BRAND_CTA_GOLD,

  pathwayPillGradient: {
    angle: "135deg",
    stops: [
      "rgba(247, 231, 196, 0.96) 0%",
      "rgba(214, 178, 106, 0.96) 55%",
      "rgba(160, 118, 54, 0.94) 100%",
    ],
  },
  liquidGlass: {
    borderOuter: "rgba(214, 178, 106, 0.36)",
    edgeTop: "rgba(247, 231, 196, 0.34)",
    edgeTopDisabled: "rgba(247, 231, 196, 0.14)",
  },
};
