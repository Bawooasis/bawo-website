import AppScreenshotPicture from "./AppScreenshotPicture";
import { IMAGES } from "../constants/images";

type HeroAppPreviewProps = {
  className?: string;
};

const HERO_WIDTH = IMAGES.previews.mainShot.width;
const HERO_HEIGHT = IMAGES.previews.mainShot.height;

export default function HeroAppPreview({
  className = "",
}: HeroAppPreviewProps) {
  const shot = IMAGES.previews.mainShot;
  return (
    <figure
      className={`bawo-hero-mockup ${className}`.trim()}
      aria-label="BawoSocial app preview"
    >
      <div className="bawo-hero-mockup__stage">
        <AppScreenshotPicture
          jpg={shot.jpg}
          webp={shot.webp}
          avif={shot.avif}
          jpgSrcSet={shot.jpgSrcSet}
          webpSrcSet={shot.webpSrcSet}
          avifSrcSet={shot.avifSrcSet}
          sizes={shot.sizes}
          alt="BawoSocial Community screen on iPhone showing NYC Community Lounge with Join"
          width={HERO_WIDTH}
          height={HERO_HEIGHT}
          className="bawo-hero-mockup__image animate-subtle-float is-active"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </figure>
  );
}
