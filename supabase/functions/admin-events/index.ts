import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PANEL_STATUSES = ["draft", "published", "hidden", "expired"] as const;
type PanelStatus = typeof PANEL_STATUSES[number];

const COVER_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_COVER_BYTES = 10 * 1024 * 1024;

type AdminRow = {
  id: string;
  uid: string | null;
  email: string | null;
  display_name: string | null;
  is_admin: boolean | null;
  role: string | null;
  account_status: string | null;
};

type EventPayload = {
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  venueName: string | null;
  address: string | null;
  neighborhood: string | null;
  borough: string | null;
  city: string | null;
  imageUrl: string | null;
  ticketUrl: string | null;
  organizerName: string | null;
  category: string | null;
  tags: string[];
  isFeatured: boolean;
  status: PanelStatus;
  region?: string | null;
  provider?: string | null;
};

type AdminEventsRequest = {
  action: "list" | "get" | "save" | "duplicate" | "create_cover_upload";
  targetId?: string;
  reason?: string;
  query?: string;
  statusFilter?: "all" | "upcoming" | "past" | "hidden" | "expired" | "draft" | "published";
  limit?: number;
  event?: EventPayload;
  coverUpload?: {
    fileName: string;
    mimeType: string;
    fileSize: number;
  };
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isUuid(value: string | undefined | null): value is string {
  return Boolean(value && UUID_PATTERN.test(value));
}

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().slice(0, max);
  return cleaned || null;
}

function panelToExternal(status: PanelStatus): {
  status: string;
  moderation_status: string;
  eventsStatus: string;
} {
  switch (status) {
    case "published":
      return {
        status: "approved",
        moderation_status: "approved",
        eventsStatus: "approved",
      };
    case "hidden":
      return {
        status: "hidden",
        moderation_status: "approved",
        eventsStatus: "hidden",
      };
    case "expired":
      return {
        status: "expired",
        moderation_status: "approved",
        eventsStatus: "expired",
      };
    case "draft":
    default:
      return {
        status: "draft",
        moderation_status: "pending",
        eventsStatus: "draft",
      };
  }
}

function externalToPanel(
  status: string | null,
  moderation: string | null,
): PanelStatus {
  const s = (status || "").toLowerCase();
  const m = (moderation || "").toLowerCase();
  if (s === "hidden") return "hidden";
  if (s === "expired") return "expired";
  if (s === "draft" || s === "pending" || m === "pending") return "draft";
  if (s === "rejected" || m === "rejected") return "hidden";
  if ((s === "approved" || s === "active" || !s) && m === "approved") {
    return "published";
  }
  return "draft";
}

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((tag) => String(tag || "").trim().toLowerCase().slice(0, 40))
    .filter(Boolean)
    .slice(0, 12);
}

function parseEventPayload(value: unknown): EventPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("event payload is required");
  }
  const body = value as Record<string, unknown>;
  const title = cleanText(body.title, 200);
  if (!title || title.length < 2) throw new Error("Title is required");

  const startsAt = cleanText(body.startsAt, 64);
  if (!startsAt || Number.isNaN(Date.parse(startsAt))) {
    throw new Error("A valid start date/time is required");
  }

  const endsAt = cleanText(body.endsAt, 64);
  if (endsAt) {
    if (Number.isNaN(Date.parse(endsAt))) {
      throw new Error("End date/time is invalid");
    }
    if (Date.parse(endsAt) < Date.parse(startsAt)) {
      throw new Error("End must be after start");
    }
  }

  const ticketUrl = cleanText(body.ticketUrl, 2048);
  if (ticketUrl) {
    try {
      const parsed = new URL(ticketUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Ticket/RSVP link must be http(s)");
      }
    } catch {
      throw new Error("Ticket/RSVP link must be a valid URL");
    }
  }

  const imageUrl = cleanText(body.imageUrl, 2048);
  if (imageUrl) {
    try {
      const parsed = new URL(imageUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Cover image URL must be http(s)");
      }
    } catch {
      throw new Error("Cover image URL must be a valid URL");
    }
  }

  const statusRaw = cleanText(body.status, 32) || "draft";
  if (!PANEL_STATUSES.includes(statusRaw as PanelStatus)) {
    throw new Error("Unsupported event status");
  }

  return {
    title,
    description: cleanText(body.description, 8000),
    startsAt,
    endsAt,
    venueName: cleanText(body.venueName, 200),
    address: cleanText(body.address, 300),
    neighborhood: cleanText(body.neighborhood, 120),
    borough: cleanText(body.borough, 80),
    city: cleanText(body.city, 120) || "New York",
    imageUrl,
    ticketUrl,
    organizerName: cleanText(body.organizerName, 160),
    category: cleanText(body.category, 80),
    tags: parseTags(body.tags),
    isFeatured: body.isFeatured === true,
    status: statusRaw as PanelStatus,
    region: cleanText(body.region, 40) || "nyc",
    provider: cleanText(body.provider, 40),
  };
}

