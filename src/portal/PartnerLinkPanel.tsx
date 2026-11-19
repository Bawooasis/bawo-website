import { Download, Link2, QrCode } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { houseCodeFor } from "../directory/partnerCodes";
import {
  partnerQrPngDataUrl,
  partnerQrSvg,
  partnerRefUrl,
} from "../directory/qr";
import { EmptyState } from "./PortalUi";

/**
 * Partner link workspace. Shows empty state until partner attribution tables
 * exist (see supabase/migrations/*_partner_*.sql). Preview QR uses the
 * BawoSocial house promoter code from src/directory/partnerCodes.ts.
 */
export default function PartnerLinkPanel() {
  const [tablesReady] = useState(false);
  const house = houseCodeFor("promoter");
  const sampleLink = useMemo(
    () => partnerRefUrl(house.code, house.partnerType),
    [house.code, house.partnerType],
  );
  const [pngUrl, setPngUrl] = useState("");
  const [svgMarkup, setSvgMarkup] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [png, svg] = await Promise.all([
          partnerQrPngDataUrl(sampleLink, 512),
          partnerQrSvg(sampleLink, 512),
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
  }, [sampleLink]);

  const downloadPng = () => {
    if (!pngUrl) return;
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `bawosocial-partner-qr-${house.code}.png`;
    a.click();
  };

  const downloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bawosocial-partner-qr-${house.code}.svg`;
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
            body="Once partner tables are migrated and Alexander activates your code, this tab will show live clicks, sign-ups, saves, activation, a weekly chart, and your events. Preview QR downloads below encode the BawoSocial house promoter URL."
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
              <h2>Partner QR · {house.code}</h2>
            </div>
          </div>
          <p className="portal-muted" style={{ marginBottom: "1rem" }}>
            {sampleLink}
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
                alt={`QR code for ${sampleLink}`}
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
