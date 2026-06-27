import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshGradient } from "@paper-design/shaders-react";
import { palette } from "../../assets/colors.js";
import { EnergyRing, ShaderPlane } from "./background-paper-shaders";

/** Mesh gradient stops — tight warm range (no bright orange vs eggplant jump) */
const MESH_COLORS = [
  palette.obsidian.canvas,
  "#14090E",
  "#18100F",
  "#3D2214",
] as const;

const MESH_SPEED = 0.45;

function ThreeShaderLayer() {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0, 1.5], fov: 75 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <ShaderPlane position={[0, 0, -0.2]} />
      <ShaderPlane
        position={[0.35, -0.15, -0.35]}
        color1={palette.copper.deep}
        color2={palette.obsidian.canvas}
      />
      <EnergyRing radius={1.15} position={[0, 0, -0.1]} />
      <EnergyRing
        radius={0.72}
        position={[0.45, 0.25, -0.2]}
        color={palette.brandCtaOrange}
      />
    </Canvas>
  );
}

function AnimatedHeroShaders() {
  return (
    <>
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={[...MESH_COLORS]}
        speed={MESH_SPEED}
        backgroundColor={palette.obsidian.canvas}
      />

      <div className="absolute inset-0 opacity-[0.22] mix-blend-soft-light">
        <ThreeShaderLayer />
      </div>

      {/* Warm ember glow orbs — brand palette, not demo gray/white */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/3 h-32 w-32 animate-pulse rounded-full blur-3xl"
          style={{
            backgroundColor: "rgba(255, 107, 0, 0.09)",
            animationDuration: `${3 / MESH_SPEED}s`,
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 h-24 w-24 animate-pulse rounded-full blur-2xl"
          style={{
            backgroundColor: "rgba(212, 175, 55, 0.07)",
            animationDuration: `${2 / MESH_SPEED}s`,
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute top-1/2 right-1/3 h-20 w-20 animate-pulse rounded-full blur-xl"
          style={{
            backgroundColor: "rgba(196, 123, 68, 0.08)",
            animationDuration: `${4 / MESH_SPEED}s`,
            animationDelay: "0.5s",
          }}
        />
      </div>

      {/* Soft vignette — matches legacy .bawo-hero-ambient mask */}
      <div
        className="pointer-events-none absolute inset-0 opacity-95"
        style={{
          maskImage:
            "radial-gradient(ellipse 92% 72% at 50% 42%, #000 25%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 92% 72% at 50% 42%, #000 25%, transparent 78%)",
          background:
            "radial-gradient(ellipse 85% 42% at 50% 38%, rgba(255, 107, 0, 0.1) 0%, transparent 68%)",
        }}
      />

      {/* Fade hero shaders into unified page canvas */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 sm:h-52 md:h-64"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, rgba(18, 8, 15, 0.65) 55%, ${palette.obsidian.canvas} 100%)`,
        }}
      />
    </>
  );
}

function StaticHeroFallback() {
  return <div className="bawo-hero-ambient absolute inset-0" aria-hidden />;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function HeroShaderBackground() {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <StaticHeroFallback />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <Suspense fallback={<StaticHeroFallback />}>
        <AnimatedHeroShaders />
      </Suspense>
    </div>
  );
}
