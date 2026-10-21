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

/** Tier-2 semantic tokens (dark / app shell) — build 165 aligned */
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
      /** Primary action = pumpkin */
      action: palette.content.pumpkin,
      /** Hover / pressed */
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
      primary: "#F4F4F5",
      secondary: "rgba(244, 244, 245, 0.9)",
      muted: "rgba(244, 244, 245, 0.6)",
      onAction: textOnCta,
    },
    border: {
      subtle: glass.border,
      hairline: glass.borderHairline,
    },
  },
};

/**
 * Canonical 4pt ladder — aligned with native `spacing` (md=16, lg=24, xxl=48).
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Typography scale — rem equivalents of native `typography.fontSize`.
 * Font family: Montserrat everywhere (build 165).
 */
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

/** Border radii — align with native `borderRadius` (xl ≈ 24px). */
export const radii = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  pill: "9999px",
};

const sem = semanticTokens.dark;

/** Primary CTA shadow — pumpkin-tinted */
const PRIMARY_CTA_SHADOW = `0 8px 18px rgba(255, 107, 0, 0.28)`;

/**
 * Tier-3 recipes — web/CSS projection of native theme shapes.
 * Primary CTAs use pumpkin; copper is accent-only (borders / edge).
 */
export const recipes = {
  liquidGlassCTA: {
    backgroundColor: palette.content.pumpkin,
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
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 600,
    fontSize: fontSize.md,
    letterSpacing: "0.2px",
  },
  glassCard: {
    background: sem.surface.glass,
    border: `1px solid ${sem.border.subtle}`,
    borderRadius: radii.lg,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 0 12px rgba(255, 188, 66, 0.06)",
  },
  pillActiveGradient: {
    angle: pathwayPillGradient.angle,
    stops: pathwayPillGradient.stops,
    border: "1px solid rgba(255, 255, 255, 0.1)",
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
