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
  /**
   * Nigerian flag green `#008751` projected brighter for additive WebGL points
   * (raw flag green is too dark to read on #0E0A14 with AdditiveBlending).
   */
  flagGreen: "#1FAE66",
  /** Softer / brighter twin for variety in the ~30% green bucket */
  flagGreenSoft: "#4FD68A",
  copper: "#B87333",
  white: "#FFFFFF",
  /** Soft white — preferred over pure #FFF for most “white” dots */
  whiteSoft: "#E8E6E3",
  canvas: "#0E0A14",
  depth: "#221525",
} as const;
