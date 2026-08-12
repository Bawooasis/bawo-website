import { memo, useState } from "react";
import { CONTENT } from "../constants/content";

type HeroNextPreviewProps = {
  className?: string;
};

function HeroNextPreview({ className = "" }: HeroNextPreviewProps) {
  const items = CONTENT.hero.nextPreview;
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <div
      className={`bawo-next-preview ${className}`.trim()}
      aria-label="What's next on BawoSocial"
    >
      <div className="bawo-next-preview__visual" aria-hidden={!current.image}>
        {current.image ? (
          <img
            src={current.image}
            alt=""
            className="bawo-next-preview__image"
            loading="lazy"
            decoding="async"
          />
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
    </div>
  );
}

export default memo(HeroNextPreview);
