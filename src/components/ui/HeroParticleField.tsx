import { useEffect, useRef } from "react";
import * as THREE from "three";
import { HERO_PARTICLE_HEX } from "./heroParticlePalette";

/**
 * Diaspora / culture-hub city nodes (lat, lon).
 * Soft glowing star-dots (not hard squares) in the existing green/gold palette.
 */
const CITY_NODES: Array<{ lat: number; lon: number; weight?: number }> = [
  { lat: 40.71, lon: -74.01, weight: 1.35 }, // NYC
  { lat: 6.52, lon: 3.38, weight: 1.4 }, // Lagos
  { lat: 51.51, lon: -0.13, weight: 1.15 }, // London
  { lat: 43.65, lon: -79.38, weight: 1.1 }, // Toronto
  { lat: 33.75, lon: -84.39, weight: 1.05 }, // Atlanta
  { lat: 29.76, lon: -95.37, weight: 1.05 }, // Houston
  { lat: 41.88, lon: -87.63, weight: 1.0 }, // Chicago
  { lat: 34.05, lon: -118.24, weight: 1.05 }, // LA
  { lat: 38.91, lon: -77.04, weight: 0.95 }, // DC
  { lat: 5.6, lon: -0.19, weight: 1.05 }, // Accra
  { lat: -26.2, lon: 28.05, weight: 1.0 }, // Johannesburg
  { lat: 9.08, lon: 7.4, weight: 0.95 }, // Abuja (node only — copy stays Lagos-only)
  { lat: 25.2, lon: 55.27, weight: 0.95 }, // Dubai
  { lat: 48.86, lon: 2.35, weight: 0.9 }, // Paris
  { lat: 52.52, lon: 13.41, weight: 0.85 }, // Berlin
  { lat: -33.87, lon: 151.21, weight: 0.9 }, // Sydney
  { lat: 1.35, lon: 103.82, weight: 0.9 }, // Singapore
  { lat: 35.68, lon: 139.69, weight: 0.85 }, // Tokyo
  { lat: -1.29, lon: 36.82, weight: 0.9 }, // Nairobi
  { lat: 19.43, lon: -99.13, weight: 0.85 }, // Mexico City
  { lat: -23.55, lon: -46.63, weight: 0.85 }, // São Paulo
  { lat: 55.76, lon: 37.62, weight: 0.8 }, // Moscow
  { lat: 28.61, lon: 77.21, weight: 0.85 }, // Delhi
  { lat: 30.04, lon: 31.24, weight: 0.85 }, // Cairo
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

const ATMOSPHERE_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPosition = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const ATMOSPHERE_FRAG = /* glsl */ `
uniform vec3 uGlowColor;
uniform vec3 uGreenColor;
varying vec3 vNormal;
varying vec3 vWorldPosition;
void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 1.85);
  float rim = smoothstep(0.02, 0.92, fresnel);
  vec3 col = mix(uGlowColor, uGreenColor, 0.42) * (0.7 + rim * 1.65);
  float alpha = clamp(rim * 0.92, 0.0, 0.95);
  gl_FragColor = vec4(col, alpha);
}
`;

/**
 * Soft circular star-dots via camera-facing instanced quads + radial sprite.
 * Avoids WebGL Points (gl_PointSize / gl_PointCoord), which render as hard
 * squares on software GL and still read blocky at tiny point sizes.
 */
const STAR_VERT = /* glsl */ `
attribute float aSize;
attribute float aPulse;
attribute float aBright;
varying float vBright;
varying vec2 vUv;
uniform float uTime;
uniform float uBaseScale;
uniform float uTwinkle;
void main() {
  vUv = uv;
  vBright = aBright;
  float twinkle = 1.0 - uTwinkle + uTwinkle * (0.78 + 0.22 * sin(uTime * (0.85 + aPulse * 1.6) + aPulse * 12.566));
  float scale = max(0.012, aSize * uBaseScale * twinkle);

  // Billboard in view space from instance translation
  vec4 world = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec4 mvPosition = viewMatrix * world;
  mvPosition.xy += position.xy * scale;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const STAR_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform sampler2D uMap;
varying float vBright;
varying vec2 vUv;
void main() {
  float sprite = texture2D(uMap, vUv).a;
  if (sprite < 0.012) discard;
  float glow = sprite * vBright;
  float coreBoost = sprite * sprite;
  vec3 col = uColor * (0.7 + coreBoost * 1.45);
  gl_FragColor = vec4(col, clamp(glow, 0.0, 1.0));
}
`;

/** Soft radial sprite atlas used by every star layer. */
function createStarSpriteTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }
  const cx = size / 2;
  const cy = size / 2;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  // Pinprick core → soft bloom halo (night-sky star)
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.1, "rgba(255,255,255,0.96)");
  grad.addColorStop(0.28, "rgba(255,255,255,0.5)");
  grad.addColorStop(0.55, "rgba(255,255,255,0.16)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

function makeStarMaterial(
  color: THREE.ColorRepresentation,
  opts: { baseScale: number; twinkle: number; map: THREE.Texture }
) {
  return new THREE.ShaderMaterial({
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uBaseScale: { value: opts.baseScale },
      uTwinkle: { value: opts.twinkle },
      uMap: { value: opts.map },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}

function makeStarField(
  count: number,
  positions: Float32Array,
  sizes: Float32Array,
  pulses: Float32Array,
  brights: Float32Array,
  material: THREE.ShaderMaterial
) {
  const geo = new THREE.PlaneGeometry(1, 1);
  geo.setAttribute("aSize", new THREE.InstancedBufferAttribute(sizes, 1));
  geo.setAttribute("aPulse", new THREE.InstancedBufferAttribute(pulses, 1));
  geo.setAttribute("aBright", new THREE.InstancedBufferAttribute(brights, 1));
  const mesh = new THREE.InstancedMesh(geo, material, count);
  mesh.frustumCulled = false;
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

type HeroParticleFieldProps = {
  className?: string;
};

/**
 * Full-viewport WebGL Earth globe (Three.js) with glowing star-dot diaspora nodes.
 * Chosen stack: plain Three.js (already in the app) — textured SphereGeometry Earth +
 * fresnel atmosphere + additive circular star Points (not hard squares).
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

    const scene = new THREE.Scene();
    scene.background = null;

    // Slightly wider FOV + pulled-back camera so the circular limb reads as a globe
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(0, 0.08, 4.55);

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

    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.4 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    // Offset right so headline stays readable; keep enough of the limb in-frame for roundness
    root.position.set(0.42, -0.06, 0);
    scene.add(root);

    const ambient = new THREE.AmbientLight(0x2a1c38, 0.38);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffe7c2, 1.55);
    key.position.set(5.2, 2.8, 3.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x1faa6a, 0.42);
    fill.position.set(-3.6, -0.4, 2.4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x66ffaa, 0.45);
    rim.position.set(-2.8, 2.0, -3.8);
    scene.add(rim);
    // Soft back-light to carve the sphere silhouette
    const back = new THREE.DirectionalLight(0x88ffcc, 0.22);
    back.position.set(0.4, 0.2, -4.5);
    scene.add(back);

    const globeRadius = 1.58;
    const segments = coarse ? 64 : 96;
    const earthGeo = new THREE.SphereGeometry(globeRadius, segments, segments);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.72,
      metalness: 0.06,
      emissive: new THREE.Color(0x04140e),
      emissiveIntensity: 0.14,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    // Start facing Africa / Atlantic so continents + diaspora arcs read clearly
    earth.rotation.y = 0.35;
    root.add(earth);

    const loader = new THREE.TextureLoader();
    let earthTex: THREE.Texture | null = null;
    loader.load(
      "/textures/earth-day.jpg",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        earthTex = tex;
        earthMat.map = tex;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback tint if texture fails — still reads as a sphere, not a flat disc
        earthMat.color = new THREE.Color(0x1a3d2e);
        earthMat.emissive = new THREE.Color(0x0a2a18);
        earthMat.needsUpdate = true;
      }
    );

    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.06, segments, segments);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: ATMOSPHERE_VERT,
      fragmentShader: ATMOSPHERE_FRAG,
      uniforms: {
        uGlowColor: { value: new THREE.Color(HERO_PARTICLE_HEX.gold) },
        uGreenColor: { value: new THREE.Color(0x22ff88) },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    root.add(atmosphere);

    const starMap = createStarSpriteTexture();

    // Gold starfield haze — soft glowey dots (was hard PointsMaterial squares)
    const hazeCount = coarse ? 520 : 900;
    const hazePos = new Float32Array(hazeCount * 3);
    const hazeSizes = new Float32Array(hazeCount);
    const hazePulse = new Float32Array(hazeCount);
    const hazeBright = new Float32Array(hazeCount);
    for (let i = 0; i < hazeCount; i++) {
      const r = globeRadius * (1.1 + Math.random() * 0.7);
      const y = 1 - (i / Math.max(1, hazeCount - 1)) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = Math.PI * (3 - Math.sqrt(5)) * i + Math.random() * 0.2;
      hazePos[i * 3] = Math.cos(theta) * ring * r;
      hazePos[i * 3 + 1] = y * r * 0.92;
      hazePos[i * 3 + 2] = Math.sin(theta) * ring * r;
      // Mostly faint pinpricks; a few slightly brighter gems
      const gem = Math.random() > 0.93;
      hazeSizes[i] = gem ? 1.35 + Math.random() * 0.9 : 0.55 + Math.random() * 0.75;
      hazePulse[i] = Math.random();
      hazeBright[i] = gem ? 0.95 + Math.random() * 0.35 : 0.22 + Math.random() * 0.4;
    }
    const hazeMat = makeStarMaterial(HERO_PARTICLE_HEX.gold, {
      baseScale: 0.038,
      twinkle: 0.32,
      map: starMap,
    });
    const haze = makeStarField(hazeCount, hazePos, hazeSizes, hazePulse, hazeBright, hazeMat);
    root.add(haze);

    // Green city / culture nodes — same soft star treatment, existing teal/mint family
    const cityCount = CITY_NODES.length;
    const cityPos = new Float32Array(cityCount * 3);
    const citySizes = new Float32Array(cityCount);
    const cityPulse = new Float32Array(cityCount);
    const cityBright = new Float32Array(cityCount);
    CITY_NODES.forEach((city, i) => {
      const v = latLonToVector3(city.lat, city.lon, globeRadius * 1.012);
      cityPos[i * 3] = v.x;
      cityPos[i * 3 + 1] = v.y;
      cityPos[i * 3 + 2] = v.z;
      citySizes[i] = 2.1 * (city.weight ?? 1);
      cityPulse[i] = (i * 0.17) % 1;
      cityBright[i] = 0.85 + (city.weight ?? 1) * 0.18;
    });
    const cityMat = makeStarMaterial(0x3dff96, {
      baseScale: 0.055,
      twinkle: 0.26,
      map: starMap,
    });
    const cities = makeStarField(cityCount, cityPos, citySizes, cityPulse, cityBright, cityMat);
    earth.add(cities);

    // Extra green spark layer — soft star-dots for glow density around the rim
    const sparkCount = coarse ? 48 : 72;
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkSizes = new Float32Array(sparkCount);
    const sparkPulse = new Float32Array(sparkCount);
    const sparkBright = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) {
      const base = CITY_NODES[i % CITY_NODES.length];
      const jitterLat = base.lat + (Math.random() - 0.5) * 8;
      const jitterLon = base.lon + (Math.random() - 0.5) * 10;
      const v = latLonToVector3(jitterLat, jitterLon, globeRadius * (1.018 + Math.random() * 0.02));
      sparkPos[i * 3] = v.x;
      sparkPos[i * 3 + 1] = v.y;
      sparkPos[i * 3 + 2] = v.z;
      const gem = Math.random() > 0.86;
      sparkSizes[i] = gem ? 1.5 + Math.random() * 1.1 : 0.65 + Math.random() * 0.95;
      sparkPulse[i] = Math.random();
      sparkBright[i] = gem ? 0.95 + Math.random() * 0.3 : 0.35 + Math.random() * 0.4;
    }
    const sparkMat = makeStarMaterial(0x8dffc0, {
      baseScale: 0.042,
      twinkle: 0.38,
      map: starMap,
    });
    const sparks = makeStarField(sparkCount, sparkPos, sparkSizes, sparkPulse, sparkBright, sparkMat);
    earth.add(sparks);

    const setSize = () => {
      const w = Math.max(1, container.clientWidth || window.innerWidth);
      const h = Math.max(1, container.clientHeight || window.innerHeight);
      camera.aspect = w / h;
      const narrow = w < 640;
      // Keep enough camera distance that the circular limb stays readable
      camera.position.z = narrow ? 4.35 : w < 1024 ? 4.15 : 3.95;
      root.position.x = narrow ? 0.08 : 0.48;
      root.position.y = narrow ? 0.04 : -0.08;
      root.scale.setScalar(narrow ? 1.12 : 1.28);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    window.addEventListener("resize", setSize, { passive: true });

    let targetRotX = 0.12;
    let targetRotY = 0;
    let curRotX = 0.12;
    let curRotY = 0;
    let scrollProgress = 0;

    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;
      targetRotY = nx * 0.18;
      targetRotX = 0.1 - ny * 0.1;
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
      hazeMat.uniforms.uTime.value = simTime;
      cityMat.uniforms.uTime.value = simTime;
      sparkMat.uniforms.uTime.value = simTime;

      curRotX += (targetRotX - curRotX) * 0.045;
      curRotY += (targetRotY - curRotY) * 0.045;

      const idleSpin = simTime * 0.055;
      const scrollSpin = scrollProgress * 0.85;
      earth.rotation.y = 0.35 + idleSpin + scrollSpin + curRotY * 0.35;
      earth.rotation.x = curRotX + Math.sin(simTime * 0.12) * 0.03;
      atmosphere.rotation.copy(earth.rotation);
      haze.rotation.y = earth.rotation.y * 0.35;

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
      earthGeo.dispose();
      atmosphereGeo.dispose();
      haze.geometry.dispose();
      cities.geometry.dispose();
      sparks.geometry.dispose();
      earthMat.dispose();
      atmosphereMat.dispose();
      hazeMat.dispose();
      cityMat.dispose();
      sparkMat.dispose();
      starMap.dispose();
      earthTex?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const rootClass = ["bawo-particle-field", className].filter(Boolean).join(" ");
  return <div ref={mountRef} className={rootClass} aria-hidden />;
}
