import { palette } from "../assets/colors.js";
import { semanticTokens } from "../assets/theme.js";

const d = semanticTokens.dark;
const c = palette.copper;
const g = d.accent.heritageGold;

/** @deprecated Prefer CSS variables (`--bawo-*`) or import `palette` / `semanticTokens` from assets. */
export const COLORS = {
  primary: {
    copper: c.base,
    copperLight: c.bright,
    copperDark: c.deep,
    pumpkin: palette.content.pumpkin,
    gold: g,
    goldLight: "#FFD078",
    goldDark: "#C49220",
  },
  background: {
    obsidian: palette.obsidian.canvas,
    obsidianLight: palette.obsidian.elevated,
    deepest: palette.obsidian.canvas,
    main: palette.obsidian.canvas,
    surface: palette.obsidian.elevated,
    card: palette.obsidian.elevated,
    dark: {
      primary: palette.obsidian.canvas,
      secondary: palette.obsidian.elevated,
      tertiary: palette.obsidian.depth,
    },
    overlay: {
      light: "rgba(255, 255, 255, 0.08)",
      medium: "rgba(255, 255, 255, 0.12)",
      subtle: "rgba(255, 255, 255, 0.04)",
    },
  },
  text: {
    primary: d.text.primary,
    secondary: d.text.secondary,
    white: d.text.primary,
    muted: d.text.muted,
  },
  border: {
    default: d.border.subtle,
    light: "rgba(255, 255, 255, 0.06)",
    copper: c.base,
    copperLight: c.bright,
  },
  status: {
    success: palette.content.gold,
    error: "#ef4444",
    warning: palette.content.peach,
    info: palette.content.eggplantLight,
  },
  gradients: {
    background: {
      from: palette.obsidian.canvas,
      via: palette.obsidian.elevated,
      to: palette.obsidian.canvas,
      end: palette.obsidian.canvas,
    },
    subtle: {
      from: palette.obsidian.canvas,
      to: palette.obsidian.elevated,
    },
    copper: {
      from: c.base,
      to: c.bright,
    },
  },
  shadows: {
    default: "rgba(0, 0, 0, 0.3)",
    hover: "rgba(0, 0, 0, 0.4)",
    subtle: "rgba(0, 0, 0, 0.2)",
    glow: "rgba(255, 107, 0, 0.5)",
  },
  utility: {
    transparent: "transparent",
    backdrop: "rgba(0, 0, 0, 0.6)",
    red: "#ef4444",
    redPulse: "#ef4444",
  },
} as const;

/** Literal Tailwind arbitrary values — must stay in sync with `src/assets/colors.js`. */
export const TAILWIND_COLORS = {
  primary: {
    /** Gradient fill — matches `.bawo-pill-cta-surface` / founding CTA ramp. */
    text: "bawo-text-cta-gradient",
    bg: "bg-[var(--bawo-brand-cta-orange)]",
    border: "border-[rgba(255,107,0,0.45)]",
    hover: {
      bg: "hover:bg-[#FF6B00]",
      text: "hover:text-[#FF8C42]",
      border: "hover:border-[#FF8C42]",
    },
    focus: {
      border: "focus:border-[var(--bawo-brand-cta-orange)]",
    },
  },
  gold: {
    text: "text-[var(--bawo-gold,#FFBC42)]",
    bg: "bg-[var(--bawo-gold,#FFBC42)]",
    border: "border-[var(--bawo-gold,#FFBC42)]",
  },
  gradients: {
    primary: "bg-gradient-to-r from-bawo-navy via-bawo-eggplant to-bawo-pumpkin",
    primaryHover: "hover:from-bawo-eggplant hover:to-bawo-peach",
    background:
      "bg-gradient-to-b from-[#0E0A14] via-[#221525] to-[#0E0A14]",
    subtle: "bg-gradient-to-b from-[#0E0A14] to-[#221525]",
  },
  text: {
    primary: "text-[var(--bawo-text-primary,#F4F4F5)]",
    secondary: "text-white/90",
    muted: "text-white/60",
  },
  bg: {
    obsidian: "bg-[#0E0A14]",
    deepest: "bg-[#0E0A14]",
    main: "bg-[#0E0A14]",
    surface: "bg-[#221525]",
    card: "bg-[var(--bawo-card,#221525)]",
    overlay: {
      light: "bg-white/8",
      medium: "bg-white/12",
      subtle: "bg-white/4",
    },
  },
  border: {
    default: "border-white/8",
    light: "border-white/6",
    glass: "border-[rgba(255,255,255,0.08)]",
  },
} as const;
