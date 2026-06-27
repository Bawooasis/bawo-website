# BawoSocial Design Migration Guide

**Purpose:** Mirror the new website look & feel in the mobile app.  
**Source of truth:** `src/assets/colors.js`, `src/assets/theme.js`, `src/index.css`  
**Website:** [joinbawo.com](https://joinbawo.com)  
**Last updated:** June 2026 (commit `27fd42e`)

---

## 1. Design philosophy — what changed

| Before | After |
|--------|--------|
| Cool blue / purple “tech” hero | **Warm obsidian + pumpkin ember** |
| Eggplant mid-page band (`#1C0E14` at 48% scroll) | **Single canvas** `#12080F` with soft orange/gold glows |
| Heavy gold/copper CTAs everywhere | **Pumpkin orange `#ff6b00`** for primary actions |
| Corporate B2B tone (“Own the market”) | **Community-first** — preserve culture, connect, belong |
| Busy conversion blocks (calculators, emoji cards) | **Clean cards** — fewer elements, one clear CTA |
| Nigerian-only copy | **African, African American, Caribbean & Latin NYC** |

---

## 2. Tier-1 palette (`colors.js`)

Copy these primitives into the app’s `src/assets/colors.js` (already mirrored on web).

```javascript
const BRAND_CTA_ORANGE = "#ff6b00";

export const palette = {
  obsidian: {
    canvas:   "#12080F",  // main app background — warm black, not pure #000
    elevated: "#1C0E14",  // cards/modals only — never full-screen bands
    depth:    "#261018",  // deeper surfaces, shadows
  },
  copper: {
    base:      "#C47B44",  // legacy liquid-glass secondary
    bright:    "#ff6b00",  // pressed state = brand orange
    deep:      "#7A4E2E",
    muted:     "#5C3D26",
    highlight: "#F0A878",
  },
  heritageGold: "#D4AF37",
  sectionTitleAccent: "#ff6b00",
  textOnCta: "#06030C",
  brandCtaOrange: "#ff6b00",
  glass: {
    fill:           "rgba(255, 255, 255, 0.06)",
    fillRaised:     "rgba(255, 255, 255, 0.08)",
    border:         "rgba(255, 255, 255, 0.08)",
    borderHairline: "rgba(255, 255, 255, 0.14)",
  },
};
```

### Web-only helpers (use in app as needed)

| Token | Value | Use |
|-------|-------|-----|
| `brandCtaOrangeHover` | `#ff8a33` | Nav links, labels, icon tints |
| `heritageGoldSoft` | `#E8CA6A` | Trust row microcopy |
| `statusSuccess` | `#10b981` | “Batch open”, live dots |
| `navGlassScrolled` | `rgba(6, 3, 12, 0.72)` | Scrolled nav bar |

---

## 3. Tier-2 semantic tokens (`theme.js`)

```javascript
surface: {
  canvas:   "#12080F",
  elevated: "#1C0E14",
  depth:    "#261018",
  glass:    "rgba(255, 255, 255, 0.06)",
  glassRaised: "rgba(255, 255, 255, 0.08)",
},

text: {
  primary:   "#FFFFFF",
  secondary: "rgba(255, 255, 255, 0.9)",
  muted:     "rgba(255, 255, 255, 0.6)",
  subtle:    "rgba(255, 255, 255, 0.45)",
  onCta:     "#06030C",
},

accent: {
  primary:     "#ff6b00",
  primarySoft: "#ff8a33",
  gold:        "#D4AF37",
},

border: {
  subtle:       "rgba(255, 255, 255, 0.08)",
  accent:       "rgba(255, 107, 0, 0.2)",
  accentStrong: "rgba(255, 107, 0, 0.5)",
},
```

---

## 4. Background & ambient system

**Critical:** Do not use a flat `#1C0E14` full-screen background. That caused the “eggplant divide” between hero and scroll sections.

### Base canvas
- Solid fill: `#12080F` everywhere (root screen, tab shell, modals backdrop)

### Ambient glow layers
Stack as radial gradients or blurred circles at **low opacity**:

| Layer | Color | Approx. position | Opacity feel |
|-------|--------|------------------|--------------|
| Ember top | `rgba(255, 107, 0, 0.14)` | top center | Hero warmth |
| Ember left | `rgba(255, 107, 0, 0.07)` | 18% x, 32% y | Mid-page |
| Gold right | `rgba(212, 175, 55, 0.06)` | 82% x, 38% y | Heritage |
| Ember center | `rgba(255, 107, 0, 0.05)` | 50% x, 62% y | Scroll cohesion |
| Copper bottom | `rgba(196, 123, 68, 0.05)` | 30% x, 88% y | Footer warmth |

### Site-wide ambient (web: `.bawo-site-ambient`)
Three extra radials at 18%, 52%, 82% vertical — keeps all sections visually connected.

### Section entry (web: `.bawo-section-warmth`)
Soft orange glow at top of each major section:
`radial-gradient(ellipse 90% 55% at 50% 0%, rgba(255,107,0,0.08) 0%, transparent 65%)`

---

## 5. Hero / mesh shader (animated background)

Web implementation: `@paper-design/shaders-react` `MeshGradient` + optional Three.js overlay.

### Mesh color stops (use for Skia/Reanimated/Lottie equivalent)

```
#12080F  →  #14090E  →  #18100F  →  #3D2214
```

| Stop | Hex | Role |
|------|-----|------|
| 1 | `#12080F` | Canvas base |
| 2 | `#14090E` | Slightly lifted warm |
| 3 | `#18100F` | Mid warm |
| 4 | `#3D2214` | Muted ember brown (not bright `#ff6b00`) |

**Animation:** slow drift, speed ~0.32–0.45.  
**Overlay:** optional pumpkin/gold pulse orbs at 6–9% opacity.

### Hero bottom fade
Blend shader into canvas so scroll doesn’t hard-cut:
`linear-gradient(to bottom, transparent → rgba(18,8,15,0.65) → #12080F)`

### Reduced motion
Fall back to static CSS ambient (orange radial + subtle scanlines) when `prefers-reduced-motion`.

---

## 6. Component recipes

### Primary CTA button
- **Fill:** `#ff6b00` (pumpkin — primary on all new screens)
- **Text:** white or `#06030C` on solid fill
- **Radius:** pill (`9999px` / 24px)
- **Labels:** “Secure My Spot”, “Join Now”, “Become a Founding Member”
- **Hover/press:** `#ff8a33` or slight brightness lift

> **Note:** `copper.base` (`#C47B44`) remains in `theme.js` for legacy liquid-glass CTAs. New screens should use `#ff6b00`.

### Glass card (`.glass-card`)
```
background: rgba(255, 255, 255, 0.06)
border:     1px solid rgba(255, 255, 255, 0.08)
            — or rgba(255, 107, 0, 0.2) for emphasis
blur:       ~20px
radius:     16px (rounded-2xl)
shadow:     0 0 12px rgba(255, 255, 255, 0.06)
```

### Community pillar icon circle
```
background: rgba(255, 107, 0, 0.15)
icon color: #ff8a33
size:       40×40, fully rounded
```

### Benefit list checkmarks
- Icon: `#ff6b00` (not gold)

### Progress bar
```
track: rgba(255, 255, 255, 0.08)
fill:  #ff6b00
glow:  0 0 14px rgba(255, 107, 0, 0.45)  // optional
```

### Countdown numerals
- Days/hrs/min: `#ff6b00`
- Seconds: `rgba(255, 255, 255, 0.9)`

### Nav / promo strip
- **Promo bar:** solid `#ff6b00`, yellow/white text
- **Scrolled nav:** `rgba(6, 3, 12, 0.72)` + 20px blur, hairline white border

### Trust row
- Text: `#E8CA6A` with soft gold text-shadow
- Separators: `rgba(212, 175, 55, 0.45)`

---

## 7. Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / H1–H2 | **MuseoModerno** | Bold (700+) | Hero, section titles |
| Body / UI / buttons | **Montserrat** | 400–700 | All interactive copy |

### Scale reference (web)
- Hero H1: 4xl–7xl responsive
- Section H2: 3xl–5xl
- Body: sm–lg
- Microcopy / trust: 10–11px uppercase tracking

### Accent gradient text (`.bawo-text-cta-gradient`)
Gold → orange → gold for savings/stats emphasis:
`#D4AF37 → #ff6b00 → #D4AF37`

---

## 8. Logo & assets

| Asset | Path | Usage |
|-------|------|-------|
| Wordmark | `public/bawosocial-logo.png` | Nav, favicon, OG, social |
| App mockups | `src/assets/images/` | Hero carousel |

**Remove / deprecate:**
- Old 3D golden “B” logo
- `Logo.svg` (1.9MB legacy)
- Cool blue hero styling

---

## 9. Copy & positioning

**Master brand:** BawoSocial

**Audience:**
> African, African American, Caribbean, and Latin NYC

**Hero headline:**
> Culture, connection, community

**Hero subtitle (current):**
> The big platforms weren't built for our communities. BawoSocial is a private network for African, African American, Caribbean, and Latin NYC — curated resources, culture-first events, and real community without the noise.

**Community mission (new section):**
- **Title:** More than an app. A home for our culture.
- **Pillars:**
  1. **Preserve culture** — heritage events, resources, groups
  2. **Connect with purpose** — borough, background, goals
  3. **Find your community** — The Cookout, Carnival Crew, Sabor NYC

**Featured groups (in-app preview):**
Soft Life NYC · The Cookout · Carnival Crew · Sabor NYC · Outside & Owambe

**Partner framing (was B2B “own the market”):**
> Help our community find trusted local partners.

Full strings: `src/constants/content.ts`

---

## 10. Deprecate in the app

- [ ] Cool blue scanline / mesh hero
- [ ] Full-screen `#1C0E14` or `#0E0A14` section backgrounds
- [ ] `#C47B44` copper as **primary** CTA on new screens
- [ ] Gold `#D4AF37` as primary button fill (accent/icons only)
- [ ] “Naija-only” / “Nigerian diaspora-only” user-facing copy
- [ ] Fake social proof (“X just joined” toasts)
- [ ] Heavy conversion UI (price calculators, emoji feature grids on home)

---

## 11. React Native implementation checklist

### Shell & background
- [ ] Root `backgroundColor`: `#12080F`
- [ ] Add 2–3 ambient radial layers (Section 4 table)
- [ ] Optional: Skia/Reanimated 4-stop mesh on home header

### Components
- [ ] Primary button → `#ff6b00`, pill radius
- [ ] Cards → 6% white fill, 8% border, blur
- [ ] Icons → `#ff8a33` on `rgba(255,107,0,0.15)` circles
- [ ] Progress bar → orange fill
- [ ] Tab bar / nav → dark glass when scrolled

### Content
- [ ] Update onboarding/about with community mission pillars
- [ ] Surface new groups in Discover
- [ ] Resource Directory copy → Black-owned / Latin-owned businesses

### Assets
- [ ] Swap app logo to orange BawoSocial wordmark
- [ ] Sync `colors.js` + `theme.js` with web repo

---

## 12. File sync map (web → app)

| Web file | App equivalent |
|----------|----------------|
| `src/assets/colors.js` | `src/assets/colors.js` |
| `src/assets/theme.js` | `src/assets/theme.js` |
| `src/constants/content.ts` | i18n / strings / marketing copy |
| `public/bawosocial-logo.png` | App icon + header logo |
| `src/index.css` (`.bawo-page-bg`, `.glass-card`) | Theme styles / StyleSheet |
| `src/components/ui/hero-shader-background.tsx` | Home header animated gradient |
| `src/components/ui/section-shader-ambient.tsx` | Section background wash |

---

## 13. CSS variables (web runtime)

Injected via `src/theme/injectCssVars.ts`:

```css
--bawo-canvas: #12080F;
--bawo-elevated: #1C0E14;
--bawo-depth: #261018;
--bawo-brand-cta-orange: #ff6b00;
--bawo-heritage-gold: #D4AF37;
--bawo-section-title-accent: #ff6b00;
--bawo-glass-card-bg: rgba(255, 255, 255, 0.06);
--bawo-radius-pill: 9999px;
--bawo-radius-xl: 1.5rem;
```

---

## 14. Spacing & radii

4pt grid from `theme.js`:

| Token | px |
|-------|-----|
| xs | 4 |
| sm | 8 |
| md | 16 |
| lg | 24 |
| xl | 32 |
| xxl | 48 |

| Radius | Value |
|--------|-------|
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| pill | 9999px |

Screen horizontal padding: **24px** (`lg`).

---

## Questions?

Design system skill: `.cursor/skills/bawosocial-design-system/SKILL.md`  
Website repo: `Bawooasis/bawo-website`
