import {
  fontSize,
  radii,
  recipes,
  semanticTokens,
  spacing,
} from "../assets/theme.js";
import { palette } from "../assets/colors.js";

/** Applies design tokens as CSS custom properties (single runtime bridge from theme.js). */
export function injectDesignTokens() {
  const r = document.documentElement.style;
  const d = semanticTokens.dark;
  const lg = recipes.liquidGlassCTA;
  const pill = recipes.pillActiveGradient;
  const pillBg = `linear-gradient(${pill.angle}, ${pill.stops.join(", ")})`;

  r.setProperty("--bawo-canvas", d.surface.canvas);
  r.setProperty("--bawo-elevated", d.surface.elevated);
  r.setProperty("--bawo-depth", d.surface.depth);
  r.setProperty("--bawo-surface-glass", d.surface.glass);
  r.setProperty("--bawo-surface-glass-raised", d.surface.glassRaised);

  r.setProperty("--bawo-signal-action", d.signal.action);
  r.setProperty("--bawo-signal-action-hover", d.signal.actionPressed);
  r.setProperty("--bawo-signal-action-pressed", d.signal.actionPressed);
  r.setProperty("--bawo-signal-action-muted", d.signal.actionMuted);

  r.setProperty("--bawo-copper-bright", palette.copper.bright);
  r.setProperty("--bawo-copper-muted", palette.copper.muted);
  r.setProperty("--bawo-heritage-gold", palette.heritageGold);
  r.setProperty("--bawo-section-title-accent", palette.sectionTitleAccent);

  r.setProperty("--bawo-text-primary", d.text.primary);
  r.setProperty("--bawo-text-secondary", d.text.secondary);
  r.setProperty("--bawo-text-muted", d.text.muted);
  r.setProperty("--bawo-text-on-action", d.text.onAction);
  r.setProperty("--bawo-border-subtle", d.border.subtle);
  r.setProperty("--bawo-border-hairline", d.border.hairline);

  /* recipes.liquidGlassCTA — solid copper + edge + shadow (native-aligned) */
  r.setProperty("--bawo-liquid-glass-fill", lg.backgroundColor);
  r.setProperty("--bawo-liquid-glass-border", lg.border);
  r.setProperty("--bawo-liquid-glass-border-top", lg.borderTop);
  r.setProperty("--bawo-liquid-glass-radius", lg.borderRadius);
  r.setProperty("--bawo-liquid-glass-shadow", lg.boxShadow);
  r.setProperty("--bawo-liquid-glass-hover-bg", recipes.liquidGlassCTAPressed.backgroundColor);
  r.setProperty("--bawo-liquid-glass-disabled-bg", recipes.liquidGlassCTADisabled.backgroundColor);
  r.setProperty(
    "--bawo-liquid-glass-disabled-border-top",
    `1px solid ${palette.liquidGlass.edgeTopDisabled}`,
  );
  r.setProperty("--bawo-liquid-glass-disabled-opacity", String(recipes.liquidGlassCTADisabled.opacity));

  r.setProperty("--bawo-cta-font-weight", String(recipes.liquidGlassCTAText.fontWeight));
  r.setProperty("--bawo-cta-letter-spacing", recipes.liquidGlassCTAText.letterSpacing);
  r.setProperty("--bawo-cta-text", recipes.liquidGlassCTAText.color);

  r.setProperty("--bawo-glass-card-bg", recipes.glassCard.background);
  r.setProperty("--bawo-glass-card-border", recipes.glassCard.border);
  r.setProperty("--bawo-glass-card-shadow", recipes.glassCard.boxShadow);
  r.setProperty("--bawo-glass-card-radius", recipes.glassCard.borderRadius);

  r.setProperty("--bawo-pill-active-bg", pillBg);
  r.setProperty("--bawo-pill-active-border", pill.border);
  /* Resources / PathWay active pill ramp — keep headline text gradient + CTAs in sync */
  r.setProperty("--bawo-pill-gradient", pillBg);
  r.setProperty("--bawo-brand-cta-orange", palette.brandCtaOrange);

  r.setProperty("--bawo-space-xs", `${spacing.xs}px`);
  r.setProperty("--bawo-space-sm", `${spacing.sm}px`);
  r.setProperty("--bawo-space-md", `${spacing.md}px`);
  r.setProperty("--bawo-space-lg", `${spacing.lg}px`);
  r.setProperty("--bawo-space-xl", `${spacing.xl}px`);
  r.setProperty("--bawo-space-xxl", `${spacing.xxl}px`);

  r.setProperty("--bawo-radius-xs", radii.xs);
  r.setProperty("--bawo-radius-sm", radii.sm);
  r.setProperty("--bawo-radius-md", radii.md);
  r.setProperty("--bawo-radius-lg", radii.lg);
  r.setProperty("--bawo-radius-xl", radii.xl);
  r.setProperty("--bawo-radius-pill", radii.pill);

  r.setProperty("--bawo-font-xs", fontSize.xs);
  r.setProperty("--bawo-font-sm", fontSize.sm);
  r.setProperty("--bawo-font-base", fontSize.base);
  r.setProperty("--bawo-font-md", fontSize.md);
  r.setProperty("--bawo-font-lg", fontSize.lg);
  r.setProperty("--bawo-font-xl", fontSize.xl);
  r.setProperty("--bawo-font-2xl", fontSize["2xl"]);
  r.setProperty("--bawo-font-3xl", fontSize["3xl"]);
  r.setProperty("--bawo-font-4xl", fontSize["4xl"]);
  r.setProperty("--bawo-font-5xl", fontSize["5xl"]);
  r.setProperty("--bawo-font-6xl", fontSize["6xl"]);
  r.setProperty("--bawo-font-7xl", fontSize["7xl"]);
  r.setProperty("--bawo-font-8xl", fontSize["8xl"]);
}
