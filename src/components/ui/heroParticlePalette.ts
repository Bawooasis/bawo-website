/**
 * Globe / particle-hero colors — build 165 brand + Nigerian flag accents.
 * Pumpkin stays dominant; flag green (#008751) and soft white sit in the mix
 * so the field reads premium on near-black #08060C, not like a literal flag.
 *
 * Target mix (~): 50% pumpkin/peach/gold · 30% Nigerian green · 20% soft white
 */
export const heroParticlePalette = {
  pumpkin: "#FF6B00",
  peach: "#FF8C42",
  gold: "#FFBC42",
  /**
   * Nigerian flag green `#008751` projected for additive WebGL points.
   * Must stay clearly green (not yellow) when mixed with pumpkin under AdditiveBlending.
   */
  flagGreen: "#00C853",
  /** High-luma emerald so greens read as distinct dots on phone screens */
  flagGreenSoft: "#69FFA0",
  copper: "#B87333",
  white: "#FFFFFF",
  /** Soft white — preferred over pure #FFF for most “white” dots */
  whiteSoft: "#E8E6E3",
  canvas: "#08060C",
  depth: "#221525",
} as const;
