import { useEffect, useRef } from "react";
import * as THREE from "three";
import { HERO_PARTICLE_HEX } from "./heroParticlePalette";

/** Golden-angle Fibonacci points on a unit sphere. */
function buildSpherePositions(count: number, radius: number): Float32Array {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    out[i * 3] = x * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = z * radius;
  }
  return out;
}

/** Vertex colors — Warm Signature Gold (#E8B959 / #FFCF6B), Rich Amber (#C9922C), Eggplant Magenta-Plum (#A82A88), Subtle Naija Emerald & Pearl. */
function buildBrandColors(count: number): Float32Array {
  const cGold = new THREE.Color(HERO_PARTICLE_HEX.pumpkin);
  const cBrightGold = new THREE.Color(HERO_PARTICLE_HEX.peach);
  const cLightGold = new THREE.Color(HERO_PARTICLE_HEX.gold);
  const cAmber = new THREE.Color(HERO_PARTICLE_HEX.copper);
  const cPlum = new THREE.Color(HERO_PARTICLE_HEX.plum);
  const cEmerald = new THREE.Color(HERO_PARTICLE_HEX.emerald);
  const cPearl = new THREE.Color(HERO_PARTICLE_HEX.pearl);
  const out = new Float32Array(count * 3);
  const tmp = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const u = ((i * 1.618033988749895) % 1 + 1) % 1;
    const v = ((i * 0.7548776662466927) % 1 + 1) % 1;
    if (u < 0.36) {
      tmp.lerpColors(cGold, cBrightGold, v);
    } else if (u < 0.62) {
      tmp.lerpColors(cBrightGold, cLightGold, v);
    } else if (u < 0.80) {
      tmp.lerpColors(cAmber, cGold, v * 0.9);
    } else if (u < 0.92) {
      tmp.lerpColors(cPlum, cGold, 0.45 + v * 0.35);
    } else if (u < 0.96) {
      tmp.lerpColors(cEmerald, cBrightGold, 0.55 + v * 0.25);
    } else {
      tmp.lerpColors(cLightGold, cPearl, v * 0.6);
    }
    tmp.multiplyScalar(1.06);
    out[i * 3] = Math.min(1, tmp.r);
    out[i * 3 + 1] = Math.min(1, tmp.g);
    out[i * 3 + 2] = Math.min(1, tmp.b);
  }
  return out;
}

function buildSizes(count: number, min: number, max: number): Float32Array {
  const out = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const t = ((i * 0.3819660112501051) % 1 + 1) % 1;
    out[i] = min + t * (max - min);
  }
  return out;
}

const SPHERE_VERT = /* glsl */ `
attribute float aSize;
varying vec3 vColor;
varying float vViewZ;
uniform float uTime;
uniform float uPixelRatio;

void main() {
  vColor = color;
  vec3 pos = position;
  float n = sin(pos.x * 2.2 + uTime * 0.85) * cos(pos.y * 2.2 + uTime * 0.65) * sin(pos.z * 2.0 + uTime * 0.55);
  pos += normalize(pos) * (n * 0.038);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewZ = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;

  float sizeAtten = (290.0 / max(1.15, -mvPosition.z));
  gl_PointSize = clamp(aSize * uPixelRatio * sizeAtten * 0.013, 1.5, 13.0);
}
`;

const SPHERE_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vViewZ;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float r = length(c) * 2.0;
  if (r > 1.0) discard;

  float core = pow(1.0 - r, 1.45);
  float rim = smoothstep(1.0, 0.15, r) * 0.55;
  float alpha = clamp(core * 0.92 + rim * 0.38, 0.0, 1.0);

  float depthFade = smoothstep(9.8, 2.3, vViewZ);
  alpha *= (0.50 + 0.50 * depthFade);

  vec3 col = vColor * (1.0 + (1.0 - r) * 0.42);
  gl_FragColor = vec4(col, alpha);
}
`;

const WAVE_VERT = /* glsl */ `
attribute float aSize;
varying vec3 vColor;
varying float vFade;
uniform float uTime;
uniform float uPixelRatio;

