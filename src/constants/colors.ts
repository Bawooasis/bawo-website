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
    pumpkinDeprecated: "#FF6B00",
    gold: g,
    goldLight: "#E4C76A",
    goldDark: "#B8922E",
  },
  background: {
    obsidian: palette.obsidian.canvas,
    obsidianLight: palette.obsidian.elevated,
    deepest: palette.obsidian.canvas,
    main: palette.obsidian.canvas,
    surface: palette.obsidian.elevated,
    card: palette.glass.fill,
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
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
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
      bg: "hover:bg-[#ff6b00]",
      text: "hover:text-[#ff8f42]",
      border: "hover:border-[#ff8f42]",
    },
    focus: {
      border: "focus:border-[var(--bawo-brand-cta-orange)]",
    },
  },
  gold: {
    text: "text-[#D4AF37]",
    bg: "bg-[#D4AF37]",
    border: "border-[#D4AF37]",
  },
  gradients: {
    primary: "bg-gradient-to-r from-[#8b3310] via-[#e05818] to-[#ff6b00]",
    primaryHover: "hover:from-[#ff6b00] hover:to-[#ff9f52]",
    background:
      "bg-gradient-to-b from-[#06030C] via-[#0E0A14] to-[#06030C]",
    subtle: "bg-gradient-to-b from-[#06030C] to-[#0E0A14]",
  },
  text: {
    primary: "text-white",
    secondary: "text-white/90",
    muted: "text-white/60",
  },
  bg: {
    obsidian: "bg-[#06030C]",
    deepest: "bg-[#06030C]",
    main: "bg-[#06030C]",
    surface: "bg-[#0E0A14]",
    card: "bg-[var(--bawo-surface-glass)]",
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
