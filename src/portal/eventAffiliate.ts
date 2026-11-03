import type { EventAffiliateFields, EventAffiliateSource, EventSubmission } from "./types";

export const AFFILIATE_SOURCE_OPTIONS: Array<{
  value: EventAffiliateSource;
  label: string;
}> = [
  { value: "", label: "Not set" },
  { value: "posh_kickback", label: "Posh Kickback" },
  { value: "eventbrite_tracking", label: "Eventbrite Tracking" },
  { value: "shotgun_promoter", label: "Shotgun Promoter" },
  { value: "tixr_promoter", label: "Tixr Promoter" },
  { value: "direct_deal", label: "Direct Deal" },
];

const AFFILIATE_KEYS = [
  "promoter_ticket_url",
  "promo_code",
  "promo_code_note",
  "affiliate_source",
] as const;

/** True when overview payloads already include at least one affiliate key. */
export function eventHasAffiliateColumns(
  events: EventSubmission[],
): boolean {
  return events.some((event) =>
    AFFILIATE_KEYS.some((key) =>
      Object.prototype.hasOwnProperty.call(event, key),
    ),
  );
}

export function emptyAffiliateDraft(
  event?: EventSubmission | null,
): EventAffiliateFields {
  return {
    promoter_ticket_url: event?.promoter_ticket_url ?? null,
    promo_code: event?.promo_code ?? null,
    promo_code_note: event?.promo_code_note ?? null,
    affiliate_source: (event?.affiliate_source as EventAffiliateSource) ?? "",
  };
}

/**
 * Detect edge-function / PostgREST failures that mean the app migration
 * (or save_event_affiliate handler) is not live yet. Keep approve/reject usable.
 */
export function isAffiliateSchemaPendingError(message: string): boolean {
  return /column|schema cache|does not exist|unknown action|unsupported action|save_event_affiliate|PGRST204|Could not find the/i.test(
    message,
  );
}
