import { useEffect, useRef } from "react";
import * as THREE from "three";
import { heroParticlePalette as palette } from "./heroParticlePalette";

type HeroParticleFieldProps = {
  className?: string;
};

const VERT = `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aPhase;
  attribute float aDrift;
  attribute vec3 aColor;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec3 pos = position;
    pos.x += sin(uTime * 0.35 + aPhase) * 0.08 * aDrift;
    pos.y += sin(uTime * 0.7 + aPhase) * 0.045 * aDrift;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = clamp(aSize * (260.0 / max(1.0, -mv.z)), 1.0, 220.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float dist = length(p) * 2.0;
    if (dist > 1.0) discard;
    float halo = exp(-dist * dist * 3.4);
    float core = exp(-dist * dist * 14.0);
    vec3 col = vColor + core * 0.12;
    float alpha = halo * vAlpha;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

const PUMPKIN = new THREE.Color(palette.pumpkin);
const PEACH = new THREE.Color(palette.peach);
const GOLD = new THREE.Color(palette.gold);
const FLAG_GREEN = new THREE.Color(palette.flagGreen);
const FLAG_GREEN_SOFT = new THREE.Color(palette.flagGreenSoft);
const WHITE = new THREE.Color(palette.white);
const WHITE_SOFT = new THREE.Color(palette.whiteSoft);

/**
 * ~50% warm (pumpkin/peach/gold), ~30% Nigerian green, ~20% soft white.
 * Pumpkin is the brand anchor; green/white are accents, not stripes.
 */
function pickColor(_x: number, _bias: number) {
  const roll = Math.random();
  if (roll < 0.5) {
    // Warm brand family
    const warm = Math.random();
    if (warm < 0.55) return PUMPKIN;
    if (warm < 0.82) return PEACH;
    return GOLD;
  }
  if (roll < 0.8) {
    // Nigerian green — soft lift so additive blend isn't muddy
    return Math.random() > 0.35 ? FLAG_GREEN_SOFT : FLAG_GREEN;
  }
  // Soft white (mostly whiteSoft; rare pure white sparkles)
  return Math.random() > 0.78 ? WHITE : WHITE_SOFT;
}

function makeMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
}

type ParticlePoint = {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  color: THREE.Color;
  phase?: number;
  drift?: number;
};

function fillAttributes(count: number, place: (i: number) => ParticlePoint) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  const phases = new Float32Array(count);
  const drifts = new Float32Array(count);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const p = place(i);
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
    color.copy(p.color);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    sizes[i] = p.size;
    alphas[i] = p.alpha;
    phases[i] = p.phase ?? 0;
    drifts[i] = p.drift ?? 0;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aDrift", new THREE.BufferAttribute(drifts, 1));
  return geometry;
}

export default function HeroParticleField({ className = "" }: HeroParticleFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    // Mobile: fewer, slightly larger dots for ~60fps on mid phones (~390px).
    const sphereCount = mobile ? 2800 : 10400;
    const waveCount = mobile ? 1600 : 8200;
    const sizeBoost = mobile ? 1.35 : 1;
    const dprCap = mobile ? 1.15 : 1.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(palette.canvas, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Wider FOV + centered framing so the sphere sits behind hero copy on phones.
    const camera = new THREE.PerspectiveCamera(mobile ? 42 : 36, 1, 0.1, 40);
    camera.position.set(0, mobile ? 0.08 : 0.15, mobile ? 8.2 : 7.6);

    const sphere = new THREE.Points(
      fillAttributes(sphereCount, (i) => {
        const band = i / sphereCount;
        let radius = 1.55;
        if (band < 0.34) radius = 0.2 + Math.random() * 0.85;
        else if (band < 0.82) radius = 1.05 + Math.random() * 0.72;
        else radius = 1.75 + Math.random() * 0.7;

        const y = 1 - (i / Math.max(1, sphereCount - 1)) * 2;
        const ring = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = Math.PI * (3 - Math.sqrt(5)) * i + Math.random() * 0.15;
        const x = Math.cos(theta) * ring * radius;
        const z = Math.sin(theta) * ring * radius;
        const py = y * radius * (0.92 + Math.random() * 0.1);

        // Green dots slightly softer so white/pumpkin stay the bright accents.
        const color = pickColor(x, band < 0.34 ? 0.08 : 0);
        const isGreen =
          color === FLAG_GREEN || color === FLAG_GREEN_SOFT;
        const isWhite = color === WHITE || color === WHITE_SOFT;
        const baseAlpha = band < 0.34 ? 0.38 + Math.random() * 0.28 : 0.48 + Math.random() * 0.4;
        const alpha = isGreen
          ? baseAlpha * 0.82
          : isWhite
            ? baseAlpha * 0.72
            : baseAlpha;

        return {
          x,
          y: py,
          z,
          size:
            (band < 0.34 ? 0.2 + Math.random() * 0.08 : 0.13 + Math.random() * 0.09) *
            sizeBoost,
          alpha,
          color,
        };
      }),
      makeMaterial(),
    );
    // Mobile: center sphere behind stacked title/phone; desktop keeps slight offset.
    sphere.position.set(mobile ? 0 : 0.2, mobile ? 0.28 : 0.72, 0);
    scene.add(sphere);

    const waveGeometry = fillAttributes(waveCount, () => {
      const n = Math.random() + Math.random() + Math.random() - 1.5;
      const x = n * (mobile ? 3.6 : 4.8);
      const density = Math.exp(-(x * x) / 16);
      const y =
        Math.sin(x * 0.62) * 0.22 +
        (Math.random() - 0.5) * (0.12 + density * 0.95);
      const z = (Math.random() - 0.5) * (0.35 + density * 1.7);
      const spark = Math.random() > 0.9;
      const color = spark
        ? Math.random() > 0.5
          ? WHITE_SOFT
          : Math.random() > 0.45
            ? GOLD
            : PUMPKIN
        : pickColor(x, -0.05);
      return {
        x,
        y,
        z,
        phase: Math.random() * Math.PI * 2,
        drift: 1,
        size:
          (spark ? 0.22 + Math.random() * 0.06 : 0.11 + Math.random() * 0.08) * sizeBoost,
        alpha: (0.2 + density * 0.55) * (0.55 + Math.random() * 0.4),
        color,
      };
    });
    const wave = new THREE.Points(waveGeometry, makeMaterial());
    wave.position.set(0, mobile ? -0.55 : -0.42, 0);
    scene.add(wave);

    const pointer = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      // Skip continuous pointer coupling on touch — saves CPU, avoids jumpiness.
      if (mobile && event.pointerType === "touch") return;
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let frame = 0;
    let pageVisible = !document.hidden;
    /**
     * Animate while any of the hero is on screen. Pause only when fully off
     * (avoids annoying pause on mobile chrome show/hide / small scrolls).
     */
    let heroVisible = true;
    const started = performance.now();
    const materials = [sphere.material, wave.material] as THREE.ShaderMaterial[];
    const lookY = mobile ? 0.12 : 0.2;
    const camRestY = mobile ? 0.08 : 0.15;

    const draw = (now: number) => {
      const t = (now - started) / 1000;
      if (!reduced) {
        for (const material of materials) material.uniforms.uTime.value = t;
      }
      sphere.rotation.y = t * 0.07;
      sphere.rotation.x = Math.sin(t * 0.15) * 0.04;
      if (!mobile) {
        sphere.rotation.y += pointer.x * 0.12;
        sphere.rotation.x += pointer.y * -0.05;
        camera.position.x += (pointer.x * 0.28 - camera.position.x) * 0.04;
        camera.position.y += (camRestY - pointer.y * 0.18 - camera.position.y) * 0.04;
      } else {
        camera.position.x *= 0.96;
        camera.position.y += (camRestY - camera.position.y) * 0.06;
      }
      camera.lookAt(0, lookY, 0);
      renderer.render(scene, camera);
    };

    const shouldAnimate = () => pageVisible && heroVisible && !reduced;

    const loop = (now: number) => {
      frame = window.requestAnimationFrame(loop);
      if (!shouldAnimate()) return;
      draw(now);
    };

    draw(started);
    if (!reduced) frame = window.requestAnimationFrame(loop);

    const onVisibility = () => {
      pageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const heroEl =
      document.querySelector<HTMLElement>(".bawo-hero-section") ??
      document.querySelector<HTMLElement>("#root");
    const intersectObs = new IntersectionObserver(
      ([entry]) => {
        // Any visible pixels keep animation running (esp. mobile URL-bar resize).
        heroVisible = (entry?.intersectionRatio ?? 0) > 0;
      },
      {
        threshold: [0, 0.01, 0.05],
        // Generous margin so tiny viewport chrome changes don't flip visibility.
        rootMargin: mobile ? "120px 0px 120px 0px" : "40px 0px 40px 0px",
      },
    );
    if (heroEl) intersectObs.observe(heroEl);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      observer.disconnect();
      intersectObs.disconnect();
      sphere.geometry.dispose();
      wave.geometry.dispose();
      (sphere.material as THREE.Material).dispose();
      (wave.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`bawo-particle-field ${className}`.trim()}
      aria-hidden
    />
  );
}
