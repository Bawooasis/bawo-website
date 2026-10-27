import { CheckCircle2, Expand, MapPin, Sparkles, X } from "lucide-react";
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
      <div className="bawo-next-preview__header mb-2 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E8B959]/35 bg-[#1C132B]/75 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E8B959] backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>Interactive iPhone 17 Pro App Showcase · Live NYC Beta</span>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#F7F3FA]/70">
          <MapPin className="h-3.5 w-3.5 text-[#E8B959]" aria-hidden />
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
            <img
              key={current.title}
              src={current.image}
              alt={current.imageAlt}
              className="bawo-next-preview__image"
              loading="lazy"
              decoding="async"
            />
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

      <ul className="bawo-next-preview__list" role="tablist">
        {items.map((item, index) => {
          const isActive = index === active;
          return (
            <li key={item.title} className="bawo-next-preview__item">
              <button
                type="button"
                role="tab"
                id={`bawo-preview-tab-${index}`}
                aria-controls={`bawo-preview-panel-${index}`}
                aria-selected={isActive}
                className={`bawo-next-preview__tab${isActive ? " is-active" : ""}`}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <span className="bawo-next-preview__tab-title font-display text-lg sm:text-xl font-bold">
                    {item.title}
                  </span>
                  <span className="rounded-full border border-[#E8B959]/30 bg-[#E8B959]/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FFCF6B]">
                    {item.badge}
                  </span>
                </div>
                {isActive ? (
                  <div className="mt-2 space-y-2.5 text-left">
                    <span className="bawo-next-preview__tab-body block text-sm text-[#F7F3FA]/85 leading-relaxed">
                      {item.description}
                    </span>
                    <ul className="space-y-1.5 pt-1">
                      {item.highlights.map((hl) => (
                        <li
                          key={hl}
                          className="flex items-center gap-2 text-xs font-medium text-[#FFE8B3]"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#E8B959]" aria-hidden />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

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
        <img src={current.image} alt={current.imageAlt} />
      </dialog>
    </div>
  );
}

export default memo(HeroNextPreview);
