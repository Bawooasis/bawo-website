import { useEffect } from "react";
import GrowthPanel from "../portal/GrowthPanel";
import PartnerLinkPanel from "../portal/PartnerLinkPanel";
import "../portal/portal.css";

function useNoIndex() {
  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) {
      robots.setAttribute("content", "noindex,nofollow");
    } else {
      const meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex,nofollow";
      document.head.appendChild(meta);
    }
  }, []);
}

/** Noindex UI preview for Partner link tab (no portal auth). */
export function PartnerLinkPreviewPage() {
  useNoIndex();
  return (
    <div className="portal-shell" style={{ minHeight: "100vh" }}>
      <main className="portal-main" style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem" }}>
        <p style={{ color: "#D6B26A", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Business Portal · Partner link tab preview
        </p>
        <div style={{ marginTop: "1rem" }}>
          <PartnerLinkPanel />
        </div>
      </main>
    </div>
  );
}

/** Noindex UI preview for Admin Growth tab (no portal auth). */
export function GrowthPreviewPage() {
  useNoIndex();
  return (
    <div className="portal-shell" style={{ minHeight: "100vh" }}>
      <main className="portal-main" style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>
        <p style={{ color: "#D6B26A", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Control Center · Growth tab preview
        </p>
        <div style={{ marginTop: "1rem" }}>
          <GrowthPanel />
        </div>
      </main>
    </div>
  );
}
