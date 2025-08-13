// Website Colors Constants - Organized by Usage

export const COLORS = {
  // Primary Brand Colors
  primary: {
    orange: "#ff7f39",
    orangeLight: "#ff6b35", 
    orangeDark: "#ff5a2e",
    redOrange: "#FF4500"
  },

  // Background Colors
  background: {
    dark: {
      primary: "#1E2D24",
      secondary: "#1A2821", 
      tertiary: "#111814"
    },
    overlay: {
      light: "rgba(255, 255, 255, 0.1)",
      medium: "rgba(255, 255, 255, 0.2)",
      subtle: "rgba(255, 255, 255, 0.05)"
    }
  },

  // Text Colors
  text: {
    white: "#ffffff",
    whiteSubtle: "rgba(255, 255, 255, 0.8)",
    whiteMuted: "rgba(255, 255, 255, 0.7)",
    whitePlaceholder: "rgba(255, 255, 255, 0.7)"
  },

  // Border Colors
  border: {
    white: "rgba(255, 255, 255, 0.2)",
    orange: "#ff7f39"
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
    primary: {
      from: "#FF4500",
      to: "#ff7f39"
    },
    primaryHover: {
      from: "#ff7f39", 
      to: "#FF4500"
    },
    secondary: {
      from: "#ff7f39",
      to: "#ff6b35"
    },
    secondaryHover: {
      from: "#ff6b35",
      to: "#ff5a2e"
    },
    background: {
      from: "#1E2D24",
      via: "#1A2821",
      to: "#111814"
    },
    // Hero gradient with full power
    heroBackground: {
      from: "#0C5B3B",
      stop1: "#0C5B3B", 
      via1: "#2D8A5A",
      via2: "#4A9B6B", 
      via3: "#C8B46D",
      to: "#F37021"
    },
    // Early sections - Dark green base with gradient fade
    earlySection: {
      from: "#0A3D28",
      to: "#0A3D28"
    },
    // Middle sections - Same dark tone
    midSection: {
      base: "#0A3D28"
    },
    // Final CTA - Warmer gradient bookend
    finalCtaBackground: {
      from: "#0C5B3B",
      via1: "#2D8A5A",
      via2: "#C8B46D", 
      via3: "#F37021",
      to: "#FF8C42" // More gold/orange
    },
    // Footer - Ultra dark
    footerBackground: {
      base: "#052418"
    },
    brandAccent: {
      from: "#ff7f39",
      to: "#ff6b35"
    },
    overlay: {
      from: "#ff7f39/10",
      to: "transparent"
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

// Tailwind CSS Custom Color Classes
export const TAILWIND_COLORS = {
  // Primary colors for Tailwind classes
  primary: {
    text: "text-[#ff7f39]",
    bg: "bg-[#ff7f39]", 
    border: "border-[#ff7f39]",
    hover: {
      bg: "hover:bg-[#ff7f39]",
      text: "hover:text-[#ff7f39]",
      border: "hover:border-[#ff7f39]"
    },
    focus: {
      border: "focus:border-[#ff7f39]"
    }
  },

  // Gradient classes
  gradients: {
    primary: "bg-gradient-to-r from-[#FF4500] to-[#ff7f39]",
    primaryHover: "hover:from-[#ff7f39] hover:to-[#FF4500]",
    secondary: "bg-gradient-to-r from-[#ff7f39] to-[#ff6b35]", 
    secondaryHover: "hover:from-[#ff6b35] hover:to-[#ff5a2e]",
    background: "bg-gradient-to-br from-[#1E2D24] via-[#1A2821] to-[#111814]",
    backgroundMain: "bg-gradient-to-br from-[#1E2D24] via-[#1A2821] to-[#111814]",
    // Hero with animated shimmer gradient
    heroBackground: "bg-gradient-to-r from-[#0C5B3B] via-[#0C5B3B] via-[#2D8A5A] via-[#4A9B6B] via-[#C8B46D] to-[#F37021]",
    // Early sections with gradient fade from hero
    earlySectionBackground: "bg-gradient-to-b from-[#0C5B3B]/20 via-[#0A3D28] to-[#0A3D28]",
    // Middle sections - consistent dark green
    midSectionBackground: "bg-[#0A3D28]",
    // Final CTA - warm gradient bookend
    finalCtaBackground: "bg-gradient-to-r from-[#0C5B3B] via-[#2D8A5A] via-[#C8B46D] via-[#F37021] to-[#FF8C42]",
    // Footer - ultra dark
    footerBackground: "bg-[#052418]",
    brandAccent: "bg-gradient-to-br from-[#ff7f39] to-[#ff6b35]",
    overlay: "bg-gradient-to-t from-[#ff7f39]/10 via-transparent to-transparent"
  },

  // Text opacity classes
  text: {
    primary: "text-white",
    secondary: "text-white/80", 
    muted: "text-white/70",
    subtle: "text-white/60"
  },

  // Background opacity classes
  bg: {
    overlay: {
      light: "bg-white/10",
      medium: "bg-white/20",
      subtle: "bg-white/5"
    }
  }
} as const;
