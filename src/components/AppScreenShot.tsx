import type { ReactNode } from "react";

type AppScreenShotProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

/**
 * App Store–style iPhone 17 Pro Max frame around real simulator captures.
 *
 * Black titanium bezel + hardware Dynamic Island + soft shadow. The screen
 * content is the real 1320×2868 sim PNG (status bar already in-shot) — no
 * fake status UI. The island is hardware chrome that sits over the black
 * island already present in the capture (no double clock/battery).
 */
export default function AppScreenShot({
  children,
  className = "",
  label = "BawoSocial app screen",
}: AppScreenShotProps) {
  return (
    <figure className={`bawo-app-screen ${className}`.trim()} aria-label={label}>
      <span className="bawo-app-screen__btn bawo-app-screen__btn--action" aria-hidden />
      <span className="bawo-app-screen__btn bawo-app-screen__btn--vol-up" aria-hidden />
      <span className="bawo-app-screen__btn bawo-app-screen__btn--vol-down" aria-hidden />
      <span className="bawo-app-screen__btn bawo-app-screen__btn--power" aria-hidden />

      <div className="bawo-app-screen__shell">
        <div className="bawo-app-screen__bezel">
          <div className="bawo-app-screen__viewport">{children}</div>
          {/* Hardware Dynamic Island — overlays the in-capture island */}
          <span className="bawo-app-screen__island" aria-hidden>
            <span className="bawo-app-screen__island-lens" />
          </span>
        </div>
      </div>
    </figure>
  );
}
