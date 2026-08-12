import { Suspense, useEffect, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { palette } from "../../assets/colors.js";

/** Cool eggplant ramp — no warm brown stops. */
const MESH_COLORS = [
  palette.obsidian.canvas,
  "#0E0A14",
  "#1A0A28",
  "#2A1438",
] as const;

function StaticSiteFallback() {
  return (
    <>
      <div className="bawo-hero-ambient absolute inset-0" aria-hidden />
      <div className="absolute inset-0 bawo-site-ambient" aria-hidden />
    </>
  );
}

function AnimatedMeshLayer() {
  return (
    <>
      <MeshGradient
        className="pointer-events-none absolute inset-0 h-full w-full"
        colors={[...MESH_COLORS]}
        speed={0.32}
        backgroundColor={palette.obsidian.canvas}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 110% 70% at 50% -8%, rgba(255, 107, 0, 0.12) 0%, transparent 52%),
            radial-gradient(ellipse 85% 55% at 18% 32%, rgba(42, 20, 56, 0.55) 0%, transparent 58%),
            radial-gradient(ellipse 75% 50% at 82% 38%, rgba(58, 29, 72, 0.4) 0%, transparent 55%),
            radial-gradient(ellipse 90% 60% at 50% 62%, rgba(26, 10, 40, 0.45) 0%, transparent 58%),
            radial-gradient(ellipse 80% 55% at 30% 88%, rgba(42, 20, 56, 0.35) 0%, transparent 52%),
            radial-gradient(ellipse 70% 45% at 75% 78%, rgba(255, 107, 0, 0.05) 0%, transparent 48%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bawo-site-ambient" aria-hidden />
    </>
  );
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

/** Fixed full-page mesh + eggplant wash — across the whole scroll. */
export default function SiteMeshBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (reducedMotion) return;
    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [reducedMotion]);

  return (
    <div
      className="bawo-site-mesh-root pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <Suspense fallback={<StaticSiteFallback />}>
        {reducedMotion || !active ? (
          <StaticSiteFallback />
        ) : (
          <AnimatedMeshLayer />
        )}
      </Suspense>
    </div>
  );
}
