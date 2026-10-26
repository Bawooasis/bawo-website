import { palette } from "../assets/colors.js";
import { semanticTokens } from "../assets/theme.js";

const d = semanticTokens.dark;
const c = palette.copper;
const g = d.accent.heritageGold;

export const COLORS = {
  primary: {
    copper: c.base,
    copperLight: c.bright,
    copperDark: c.deep,
    pumpkin: palette.content.pumpkin,
    gold: g,
    goldLight: "#FFCF6B",
    goldDark: "#C9922C",
  },
  background: {
    obsidian: palette.obsidian.canvas,
    obsidianLight: palette.obsidian.elevated,
    deepest: "#07050B",
    main: palette.obsidian.canvas,
    surface: palette.obsidian.elevated,
    card: palette.obsidian.elevated,
    dark: {
      primary: palette.obsidian.canvas,
      secondary: palette.obsidian.elevated,
      tertiary: palette.obsidian.depth,
    },
    overlay: {
      light: "rgba(232, 185, 89, 0.08)",
      medium: "rgba(232, 185, 89, 0.14)",
      subtle: "rgba(168, 42, 136, 0.08)",
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
    light: "rgba(232, 185, 89, 0.16)",
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
      from: "#07050B",
      via: "#0E0A14",
      to: "#160F24",
      end: "#0E0A14",
    },
    subtle: {
      from: "#0E0A14",
      to: "#1C132B",
    },
    copper: {
      from: "#FFCF6B",
      to: "#C9922C",
    },
  },
  shadows: {
    default: "rgba(5, 2, 10, 0.45)",
    hover: "rgba(5, 2, 10, 0.6)",
    subtle: "rgba(5, 2, 10, 0.3)",
    glow: "rgba(232, 185, 89, 0.42)",
  },
  utility: {
    transparent: "transparent",
    backdrop: "rgba(14, 10, 20, 0.72)",
    red: "#ef4444",
    redPulse: "#ef4444",
  },
} as const;

export const TAILWIND_COLORS = {
  primary: {
    text: "bawo-text-cta-gradient",
    bg: "bg-[#E8B959]",
    border: "border-[rgba(232,185,89,0.42)]",
    hover: {
      bg: "hover:bg-[#FFCF6B]",
      text: "hover:text-[#FFCF6B]",
      border: "hover:border-[#FFCF6B]",
    },
    focus: {
      border: "focus:border-[#E8B959]",
    },
  },
  gold: {
    text: "text-[#E8B959]",
    bg: "bg-[#E8B959]",
    border: "border-[#E8B959]",
  },
  gradients: {
    primary: "bg-gradient-to-r from-[#FFCF6B] via-[#E8B959] to-[#C9922C]",
    primaryHover: "hover:from-[#FFE094] hover:to-[#E8B959]",
    background:
      "bg-gradient-to-b from-[#07050B] via-[#0E0A14] to-[#160F24]",
    subtle: "bg-gradient-to-b from-[#0E0A14] to-[#1C132B]",
  },
  text: {
    primary: "text-[#F7F3FA]",
    secondary: "text-[#F7F3FA]/90",
    muted: "text-[#E6DCF2]/65",
  },
  bg: {
    obsidian: "bg-[#0E0A14]",
    deepest: "bg-[#07050B]",
    main: "bg-[#0E0A14]",
    surface: "bg-[#1C132B]",
    card: "bg-[#1C132B]/75",
    overlay: {
      light: "bg-[#E8B959]/10",
      medium: "bg-[#E8B959]/15",
      subtle: "bg-[#2A193D]/40",
    },
  },
  border: {
    default: "border-[rgba(232,185,89,0.22)]",
    light: "border-[rgba(232,185,89,0.14)]",
    glass: "border-[rgba(232,185,89,0.24)]",
  },
} as const;