void main() {
  vColor = color;
  vec3 p = position;

  float w1 = sin(p.x * 1.15 + uTime * 0.72 + p.z * 0.45) * 0.22;
  float w2 = cos(p.z * 0.95 - uTime * 0.54 + p.x * 0.3) * 0.16;
  float w3 = sin((p.x + p.z) * 0.7 + uTime * 0.38) * 0.1;
  p.y += w1 + w2 + w3;

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float dist = length(p.xz);
  vFade = 1.0 - smoothstep(1.8, 6.2, dist);

  float sizeAtten = (255.0 / max(1.3, -mvPosition.z));
  gl_PointSize = clamp(aSize * uPixelRatio * sizeAtten * 0.0115, 1.1, 8.2);
}
`;

const WAVE_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vFade;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float r = length(c) * 2.0;
  if (r > 1.0) discard;

  float a = pow(1.0 - r, 1.75) * vFade * 0.78;
  if (a < 0.01) discard;
  vec3 col = vColor * (0.98 + (1.0 - r) * 0.32);
  gl_FragColor = vec4(col, a);
}
`;

function buildWaveGrid(cols: number, rows: number, width: number, depth: number) {
  const count = cols * rows;
  const positions = new Float32Array(count * 3);
  const colors = buildBrandColors(count);
  const sizes = buildSizes(count, 1.0, 2.3);

  let idx = 0;
  for (let iy = 0; iy < rows; iy++) {
    const tz = rows <= 1 ? 0.5 : iy / (rows - 1);
    const z = (tz - 0.5) * depth;
    for (let ix = 0; ix < cols; ix++) {
      const tx = cols <= 1 ? 0.5 : ix / (cols - 1);
      const x = (tx - 0.5) * width;
      positions[idx * 3] = x;
      positions[idx * 3 + 1] = 0;
      positions[idx * 3 + 2] = z;
      idx++;
    }
  }

  return { positions, colors, sizes, count };
}

type HeroParticleFieldProps = {
  className?: string;
};

/**
 * Full-page continuous 3D particle globe + wave background.
 * Runs continuously at 60fps across the entire webpage scroll (no hero-only freeze),
 * with subtle scroll-linked camera/globe parallax so the Deep Eggplant + Gold
 * living atmosphere accompanies the visitor from hero to footer.
 */
