# Globe / Earth hero — porting notes

This document describes the marketing-site hero globe so a React Native (or other) port can match it. Source of truth: the live web implementation.

**Website:** [joinbawo.com](https://www.joinbawo.com)  
**Primary files:**

| Path | Role |
|------|------|
| `src/components/ui/HeroParticleField.tsx` | Three.js Earth scene: textured sphere, atmosphere, green city nodes, idle spin |
| `src/components/ui/heroParticlePalette.ts` | Brand gold used for soft haze accents |
| `public/textures/earth-day.jpg` | Daytime Earth albedo (~234KB JPEG) |
| `src/index.css` (`.bawo-particle-field`, `.bawo-particle-field--site`) | Fixed full-viewport host |
| `src/App.tsx` | Mounts `<HeroParticleField className="bawo-particle-field--site" />` behind page content |

---

## 1. Framework choice

**Chosen stack: plain Three.js (already a dependency) via `THREE.WebGLRenderer`.**

| Option | Verdict |
|--------|---------|
| **Three.js (current)** | Best fit — already bundled, full control over Earth mesh + atmosphere + additive green Points, no extra deps, recognizable textured globe |
| React Three Fiber | Solid, but adds package weight for a single fixed hero scene |
| globe.gl | Globe-focused, but heavier and less brand-tunable for eggplant/gold atmosphere |

Not used: CSS/canvas fibonacci dotted disc (previous treatment — read as a flat circle).

---

## 2. Scene layout

| Parameter | Value |
|-----------|--------|
| Camera | `PerspectiveCamera(38°, aspect, near=0.1, far=80)` |
| Camera Z | ~3.15 desktop / ~3.55 mobile (pulled in so globe fills the hero) |
| Root scale | ~1.22 desktop / ~1.08 mobile |
| Globe radius | `1.72` world units |
| Segments | 96 desktop / 64 coarse pointer |
| Clear | Transparent (`alpha: true`) over eggplant page canvas |
| Pixel ratio cap | `min(dpr, 1.75)` desktop / `1.4` coarse |
| Idle spin | `~0.045 rad/s` on `earth.rotation.y` |
| Pointer parallax | Soft target rot X/Y (disabled under `prefers-reduced-motion`) |

### Earth mesh

- `SphereGeometry` + `MeshStandardMaterial` with `/textures/earth-day.jpg` (`SRGBColorSpace`)
- Warm key light + green fill/rim so continents read against the dark hero
- Emissive tint `#061810` keeps landmasses faintly alive in shadow

### Atmosphere

- Slightly larger back-face sphere with fresnel shader
- Mix of brand gold + green glow (`#22ff88`)

### Glowing green particles (required accent)

- **City nodes:** ~24 diaspora lat/lon Points parented to the Earth (NYC, Lagos, London, Toronto, …) — additive green `#2dff8a`, size pulse via custom shader
- **Spark layer:** ~48–72 jittered green Points just above the surface for glow density
- Sparse gold haze Points outside the sphere (not the primary look)

---

## 3. Performance / a11y

- Pause RAF when `document.hidden`
- Static single frame when `prefers-reduced-motion: reduce`
- Lower segment count + DPR on coarse pointers / narrow viewports
- Texture is a single ~234KB JPEG — avoid shipping multi-megabyte Earth assets

---

## 4. Hero composition rules (do not regress)

- Globe is **background** behind headline + phone — do not stack download/waitlist CTAs on the sphere
- Header already carries TestFlight + Join Waitlist
- Approved homepage paragraph wording stays verbatim; type is supporting Outfit body, not a second headline
- Always write **BawoSocial** in full; Lagos-only city copy in marketing text
