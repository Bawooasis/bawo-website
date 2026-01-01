// Website Colors Constants - Dark Theme Palette

export const COLORS = {
  // Primary Brand Colors
  primary: {
    pumpkin: "#F37021",
    pumpkinLight: "#FF8A42",
    pumpkinDark: "#D85A0F",
    gold: "#D4AF37",
    goldLight: "#E5C158",
    goldDark: "#B8941F"
  },

  // Background Colors - Dark Theme
  background: {
    deepest: "#0B0B0D",
    main: "#101114",
    surface: "#14151A",
    card: "#161820",
    dark: {
      primary: "#0B0B0D",
      secondary: "#101114", 
      tertiary: "#14151A"
    },
    overlay: {
      light: "rgba(255, 255, 255, 0.1)",
      medium: "rgba(255, 255, 255, 0.14)",
      subtle: "rgba(255, 255, 255, 0.05)"
    }
  },

  // Text Colors
  text: {
    primary: "#FAF9F6",
    secondary: "rgba(250, 249, 246, 0.82)",
    white: "#FAF9F6",
    muted: "rgba(250, 249, 246, 0.6)"
  },

  // Border Colors
  border: {
    default: "rgba(255, 255, 255, 0.14)",
    light: "rgba(255, 255, 255, 0.1)",
    pumpkin: "#F37021"
  },

  // Status Colors
  status: {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6"
  },

  // Gradient Combinations
  gradients: {
    background: {
      from: "#0B0B0D",
      via: "#101114",
      to: "#14151A",
      end: "#161820"
    },
    subtle: {
      from: "#0B0B0D",
      to: "#101114"
    }
  },

  // Shadow Colors
  shadows: {
    default: "rgba(0, 0, 0, 0.15)",
    hover: "rgba(0, 0, 0, 0.25)",
    subtle: "rgba(0, 0, 0, 0.1)"
  },

  // Utility Colors  
  utility: {
    transparent: "transparent",
    backdrop: "rgba(0, 0, 0, 0.5)",
    red: "#ef4444",
    redPulse: "#ef4444"
  }
} as const;

// Tailwind CSS Custom Color Classes - Dark Theme
export const TAILWIND_COLORS = {
  // Primary colors for Tailwind classes
  primary: {
    text: "text-[#F37021]",
    bg: "bg-[#F37021]", 
    border: "border-[#F37021]",
    hover: {
      bg: "hover:bg-[#FF8A42]",
      text: "hover:text-[#FF8A42]",
      border: "hover:border-[#FF8A42]"
    },
    focus: {
      border: "focus:border-[#F37021]"
    }
  },

  // Gradient classes
  gradients: {
    background: "bg-gradient-to-b from-[#0B0B0D] via-[#101114] to-[#14151A]",
    subtle: "bg-gradient-to-b from-[#0B0B0D] to-[#101114]"
  },

  // Text classes
  text: {
    primary: "text-[#FAF9F6]",
    secondary: "text-[rgba(250,249,246,0.82)]",
    muted: "text-[rgba(250,249,246,0.6)]"
  },

  // Background classes
  bg: {
    deepest: "bg-[#0B0B0D]",
    main: "bg-[#101114]",
    surface: "bg-[#14151A]",
    card: "bg-[#161820]",
    overlay: {
      light: "bg-white/10",
      medium: "bg-white/14",
      subtle: "bg-white/5"
    }
  },

  // Border classes
  border: {
    default: "border-[rgba(255,255,255,0.14)]",
    light: "border-[rgba(255,255,255,0.1)]"
  }
} as const;
