# Globe / particle-field animation — porting notes

This document describes the marketing-site “globe of dots” so a React Native (or other) port can match it. Source of truth: the live web implementation.

**Website:** [joinbawo.com](https://www.joinbawo.com)  
**Primary files:**

| Path | Role |
|------|------|
| `src/components/ui/HeroParticleField.tsx` | Scene setup, particle generation, shaders, animation loop, pause logic |
| `src/components/ui/heroParticlePalette.ts` | Brand colors used by the field |
| `src/index.css` (`.bawo-particle-field`, `.bawo-particle-field--site`) | Host sizing / fixed full-viewport layer |
| `src/App.tsx` | Mounts `<HeroParticleField className="bawo-particle-field--site" />` behind page content |

Related (not the globe, but “dots + connections” on the borough section):

| Path | Role |
|------|------|
| `src/components/BoroughNetworkGraphic.tsx` | Static SVG mesh of spokes/chains between borough hubs (not animated WebGL) |

---

## 1. Rendering technology

- **Library:** [three.js](https://threejs.org/) (`three` npm package).
- **API:** WebGL via `THREE.WebGLRenderer`.
- **Primitives:** two `THREE.Points` meshes (sphere shell + horizontal wave), each with a custom `THREE.ShaderMaterial`.
- **Not used:** Canvas 2D, SVG for the globe, or a higher-level particle library.
- **Blending:** `THREE.AdditiveBlending`, `transparent: true`, `depthWrite: false`, `toneMapped: false` — nearby dots bloom into soft “connections” without drawing explicit line segments.

For React Native, the closest ports are **expo-gl + three** or **react-native-filament** / custom GLES. Match the same two-pass Points + additive blend look; do not require a graph of edges unless you intentionally add one.

---

## 2. Scene layout

| Parameter | Value |
|-----------|--------|
| Camera | `PerspectiveCamera(36°, aspect, near=0.1, far=40)` |
| Camera position (rest) | `(0, 0.15, 7.6)` |
| Look-at | `(0, 0.2, 0)` |
| Clear / canvas color | `#0E0A14` (`heroParticlePalette.canvas`) |
| Antialias | `false` (perf) |
| Pixel ratio cap | `min(devicePixelRatio, 1.25)` on mobile (≤767px), else `1.5` |
| Power preference | `"high-performance"` |

### Layer A — sphere (“globe”)

- Object: `THREE.Points`
- Position: `(0.2, 0.72, 0)`
- Dot count: **4600** (mobile) / **10400** (desktop)

### Layer B — wave (foreground ribbon under the globe)

- Object: `THREE.Points`
- Position: `(0, -0.42, 0)`
- Dot count: **3200** (mobile) / **8200** (desktop)

---

## 3. Dot positions — how they are generated

### Sphere (fibonacci / golden-angle shell with radial bands)

For index `i` in `[0, sphereCount)`:

1. **Band** by normalized index `band = i / sphereCount`:
   - `band < 0.34` → inner fill: `radius = 0.2 + random * 0.85`
   - `band < 0.82` → main shell: `radius = 1.05 + random * 0.72`
   - else → outer haze: `radius = 1.75 + random * 0.7`
2. **Latitude:** `y = 1 - (i / (sphereCount - 1)) * 2` ∈ `[-1, 1]`
3. **Ring radius:** `ring = sqrt(max(0, 1 - y²))`
4. **Azimuth (golden angle + jitter):**  
   `theta = π * (3 - √5) * i + random * 0.15`
5. **Cartesian:**  
   `x = cos(theta) * ring * radius`  
   `z = sin(theta) * ring * radius`  
   `py = y * radius * (0.92 + random * 0.1)`
6. **Size / alpha:**
   - Inner band: `size = 0.2 + r*0.08`, `alpha = 0.38 + r*0.28`
   - Outer bands: `size = 0.13 + r*0.09`, `alpha = 0.48 + r*0.4`

This is a **jittered fibonacci sphere** with three radial shells — not lat/long grid, not Poisson disk.

### Wave (1D ribbon with Gaussian density)

For each of `waveCount` points:

1. `n = random + random + random - 1.5` ( Irwin–Hall ≈ triangular )
2. `x = n * 4.8`
3. `density = exp(-(x²) / 16)` (more dots near x=0)
4. `y = sin(x * 0.62) * 0.22 + (random - 0.5) * (0.12 + density * 0.95)`
5. `z = (random - 0.5) * (0.35 + density * 1.7)`
6. `phase = random * 2π`, `drift = 1` (enables vertex drift)
7. ~10% “sparks”: larger size (`0.22–0.28`), brighter color

---

## 4. “Connection” logic

**There is no explicit edge list or line renderer on the globe.**

Perceived connections come from:

1. **High local density** on the shell (fibonacci packing).
2. **Additive blending** + soft Gaussian point sprites in the fragment shader (halo + hot core).
3. **Color continuity** (warm pumpkin/peach/gold neighbors read as linked).

If the native port needs literal polylines (e.g. Skia `drawLine`), a reasonable approximation is: for a random subset of sphere points, connect each point to its **2–3 nearest neighbors within a chord distance threshold** (~0.12–0.18 in scene units), drawn at low opacity with gold/pumpkin strokes. That is an **enhancement**, not what web ships today.

The **borough network** SVG (`BoroughNetworkGraphic`) *does* draw explicit paths (hub spokes + neighbor chains). That is a separate graphic, not part of the WebGL globe.

---

## 5. Shaders (point sprites)

### Vertex

Uniforms: `uTime` (seconds).  
Attributes: `position`, `aSize`, `aAlpha`, `aPhase`, `aDrift`, `aColor`.

Per-frame drift (wave only uses non-zero `aDrift`):

```
pos.x += sin(uTime * 0.28 + aPhase) * 0.045 * aDrift
pos.y += sin(uTime * 0.52 + aPhase) * 0.028 * aDrift
gl_PointSize = clamp(aSize * (260.0 / max(1.0, -mv.z)), 1.0, 220.0)
```

### Fragment

Circular soft particle:

```
dist = length(gl_PointCoord - 0.5) * 2
discard if dist > 1
halo = exp(-dist² * 3.4)
core = exp(-dist² * 14.0)
color = vColor + core * 0.12
alpha = halo * vAlpha
output = vec4(color * alpha, alpha)   // premultiplied-style additive
```

---

## 6. Rotation, camera, and timing (buttery continuous spin)

Animation is **delta-time based** from `requestAnimationFrame`, not fixed per-frame increments.

```
dt = clamp((now - lastNow) / 1000, 0, 1/30)
simTime += dt                         // only while animating
ease = smoothstep(easeT / 1.35s)      // eased start, then stays 1
pointerSmooth = damp(pointerSmooth, pointerTarget, λ≈3.2, dt)
```

| Motion | Formula |
|--------|---------|
| Sphere yaw | `rotation.y = simTime * 0.055 * ease + pointerSmooth.x * 0.05 * ease` |
| Sphere pitch | `rotation.x = sin(simTime * 0.07) * 0.022 * ease + pointerSmooth.y * -0.02 * ease` |
| Camera | exponential damp toward rest (+ tiny desktop pointer offset); no scroll-linked spin |
| Pointer | desktop only; touch ignored; heavily damped so it never fights auto rotation |
| Pause | tab hidden **or** hero fully off-screen — `simTime` does **not** advance; `lastNow` resets on resume to avoid dt spikes |

Constant angular velocity ≈ **0.055 rad/s** → full Y turn ≈ `2π / 0.055 ≈ 114s`. No wrap/reset of rotation angles (floats grow freely — no loop seam).

Wave points only bob via softened vertex `sin` terms (`0.045` / `0.028` amp) — no mesh rotation.

---

## 7. Colors and sizes (build 165 + flag accents)

From `heroParticlePalette.ts`:

| Token | Hex | Use in field |
|-------|-----|----------------|
| pumpkin | `#FF6B00` | Dominant brand dots |
| peach | `#FF8C42` | Secondary warm |
| gold | `#FFBC42` | Warm accent within the 50% warm bucket |
| flagGreen / soft | `#00C853` / `#69FFA0` | Nigerian green (~30%); lifted from `#008751` + size bump so greens stay distinct under additive pumpkin |
| white / whiteSoft | `#FFFFFF` / `#E8E6E3` | Soft whites (~20%); prefer soft |
| canvas | `#08060C` | Clear color / page bg (near-black) |

`pickColor` target mix: **~50% pumpkin/peach/gold · ~30% flag green · ~20% soft white**. Tuned for a premium field on `#08060C`.

### Mobile (~390px / ≤767px)

| Param | Mobile | Desktop |
|-------|--------|---------|
| Sphere count | **2800** | 10400 |
| Wave count | **1600** | 8200 |
| Size boost | **1.35×** | 1× |
| DPR cap | **1.15** | 1.5 |
| Camera FOV / Z | 42° / `8.2` | 36° / `7.6` |
| Sphere position | `(0, 0.28, 0)` | `(0.2, 0.72, 0)` |
| Pointer coupling | off | damped desktop only |

Pause when hero `intersectionRatio === 0` (generous `rootMargin` on mobile) or the tab is hidden.

Point **attribute sizes** are in the ranges in §3; on-screen pixel size is perspective-scaled in the vertex shader (`260 / -mv.z`).

---

## 8. Performance tricks (match these on native)

1. **No antialiasing** on the GL context.
2. **Capped DPR** (1.15 mobile / 1.5 desktop).
3. **Fewer particles on mobile** (2800+1600 vs 10400+8200).
4. **Single `requestAnimationFrame` loop**; skip `render` when paused; clamp `dt ≤ 1/30`.
5. **Pause when document hidden** (`visibilitychange`) — reset `lastNow` on return.
6. **Pause when hero is off-screen** — `IntersectionObserver` on `.bawo-hero-section`; last frame stays as static backdrop.
7. **`prefers-reduced-motion: reduce`** — one static frame; no rAF loop.
8. **Passive** `pointermove`; no touch pointer coupling.
9. **ResizeObserver** on the host only.
10. Dispose geometries, materials, and force context loss on unmount.

Host CSS: fixed full viewport (`.bawo-particle-field--site`), `pointer-events: none`, behind content (`z-index: 0`).

---

## 9. Suggested RN parity checklist

- [ ] Same fibonacci band radii and counts (or proportional on low-end devices).
- [ ] Delta-time spin at `0.055` rad/s yaw + tiny pitch sine; smoothstep ease-in ~1.35s.
- [ ] Additive soft discs (or Skia blur) in brand palette only.
- [ ] Pause on app background + when hero not visible + reduced motion (no dt spike on resume).
- [ ] Clear color `#08060C`.
- [ ] Optional: skip the wave layer on very low-end devices; keep the sphere.

---

## 10. Out of scope

- Copy, TestFlight / waitlist CTA URLs, and page layout are unrelated to this animation.
- Portal admin/business UIs do not mount `HeroParticleField`.
