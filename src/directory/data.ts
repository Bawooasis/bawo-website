import { makeSlug, matchesSlugId } from "./slug";
import { fetchTableCount, fetchTableRows } from "./supabasePublic";
import type {
  BoroughFilter,
  DirectoryCategoryTab,
  EventRecord,
  PlaceRecord,
} from "./types";

type CommunityResourceRow = {
  id: string;
  category: string;
  name: string;
  location: string | null;
  neighborhood: string | null;
  borough: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  image_url: string | null;
  metadata: Record<string, unknown> | null;
  function: string | null;
};

type NigerianRestaurantRow = {
  id: string;
  name: string;
  borough: string | null;
  neighborhood: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  image_url: string | null;
  cuisine_type: string | null;
  category: string | null;
  rating: number | string | null;
  price_range: string | null;
  hours: string | null;
  is_open: boolean | null;
  is_active: boolean | null;
};

type ExternalEventRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  venue_name: string | null;
  city: string | null;
  location: string | null;
  image_url: string | null;
  url: string | null;
  promoter_ticket_url: string | null;
  tags: string[] | null;
  category: string | null;
  moderation_status: string | null;
  status: string | null;
};

const FOOD_CATS = new Set([
  "food",
  "restaurant",
  "restaurants",
  "dining",
  "cafe",
  "bar",
]);
const BEAUTY_CATS = new Set([
  "beauty",
  "salon",
  "salons",
  "braiding",
  "barbershop",
  "spa",
]);
const STORE_CATS = new Set(["store", "stores", "market", "markets", "grocery"]);
const SERVICE_CATS = new Set([
  "service",
  "services",
  "mental health",
  "legal",
  "logistics",
  "nin",
  "consulate services",
  "community",
  "explore",
]);

