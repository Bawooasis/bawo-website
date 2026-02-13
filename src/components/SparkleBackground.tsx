import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  baseA: number;
  tw: number;
  ph: number;
  s: number;
  kind: "dot" | "glow";
  /** Random glow: some dots occasionally get a soft glow (phase for slow sine) */
  glowPh: number;
  /** 0 = never glow, 1 = can randomly glow */
  glowChance: number;
};

type Pop = {
  x: number;
  y: number;
  bornMs: number;
  lifeMs: number;
  size: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function SparkleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const popsRef = useRef<Pop[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // --- 1. SETUP & RESIZE ---
    let width = 0;
    let height = 0;
    let vignetteGradient: CanvasGradient | null = null;

    let dpr = 1;

    const setSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      // Explicit px size so canvas display aspect ratio matches buffer (no CSS stretch → no vertical streaks)
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      vignetteGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.3,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.9
      );
      vignetteGradient.addColorStop(0, "rgba(2, 4, 10, 0)");
      vignetteGradient.addColorStop(1, "rgba(0, 0, 0, 0.85)");
    };

    const makeStars = () => {
      const area = width * height;
      const count = clamp(Math.floor(area / 15000), 50, 300);

      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        const kind = Math.random() < 0.18 ? "glow" : "dot";
        const s = kind === "glow" ? 30 + Math.random() * 20 : 10 + Math.random() * 15;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseA: 0.3 + Math.random() * 0.5,
          tw: 0.2 + Math.random() * 0.8,
          ph: Math.random() * Math.PI * 2,
          s,
          kind,
          glowPh: Math.random() * Math.PI * 2,
          glowChance: Math.random(),
        });
      }
      starsRef.current = stars;
    };

    setSize();
    makeStars();

    // --- 2. ANIMATION LOOP: circles only via arc(), no drawImage. Reset transform each frame to avoid drift. ---
    const draw = (time: number) => {
      const t = time / 1000;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.fillStyle = "#02040a";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Slow global phase so "random" glows drift over time (same for all stars, but each has own glowPh)
      const glowPhase = t * 0.25;

      for (const s of starsRef.current) {
        const a = clamp(s.baseA + 0.15 * Math.sin(t * s.tw + s.ph), 0.1, 1);
        const cx = Math.floor(s.x) + 0.5;
        const cy = Math.floor(s.y) + 0.5;

        if (s.kind === "glow") {
          const r = s.s / 2;
          const glowA = a * (0.7 + 0.4 * Math.sin(glowPhase * 0.7 + s.glowPh));
          ctx.globalAlpha = clamp(glowA, 0.2, 1);
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          g.addColorStop(0, `rgba(134, 239, 172, ${glowA * 0.9})`);
          g.addColorStop(0.5, `rgba(34, 197, 94, ${glowA * 0.3})`);
          g.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const radius = s.s < 18 ? 1.2 : 2.2;
          const randomGlow = Math.sin(glowPhase + s.glowPh);
          const isGlowing = s.glowChance > 0.5 && randomGlow > 0.4;
          if (isGlowing) {
            const glowR = 8 + 4 * (randomGlow - 0.4) / 0.6;
            const glowA = 0.15 * a * (randomGlow - 0.4) / 0.6;
            ctx.globalAlpha = clamp(glowA, 0.03, 0.2);
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
            g.addColorStop(0, `rgba(134, 239, 172, ${glowA})`);
            g.addColorStop(0.6, `rgba(34, 197, 94, ${glowA * 0.3})`);
            g.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = a;
          ctx.fillStyle = "#4ade80";
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      if (vignetteGradient) {
        ctx.save();
        ctx.fillStyle = vignetteGradient;
        ctx.globalCompositeOperation = "source-over";
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      if (popsRef.current.length < 3 && Math.random() < 0.005) {
        popsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          bornMs: time,
          lifeMs: 1000 + Math.random() * 500,
          size: 40 + Math.random() * 20,
        });
      }

      const pops = popsRef.current;
      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i];
        const u = (time - p.bornMs) / p.lifeMs;
        if (u >= 1) {
          pops.splice(i, 1);
          continue;
        }
        const alpha = Math.sin(u * Math.PI);
        const r = p.size / 2;
        const px = Math.floor(p.x) + 0.5;
        const py = Math.floor(p.y) + 0.5;
        const g = ctx.createRadialGradient(px, py, 0, px, py, r);
        g.addColorStop(0, `rgba(134, 239, 172, ${alpha * 0.8})`);
        g.addColorStop(0.5, `rgba(34, 197, 94, ${alpha * 0.2})`);
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      setSize();
      makeStars();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#02040a] overflow-hidden">
      <canvas ref={canvasRef} className="absolute left-0 top-0 block" />
    </div>
  );
}
