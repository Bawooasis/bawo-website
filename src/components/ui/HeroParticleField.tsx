import { useEffect, useRef } from "react";
import * as THREE from "three";
import { HERO_PARTICLE_HEX } from "./heroParticlePalette";

/**
 * Diaspora / culture-hub city nodes (lat, lon).
 * Glowing green accents Alexander requested — tasteful, not a dense starfield.
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
  float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 2.35);
  float rim = smoothstep(0.08, 0.95, fresnel);
  vec3 col = mix(uGlowColor, uGreenColor, 0.28) * (0.55 + rim * 1.35);
  float alpha = clamp(rim * 0.72, 0.0, 0.85);
  gl_FragColor = vec4(col, alpha);
}
`;

const CITY_VERT = /* glsl */ `
attribute float aSize;
attribute float aPulse;
varying float vPulse;
uniform float uTime;
uniform float uPixelRatio;
void main() {
  vPulse = aPulse;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float breathe = 0.85 + 0.25 * sin(uTime * 1.6 + aPulse * 6.28);
  float sizeAtten = 280.0 / max(1.2, -mvPosition.z);
  gl_PointSize = clamp(aSize * breathe * uPixelRatio * sizeAtten * 0.02, 2.5, 18.0);
}
`;

const CITY_FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vPulse;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float r = length(c) * 2.0;
  if (r > 1.0) discard;
  float core = pow(1.0 - r, 2.2);
  float halo = smoothstep(1.0, 0.2, r) * 0.55;
  float alpha = clamp(core * 1.15 + halo * 0.45, 0.0, 1.0);
  vec3 col = uColor * (1.15 + (1.0 - r) * 0.85);
  gl_FragColor = vec4(col, alpha);
}
`;

type HeroParticleFieldProps = {
  className?: string;
};

/**
 * Full-viewport WebGL Earth globe (Three.js) with glowing green diaspora nodes.
 * Chosen stack: plain Three.js (already in the app) — textured SphereGeometry Earth +
 * fresnel atmosphere + additive green city Points. Avoids adding React Three Fiber /
 * globe.gl while delivering a recognizable rotating globe behind the hero.
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

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(0, 0.12, 4.05);

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
    // Slightly right/low so headline stays readable over the left-center of the sphere
    root.position.set(0.28, -0.08, 0);
    scene.add(root);

    const ambient = new THREE.AmbientLight(0x3a2a48, 0.55);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffe2b8, 1.35);
    key.position.set(4.2, 2.4, 3.6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x1faa6a, 0.35);
    fill.position.set(-3.2, -0.6, 2.2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x66ffaa, 0.28);
    rim.position.set(-2.5, 1.8, -3.5);
    scene.add(rim);

    const globeRadius = 1.72;
    const segments = coarse ? 64 : 96;
    const earthGeo = new THREE.SphereGeometry(globeRadius, segments, segments);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.78,
      metalness: 0.08,
      emissive: new THREE.Color(0x061810),
      emissiveIntensity: 0.18,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.rotation.y = -0.55;
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

    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.045, segments, segments);
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

    // Soft gold starfield haze (kept sparse so continents stay primary)
    const hazeCount = coarse ? 900 : 1600;
    const hazePos = new Float32Array(hazeCount * 3);
    const hazeSizes = new Float32Array(hazeCount);
    for (let i = 0; i < hazeCount; i++) {
      const r = globeRadius * (1.08 + Math.random() * 0.55);
      const y = 1 - (i / Math.max(1, hazeCount - 1)) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = Math.PI * (3 - Math.sqrt(5)) * i + Math.random() * 0.2;
      hazePos[i * 3] = Math.cos(theta) * ring * r;
      hazePos[i * 3 + 1] = y * r * 0.92;
      hazePos[i * 3 + 2] = Math.sin(theta) * ring * r;
      hazeSizes[i] = 0.7 + Math.random() * 1.4;
    }
    const hazeGeo = new THREE.BufferGeometry();
    hazeGeo.setAttribute("position", new THREE.BufferAttribute(hazePos, 3));
    hazeGeo.setAttribute("aSize", new THREE.BufferAttribute(hazeSizes, 1));
    const hazeMat = new THREE.PointsMaterial({
      color: new THREE.Color(HERO_PARTICLE_HEX.gold),
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const haze = new THREE.Points(hazeGeo, hazeMat);
    root.add(haze);

    // Glowing green city / culture nodes
    const cityCount = CITY_NODES.length;
    const cityPos = new Float32Array(cityCount * 3);
    const citySizes = new Float32Array(cityCount);
    const cityPulse = new Float32Array(cityCount);
    CITY_NODES.forEach((city, i) => {
      const v = latLonToVector3(city.lat, city.lon, globeRadius * 1.012);
      cityPos[i * 3] = v.x;
      cityPos[i * 3 + 1] = v.y;
      cityPos[i * 3 + 2] = v.z;
      citySizes[i] = 2.2 * (city.weight ?? 1);
      cityPulse[i] = (i * 0.17) % 1;
    });
    const cityGeo = new THREE.BufferGeometry();
    cityGeo.setAttribute("position", new THREE.BufferAttribute(cityPos, 3));
    cityGeo.setAttribute("aSize", new THREE.BufferAttribute(citySizes, 1));
    cityGeo.setAttribute("aPulse", new THREE.BufferAttribute(cityPulse, 1));
    const cityUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
      uColor: { value: new THREE.Color(0x2dff8a) },
    };
    const cityMat = new THREE.ShaderMaterial({
      vertexShader: CITY_VERT,
      fragmentShader: CITY_FRAG,
      uniforms: cityUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const cities = new THREE.Points(cityGeo, cityMat);
    // Parent to earth so cities rotate with the globe
    earth.add(cities);

    // Extra green spark layer just above the surface for glow density
    const sparkCount = coarse ? 48 : 72;
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkSizes = new Float32Array(sparkCount);
    const sparkPulse = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) {
      const base = CITY_NODES[i % CITY_NODES.length];
      const jitterLat = base.lat + (Math.random() - 0.5) * 8;
      const jitterLon = base.lon + (Math.random() - 0.5) * 10;
      const v = latLonToVector3(jitterLat, jitterLon, globeRadius * (1.018 + Math.random() * 0.02));
      sparkPos[i * 3] = v.x;
      sparkPos[i * 3 + 1] = v.y;
      sparkPos[i * 3 + 2] = v.z;
      sparkSizes[i] = 1.1 + Math.random() * 1.6;
      sparkPulse[i] = Math.random();
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute("aSize", new THREE.BufferAttribute(sparkSizes, 1));
    sparkGeo.setAttribute("aPulse", new THREE.BufferAttribute(sparkPulse, 1));
    const sparkUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
      uColor: { value: new THREE.Color(0x7dffb2) },
    };
    const sparkMat = new THREE.ShaderMaterial({
      vertexShader: CITY_VERT,
      fragmentShader: CITY_FRAG,
      uniforms: sparkUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    earth.add(sparks);

    const setSize = () => {
      const w = Math.max(1, container.clientWidth || window.innerWidth);
      const h = Math.max(1, container.clientHeight || window.innerHeight);
      camera.aspect = w / h;
      const narrow = w < 640;
      // Pull camera in so the globe fills more of the hero
      camera.position.z = narrow ? 3.55 : w < 1024 ? 3.35 : 3.15;
      root.position.x = narrow ? 0.05 : 0.32;
      root.position.y = narrow ? 0.02 : -0.12;
      root.scale.setScalar(narrow ? 1.08 : 1.22);
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
      cityUniforms.uTime.value = simTime;
      sparkUniforms.uTime.value = simTime;

      curRotX += (targetRotX - curRotX) * 0.045;
      curRotY += (targetRotY - curRotY) * 0.045;

      const idleSpin = simTime * 0.045;
      const scrollSpin = scrollProgress * 0.85;
      earth.rotation.y = -0.55 + idleSpin + scrollSpin + curRotY * 0.35;
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
      hazeGeo.dispose();
      cityGeo.dispose();
      sparkGeo.dispose();
      earthMat.dispose();
      atmosphereMat.dispose();
      hazeMat.dispose();
      cityMat.dispose();
      sparkMat.dispose();
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
