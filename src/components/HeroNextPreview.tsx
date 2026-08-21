import { Expand, X } from "lucide-react";
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
      aria-label="What's next on BawoSocial"
    >
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
        ) : (
          <div className="bawo-next-preview__placeholder">
            <span className="bawo-next-preview__placeholder-kicker">
              {current.kicker}
            </span>
            <span className="bawo-next-preview__placeholder-title">
              {current.title}
            </span>
            <span className="bawo-next-preview__placeholder-hint">
              Image coming soon
            </span>
          </div>
        )}
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
                <span className="bawo-next-preview__tab-title">{item.title}</span>
                {isActive ? (
                  <span className="bawo-next-preview__tab-body">
                    {item.description}
                  </span>
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
