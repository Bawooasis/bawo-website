import { memo } from "react";
import { CONTENT } from "../constants/content";

/**
 * Fixed bottom-right TestFlight CTA — visible while scrolling on public pages.
 * Keeps the two-line DOWNLOAD VIA / TESTFLIGHT treatment from the header polish.
 */
function StickyTestFlightCta() {
  return (
    <a
      href={CONTENT.hero.testflightLink}
      target="_blank"
      rel="noopener noreferrer"
      className="bawo-sticky-testflight"
      aria-label="Download via TestFlight"
    >
      <span className="bawo-sticky-testflight__label">
        <span className="bawo-sticky-testflight__line">Download via</span>
        <span className="bawo-sticky-testflight__line">TestFlight</span>
      </span>
    </a>
  );
}

export default memo(StickyTestFlightCta);
