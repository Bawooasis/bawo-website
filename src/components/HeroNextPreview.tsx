import { Expand, MapPin, Sparkles, X } from "lucide-react";
import { memo, useRef, useState } from "react";
import { CONTENT } from "../constants/content";

type HeroNextPreviewProps = {
  className?: string;
};

function HeroNextPreview({ className = "" }: HeroNextPreviewProps) {
  const items = CONTENT.hero.nextPreview;
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];
  const dialogRef = useRef<HTMLDialogElement>(null);

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
          <span>Interactive App Showcase · iPhone 17 Pro + Android · Live NYC Beta</span>
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
            <img
              src={current.image}
              alt=""
              className="bawo-next-preview__backdrop"
              aria-hidden="true"
            />

            <div className="bawo-next-preview__devices" aria-label="iPhone and Android app simulators">
              {/* Latest iPhone */}
              <div className="bawo-next-preview__device bawo-next-preview__device--iphone">
                <div className="bawo-next-preview__device-frame bawo-next-preview__device-frame--iphone">
                  <div className="bawo-next-preview__device-side bawo-next-preview__device-side--left" aria-hidden />
                  <div className="bawo-next-preview__device-side bawo-next-preview__device-side--right" aria-hidden />
                  <div className="bawo-next-preview__device-island" aria-hidden />
                  <div className="bawo-next-preview__device-screen">
                    <img
                      key={`ios-${current.title}`}
                      src={current.image}
                      alt={`${current.imageAlt} on iPhone`}
                      className="bawo-next-preview__image"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="bawo-next-preview__device-home" aria-hidden />
                </div>
                <span className="bawo-next-preview__device-label">iPhone 17 Pro</span>
              </div>

              {/* Android flagship / Pixel-style */}
              <div className="bawo-next-preview__device bawo-next-preview__device--android">
                <div className="bawo-next-preview__device-frame bawo-next-preview__device-frame--android">
                  <div className="bawo-next-preview__device-punch" aria-hidden />
                  <div className="bawo-next-preview__device-screen bawo-next-preview__device-screen--android">
                    <img
                      key={`android-${current.title}`}
                      src={current.image}
                      alt={`${current.imageAlt} on Android`}
                      className="bawo-next-preview__image"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="bawo-next-preview__device-gesture" aria-hidden />
                </div>
                <span className="bawo-next-preview__device-label">Android</span>
              </div>
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
          <h3
            id={`bawo-preview-tab-${active}`}
            className="bawo-next-preview__heading font-display"
          >
            {current.title}
          </h3>
          <span className="bawo-next-preview__badge">{current.badge}</span>
          <p className="bawo-next-preview__tab-body">{current.description}</p>
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
        <div className="bawo-next-preview__dialog-devices">
          <div className="bawo-next-preview__device-frame bawo-next-preview__device-frame--iphone">
            <div className="bawo-next-preview__device-island" aria-hidden />
            <div className="bawo-next-preview__device-screen">
              <img src={current.image} alt={`${current.imageAlt} on iPhone`} />
            </div>
            <div className="bawo-next-preview__device-home" aria-hidden />
          </div>
          <div className="bawo-next-preview__device-frame bawo-next-preview__device-frame--android">
            <div className="bawo-next-preview__device-punch" aria-hidden />
            <div className="bawo-next-preview__device-screen bawo-next-preview__device-screen--android">
              <img src={current.image} alt={`${current.imageAlt} on Android`} />
            </div>
            <div className="bawo-next-preview__device-gesture" aria-hidden />
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default memo(HeroNextPreview);
