import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  baseA: number;
  tw: number;
  ph: number;
  s: number; // sprite size in css px
  kind: "dot" | "glow";
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function makeSprite(size: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  draw(ctx);
  return c;
}

export default function SparkleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const saveData =
      typeof navigator !== "undefined" &&
      "connection" in navigator &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigator as any).connection?.saveData === true;

    // Pre-rendered sprites (much faster than per-star blur/shadow each frame)
    const dotSmall = makeSprite(32, (c) => {
      const r = 6;
      const g = c.createRadialGradient(16, 16, 0, 16, 16, r);
      g.addColorStop(0, "rgba(134,239,172,1)");
      g.addColorStop(0.5, "rgba(34,197,94,0.55)");
      g.addColorStop(1, "rgba(34,197,94,0)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(16, 16, r, 0, Math.PI * 2);
      c.fill();
    });

    const dotLarge = makeSprite(48, (c) => {
      const r = 10;
      const g = c.createRadialGradient(24, 24, 0, 24, 24, r);
      g.addColorStop(0, "rgba(187,247,208,1)");
      g.addColorStop(0.5, "rgba(34,197,94,0.55)");
      g.addColorStop(1, "rgba(34,197,94,0)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(24, 24, r, 0, Math.PI * 2);
      c.fill();
    });

    // Brighter glow dot (no star spikes)
    const glowBright = makeSprite(64, (c) => {
      const r = 14;
      const g = c.createRadialGradient(32, 32, 0, 32, 32, r);
      g.addColorStop(0, "rgba(220,252,231,1)"); // very light green center
      g.addColorStop(0.25, "rgba(134,239,172,0.75)");
      g.addColorStop(0.55, "rgba(34,197,94,0.45)");
      g.addColorStop(1, "rgba(34,197,94,0)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(32, 32, r, 0, Math.PI * 2);
      c.fill();
    });

    let vignetteGradient: CanvasGradient | null = null;

    const setSize = () => {
      // Apple-like crispness but avoid runaway GPU costs on ultra-high DPR.
      const rawDpr = window.devicePixelRatio || 1;
      const dpr = Math.max(1, Math.min(saveData ? 1.25 : 1.75, rawDpr));
      dprRef.current = dpr;
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cssW = window.innerWidth;
      const cssH = window.innerHeight;

      // Soft vignette to feel like a real sky (no grid texture)
      vignetteGradient = ctx.createRadialGradient(
        cssW * 0.5,
        cssH * 0.45,
        Math.min(cssW, cssH) * 0.15,
        cssW * 0.5,
        cssH * 0.45,
        Math.max(cssW, cssH) * 0.85
      );
      vignetteGradient.addColorStop(0, "rgba(0,0,0,0)");
      vignetteGradient.addColorStop(0.65, "rgba(0,0,0,0.22)");
      vignetteGradient.addColorStop(1, "rgba(0,0,0,0.55)");
    };

    const makeStars = (scale = 1) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const area = w * h;
      const base = Math.floor(area / (saveData ? 24000 : 17000));
      const count = clamp(Math.floor(base * scale), 60, saveData ? 120 : 180);

      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        // Dots only (no large glows) – reads as starfield, not rain or streaks
        const s = 8 + Math.random() * 16;
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseA: 0.15 + Math.random() * 0.4,
          tw: 0.6 + Math.random() * 1.6,
          ph: Math.random() * Math.PI * 2,
          s,
          kind: "dot",
        });
      }
      starsRef.current = stars;
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      for (const s of starsRef.current) {
        ctx.globalAlpha = clamp(s.baseA, 0.1, 0.8);
        const size = s.s;
        const sprite = size < 14 ? dotSmall : dotLarge;
        ctx.drawImage(sprite, s.x - size / 2, s.y - size / 2, size, size);
      }

      ctx.restore();
      ctx.globalAlpha = 1;

      if (vignetteGradient) {
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = vignetteGradient;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
    };

    setSize();
    makeStars();
    draw();

    const onResize = () => {
      setSize();
      makeStars();
      draw();
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

