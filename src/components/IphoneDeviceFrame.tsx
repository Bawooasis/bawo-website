import type { ReactNode } from "react";

type IphoneDeviceFrameProps = {
  children: ReactNode;
  className?: string;
  /** Extra class on the screen viewport (overflow clip). */
  screenClassName?: string;
  /** Accessible name for the device figure. */
  label?: string;
};

/**
 * Pure CSS/SVG iPhone 17 Pro Max–style device chrome.
 *
 * Proportions follow the public 440×956 CSS viewport (screen radius ~62pt,
 * Dynamic Island ~125×37pt). Not Apple marketing artwork — original CSS/SVG
 * approximation for commercial use on joinbawo.com.
 */
export default function IphoneDeviceFrame({
  children,
  className = "",
  screenClassName = "",
  label = "iPhone preview",
}: IphoneDeviceFrameProps) {
  return (
    <figure
      className={`bawo-iphone ${className}`.trim()}
      aria-label={label}
    >
      {/* Volume / Action (left) */}
      <span className="bawo-iphone__btn bawo-iphone__btn--action" aria-hidden />
      <span className="bawo-iphone__btn bawo-iphone__btn--vol-up" aria-hidden />
      <span className="bawo-iphone__btn bawo-iphone__btn--vol-down" aria-hidden />
      {/* Power (right) */}
      <span className="bawo-iphone__btn bawo-iphone__btn--power" aria-hidden />

      <div className="bawo-iphone__shell">
        <div className="bawo-iphone__bezel">
          <div className={`bawo-iphone__screen ${screenClassName}`.trim()}>
            {children}
            {/* Hardware Dynamic Island — overlays the screenshot status bar */}
            <span className="bawo-iphone__island" aria-hidden>
              <span className="bawo-iphone__island-camera" />
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}
