export type PanelEventStatus = "draft" | "published" | "hidden" | "expired";

export function panelStatusFromDb(
  status: string | null | undefined,
  moderationStatus: string | null | undefined,
): PanelEventStatus {
  const s = String(status || "").toLowerCase();
  const m = String(moderationStatus || "").toLowerCase();
  if (s === "hidden") return "hidden";
  if (s === "expired") return "expired";
  if (s === "draft" || s === "pending" || m === "pending") return "draft";
  if (s === "rejected" || m === "rejected") return "hidden";
  if ((s === "approved" || s === "active" || !s) && (m === "approved" || !m)) {
    return "published";
  }
  return "draft";
}

export function panelStatusLabel(status: PanelEventStatus): string {
  switch (status) {
    case "published":
      return "Published";
    case "hidden":
      return "Hidden";
    case "expired":
      return "Expired";
    case "draft":
    default:
      return "Draft";
  }
}

export function panelStatusTone(
  status: PanelEventStatus,
): "is-success" | "is-warning" | "is-danger" | "" {
  switch (status) {
    case "published":
      return "is-success";
    case "draft":
      return "is-warning";
    case "hidden":
    case "expired":
      return "is-danger";
    default:
      return "";
  }
}

/** Convert an ISO timestamp to datetime-local value in America/New_York. */
export function toNyDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value || "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/**
 * Interpret a datetime-local wall clock as America/New_York and return ISO UTC.
 * Handles EST/EDT via the timezone offset at that local wall time.
 */
export function fromNyDatetimeLocal(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );
  if (!match) return null;
  const [, y, mo, d, h, mi, se] = match;
  const asUtc = Date.UTC(
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    Number(se || "0"),
  );
  // Find the NY offset for this wall time by probing.
  const probe = new Date(asUtc);
  const nyFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    timeZoneName: "shortOffset",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const tzPart =
    nyFormatter
      .formatToParts(probe)
      .find((part) => part.type === "timeZoneName")?.value || "GMT-5";
  const offsetMatch = tzPart.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
  const offsetHours = offsetMatch ? Number(offsetMatch[1]) : -5;
  const offsetMinutes = offsetMatch?.[2] ? Number(offsetMatch[2]) : 0;
  const offsetMs = (offsetHours * 60 + Math.sign(offsetHours) * offsetMinutes) *
    60 *
    1000;
  return new Date(asUtc - offsetMs).toISOString();
}

export function parseTagsInput(value: string): string[] {
  return value
    .split(/[,#\n]/)
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
}
