import QRCode from "qrcode";
import { Download, Link2, QrCode } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "./PortalUi";

/**
 * Partner link workspace. Shows empty state until partner attribution tables
 * exist (see supabase/migrations/*_partner_growth.sql). Demo kit uses a
 * placeholder code so operators can preview QR downloads.
 */
export default function PartnerLinkPanel() {
  const [tablesReady] = useState(false);
  const demoCode = "BAWO-PENDING";
  const demoLink = useMemo(
    () => `https://www.joinbawo.com/nyc?ref=${demoCode}`,
    [demoCode],
  );
  const [pngUrl, setPngUrl] = useState("");
  const [svgMarkup, setSvgMarkup] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [png, svg] = await Promise.all([
        QRCode.toDataURL(demoLink, {
          width: 512,
          margin: 1,
          color: { dark: "#0E0A14", light: "#FFFFFF" },
        }),
        QRCode.toString(demoLink, {
          type: "svg",
          margin: 1,
          color: { dark: "#0E0A14", light: "#FFFFFF" },
        }),
      ]);
      if (cancelled) return;
      setPngUrl(png);
      setSvgMarkup(svg);
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
    const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
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
            body="Once partner tables are migrated and Alexander activates your code, this tab will show live clicks, sign-ups, saves, activation, a weekly chart, and your events. Preview QR downloads use a placeholder for now."
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
              <h2>Placeholder QR</h2>
            </div>
          </div>
          <p className="portal-muted" style={{ marginBottom: "1rem" }}>
            {demoLink}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            {pngUrl ? (
              <img
                src={pngUrl}
                alt="Placeholder partner QR"
                width={160}
                height={160}
                style={{ borderRadius: 12, background: "#fff", padding: 8 }}
              />
            ) : null}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <button type="button" className="portal-btn" onClick={downloadPng}>
                <Download aria-hidden /> Download PNG
              </button>
              <button type="button" className="portal-btn portal-btn-ghost" onClick={downloadSvg}>
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
