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

const NEON = new THREE.Color(palette.neon);
const NEON_HOT = new THREE.Color(palette.neonHot);
const FOREST = new THREE.Color(palette.forest);
const PINK = new THREE.Color(palette.pink);
const MAGENTA = new THREE.Color(palette.magenta);
const PURPLE = new THREE.Color(palette.purple);
const VIOLET = new THREE.Color(palette.violet);
const WHITE = new THREE.Color(palette.white);
const WHITE_SOFT = new THREE.Color(palette.whiteSoft);
const YELLOW = new THREE.Color(palette.yellow);

function pickColor(x: number, bias: number) {
  const roll = Math.random();
  if (roll < 0.1) return YELLOW;
  if (roll < 0.22) {
    return Math.random() > 0.4 ? WHITE : WHITE_SOFT;
  }
  const colorRoll = (roll - 0.22) / 0.78;
  const greenWeight = x < 0 ? 0.62 : 0.16 + bias;
  if (colorRoll < greenWeight) {
    return Math.random() > 0.45 ? NEON_HOT : Math.random() > 0.35 ? NEON : FOREST;
  }
  if (colorRoll < greenWeight + 0.42) {
    return Math.random() > 0.5 ? PINK : MAGENTA;
  }
  return Math.random() > 0.45 ? PURPLE : VIOLET;
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
    const sphereCount = mobile ? 4600 : 10400;
    const waveCount = mobile ? 3200 : 8200;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(palette.canvas, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.set(0, 0.15, 7.6);

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
        return {
          x,
          y: py,
          z,
          size: band < 0.34 ? 0.2 + Math.random() * 0.08 : 0.13 + Math.random() * 0.09,
          alpha: band < 0.34 ? 0.38 + Math.random() * 0.28 : 0.48 + Math.random() * 0.4,
          color: pickColor(x, band < 0.34 ? 0.08 : 0),
        };
      }),
      makeMaterial(),
    );
    sphere.position.set(0.2, 0.72, 0);
    scene.add(sphere);

    const coreGlow = new THREE.Points(
      fillAttributes(14, (i) => {
        const angle = (i / 14) * Math.PI * 2;
        const ring = i < 2 ? 0.05 : 0.25 + (i % 4) * 0.22;
        return {
          x: Math.cos(angle) * ring,
          y: Math.sin(angle * 0.85) * ring * 0.72,
          z: Math.sin(angle) * 0.28,
          size: i < 2 ? 1.85 : 1.25 + (i % 3) * 0.22,
          alpha: i < 2 ? 0.06 : 0.042 + (i % 3) * 0.01,
          color: i % 4 === 0 ? YELLOW : i % 4 === 1 ? NEON : i % 4 === 2 ? PINK : PURPLE,
        };
      }),
      makeMaterial(),
    );
    sphere.add(coreGlow);

    const waveGeometry = fillAttributes(waveCount, () => {
      const n = Math.random() + Math.random() + Math.random() - 1.5;
      const x = n * 4.8;
      const density = Math.exp(-(x * x) / 16);
      const y =
        Math.sin(x * 0.62) * 0.22 +
        (Math.random() - 0.5) * (0.12 + density * 0.95);
      const z = (Math.random() - 0.5) * (0.35 + density * 1.7);
      const spark = Math.random() > 0.9;
      return {
        x,
        y,
        z,
        phase: Math.random() * Math.PI * 2,
        drift: 1,
        size: spark ? 0.22 + Math.random() * 0.06 : 0.11 + Math.random() * 0.08,
        alpha: (0.2 + density * 0.55) * (0.55 + Math.random() * 0.4),
        color: spark
          ? Math.random() > 0.62
            ? WHITE
            : Math.random() > 0.4
              ? NEON_HOT
              : NEON
          : pickColor(x, -0.05),
      };
    });
    const wave = new THREE.Points(waveGeometry, makeMaterial());
    wave.position.set(0, -0.42, 0);
    scene.add(wave);

    const horizonGlow = new THREE.Points(
      fillAttributes(9, (i) => {
        const x = (i - 4) * 0.85;
        return {
          x,
          y: Math.sin(x * 0.55) * 0.12,
          z: 0,
          size: 1.2 - Math.abs(i - 4) * 0.06,
          alpha: 0.028 + (1 - Math.abs(i - 4) / 5) * 0.02,
          color: i % 2 === 0 ? PURPLE : i % 3 === 0 ? NEON : MAGENTA,
        };
      }),
      makeMaterial(),
    );
    wave.add(horizonGlow);

    const pointer = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer);

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
    let running = !document.hidden;
    const started = performance.now();
    const materials = [
      sphere.material,
      wave.material,
      coreGlow.material,
      horizonGlow.material,
    ] as THREE.ShaderMaterial[];

    const draw = (now: number) => {
      const t = (now - started) / 1000;
      if (!reduced) {
        for (const material of materials) material.uniforms.uTime.value = t;
      }
      sphere.rotation.y = t * 0.07;
      sphere.rotation.x = Math.sin(t * 0.15) * 0.04;
      sphere.rotation.y += pointer.x * 0.12;
      sphere.rotation.x += pointer.y * -0.05;

      camera.position.x += (pointer.x * 0.28 - camera.position.x) * 0.04;
      camera.position.y += (0.15 - pointer.y * 0.18 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.2, 0);
      renderer.render(scene, camera);
    };

    const loop = (now: number) => {
      frame = window.requestAnimationFrame(loop);
      if (!running) return;
      draw(now);
    };

    draw(started);
    if (!reduced) frame = window.requestAnimationFrame(loop);

    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      observer.disconnect();
      sphere.geometry.dispose();
      wave.geometry.dispose();
      coreGlow.geometry.dispose();
      horizonGlow.geometry.dispose();
      (sphere.material as THREE.Material).dispose();
      (wave.material as THREE.Material).dispose();
      (coreGlow.material as THREE.Material).dispose();
      (horizonGlow.material as THREE.Material).dispose();
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