function parseRequest(value: unknown): AdminEventsRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Request body must be a JSON object");
  }
  const body = value as Record<string, unknown>;
  const action = cleanText(body.action, 40);
  if (
    !action ||
    !["list", "get", "save", "duplicate", "create_cover_upload"].includes(
      action,
    )
  ) {
    throw new Error("Unsupported admin-events action");
  }

  const request: AdminEventsRequest = {
    action: action as AdminEventsRequest["action"],
    targetId: cleanText(body.targetId, 120) || undefined,
    reason: cleanText(body.reason, 500) || undefined,
    query: cleanText(body.query, 200) || undefined,
    statusFilter:
      (cleanText(body.statusFilter, 32) as AdminEventsRequest["statusFilter"]) ||
      "all",
    limit: typeof body.limit === "number"
      ? Math.min(Math.max(body.limit, 1), 200)
      : 100,
  };

  if (action !== "list" && action !== "save" && !request.targetId) {
    throw new Error("targetId is required");
  }
  if ((action === "get" || action === "duplicate" || action === "create_cover_upload") &&
    !isUuid(request.targetId)
  ) {
    throw new Error("A valid event UUID is required");
  }
  if (action === "save") {
    request.event = parseEventPayload(body.event);
    if (request.targetId && !isUuid(request.targetId)) {
      throw new Error("A valid event UUID is required when updating");
    }
  }
  if (action === "create_cover_upload") {
    const upload = body.coverUpload;
    if (!upload || typeof upload !== "object" || Array.isArray(upload)) {
      throw new Error("coverUpload is required");
    }
    const u = upload as Record<string, unknown>;
    const mimeType = cleanText(u.mimeType, 80);
    const fileName = cleanText(u.fileName, 200);
    const fileSize = typeof u.fileSize === "number" ? u.fileSize : 0;
    if (!mimeType || !COVER_MIME.has(mimeType)) {
      throw new Error("Cover must be JPG, PNG, WebP, or GIF");
    }
    if (!fileName) throw new Error("fileName is required");
    if (fileSize <= 0 || fileSize > MAX_COVER_BYTES) {
      throw new Error("Cover images must be 10 MB or smaller");
    }
    request.coverUpload = { fileName, mimeType, fileSize };
  }

  return request;
}

async function fetchAdmin(
  adminClient: SupabaseClient,
  userId: string,
): Promise<AdminRow | null> {
  const { data, error } = await adminClient
    .from("users")
    .select(
      "id, uid, email, display_name, is_admin, role, account_status",
    )
    .or(`id.eq.${userId},uid.eq.${userId}`)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error("Unable to verify administrator access");
  if (!data || (data.is_admin !== true && data.role !== "admin")) return null;
  if (data.account_status === "suspended") return null;
  const admin = data as AdminRow;
  return {
    ...admin,
    id: admin.uid && isUuid(admin.uid) ? admin.uid : admin.id,
  };
}

function mapEventRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    provider: row.provider,
    provider_id: row.provider_id,
    title: row.title,
    description: row.description,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    venue_name: row.venue_name,
    address: row.address ?? row.location ?? null,
    location: row.location,
    neighborhood: row.neighborhood,
    borough: row.borough,
    city: row.city,
    image_url: row.image_url,
    url: row.url,
    source_url: row.source_url,
    organizer_name: row.organizer_name,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags : [],
    is_featured: Boolean(row.is_featured),
    status: row.status,
    moderation_status: row.moderation_status,
    panel_status: externalToPanel(
      String(row.status ?? ""),
      String(row.moderation_status ?? ""),
    ),
    region: row.region,
    source: row.source,
    submitted_by: row.submitted_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function writeAudits(
  adminClient: SupabaseClient,
  actorId: string,
  action: string,
  eventId: string,
  outcome: "success" | "failure",
  reason: string | null,
  beforeRow: Record<string, unknown>,
  afterRow: Record<string, unknown>,
  metadata: Record<string, unknown> = {},
) {
  await adminClient.from("admin_audit_log").insert({
    actor_user_id: actorId,
    action,
    target_type: "event",
    target_id: eventId,
    outcome,
    reason,
    metadata,
  });
  await adminClient.from("admin_event_audit").insert({
    actor_user_id: actorId,
    action,
    event_id: eventId,
    outcome,
    reason,
    before_row: beforeRow,
    after_row: afterRow,
    metadata,
  });
}

function nyParts(iso: string): { eventDate: string; eventTime: string } {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value || "00";
  return {
    eventDate: `${get("year")}-${get("month")}-${get("day")}`,
    eventTime: `${get("hour")}:${get("minute")}:${get("second")}`,
  };
}

