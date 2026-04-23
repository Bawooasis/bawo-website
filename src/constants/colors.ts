// Website Colors Constants - Obsidian & Copper Theme

export const COLORS = {
  // Primary Brand Colors - Copper/Pumpkin Orange & Gold (Matched to Mobile)
  primary: {
    copper: "#C47B44",        // Main Copper (matches mobile primary)
    copperLight: "#E09255",   // Bright Copper (matches mobile primaryGlow)
    copperDark: "#4A3222",    // Deep Copper (matches mobile primaryMuted)
    pumpkin: "#FF6B00",       // Primary CTA orange
    gold: "#DAA520",
    goldLight: "#E5C158",
    goldDark: "#B8941F"
  },

  // Background Colors - Obsidian Black (Pure Black for Web)
  background: {
    obsidian: "#000000",
    obsidianLight: "#0B0C10",
    deepest: "#000000",
    main: "#000000",
    surface: "#0B0C10",
    card: "rgba(11, 12, 16, 0.8)",
    dark: {
      primary: "#000000",
      secondary: "#0B0C10", 
      tertiary: "#14151C"
    },
    overlay: {
      light: "rgba(255, 255, 255, 0.08)",
      medium: "rgba(255, 255, 255, 0.12)",
      subtle: "rgba(255, 255, 255, 0.04)"
    }
  },

  // Text Colors
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.9)",
    white: "#FFFFFF",
    muted: "rgba(255, 255, 255, 0.6)"
  },

  // Border Colors - Subtle Glass Borders
  border: {
    default: "rgba(255, 255, 255, 0.08)",
    light: "rgba(255, 255, 255, 0.06)",
    copper: "#C47B44",
    copperLight: "#E09255"
  },

  // Status Colors
  status: {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6"
  },

  // Gradient Combinations - Obsidian gradients (Pure Black)
  gradients: {
    background: {
      from: "#000000",
      via: "#0B0C10",
      to: "#000000",
      end: "#000000"
    },
    subtle: {
      from: "#000000",
      to: "#0B0C10"
    },
    copper: {
      from: "#C47B44",
      to: "#E09255"
    }
  },

  // Shadow Colors - Enhanced for depth
  shadows: {
    default: "rgba(0, 0, 0, 0.3)",
    hover: "rgba(0, 0, 0, 0.4)",
    subtle: "rgba(0, 0, 0, 0.2)",
    glow: "rgba(196, 123, 68, 0.5)"
  },

  // Utility Colors  
  utility: {
    transparent: "transparent",
    backdrop: "rgba(0, 0, 0, 0.6)",
    red: "#ef4444",
    redPulse: "#ef4444"
  }
} as const;

// Tailwind CSS Custom Color Classes - Obsidian & Copper Theme (Matched to Mobile)
export const TAILWIND_COLORS = {
  // Primary colors for Tailwind classes - Copper/Orange
  primary: {
    text: "text-[#C47B44]",
    bg: "bg-[#C47B44]", 
    border: "border-[#C47B44]",
    hover: {
      bg: "hover:bg-[#E09255]",
      text: "hover:text-[#E09255]",
      border: "hover:border-[#E09255]"
    },
    focus: {
      border: "focus:border-[#C47B44]"
    }
  },

  // Gold accent
  gold: {
    text: "text-[#DAA520]",
    bg: "bg-[#DAA520]",
    border: "border-[#DAA520]"
  },

  // Gradient classes
  gradients: {
    primary: "bg-gradient-to-r from-[#C47B44] to-[#E09255]",
    primaryHover: "hover:from-[#E09255] hover:to-[#C47B44]",
    background: "bg-gradient-to-b from-[#000000] via-[#0B0C10] to-[#000000]",
    subtle: "bg-gradient-to-b from-[#000000] to-[#0B0C10]"
  },

  // Text classes
  text: {
    primary: "text-white",
    secondary: "text-white/90",
    muted: "text-white/60"
  },

  // Background classes - Obsidian (Pure Black)
  bg: {
    obsidian: "bg-[#000000]",
    deepest: "bg-[#000000]",
    main: "bg-[#000000]",
    surface: "bg-[#0B0C10]",
    card: "bg-[rgba(11,12,16,0.8)]",
    overlay: {
      light: "bg-white/8",
      medium: "bg-white/12",
      subtle: "bg-white/4"
    }
  },

  // Border classes - Subtle glass borders
  border: {
    default: "border-white/8",
    light: "border-white/6",
    glass: "border-[rgba(255,255,255,0.08)]"
  }
} as const;
