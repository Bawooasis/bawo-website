import { Expand, MapPin, Sparkles, X } from "lucide-react";
import { memo, useRef, useState } from "react";
import AppScreenShot from "./AppScreenShot";
import AppScreenshotPicture from "./AppScreenshotPicture";
import { CONTENT } from "../constants/content";
import type { AppScreenshotSources } from "../constants/images";

type HeroNextPreviewProps = {
  className?: string;
};

type PreviewItem = (typeof CONTENT.hero.nextPreview)[number] & {
  imageShot?: AppScreenshotSources;
};

function HeroNextPreview({ className = "" }: HeroNextPreviewProps) {
  const items = CONTENT.hero.nextPreview as PreviewItem[];
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shot = current.imageShot;

  const openPreview = () => dialogRef.current?.showModal();
  const closePreview = () => dialogRef.current?.close();

  return (
    <div
      className={`bawo-next-preview ${className}`.trim()}
      aria-label="Interactive BawoSocial App Showcase"
    >
      <div className="bawo-next-preview__header mb-3 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B26A]/35 bg-[#1C132B]/75 px-3.5 py-1.5 text-sm font-bold uppercase tracking-wider text-[#D6B26A] backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>Interactive App Showcase · Live NYC Beta</span>
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-[#F7F3FA]/70">
          <MapPin className="h-3.5 w-3.5 text-[#D6B26A]" aria-hidden />
          <span>{current.liveMetric}</span>
        </div>
      </div>

      <div
        className="bawo-next-preview__visual"
        data-layout={current.layout}
        role="tabpanel"
        id={`bawo-preview-panel-${active}`}
        aria-labelledby={`bawo-preview-tab-${active}`}
      >
        {current.image ? (
          <>
            <div className="bawo-next-preview__device-wrap">
              <AppScreenShot
                key={current.title}
                className="bawo-next-preview__device"
                label={`${current.title} app screen`}
              >
                {shot ? (
                  <AppScreenshotPicture
                    jpg={shot.jpg}
                    webp={shot.webp}
                    avif={shot.avif}
                    jpgSrcSet={shot.jpgSrcSet}
                    webpSrcSet={shot.webpSrcSet}
                    avifSrcSet={shot.avifSrcSet}
                    sizes={shot.sizes}
                    alt={current.imageAlt}
                    width={shot.width}
                    height={shot.height}
                    className="bawo-app-screen__img"
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={current.image}
                    alt={current.imageAlt}
                    className="bawo-app-screen__img"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </AppScreenShot>
            </div>
            <div className="bawo-next-preview__chrome">
              <span className="bawo-next-preview__status">
                <span aria-hidden="true" />
                {current.kicker}
              </span>
              <button
                type="button"
                className="bawo-next-preview__expand"
                onClick={openPreview}
                aria-label={`View ${current.title} screen larger`}
              >
                <span>Expand</span>
                <Expand size={15} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </>
        ) : null}
      </div>

      <div className="bawo-next-preview__copy">
        <div className="bawo-next-preview__active-card">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              id={`bawo-preview-tab-${active}`}
              className="bawo-next-preview__tab-title font-display text-xl sm:text-2xl font-bold text-white"
            >
              {current.title}
            </h3>
            <span className="rounded-full border border-[#D6B26A]/30 bg-[#D6B26A]/12 px-2.5 py-0.5 text-sm font-bold uppercase tracking-wider text-[#F7E7C4]">
              {current.badge}
            </span>
          </div>
          <p className="bawo-next-preview__tab-body mt-3 text-base text-[#F7F3FA]/85 leading-relaxed">
            {current.description}
          </p>
        </div>

        <ul className="bawo-next-preview__list" role="tablist">
          {items.map((item, index) => {
            if (index === active) return null;
            return (
              <li key={item.title} className="bawo-next-preview__item">
                <button
                  type="button"
                  role="tab"
                  aria-controls={`bawo-preview-panel-${index}`}
                  aria-selected={false}
                  className="bawo-next-preview__tab"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                >
                  <span className="bawo-next-preview__tab-title">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        className="bawo-next-preview__dialog"
        aria-label={`${current.title} app preview`}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePreview();
        }}
      >
        <button
          type="button"
          className="bawo-next-preview__dialog-close"
          onClick={closePreview}
          aria-label="Close app preview"
        >
          <X size={22} aria-hidden="true" />
        </button>
        <AppScreenShot
          className="bawo-next-preview__dialog-device"
          label={`${current.title} app screen`}
        >
          {shot ? (
            <AppScreenshotPicture
              jpg={shot.jpg}
              webp={shot.webp}
              avif={shot.avif}
              jpgSrcSet={shot.jpgSrcSet}
              webpSrcSet={shot.webpSrcSet}
              avifSrcSet={shot.avifSrcSet}
              sizes="(max-width: 768px) 90vw, 420px"
              alt={current.imageAlt}
              width={shot.width}
              height={shot.height}
              className="bawo-app-screen__img"
              loading="eager"
            />
          ) : (
            <img
              src={current.image}
              alt={current.imageAlt}
              className="bawo-app-screen__img"
            />
          )}
        </AppScreenShot>
      </dialog>
    </div>
  );
}

export default memo(HeroNextPreview);
