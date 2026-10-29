import { palette } from "./colors.js";

const {
  obsidian,
  copper,
  heritageGold,
  glass,
  textOnCta,
  liquidGlass,
  pathwayPillGradient,
} = palette;

/** Tier-2 semantic tokens (Deep Eggplant + Signature Gold + Liquid Glass) */
export const semanticTokens = {
  dark: {
    surface: {
      canvas: obsidian.canvas,
      elevated: obsidian.elevated,
      depth: obsidian.depth,
      glass: glass.fill,
      glassRaised: glass.fillRaised,
      card: obsidian.elevated,
    },
    signal: {
      action: palette.content.gold,
      actionPressed: palette.content.peach,
      actionMuted: copper.muted,
    },
    accent: {
      heritageGold,
      peach: palette.content.peach,
      pumpkin: palette.content.pumpkin,
      gold: palette.content.gold,
      copper: copper.base,
      eggplant: palette.content.eggplant,
      eggplantLight: palette.content.eggplantLight,
      navy: palette.content.navy,
      ink: palette.content.ink,
    },
    text: {
      primary: "#F7F3FA",
      secondary: "rgba(247, 243, 250, 0.9)",
      muted: "rgba(231, 221, 240, 0.68)",
      onAction: textOnCta,
    },
    border: {
      subtle: glass.border,
      hairline: glass.borderHairline,
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.625rem",
  "3xl": "2rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
};

export const radii = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  pill: "9999px",
};

const sem = semanticTokens.dark;

const PRIMARY_CTA_SHADOW = `0 10px 26px rgba(232, 185, 89, 0.28)`;

export const recipes = {
  liquidGlassCTA: {
    backgroundColor: palette.content.gold,
    border: `1px solid ${liquidGlass.borderOuter}`,
    borderTop: `1px solid ${liquidGlass.edgeTop}`,
    borderRadius: radii.xl,
    boxShadow: `${PRIMARY_CTA_SHADOW}, inset 0 1px 0 ${liquidGlass.edgeTop}`,
    padding: `${spacing.md}px ${spacing.lg}px`,
  },
  liquidGlassCTAPressed: {
    backgroundColor: palette.content.peach,
  },
  liquidGlassCTADisabled: {
    backgroundColor: copper.muted,
    borderTopColor: liquidGlass.edgeTopDisabled,
    opacity: 0.7,
    boxShadow: "none",
  },
  liquidGlassCTAText: {
    color: sem.text.onAction,
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    fontWeight: 700,
    fontSize: fontSize.md,
    letterSpacing: "0.01em",
  },
  glassCard: {
    background: sem.surface.glass,
    border: `1px solid ${sem.border.subtle}`,
    borderRadius: radii.lg,
    backdropFilter: "blur(28px) saturate(165%)",
    WebkitBackdropFilter: "blur(28px) saturate(165%)",
    boxShadow: "0 18px 44px rgba(5, 2, 10, 0.55), inset 0 1px 0 rgba(255, 236, 190, 0.28)",
  },
  pillActiveGradient: {
    angle: pathwayPillGradient.angle,
    stops: pathwayPillGradient.stops,
    border: "1px solid rgba(255, 236, 190, 0.35)",
  },
};

export default {
  palette,
  semanticTokens,
  spacing,
  fontSize,
  radii,
  recipes,
};
