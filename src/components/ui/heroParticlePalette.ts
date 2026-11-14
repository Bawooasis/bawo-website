import { palette } from "../../assets/colors.js";

/**
 * BawoSocial WebGL 3D Particle Globe + Wave Palette
 * Deep Eggplant canvas (#0E0A14) + App Gold (#D6B26A / #F7E7C4 / #E9CF94) + Eggplant Plum & Naija Emerald accents
 */
export const HERO_PARTICLE_HEX = {
  canvas: palette.obsidian.canvas,
  pumpkin: "#D6B26A",
  peach: "#F7E7C4",
  gold: "#E9CF94",
  copper: "#A07636",
  /* Soft deep eggplant accent — avoid magenta splash against canvas */
  plum: "#2A193D",
  emerald: "#10B981",
  pearl: "#F7F3FA",
} as const;
