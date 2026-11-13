import AppScreenShot from "./AppScreenShot";
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
    <div className={`bawo-hero-mockup ${className}`.trim()}>
      <div className="bawo-hero-mockup__stage">
        <AppScreenShot
          className="bawo-hero-mockup__device animate-subtle-float is-active"
          label="BawoSocial app preview"
        >
          <AppScreenshotPicture
            jpg={shot.jpg}
            webp={shot.webp}
            avif={shot.avif}
            jpgSrcSet={shot.jpgSrcSet}
            webpSrcSet={shot.webpSrcSet}
            avifSrcSet={shot.avifSrcSet}
            sizes={shot.sizes}
            alt="BawoSocial Community screen showing NYC Community Lounge with Join on iPhone"
            width={HERO_WIDTH}
            height={HERO_HEIGHT}
            className="bawo-app-screen__img"
            loading="eager"
            fetchPriority="high"
          />
        </AppScreenShot>
      </div>
    </div>
  );
}
