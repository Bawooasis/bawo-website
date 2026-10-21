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
    // Gentle drift — small amplitude so it never fights the sphere spin
    pos.x += sin(uTime * 0.28 + aPhase) * 0.045 * aDrift;
    pos.y += sin(uTime * 0.52 + aPhase) * 0.028 * aDrift;
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

/** Constant angular rates (rad/s) — buttery slow continuous spin */
const SPIN_Y_RAD_PER_SEC = 0.055;
const PITCH_AMP = 0.022;
const PITCH_FREQ = 0.07;
/** Smoothstep ease-in duration for spin start (seconds) */
const SPIN_EASE_SEC = 1.35;
/** Pointer influence (heavily damped; never overwrites base spin) */
const POINTER_YAW_GAIN = 0.05;
const POINTER_PITCH_GAIN = 0.02;
const POINTER_SMOOTH = 3.2;
const CAM_SMOOTH = 2.8;
/** Cap dt so a long pause / background tab doesn't jump */
const MAX_DT = 1 / 30;

/**
 * ~50% warm (pumpkin/peach/gold), ~30% Nigerian green, ~20% soft white.
 */
function pickColor(_x: number, _bias: number) {
  const roll = Math.random();
  if (roll < 0.5) {
    const warm = Math.random();
    if (warm < 0.58) return PUMPKIN;
    if (warm < 0.84) return PEACH;
    return GOLD;
  }
  if (roll < 0.8) {
    return Math.random() > 0.28 ? FLAG_GREEN_SOFT : FLAG_GREEN;
  }
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

function smoothstep01(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** Exponential decay toward target — frame-rate independent */
function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export default function HeroParticleField({ className = "" }: HeroParticleFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    // Keep prior mobile caps unless mid-phone stutter warrants a drop.
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

        const color = pickColor(x, band < 0.34 ? 0.08 : 0);
        const isGreen = color === FLAG_GREEN || color === FLAG_GREEN_SOFT;
        const isWhite = color === WHITE || color === WHITE_SOFT;
        const baseAlpha = band < 0.34 ? 0.38 + Math.random() * 0.28 : 0.48 + Math.random() * 0.4;
        const alpha = isWhite ? baseAlpha * 0.72 : isGreen ? Math.min(1, baseAlpha * 1.08) : baseAlpha;
        const baseSize = band < 0.34 ? 0.2 + Math.random() * 0.08 : 0.13 + Math.random() * 0.09;

        return {
          x,
          y: py,
          z,
          size: baseSize * sizeBoost * (isGreen ? 1.22 : 1),
          alpha,
          color,
        };
      }),
      makeMaterial(),
    );
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

    const pointerTarget = { x: 0, y: 0 };
    const pointerSmooth = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      // No touch coupling — avoids scroll/gesture fighting the spin on phones.
      if (mobile || event.pointerType === "touch") return;
      pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 2;
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
    let heroVisible = true;
    let simTime = 0;
    let easeT = 0;
    let lastNow = performance.now();
    const materials = [sphere.material, wave.material] as THREE.ShaderMaterial[];
    const lookY = mobile ? 0.12 : 0.2;
    const camRestY = mobile ? 0.08 : 0.15;
    const camRestX = 0;

    const renderFrame = () => {
      const ease = smoothstep01(easeT / SPIN_EASE_SEC);
      if (!reduced) {
        for (const material of materials) material.uniforms.uTime.value = simTime;
      }
      // Continuous spin from accumulated simTime — no loop resets / wrap jumps.
      sphere.rotation.y =
        simTime * SPIN_Y_RAD_PER_SEC * ease + pointerSmooth.x * POINTER_YAW_GAIN * ease;
      sphere.rotation.x =
        Math.sin(simTime * PITCH_FREQ) * PITCH_AMP * ease +
        pointerSmooth.y * -POINTER_PITCH_GAIN * ease;

      camera.lookAt(0, lookY, 0);
      renderer.render(scene, camera);
    };

    const shouldAnimate = () => pageVisible && heroVisible && !reduced;

    const loop = (now: number) => {
      frame = window.requestAnimationFrame(loop);

      // Always refresh lastNow when paused so resume doesn't get a huge dt spike.
      if (!shouldAnimate()) {
        lastNow = now;
        return;
      }

      let dt = (now - lastNow) / 1000;
      lastNow = now;
      if (dt < 0) dt = 0;
      if (dt > MAX_DT) dt = MAX_DT;

      simTime += dt;
      easeT = Math.min(SPIN_EASE_SEC, easeT + dt);

      if (!mobile) {
        pointerSmooth.x = damp(pointerSmooth.x, pointerTarget.x, POINTER_SMOOTH, dt);
        pointerSmooth.y = damp(pointerSmooth.y, pointerTarget.y, POINTER_SMOOTH, dt);
        camera.position.x = damp(
          camera.position.x,
          camRestX + pointerSmooth.x * 0.18,
          CAM_SMOOTH,
          dt,
        );
        camera.position.y = damp(
          camera.position.y,
          camRestY - pointerSmooth.y * 0.1,
          CAM_SMOOTH,
          dt,
        );
      } else {
        pointerSmooth.x = damp(pointerSmooth.x, 0, POINTER_SMOOTH, dt);
        pointerSmooth.y = damp(pointerSmooth.y, 0, POINTER_SMOOTH, dt);
        camera.position.x = damp(camera.position.x, camRestX, CAM_SMOOTH, dt);
        camera.position.y = damp(camera.position.y, camRestY, CAM_SMOOTH, dt);
      }

      renderFrame();
    };

    // Static first paint (also final state for reduced motion).
    renderFrame();
    if (!reduced) frame = window.requestAnimationFrame(loop);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      // Reset clock baseline on return so the next frame's dt is small.
      lastNow = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const heroEl =
      document.querySelector<HTMLElement>(".bawo-hero-section") ??
      document.querySelector<HTMLElement>("#root");
    const intersectObs = new IntersectionObserver(
      ([entry]) => {
        const next = (entry?.intersectionRatio ?? 0) > 0;
        if (next && !heroVisible) lastNow = performance.now();
        heroVisible = next;
      },
      {
        threshold: [0, 0.01, 0.05],
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