export default function HeroParticleField({ className }: HeroParticleFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const coarse =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

    const sphereCount = coarse ? 3400 : 6800;
    const waveCols = coarse ? 58 : 88;
    const waveRows = coarse ? 34 : 52;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 0.08, 4.9);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !coarse,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const sphereGeo = new THREE.BufferGeometry();
    const sphereRadius = 1.38;
    const spherePos = buildSpherePositions(sphereCount, sphereRadius);
    const sphereCol = buildBrandColors(sphereCount);
    const sphereSizes = buildSizes(sphereCount, 1.3, 3.0);

    sphereGeo.setAttribute("position", new THREE.BufferAttribute(spherePos, 3));
    sphereGeo.setAttribute("color", new THREE.BufferAttribute(sphereCol, 3));
    sphereGeo.setAttribute("aSize", new THREE.BufferAttribute(sphereSizes, 1));

    const sphereUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
    };

    const sphereMat = new THREE.ShaderMaterial({
      vertexShader: SPHERE_VERT,
      fragmentShader: SPHERE_FRAG,
      uniforms: sphereUniforms,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const spherePoints = new THREE.Points(sphereGeo, sphereMat);
    spherePoints.position.set(0, 0.14, 0);
    rootGroup.add(spherePoints);

    const innerCount = Math.floor(sphereCount * 0.25);
    const innerGeo = new THREE.BufferGeometry();
    innerGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(buildSpherePositions(innerCount, sphereRadius * 0.72), 3)
    );
    innerGeo.setAttribute("color", new THREE.BufferAttribute(buildBrandColors(innerCount), 3));
    innerGeo.setAttribute(
      "aSize",
      new THREE.BufferAttribute(buildSizes(innerCount, 0.95, 2.0), 1)
    );
    const innerPoints = new THREE.Points(innerGeo, sphereMat);
    innerPoints.position.copy(spherePoints.position);
    rootGroup.add(innerPoints);

    const wave = buildWaveGrid(waveCols, waveRows, 10.5, 6.2);
    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute("position", new THREE.BufferAttribute(wave.positions, 3));
    waveGeo.setAttribute("color", new THREE.BufferAttribute(wave.colors, 3));
    waveGeo.setAttribute("aSize", new THREE.BufferAttribute(wave.sizes, 1));

    const waveUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
    };

    const waveMat = new THREE.ShaderMaterial({
      vertexShader: WAVE_VERT,
      fragmentShader: WAVE_FRAG,
      uniforms: waveUniforms,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const wavePoints = new THREE.Points(waveGeo, waveMat);
    wavePoints.position.set(0, -1.25, -0.55);
    wavePoints.rotation.x = -0.18;
    rootGroup.add(wavePoints);

    const setSize = () => {
      const w = Math.max(1, container.clientWidth || window.innerWidth);
      const h = Math.max(1, container.clientHeight || window.innerHeight);
      camera.aspect = w / h;
      const narrow = w < 640;
      camera.position.z = narrow ? 5.45 : w < 1024 ? 5.1 : 4.82;
      spherePoints.position.y = narrow ? 0.24 : 0.14;
      innerPoints.position.y = spherePoints.position.y;
      wavePoints.position.y = narrow ? -1.35 : -1.22;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    window.addEventListener("resize", setSize, { passive: true });

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let scrollProgress = 0;

    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;
      targetRotY = nx * 0.22;
      targetRotX = -ny * 0.14;
    };

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };
    onScroll();

    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    let raf = 0;
    let pageVisible = typeof document !== "undefined" ? !document.hidden : true;
    let simTime = 0;
    let lastNow = performance.now();

    const shouldAnimate = () => pageVisible && !reduced;

    const renderFrame = (dt: number) => {
      simTime += dt;
      sphereUniforms.uTime.value = simTime;
      waveUniforms.uTime.value = simTime;

      const scrollAngleY = scrollProgress * Math.PI * 1.15;
      const scrollTiltX = Math.sin(scrollProgress * Math.PI * 2.0) * 0.14;

      curRotX += (targetRotX + scrollTiltX - curRotX) * 0.05;
      curRotY += (targetRotY - curRotY) * 0.05;

      const spin = simTime * 0.14 + scrollAngleY;
      spherePoints.rotation.y = spin + curRotY;
      spherePoints.rotation.x = 0.22 + curRotX + Math.sin(simTime * 0.25) * 0.05;
      spherePoints.rotation.z = Math.cos(simTime * 0.18) * 0.04;

      innerPoints.rotation.y = -spin * 0.65 + curRotY * 0.6;
      innerPoints.rotation.x = -0.15 + curRotX * 0.6;

      wavePoints.rotation.z = curRotY * 0.08 + Math.sin(scrollProgress * Math.PI) * 0.05;

      renderer.render(scene, camera);
    };

    const tick = (now: number) => {
      if (!shouldAnimate()) {
        raf = 0;
        return;
      }
      const dt = Math.min(0.05, Math.max(0, (now - lastNow) * 0.001));
      lastNow = now;
      renderFrame(dt);
      raf = window.requestAnimationFrame(tick);
    };

    const ensureLoop = () => {
      if (!shouldAnimate()) {
        if (raf) {
          window.cancelAnimationFrame(raf);
          raf = 0;
        }
        return;
      }
      if (!raf) {
        lastNow = performance.now();
        raf = window.requestAnimationFrame(tick);
      }
    };

    if (reduced) {
      renderFrame(0);
    } else {
      ensureLoop();
    }

    const onVis = () => {
      pageVisible = !document.hidden;
      if (pageVisible) lastNow = performance.now();
      ensureLoop();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setSize);
      ro.disconnect();
      sphereGeo.dispose();
      innerGeo.dispose();
      waveGeo.dispose();
      sphereMat.dispose();
      waveMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const rootClass = ["bawo-particle-field", className].filter(Boolean).join(" ");
  return <div ref={mountRef} className={rootClass} aria-hidden />;
}
