# BawoSocial 2026 design system (web)

Canonical tokens live in `src/assets/colors.js` (Tier-1 palette) and `src/assets/theme.js` (`semanticTokens`, `recipes`, spacing, typography scale, radii). Runtime CSS variables are injected in `src/theme/injectCssVars.ts` and consumed in `src/index.css`.

## Build 165 brand system (source of truth with the app)

| Token | Hex | Role |
|-------|-----|------|
| Pumpkin | `#FF6B00` | Primary / CTA fill |
| Light orange | `#FF8C42` | Hover / secondary warm |
| Gold | `#FFBC42` | Accent / highlights |
| Copper | `#B87333` | Accent only (borders, edges) — never primary CTA fill |
| Background | `#0E0A14` | Canvas |
| Card | `#221525` | Elevated / card surfaces |
| Text | `#F4F4F5` | Primary text |

**Font:** Montserrat everywhere (weights 400–700). Legacy `font-museo-*` / `font-display` Tailwind classes map to Montserrat.

## Stacked auth / hero pills

Use **full-width** rows with **pill radius** (`--bawo-radius-pill`) and the warm gradient from `recipes.pillActiveGradient` (see `.pill-warm-auth` / `.bawo-pill-cta-surface`).

Primary conversion actions use **pumpkin** (`.bawo-pill-cta-surface`, `.liquid-glass-cta`). Reserve **gold** for small accents (icons, emphasis numerals). Copper is edge/accent only.

## Glass cards

Prefer `.glass-card` (maps to `recipes.glassCard` / `--bawo-card`).

## Spacing

4pt grid: `--bawo-space-xs` … `--bawo-space-xxl`. Screen horizontal padding = **24px** (`--bawo-space-lg`).

## Globe animation

See `docs/globe-animation.md` — WebGL particle sphere in `src/components/ui/HeroParticleField.tsx`.
