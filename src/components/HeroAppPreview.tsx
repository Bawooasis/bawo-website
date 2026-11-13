import AppScreenshotPicture from "./AppScreenshotPicture";
import IphoneDeviceFrame from "./IphoneDeviceFrame";
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
        <IphoneDeviceFrame
          className="bawo-hero-mockup__device animate-subtle-float is-active"
          label="BawoSocial app preview on iPhone"
        >
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
            className="bawo-iphone__shot"
            loading="eager"
            fetchPriority="high"
          />
        </IphoneDeviceFrame>
      </div>
    </div>
  );
}
