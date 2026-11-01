import { useState, type MouseEvent } from "react";
import { IMAGES } from "../constants/images";

type SiteLogoProps = {
  className?: string;
  /** Use deep gold (#A07636) on light/ivory surfaces; default is app gold on dark. */
  tone?: "gold" | "deep";
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function SiteLogo({
  className = "",
  tone = "gold",
  onClick,
}: SiteLogoProps) {
  const [markOk, setMarkOk] = useState(true);

  return (
    <a
      href="#"
      className={`bawo-site-logo ${tone === "deep" ? "bawo-site-logo--deep" : ""} ${className}`.trim()}
      onClick={onClick}
      aria-label="BawoSocial home"
    >
      {markOk ? (
        <img
          src={IMAGES.assets.mark}
          alt=""
          className="bawo-site-logo__mark"
          width={256}
          height={256}
          decoding="async"
          fetchPriority="high"
          aria-hidden
          onError={() => setMarkOk(false)}
        />
      ) : null}
      {/* Live MuseoModerno SemiBold wordmark — Direction C (gold / deep) */}
      <span className="bawo-site-logo__wordmark" aria-hidden>
        BawoSocial
      </span>
      {/* Fallback image for crawlers / no-CSS; visually hidden when text wordmark paints */}
      <img
        src={tone === "deep" ? IMAGES.assets.logoDeep : IMAGES.assets.logo}
        alt=""
        className="bawo-site-logo__img"
        width={176}
        height={36}
        decoding="async"
        aria-hidden
      />
    </a>
  );
}
