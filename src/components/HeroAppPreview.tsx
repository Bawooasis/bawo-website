import { IMAGES } from "../constants/images";

type HeroAppPreviewProps = {
  className?: string;
};

const HERO_MOCKUP_WIDTH = 2572;
const HERO_MOCKUP_HEIGHT = 5284;

export default function HeroAppPreview({
  className = "",
}: HeroAppPreviewProps) {
  return (
    <figure
      className={`bawo-hero-mockup ${className}`.trim()}
      aria-label="BawoSocial app preview"
    >
      <div className="bawo-hero-mockup__glow" aria-hidden />
      <div className="bawo-hero-mockup__stage">
        <img
          src={IMAGES.previews.main}
          alt="BawoSocial Community app on iPhone — Soft Life NYC and No Wahala Lounge"
          className="bawo-hero-mockup__image animate-subtle-float is-active"
          width={HERO_MOCKUP_WIDTH}
          height={HERO_MOCKUP_HEIGHT}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </figure>
  );
}
