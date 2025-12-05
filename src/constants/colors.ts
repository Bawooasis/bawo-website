// Website Colors Constants - Premium Luxury Palette

export const COLORS = {
  // Primary Brand Colors - Premium Gold/Amber
  primary: {
    gold: "#D4AF37",
    goldLight: "#E5C158",
    goldDark: "#B8941F",
    amber: "#F4A460",
    amberLight: "#F5B887",
    amberDark: "#D68910"
  },

  // Background Colors - Deep Charcoal & Cream
  background: {
    dark: {
      primary: "#1A1A1A",
      secondary: "#0F0F0F", 
      tertiary: "#050505"
    },
    light: {
      primary: "#FAF9F6",
      secondary: "#F5F5F0",
      cream: "#FEFCF8"
    },
    overlay: {
      light: "rgba(255, 255, 255, 0.1)",
      medium: "rgba(255, 255, 255, 0.2)",
      subtle: "rgba(255, 255, 255, 0.05)"
    }
  },

  // Text Colors
  text: {
    white: "#FFFFFF",
    charcoal: "#1A1A1A",
    charcoalLight: "#2A2A2A",
    charcoalMuted: "#4A4A4A",
    cream: "#FAF9F6",
    creamMuted: "#E8E6E0"
  },

  // Border Colors
  border: {
    white: "rgba(255, 255, 255, 0.2)",
    gold: "#D4AF37",
    charcoal: "rgba(26, 26, 26, 0.1)",
    cream: "rgba(250, 249, 246, 0.2)"
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

// Tailwind CSS Custom Color Classes - Premium
export const TAILWIND_COLORS = {
  // Primary colors for Tailwind classes - Gold/Amber
  primary: {
    text: "text-[#D4AF37]",
    bg: "bg-[#D4AF37]", 
    border: "border-[#D4AF37]",
    hover: {
      bg: "hover:bg-[#E5C158]",
      text: "hover:text-[#E5C158]",
      border: "hover:border-[#E5C158]"
    },
    focus: {
      border: "focus:border-[#D4AF37]"
    }
  },

  // Gradient classes - Premium
  gradients: {
    primary: "bg-gradient-to-r from-[#D4AF37] to-[#F4A460]",
    primaryHover: "hover:from-[#E5C158] hover:to-[#F5B887]",
    secondary: "bg-gradient-to-r from-[#F4A460] to-[#D4AF37]", 
    secondaryHover: "hover:from-[#F5B887] hover:to-[#E5C158]",
    // Premium backgrounds
    background: "bg-[#FAF9F6]",
    backgroundDark: "bg-[#1A1A1A]",
    backgroundCharcoal: "bg-[#0F0F0F]",
    // Hero - clean white/cream
    heroBackground: "bg-[#FAF9F6]",
    // Sections - alternating light/dark
    sectionLight: "bg-[#FAF9F6]",
    sectionDark: "bg-[#1A1A1A]",
    // Final CTA - dark with gold accent
    finalCtaBackground: "bg-[#0F0F0F]",
    // Footer - deep charcoal
    footerBackground: "bg-[#050505]",
    brandAccent: "bg-gradient-to-br from-[#D4AF37] to-[#F4A460]",
    overlay: "bg-gradient-to-t from-[#D4AF37]/10 via-transparent to-transparent"
  },

  // Text opacity classes
  text: {
    primary: "text-[#1A1A1A]",
    primaryLight: "text-white",
    secondary: "text-[#4A4A4A]", 
    muted: "text-[#6A6A6A]",
    subtle: "text-[#8A8A8A]",
    cream: "text-[#FAF9F6]"
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
