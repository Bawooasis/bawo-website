import QRCode from "qrcode";

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

export function partnerRefUrl(code: string): string {
  // Keep display URL and encoded payload identical (no extra encoding churn).
  return `https://www.joinbawo.com/nyc?ref=${code}`;
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
