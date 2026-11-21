import QRCode from "qrcode";
import type { PartnerApplicantType } from "./types";

/** Shared partner-kit QR settings: scannable quiet zone + error correction ≥ M. */
export const PARTNER_QR_OPTIONS = {
  errorCorrectionLevel: "M" as const,
  /** Quiet zone in modules (QR spec recommends ≥ 4). */
  margin: 4,
  color: {
    dark: "#000000",
    light: "#FFFFFF",
  },
};

const UTM_CAMPAIGN: Record<PartnerApplicantType, string> = {
  promoter: "partner_promoter",
  venue: "partner_venue",
  student_society: "partner_student",
};

/**
 * Canonical partner kit URL: UTM tracking + ?ref=<code>.
 * Displayed text and QR payload must stay identical.
 */
export function partnerRefUrl(
  code: string,
  partnerType: PartnerApplicantType = "promoter",
): string {
  const params = new URLSearchParams({
    utm_source: "partner",
    utm_medium: "qr",
    utm_campaign: UTM_CAMPAIGN[partnerType],
    ref: code,
  });
  return `https://www.joinbawo.com/nyc?${params.toString()}`;
}

export async function partnerQrDataUrl(
  url: string,
  width = 280,
): Promise<string> {
  return QRCode.toDataURL(url, {
    ...PARTNER_QR_OPTIONS,
    width,
    type: "image/png",
  });
}

export async function partnerQrPngDataUrl(
  url: string,
  width = 512,
): Promise<string> {
  return QRCode.toDataURL(url, {
    ...PARTNER_QR_OPTIONS,
    width,
    type: "image/png",
  });
}

export async function partnerQrSvg(url: string, width = 512): Promise<string> {
  return QRCode.toString(url, {
    ...PARTNER_QR_OPTIONS,
    type: "svg",
    width,
  });
}
