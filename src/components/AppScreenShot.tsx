import type { ReactNode } from "react";

type AppScreenShotProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

/**
 * Clean presentation for real iPhone 17 Pro Max simulator captures.
 * Rounded to ~55px screen radius at 1320×2868 (scales with the element);
 * soft shadow only — no fake bezel, notch, or Dynamic Island overlay.
 */
export default function AppScreenShot({
  children,
  className = "",
  label = "BawoSocial app screen",
}: AppScreenShotProps) {
  return (
    <figure className={`bawo-app-screen ${className}`.trim()} aria-label={label}>
      <div className="bawo-app-screen__viewport">{children}</div>
    </figure>
  );
}