export function normalizeCategoryLabel(raw: string | null | undefined): string {
  const value = (raw || "").trim();
  if (!value) return "Services";
  const lower = value.toLowerCase();
  if (lower === "store" || lower === "stores") return "Stores";
  if (lower === "restaurant" || lower === "restaurants") return "Restaurants";
  if (lower === "food") return "Food";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function categoryGroupFor(
  category: string | null | undefined,
): DirectoryCategoryTab {
  const key = (category || "").trim().toLowerCase();
  if (FOOD_CATS.has(key)) return "food";
  if (BEAUTY_CATS.has(key)) return "beauty";
  if (STORE_CATS.has(key)) return "stores";
  if (SERVICE_CATS.has(key)) return "services";
  if (key.includes("food") || key.includes("restaurant")) return "food";
  if (key.includes("beauty") || key.includes("salon") || key.includes("braid"))
    return "beauty";
  if (key.includes("store") || key.includes("market")) return "stores";
  return "services";
}

export function hasLagosInTitle(title: string | null | undefined): boolean {
  return /\blagos\b/i.test(title || "");
}

export function deriveEventTags(event: {
  title: string;
  description?: string | null;
  category?: string | null;
  tags?: string[] | null;
  venueName?: string | null;
}): string[] {
  const existing = (event.tags || [])
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (existing.length) {
    return Array.from(new Set(existing)).slice(0, 4);
  }

  const haystack = [
    event.title,
    event.description || "",
    event.category || "",
    event.venueName || "",
  ]
    .join(" ")
    .toLowerCase();

  const dictionary: Array<[string, RegExp]> = [
    ["afrobeats", /afrobeats?|amapiano|afrobeat/],
    ["owambe", /owambe|party|nightlife|club/],
    ["suya", /suya|jollof|food|dinner|supper/],
    ["culture", /culture|independence|heritage|naija/],
    ["networking", /mixer|founder|networking|professional/],
    ["faith", /church|mosque|faith|worship/],
    ["dance", /dance|soca|reggae|hip.?hop/],
  ];

  const derived = dictionary
    .filter(([, re]) => re.test(haystack))
    .map(([tag]) => tag);

  if (!derived.length) derived.push("nyc");
  return derived.slice(0, 4);
}

function normalizeBorough(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const v = raw.trim();
  const lower = v.toLowerCase();
  if (lower.includes("brooklyn")) return "Brooklyn";
  if (lower.includes("queens")) return "Queens";
  if (lower.includes("bronx")) return "Bronx";
  if (lower.includes("staten")) return "Staten Island";
  if (
    lower.includes("manhattan") ||
    lower.includes("harlem") ||
    lower.includes("midtown") ||
    lower.includes("downtown")
  )
    return "Manhattan";
  if (
    lower.includes("jersey") ||
    lower === "nj" ||
    lower.includes("newark") ||
    lower.includes("jersey city")
  )
    return "New Jersey";
  return v;
}

function mapRestaurant(row: NigerianRestaurantRow): PlaceRecord | null {
  if (hasLagosInTitle(row.name)) return null;
  if (row.is_active === false) return null;
  const category = normalizeCategoryLabel(row.category || "Restaurants");
  return {
    id: row.id,
    source: "nigerian_restaurants",
    slug: makeSlug(row.name, row.id),
    name: row.name,
    category,
    categoryGroup: categoryGroupFor(category),
    borough: normalizeBorough(row.borough),
    neighborhood: row.neighborhood,
    address: row.address,
    phone: row.phone,
    website: row.website,
    description: row.description,
    imageUrl: row.image_url,
    rating: row.rating == null ? null : Number(row.rating),
    priceRange: row.price_range,
    cuisine: row.cuisine_type,
    hours: row.hours,
    isOpen: row.is_open,
    location: row.address,
  };
}

function mapResource(row: CommunityResourceRow): PlaceRecord | null {
  if (hasLagosInTitle(row.name)) return null;
  const category = normalizeCategoryLabel(row.category);
  const hours =
    typeof row.metadata?.hours === "string" ? row.metadata.hours : null;
  const isOpen =
    typeof row.metadata?.verified_open === "boolean"
      ? row.metadata.verified_open
      : null;
  return {
    id: row.id,
    source: "community_resources",
    slug: makeSlug(row.name, row.id),
    name: row.name,
    category,
    categoryGroup: categoryGroupFor(category),
    borough: normalizeBorough(row.borough || row.location),
    neighborhood: row.neighborhood,
    address: row.address,
    phone: row.phone,
    website: row.website,
    description: row.description || row.function,
    imageUrl: row.image_url,
    rating: null,
    priceRange: null,
    cuisine: null,
    hours,
    isOpen,
    location: row.location || row.address,
  };
}

function mapEvent(row: ExternalEventRow): EventRecord | null {
  if (hasLagosInTitle(row.title)) return null;
  const status = (row.moderation_status || "").toLowerCase();
  if (status && !["approved", "auto_approved", "published", ""].includes(status)) {
    // Still show synced feed events that aren't rejected/pending community submissions
    if (["rejected", "pending", "removed", "hidden"].includes(status)) {
      return null;
    }
  }
  const tags = deriveEventTags({
    title: row.title,
    description: row.description,
    category: row.category,
    tags: row.tags,
    venueName: row.venue_name,
  });
  return {
    id: row.id,
    slug: makeSlug(row.title, row.id),
    title: row.title,
    description: row.description,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    venueName: row.venue_name,
    city: row.city,
    location: row.location,
    imageUrl: row.image_url,
    url: row.url,
    ticketUrl: row.promoter_ticket_url || row.url,
    tags,
    category: row.category,
    moderationStatus: row.moderation_status,
  };
}

export async function loadPlaces(): Promise<PlaceRecord[]> {
  const [restaurants, resources] = await Promise.all([
    fetchTableRows<NigerianRestaurantRow>(
      "nigerian_restaurants",
      "select=id,name,borough,neighborhood,address,phone,website,description,image_url,cuisine_type,category,rating,price_range,hours,is_open,is_active&order=name.asc&limit=500",
    ).catch(() => [] as NigerianRestaurantRow[]),
    fetchTableRows<CommunityResourceRow>(
      "community_resources",
      "select=id,category,name,location,neighborhood,borough,address,phone,website,description,image_url,metadata,function&order=name.asc&limit=500",
    ).catch(() => [] as CommunityResourceRow[]),
  ]);

  const restaurantPlaces = restaurants
    .map(mapRestaurant)
    .filter((p): p is PlaceRecord => Boolean(p));
  const restaurantNames = new Set(
    restaurantPlaces.map((p) => p.name.toLowerCase()),
  );

  const resourcePlaces = resources
    .map(mapResource)
    .filter((p): p is PlaceRecord => Boolean(p))
    .filter((p) => !restaurantNames.has(p.name.toLowerCase()));

  return [...restaurantPlaces, ...resourcePlaces];
}

export async function loadEvents(): Promise<EventRecord[]> {
  const nowIso = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const rows = await fetchTableRows<ExternalEventRow>(
    "external_events",
    `select=id,title,description,starts_at,ends_at,venue_name,city,location,image_url,url,promoter_ticket_url,tags,category,moderation_status,status&starts_at=gte.${nowIso}&order=starts_at.asc&limit=200`,
  ).catch(() => [] as ExternalEventRow[]);

  return rows.map(mapEvent).filter((e): e is EventRecord => Boolean(e));
}

export async function loadPlaceBySlug(
  slug: string,
): Promise<PlaceRecord | null> {
  const places = await loadPlaces();
  return places.find((p) => p.slug === slug || matchesSlugId(p.id, slug)) || null;
}

export async function loadEventBySlug(
  slug: string,
): Promise<EventRecord | null> {
  // Prefer near-term ascending window so popular/upcoming events are not
  // pushed out by far-future rows when ordering desc.
  const fromIso = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const rows = await fetchTableRows<ExternalEventRow>(
    "external_events",
    `select=id,title,description,starts_at,ends_at,venue_name,city,location,image_url,url,promoter_ticket_url,tags,category,moderation_status,status&starts_at=gte.${fromIso}&order=starts_at.asc&limit=1000`,
  ).catch(() => [] as ExternalEventRow[]);

  const events = rows.map(mapEvent).filter((e): e is EventRecord => Boolean(e));
  const exact =
    events.find((e) => e.slug === slug || matchesSlugId(e.id, slug)) || null;
  if (exact) return exact;

  // Fallback: title search from slug words (for deep links outside the window)
  const tip = slug.replace(/-[a-f0-9]{6,8}$/i, "").replace(/-/g, " ").trim();
  if (!tip) return null;
  const fallback = await fetchTableRows<ExternalEventRow>(
    "external_events",
    `select=id,title,description,starts_at,ends_at,venue_name,city,location,image_url,url,promoter_ticket_url,tags,category,moderation_status,status&title=ilike.*${encodeURIComponent(tip.split(" ").slice(0, 4).join("%"))}*&order=starts_at.asc&limit=20`,
  ).catch(() => [] as ExternalEventRow[]);
  return (
    fallback
      .map(mapEvent)
      .filter((e): e is EventRecord => Boolean(e))
      .find((e) => e.slug === slug || matchesSlugId(e.id, slug)) || null
  );
}

export function filterPlaces(
  places: PlaceRecord[],
  opts: {
    query?: string;
    category?: DirectoryCategoryTab;
    borough?: BoroughFilter;
    openNow?: boolean;
  },
): PlaceRecord[] {
  const q = (opts.query || "").trim().toLowerCase();
  return places.filter((place) => {
    if (opts.category && opts.category !== "everything" && opts.category !== "events") {
      if (place.categoryGroup !== opts.category) return false;
    }
    if (opts.borough && opts.borough !== "all") {
      if ((place.borough || "") !== opts.borough) return false;
    }
    if (opts.openNow && place.isOpen === false) return false;
    if (q) {
      const blob = [
        place.name,
        place.category,
        place.neighborhood,
        place.borough,
        place.cuisine,
        place.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

export function filterEvents(
  events: EventRecord[],
  opts: {
    query?: string;
    borough?: BoroughFilter;
    thisWeekend?: boolean;
  },
): EventRecord[] {
  const q = (opts.query || "").trim().toLowerCase();
  const weekend = opts.thisWeekend ? weekendRange() : null;

  return events.filter((event) => {
    if (weekend) {
      const t = new Date(event.startsAt).getTime();
      if (t < weekend.start || t > weekend.end) return false;
    }
    if (opts.borough && opts.borough !== "all") {
      const blob = `${event.city || ""} ${event.location || ""} ${event.venueName || ""}`;
      if (!boroughMatchesText(opts.borough, blob)) return false;
    }
    if (q) {
      const blob = [
        event.title,
        event.description,
        event.venueName,
        event.city,
        event.tags.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

function weekendRange(): { start: number; end: number } {
  const now = new Date();
  const day = now.getDay(); // 0 Sun
  const toFriday = (5 - day + 7) % 7;
  const friday = new Date(now);
  friday.setHours(0, 0, 0, 0);
  friday.setDate(now.getDate() + (day === 5 || day === 6 || day === 0 ? (day === 5 ? 0 : day === 6 ? -1 : -2) : toFriday));
  const end = new Date(friday);
  end.setDate(friday.getDate() + 3);
  end.setHours(6, 0, 0, 0);
  return { start: friday.getTime(), end: end.getTime() };
}

function boroughMatchesText(borough: BoroughFilter, text: string): boolean {
  const t = text.toLowerCase();
  switch (borough) {
    case "Brooklyn":
      return t.includes("brooklyn") || t.includes("bk");
    case "Queens":
      return t.includes("queens");
    case "Bronx":
      return t.includes("bronx");
    case "Staten Island":
      return t.includes("staten");
    case "New Jersey":
      return t.includes("jersey") || t.includes(" newark") || t.includes("nj");
    case "Manhattan":
      return (
        t.includes("manhattan") ||
        t.includes("harlem") ||
        t.includes("new york") ||
        t.includes("nyc")
      );
    default:
      return true;
  }
}

export async function loadGrowthSnapshot(): Promise<{
  signups: number;
  listings: number;
  events: number;
  recentSignups: Array<{ created_at: string }>;
}> {
  const [signups, listings, restaurants, upcomingEvents, recent] =
    await Promise.all([
      fetchTableCount("users", "select=id").catch(() => 0),
      fetchTableCount("community_resources", "select=id").catch(() => 0),
      fetchTableCount(
        "nigerian_restaurants",
        "select=id&is_active=eq.true",
      ).catch(() => 0),
      fetchTableCount(
        "external_events",
        `select=id&starts_at=gte.${new Date().toISOString()}`,
      ).catch(() => 0),
      fetchTableRows<{ created_at: string }>(
        "users",
        "select=created_at&order=created_at.desc&limit=30",
      ).catch(() => [] as Array<{ created_at: string }>),
    ]);

  return {
    signups,
    listings: listings + restaurants,
    events: upcomingEvents,
    recentSignups: recent,
  };
}

export const DIRECTORY_TABS: Array<{
  id: DirectoryCategoryTab;
  label: string;
}> = [
  { id: "everything", label: "Everything" },
  { id: "events", label: "Events" },
  { id: "food", label: "Food & drink" },
  { id: "beauty", label: "Beauty & salons" },
  { id: "stores", label: "Stores & markets" },
  { id: "services", label: "Services" },
];

export const BOROUGH_CHIPS: BoroughFilter[] = [
  "all",
  "Brooklyn",
  "Manhattan",
  "Queens",
  "Bronx",
  "Staten Island",
  "New Jersey",
];
