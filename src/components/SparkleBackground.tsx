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
  const rafRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const popsRef = useRef<Pop[]>([]);
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
    let noiseCanvas: HTMLCanvasElement | null = null;
    let lastFrameMs = performance.now();
    let emaFrame = 16; // exponential moving average in ms

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

      // High-quality smooth noise tile (static, no visible pattern)
      // Larger tile reduces repetition artifacts.
      const nSize = saveData ? 192 : 256;
      const n = document.createElement("canvas");
      n.width = nSize;
      n.height = nSize;
      const nctx = n.getContext("2d");
      if (nctx) {
        const img = nctx.createImageData(nSize, nSize);
        // Blue-noise-ish approximation: random luminance with low alpha.
        for (let i = 0; i < img.data.length; i += 4) {
          const v = 160 + Math.floor(Math.random() * 90);
          img.data[i] = v;
          img.data[i + 1] = v;
          img.data[i + 2] = v;
          img.data[i + 3] = Math.floor(8 + Math.random() * 14); // subtle
        }
        nctx.putImageData(img, 0, 0);
      }
      noiseCanvas = n;
    };

    const makeStars = (scale = 1) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const area = w * h;
      const base = Math.floor(area / (saveData ? 24000 : 17000));
      const count = clamp(Math.floor(base * scale), 60, saveData ? 120 : 180);

      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        const kind = Math.random() < 0.12 ? "glow" : "dot";
        const s = kind === "glow" ? 22 + Math.random() * 18 : 10 + Math.random() * 18;
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseA: 0.12 + Math.random() * 0.35,
          tw: 0.6 + Math.random() * 1.6,
          ph: Math.random() * Math.PI * 2,
          s,
          kind,
        });
      }
      starsRef.current = stars;
    };

    const draw = (tMs: number) => {
      const t = tMs / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Adaptive quality: if frames get heavy, reduce star count.
      const dt = tMs - lastFrameMs;
      lastFrameMs = tMs;
      emaFrame = emaFrame * 0.9 + dt * 0.1;
      if (!saveData && emaFrame > 22 && starsRef.current.length > 90) {
        makeStars(0.8);
        emaFrame = 16;
      }

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Pitch-black base (stars provide all the life)
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, w, h);

      // Stars
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      for (const s of starsRef.current) {
        const a =
          s.baseA +
          0.22 * Math.sin(t * s.tw + s.ph) +
          0.08 * Math.sin(t * (s.tw * 2.1) + s.ph * 1.7);

        const alpha = clamp(a, 0.03, 0.9);
        ctx.globalAlpha = alpha;

        const size = s.s;
        const sprite =
          s.kind === "glow" ? glowBright : size < 20 ? dotSmall : dotLarge;
        ctx.drawImage(sprite, s.x - size / 2, s.y - size / 2, size, size);
      }

      // Scheduled pops (avoid random heavy ops per-frame)
      const pops = popsRef.current;
      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i];
        const u = (tMs - p.bornMs) / p.lifeMs;
        if (u >= 1) {
          pops.splice(i, 1);
          continue;
        }
        const a = Math.sin(u * Math.PI); // ease in/out
        ctx.globalAlpha = 0.65 * a;
        ctx.drawImage(
          glowBright,
          p.x - p.size / 2,
          p.y - p.size / 2,
          p.size,
          p.size
        );
      }

      ctx.restore();
      ctx.globalAlpha = 1;

      // Smooth micro-noise (no grid). Gentle drift to avoid perceivable tiling.
      if (noiseCanvas && !saveData) {
        const driftX = (Math.sin(t * 0.07) + 1) * 0.5 * 30;
        const driftY = (Math.cos(t * 0.05) + 1) * 0.5 * 30;
        ctx.save();
        ctx.globalCompositeOperation = "soft-light";
        ctx.globalAlpha = 0.05;
        ctx.drawImage(noiseCanvas, -driftX, -driftY, w + driftX, h + driftY);
        ctx.restore();
      }

      // Vignette on top for depth
      if (vignetteGradient) {
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = vignetteGradient;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      // Spawn pops at a gentle cadence (1–2 per second)
      if (!saveData && popsRef.current.length < 3 && Math.random() < 0.03) {
        popsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          bornMs: tMs,
          lifeMs: 900 + Math.random() * 600,
          size: 22 + Math.random() * 26,
        });
      }

      rafRef.current = window.requestAnimationFrame(draw);
    };

    setSize();
    makeStars();

    const onResize = () => {
      setSize();
      makeStars();
    };

    window.addEventListener("resize", onResize, { passive: true });

    const stop = () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const start = () => {
      if (rafRef.current) return;
      lastFrameMs = performance.now();
      emaFrame = 16;
      rafRef.current = window.requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") stop();
      else if (!prefersReducedMotion) start();
    };

    document.addEventListener("visibilitychange", onVisibility, { passive: true });

    if (!prefersReducedMotion) {
      start();
    } else {
      // Draw a single still frame
      draw(performance.now());
      stop();
    }

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
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

