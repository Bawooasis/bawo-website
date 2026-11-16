import { Download, Link2, QrCode } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  partnerQrPngDataUrl,
  partnerQrSvg,
  partnerRefUrl,
} from "../directory/qr";
import { EmptyState } from "./PortalUi";

/**
 * Partner link workspace. Shows empty state until partner attribution tables
 * exist (see supabase/migrations/*_partner_growth.sql). Demo kit uses a
 * real QR for the placeholder ref so operators can verify downloads scan.
 */
export default function PartnerLinkPanel() {
  const [tablesReady] = useState(false);
  const demoCode = "BAWO-PENDING";
  const demoLink = useMemo(() => partnerRefUrl(demoCode), [demoCode]);
  const [pngUrl, setPngUrl] = useState("");
  const [svgMarkup, setSvgMarkup] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [png, svg] = await Promise.all([
          partnerQrPngDataUrl(demoLink, 512),
          partnerQrSvg(demoLink, 512),
        ]);
        if (cancelled) return;
        setPngUrl(png);
        setSvgMarkup(svg);
      } catch {
        if (!cancelled) {
          setPngUrl("");
          setSvgMarkup("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [demoLink]);

  const downloadPng = () => {
    if (!pngUrl) return;
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = "bawosocial-partner-qr.png";
    a.click();
  };

  const downloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bawosocial-partner-qr.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!tablesReady) {
    return (
      <div className="portal-stack">
        <section className="portal-panel">
          <div className="portal-panel-heading">
            <div>
              <span className="portal-kicker">Partner link</span>
              <h2>Your share kit</h2>
            </div>
            <Link2 aria-hidden />
          </div>
          <EmptyState
            icon={QrCode}
            title="Partner analytics unlock after approval"
            body="Once partner tables are migrated and Alexander activates your code, this tab will show live clicks, sign-ups, saves, activation, a weekly chart, and your events. Preview QR downloads below encode the exact placeholder URL."
          />
          <div className="portal-feature-row" style={{ marginTop: "1.25rem" }}>
            <span>Clicks</span>
            <span>Sign-ups</span>
            <span>Saves</span>
            <span>Activation</span>
          </div>
        </section>

        <section className="portal-panel">
          <div className="portal-panel-heading">
            <div>
              <span className="portal-kicker">Preview</span>
              <h2>Partner QR</h2>
            </div>
          </div>
          <p className="portal-muted" style={{ marginBottom: "1rem" }}>
            {demoLink}
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {pngUrl ? (
              <img
                src={pngUrl}
                alt={`QR code for ${demoLink}`}
                width={200}
                height={200}
                style={{
                  borderRadius: 0,
                  background: "#fff",
                  padding: 12,
                  imageRendering: "pixelated",
                }}
              />
            ) : null}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <button type="button" className="portal-btn" onClick={downloadPng}>
                <Download aria-hidden /> Download PNG
              </button>
              <button
                type="button"
                className="portal-btn portal-btn-ghost"
                onClick={downloadSvg}
              >
                <Download aria-hidden /> Download SVG
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return null;
}
