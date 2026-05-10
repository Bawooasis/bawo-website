# BawoSocial 2026 design system (web)

Canonical tokens live in `src/assets/colors.js` (Tier-1 palette) and `src/assets/theme.js` (`semanticTokens`, `recipes`, spacing, typography scale, radii). Runtime CSS variables are injected in `src/theme/injectCssVars.ts` and consumed in `src/index.css`.

## 2.1 Stacked auth / hero pills (PathWay-style)

Use **full-width** rows on imagery with **pill radius** (`--bawo-radius-pill`) and the warm gradient from `recipes.pillActiveGradient` (see `.pill-warm-auth`).

**Layout rule:** leading **white** icon + label **optically centered** across the full width:

- Container: `position: relative; display: flex; align-items: center; width: 100%; min-height` per touch target.
- Icon wrapper: `position: absolute; left: var(--bawo-space-lg);` (24px), flex-centered, `color: white`.
- Label: `flex: 1 1 auto; text-align: center; padding-inline: 3rem` (or equivalent) so the text stays centered while the icon occupies the leading gutter—mirror iOS “Continue with email” rows.

Primary conversion actions use **Liquid Glass** copper (`.liquid-glass-cta` / `recipes.liquidGlassCTA`), not pumpkin orange. Reserve **heritage gold** (`--bawo-heritage-gold`) for small accents only (icons, emphasis numerals), never primary CTA fill.

## Glass cards

Prefer `.glass-card` (maps to `recipes.glassCard`): low white fill opacity, subtle border, backdrop blur.

## Spacing

4pt grid: `--bawo-space-xs` … `--bawo-space-xxl`. Screen horizontal padding = **24px** (`--bawo-space-lg`).

## Typography

- **Display / hero / major headings:** MuseoModerno-Bold (`font-display` in Tailwind).
- **UI body, buttons, forms:** Montserrat (`font-sans`).
