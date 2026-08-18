import { useState, type MouseEvent } from "react";
import { IMAGES } from "../constants/images";

type SiteLogoProps = {
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function SiteLogo({ className = "", onClick }: SiteLogoProps) {
  const [markOk, setMarkOk] = useState(true);

  return (
    <a
      href="#"
      className={`bawo-site-logo ${className}`.trim()}
      onClick={onClick}
      aria-label="BawoSocial home"
    >
      {markOk ? (
        <img
          src={IMAGES.assets.mark}
          alt=""
          className="bawo-site-logo__mark"
          width={225}
          height={256}
          decoding="async"
          fetchPriority="high"
          aria-hidden
          onError={() => setMarkOk(false)}
        />
      ) : null}
      <img
        src={IMAGES.assets.logo}
        alt="BawoSocial"
        className="bawo-site-logo__img"
        width={176}
        height={36}
        decoding="async"
        fetchPriority="high"
      />
    </a>
  );
}