async function listEvents(
  adminClient: SupabaseClient,
  request: AdminEventsRequest,
) {
  let query = adminClient
    .from("external_events")
    .select(
      "id,provider,provider_id,title,description,starts_at,ends_at,venue_name,address,location,neighborhood,borough,city,image_url,url,source_url,organizer_name,category,tags,is_featured,status,moderation_status,region,source,submitted_by,created_at,updated_at",
    )
    .or("region.eq.nyc,region.is.null")
    .order("starts_at", { ascending: true })
    .limit(request.limit || 100);

  const filter = request.statusFilter || "all";
  const nowIso = new Date().toISOString();

  if (filter === "draft") {
    query = query.or(
      "status.eq.draft,status.eq.pending,moderation_status.eq.pending",
    );
  } else if (filter === "published") {
    query = query
      .eq("moderation_status", "approved")
      .in("status", ["approved", "active"]);
  } else if (filter === "hidden") {
    query = query.or("status.eq.hidden,status.eq.rejected,moderation_status.eq.rejected");
  } else if (filter === "expired") {
    query = query.eq("status", "expired");
  } else if (filter === "upcoming") {
    query = query
      .eq("moderation_status", "approved")
      .not("status", "in", "(expired,hidden,draft,pending,rejected)")
      .gte("starts_at", nowIso);
  } else if (filter === "past") {
    query = query.lt("starts_at", nowIso);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let rows = (data || []).map((row) => mapEventRow(row as Record<string, unknown>));
  const q = (request.query || "").trim().toLowerCase();
  if (q) {
    rows = rows.filter((row) =>
      [
        row.title,
        row.venue_name,
        row.city,
        row.borough,
        row.neighborhood,
        row.organizer_name,
        row.category,
        Array.isArray(row.tags) ? row.tags.join(" ") : "",
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }

  rows.sort((a, b) => {
    const aMs = Date.parse(String(a.starts_at || ""));
    const bMs = Date.parse(String(b.starts_at || ""));
    const now = Date.now();
    const aUpcoming = !Number.isNaN(aMs) && aMs >= now;
    const bUpcoming = !Number.isNaN(bMs) && bMs >= now;
    if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return aMs - bMs;
  });

  return { events: rows, count: rows.length };
}

async function getEvent(adminClient: SupabaseClient, targetId: string) {
  const { data, error } = await adminClient
    .from("external_events")
    .select(
      "id,provider,provider_id,title,description,starts_at,ends_at,venue_name,address,location,neighborhood,borough,city,image_url,url,source_url,organizer_name,category,tags,is_featured,status,moderation_status,region,source,submitted_by,created_at,updated_at",
    )
    .eq("id", targetId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Event was not found");
  return { event: mapEventRow(data as Record<string, unknown>) };
}

async function syncNativeEventsRow(
  adminClient: SupabaseClient,
  eventId: string,
  payload: EventPayload,
  mapped: ReturnType<typeof panelToExternal>,
  actorId: string,
) {
  const { eventDate, eventTime } = nyParts(payload.startsAt);
  const nativeRow = {
    id: eventId,
    title: payload.title,
    description: payload.description,
    category: payload.category || "Social",
    event_date: eventDate,
    event_time: eventTime,
    location: payload.address || payload.venueName || payload.city || "NYC",
    address: payload.address,
    borough: payload.borough,
    neighborhood: payload.neighborhood,
    image_url: payload.imageUrl,
    organizer_name: payload.organizerName,
    organizer_id: actorId,
    status: mapped.eventsStatus,
    is_featured: payload.isFeatured,
    venue_name: payload.venueName,
    city: payload.city || "New York",
    ticket_url: payload.ticketUrl,
    starts_at: payload.startsAt,
    ends_at: payload.endsAt,
    updated_at: new Date().toISOString(),
  };

  const { error } = await adminClient.from("events").upsert(nativeRow, {
    onConflict: "id",
  });
  if (error) {
    console.error("[admin-events] native events upsert failed", error.message);
  }
}

async function saveEvent(
  adminClient: SupabaseClient,
  actor: AdminRow,
  request: AdminEventsRequest,
) {
  const payload = request.event!;
  const mapped = panelToExternal(payload.status);
  const isUpdate = Boolean(request.targetId);
  const eventId = isUpdate ? request.targetId! : crypto.randomUUID();
  const provider = (payload.provider || "bawosocial").toLowerCase();
  const providerId = isUpdate
    ? undefined
    : provider === "bawosocial"
    ? `bawosocial_${eventId}`
    : `curated_${eventId}`;

  let beforeRow: Record<string, unknown> = {};
  if (isUpdate) {
    const { data: existing, error: existingError } = await adminClient
      .from("external_events")
      .select("*")
      .eq("id", eventId)
      .maybeSingle();
    if (existingError) throw new Error(existingError.message);
    if (!existing) throw new Error("Event was not found");
    beforeRow = existing as Record<string, unknown>;
  }

  const tags = payload.tags.length
    ? payload.tags
    : ["diaspora", "nigerian", "community"];

  const row: Record<string, unknown> = {
    id: eventId,
    title: payload.title,
    description: payload.description,
    starts_at: payload.startsAt,
    ends_at: payload.endsAt,
    venue_name: payload.venueName,
    location: payload.address || payload.venueName || payload.city,
    address: payload.address,
    borough: payload.borough,
    neighborhood: payload.neighborhood,
    city: payload.city || "New York",
    country: "US",
    image_url: payload.imageUrl,
    url: payload.ticketUrl,
    source_url: payload.ticketUrl,
    organizer_name: payload.organizerName,
    category: payload.category,
    tags,
    is_featured: payload.isFeatured,
    status: mapped.status,
    moderation_status: mapped.moderation_status,
    region: payload.region || "nyc",
    source: provider,
    updated_at: new Date().toISOString(),
  };

  if (!isUpdate) {
    row.provider = provider === "curated" ? "curated" : "bawosocial";
    row.provider_id = providerId;
    row.created_at = new Date().toISOString();
    row.submitted_by = actor.id;
  }

  const selectCols =
    "id,provider,provider_id,title,description,starts_at,ends_at,venue_name,address,location,neighborhood,borough,city,image_url,url,source_url,organizer_name,category,tags,is_featured,status,moderation_status,region,source,submitted_by,created_at,updated_at";

  const { data, error } = isUpdate
    ? await adminClient
      .from("external_events")
      .update(row)
      .eq("id", eventId)
      .select(selectCols)
      .maybeSingle()
    : await adminClient
      .from("external_events")
      .insert(row)
      .select(selectCols)
      .maybeSingle();

  if (error || !data) {
    throw new Error(error?.message || "Unable to save event");
  }

  // Keep native events + public_events in sync for bawosocial rows only.
  // Curated/external providers must not insert a colliding events.id row.
  const shouldSyncNative =
    String(data.provider) === "bawosocial" ||
    String(beforeRow.provider || "") === "bawosocial";
  if (shouldSyncNative) {
    await syncNativeEventsRow(adminClient, eventId, payload, mapped, actor.id);
  }

  await writeAudits(
    adminClient,
    actor.id,
    isUpdate ? "save_event" : "create_event",
    eventId,
    "success",
    request.reason || null,
    beforeRow,
    data as Record<string, unknown>,
    { panelStatus: payload.status },
  );

  return { event: mapEventRow(data as Record<string, unknown>) };
}

async function duplicateEvent(
  adminClient: SupabaseClient,
  actor: AdminRow,
  request: AdminEventsRequest,
) {
  const { event } = await getEvent(adminClient, request.targetId!);
  const startsAt = event.starts_at
    ? new Date(String(event.starts_at))
    : new Date();
  startsAt.setDate(startsAt.getDate() + 7);
  const endsAt = event.ends_at ? new Date(String(event.ends_at)) : null;
  if (endsAt) endsAt.setDate(endsAt.getDate() + 7);

  return saveEvent(adminClient, actor, {
    action: "save",
    reason: request.reason || `Duplicated from ${request.targetId}`,
    event: {
      title: `${String(event.title || "Event")} (copy)`,
      description: (event.description as string | null) || null,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt ? endsAt.toISOString() : null,
      venueName: (event.venue_name as string | null) || null,
      address: (event.address as string | null) || null,
      neighborhood: (event.neighborhood as string | null) || null,
      borough: (event.borough as string | null) || null,
      city: (event.city as string | null) || "New York",
      imageUrl: (event.image_url as string | null) || null,
      ticketUrl: (event.url as string | null) || null,
      organizerName: (event.organizer_name as string | null) || null,
      category: (event.category as string | null) || null,
      tags: Array.isArray(event.tags) ? event.tags as string[] : [],
      isFeatured: false,
      status: "draft",
      region: (event.region as string | null) || "nyc",
      provider: "bawosocial",
    },
  });
}

async function createCoverUpload(
  adminClient: SupabaseClient,
  actor: AdminRow,
  request: AdminEventsRequest,
) {
  const upload = request.coverUpload!;
  const eventId = request.targetId!;
  const { data: existing, error: existingError } = await adminClient
    .from("external_events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();
  if (existingError || !existing) throw new Error("Event was not found");

  const extension = upload.mimeType === "image/jpeg"
    ? "jpg"
    : upload.mimeType.split("/")[1];
  const path =
    `control-center/${eventId}/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await adminClient.storage
    .from("event-images")
    .createSignedUploadUrl(path);
  if (error || !data?.signedUrl) {
    throw new Error("Unable to create a secure cover upload");
  }

  const publicUrl =
    `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/event-images/${path}`;

  await writeAudits(
    adminClient,
    actor.id,
    "create_event_cover_upload",
    eventId,
    "success",
    request.reason || null,
    {},
    { path, publicUrl },
    { mimeType: upload.mimeType, fileSize: upload.fileSize },
  );

  return {
    signedUrl: data.signedUrl,
    path,
    publicUrl,
    fileName: upload.fileName,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json(405, { success: false, error: "Method not allowed" });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    if (!supabaseUrl || !serviceKey) {
      throw new Error("Supabase environment is not configured");
    }

    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!jwt) return json(401, { success: false, error: "Sign in required" });

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return json(401, { success: false, error: "Invalid session" });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const actor = await fetchAdmin(adminClient, userData.user.id);
    if (!actor) {
      return json(403, {
        success: false,
        error: "Administrator access required",
      });
    }

    const request = parseRequest(await req.json());
    let data: Record<string, unknown>;

    switch (request.action) {
      case "list":
        data = await listEvents(adminClient, request);
        break;
      case "get":
        data = await getEvent(adminClient, request.targetId!);
        break;
      case "save":
        data = await saveEvent(adminClient, actor, request);
        break;
      case "duplicate":
        data = await duplicateEvent(adminClient, actor, request);
        break;
      case "create_cover_upload":
        data = await createCoverUpload(adminClient, actor, request);
        break;
      default:
        throw new Error("Unsupported action");
    }

    return json(200, { success: true, data });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Admin events request failed";
    console.error("[admin-events]", message);
    return json(400, { success: false, error: message });
  }
});
