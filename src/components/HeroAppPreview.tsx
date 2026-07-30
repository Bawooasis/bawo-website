import { useEffect, useState } from "react";
import { IMAGES } from "../constants/images";

type HeroAppPreviewProps = {
  className?: string;
};

const ROTATE_MS = 6500;

const SLIDES = [
  {
    src: IMAGES.previews.main,
    alt: "BawoSocial Explore app on iPhone — map, AI concierge, and nearby restaurants in NYC",
  },
  {
    src: IMAGES.previews.events,
    alt: "BawoSocial Events app on iPhone — Afrobeats events and community gatherings in NYC",
  },
] as const;

export default function HeroAppPreview({
  className = "",
}: HeroAppPreviewProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (SLIDES.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <figure
      className={`bawo-hero-mockup ${className}`.trim()}
      aria-label="BawoSocial app preview"
    >
      <div className="bawo-hero-mockup__glow" aria-hidden />
      <div className="bawo-hero-mockup__stage">
        {SLIDES.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={index === active ? slide.alt : ""}
            aria-hidden={index !== active}
            className={`bawo-hero-mockup__image animate-subtle-float${
              index === active ? " is-active" : ""
            }`}
            width={3840}
            height={3072}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "low"}
          />
        ))}
      </div>
    </figure>
  );
}
