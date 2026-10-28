import type {
  GroupChatModerationItem,
  ListingIssueReportItem,
} from "./types";

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const FOUNDING_LISTINGS = [
  {
    id: "founding-buka-new-york",
    name: "BUKA New York",
    handle: "@bukanewyork",
    address: "1111 Fulton St, Brooklyn, NY 11238",
  },
  {
    id: "founding-small-mommi",
    name: "Small Mommi African Market",
    handle: "@small_mommi_africa_market",
    address: "939A Pennsylvania Ave, Brooklyn, NY 11207",
  },
  {
    id: "founding-laduns-chops",
    name: "Laduns Chops ~ Eat's Savory",
    handle: "@ladunschops",
    address: "Brooklyn & NYC Catering",
  },
  {
    id: "founding-owolabi-cafe",
    name: "Owolabi Cafe",
    handle: "@owolabicafe",
    address: "2123 Caton Ave, Brooklyn, NY 11226",
  },
  {
    id: "founding-chukas-kitchen",
    name: "Chuka's Kitchen",
    handle: "@chukas_kitchen",
    address: "150-46 Shore Ave, Jamaica, NY 11433",
  },
  {
    id: "founding-leilas-hair",
    name: "Leila's Hair Braiding",
    handle: "@leilas_hairbraiding",
    address: "Bronx, NY",
  },
] as const;

/** Realistic Build 183–aligned seed queue when moderation tables are empty / RLS-blocked. */
export const SEED_GROUP_CHAT_ALERTS: GroupChatModerationItem[] = [
  {
    id: "seed-msg-report-1",
    source: "seed",
    status: "pending_review",
    alert_type: "spam",
    group_id: "group-nyc-newcomers",
    group_name: "NYC Newcomers Circle",
    message_id: "msg-seed-101",
    message_preview:
      "Cheap shipping clearance!!! Click my WhatsApp link for cargo deals 🔥🔥🔥",
    reporter_name: "Adaeze O.",
    reported_user_name: "CargoKing99",
    reported_user_id: "user-seed-cargo",
    reason: "spam",
    keyword_hit: "whatsapp link",
    created_at: hoursAgo(3),
    resolved_at: null,
    resolution: null,
  },
  {
    id: "seed-msg-report-2",
    source: "seed",
    status: "safety_alert",
    alert_type: "harassment",
    group_id: "group-sisterhood",
    group_name: "Sisterhood Safe Space",
    message_id: "msg-seed-214",
    message_preview:
      "Repeated personal attacks after a faith discussion — flagged by keyword safety.",
    reporter_name: "Safety Autodetect",
    reported_user_name: "anon_brooklyn",
    reported_user_id: "user-seed-anon",
    reason: "harassment",
    keyword_hit: "threat language",
    created_at: hoursAgo(8),
    resolved_at: null,
    resolution: null,
  },
  {
    id: "seed-msg-report-3",
    source: "seed",
    status: "pending_review",
    alert_type: "scam",
    group_id: "group-jobs-nyc",
    group_name: "Jobs & Careers NYC",
    message_id: "msg-seed-330",
    message_preview:
      "Send $200 gift card codes to unlock remote H-1B processing. Guaranteed approval.",
    reporter_name: "Chinedu A.",
    reported_user_name: "visa_fasttrack",
    reported_user_id: "user-seed-visa",
    reason: "scam",
    keyword_hit: "gift card",
    created_at: hoursAgo(14),
    resolved_at: null,
    resolution: null,
  },
  {
    id: "seed-msg-report-4",
    source: "seed",
    status: "pending_review",
    alert_type: "inappropriate",
    group_id: "group-faith-nyc",
    group_name: "Faith & Fellowship NYC",
    message_id: "msg-seed-441",
    message_preview: "Offensive media shared in a family-friendly faith thread.",
    reporter_name: "Pastor Emeka",
    reported_user_name: "guest_poster",
    reported_user_id: "user-seed-guest",
    reason: "inappropriate",
    keyword_hit: null,
    created_at: hoursAgo(26),
    resolved_at: null,
    resolution: null,
  },
  {
    id: "seed-msg-report-5",
    source: "seed",
    status: "resolved",
    alert_type: "off_topic",
    group_id: "group-foodie",
    group_name: "Naija Foodies NYC",
    message_id: "msg-seed-512",
    message_preview: "Crypto pump thread repeatedly posted outside Events.",
    reporter_name: "Moderator Bot",
    reported_user_name: "alpha_trades",
    reported_user_id: "user-seed-alpha",
    reason: "off_topic",
    keyword_hit: "crypto",
    created_at: hoursAgo(40),
    resolved_at: hoursAgo(30),
    resolution: "dismissed",
  },
];

const listingReasons: Array<ListingIssueReportItem["issue_type"]> = [
  "wrong_hours",
  "permanently_closed",
  "wrong_address_pin",
  "wrong_phone_link",
  "claim_dispute",
  "other",
];

export const SEED_LISTING_ISSUE_REPORTS: ListingIssueReportItem[] =
  FOUNDING_LISTINGS.map((store, index) => {
    const issue_type = listingReasons[index % listingReasons.length];
    return {
      id: `seed-listing-${store.id}`,
      source: "seed" as const,
      status: index === 4 ? ("resolved" as const) : ("pending" as const),
      issue_type,
      listing_id: store.id,
      listing_name: store.name,
      listing_handle: store.handle,
      listing_address: store.address,
      reporter_name: index % 2 === 0 ? "Community member" : "Business owner",
      details:
        issue_type === "claim_dispute"
          ? `Ownership dispute opened for ${store.name}. Please verify the claimant before approving.`
          : issue_type === "wrong_hours"
            ? `Reported hours look outdated for ${store.name}.`
            : issue_type === "permanently_closed"
              ? `Member says ${store.name} may be permanently closed.`
              : issue_type === "wrong_address_pin"
                ? `Map pin may be incorrect for ${store.address}.`
                : issue_type === "wrong_phone_link"
                  ? `Phone / Instagram link may be wrong for ${store.handle}.`
                  : `Other Explore listing issue for ${store.name}.`,
      created_at: hoursAgo(6 + index * 5),
      resolved_at: index === 4 ? hoursAgo(2) : null,
      resolution: index === 4 ? ("dismissed" as const) : null,
    };
  });
