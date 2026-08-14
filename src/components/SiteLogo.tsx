import type { MouseEvent } from "react";
import { IMAGES } from "../constants/images";

type SiteLogoProps = {
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function SiteLogo({ className = "", onClick }: SiteLogoProps) {
  return (
    <a
      href="#"
      className={`bawo-site-logo ${className}`.trim()}
      onClick={onClick}
      aria-label="BawoSocial home"
    >
      <img
        src={IMAGES.assets.mark}
        alt=""
        className="bawo-site-logo__mark"
        width={112}
        height={128}
        decoding="async"
        fetchPriority="high"
        aria-hidden
      />
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
