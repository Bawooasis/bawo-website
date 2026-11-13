import type { ReactNode } from "react";

type AppScreenShotProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

/**
 * Wrapper for Alexander’s App Store–framed phone renders (transparent PNG/WebP).
 * The device chrome (black/purple titanium bezel + Dynamic Island) is baked into
 * the image via webshots/render.py — no CSS bezel or fake status UI here.
 */
export default function AppScreenShot({
  children,
  className = "",
  label = "BawoSocial app screen",
}: AppScreenShotProps) {
  return (
    <figure className={`bawo-app-screen ${className}`.trim()} aria-label={label}>
      {children}
    </figure>
  );
}
