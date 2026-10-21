/**
 * Globe / particle-hero colors — build 165 brand + Nigerian flag accents.
 * Pumpkin stays dominant; flag green (#008751) and soft white sit in the mix
 * so the field reads premium on #0E0A14, not like a literal flag.
 *
 * Target mix (~): 50% pumpkin/peach/gold · 30% Nigerian green · 20% soft white
 */
export const heroParticlePalette = {
  pumpkin: "#FF6B00",
  peach: "#FF8C42",
  gold: "#FFBC42",
  /** Nigerian flag green — softened in pickColor via lower alpha / mix */
  flagGreen: "#008751",
  /** Slightly lifted green for additive glow on dark canvas */
  flagGreenSoft: "#1AA36A",
  copper: "#B87333",
  white: "#FFFFFF",
  /** Soft white — preferred over pure #FFF for most “white” dots */
  whiteSoft: "#E8E6E3",
  canvas: "#0E0A14",
  depth: "#221525",
} as const;
