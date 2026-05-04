import { useEffect, useRef, useState } from "react";

const ROTATE_MS = 5500;

interface BoroughSquareCarouselProps {
  images: readonly string[];
  alt: string;
  showDots?: boolean;
  /** Delay before the first auto-advance (spreads work across borough tiles). */
  rotationStaggerMs?: number;
}

export default function BoroughSquareCarousel({
  images,
  alt,
  showDots = true,
  rotationStaggerMs = 0,
}: BoroughSquareCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const safeImages = images.length > 0 ? images : [];

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const ob = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { rootMargin: "100px 0px", threshold: 0.08 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || safeImages.length < 2) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const startTimer = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % safeImages.length);
      }, ROTATE_MS);
    }, rotationStaggerMs);

    return () => {
      window.clearTimeout(startTimer);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [visible, safeImages.length, rotationStaggerMs]);

  if (safeImages.length === 0) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="relative h-full w-full contain-content"
    >
      {safeImages.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          aria-hidden={i !== index}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            i === index ? "opacity-100 z-[1]" : "opacity-0 z-0 pointer-events-none"
          }`}
        />
      ))}
      {/* Bottom gradient for depth — matches obsidian glass */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/55 via-black/15 to-transparent z-[2]"
        aria-hidden
      />
      {showDots && safeImages.length > 1 ? (
        <div
          className="absolute bottom-3 left-0 right-0 z-[3] flex justify-center gap-1.5"
          aria-hidden
        >
          {safeImages.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "bg-[#D4AF37] w-4 shadow-[0_0_10px_rgba(212,175,55,0.45)]"
                  : "bg-white/35"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
