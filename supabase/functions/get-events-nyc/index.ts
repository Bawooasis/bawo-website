import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/** List endpoint — keep payloads small for mobile cold start (was 300 + select *). */
const MAX_EVENTS_LIMIT = 80;
const DESCRIPTION_SNIPPET_CHARS = 280;
const LATIN_EXCLUSION_TERMS = [
  "reggaeton",
  "salsa",
  "bachata",
  "merengue",
  "cumbia",
  "enamore",
  "enamor",
  "perreo",
  "banda",
  "corrido",
  "vallenato",
  "dembow",
  "champeta",
  "latin",
  "latino",
  "latina",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    if (!supabaseUrl) {
      throw new Error("Supabase URL missing");
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey || supabaseAnonKey,
    );

    const url = new URL(req.url);
    let filterTags = url.searchParams.get("tags");
    let onlyUpcoming = url.searchParams.get("upcoming") !== "false";
    let filterProvider = url.searchParams.get("provider");
    let onlyFeatured = url.searchParams.get("featured") === "true";

    if (req.method === "POST") {
      try {
        const bodyText = await req.text();
        if (bodyText) {
          const body = JSON.parse(bodyText);
          if (body.tags !== undefined) {
            filterTags = Array.isArray(body.tags)
              ? body.tags.join(",")
              : body.tags;
          }
          if (body.upcoming !== undefined) {
            onlyUpcoming = body.upcoming !== false;
          }
          if (body.provider !== undefined) {
            filterProvider = body.provider;
          }
          if (body.featured !== undefined) {
            onlyFeatured = body.featured === true;
          }
        }
      } catch (e) {
        console.log("⚠️ Could not parse request body, using URL params:", e);
      }
    }

    // Provider-agnostic NYC list: approved rows from any source tagged nyc
    // (or legacy null region). Nigeria inventory uses region='nigeria' and must not leak here.
    // Panel visibility: exclude draft / hidden / expired / pending / rejected statuses.
    let query = supabase
      .from("external_events")
      .select(
        "id,provider_id,title,description,starts_at,ends_at,venue_name,city,location,address,borough,neighborhood,organizer_name,image_url,url,source,provider,region,tags,is_featured,category,status,moderation_status",
      )
      .eq("moderation_status", "approved")
      .or("region.eq.nyc,region.is.null")
      .not("status", "in", "(expired,hidden,draft,pending,rejected)");

    if (filterProvider) {
      query = query.eq("provider", filterProvider);
    }

    console.log("🔍 Query params:", {
      onlyUpcoming,
      filterTags,
      filterProvider,
      onlyFeatured,
      region: "nyc|null",
    });

    if (filterTags) {
      const tagsArray = filterTags.split(",").map((t) => t.trim());
      console.log("🏷️ Filtering by tags:", tagsArray);
      query = query.overlaps("tags", tagsArray);
    }

    if (onlyFeatured) {
      query = query.eq("is_featured", true);
    }

    query = query.order("is_featured", { ascending: false, nullsFirst: false });
    query = query.order("starts_at", { ascending: true });
    query = query.limit(MAX_EVENTS_LIMIT);

    console.log("🔍 Executing query...");
    const { data: events, error } = await query;

    console.log("📊 Query result:", {
      eventCount: events?.length || 0,
      error: error?.message || null,
      firstEvent: events?.[0]
        ? {
          id: events[0].id,
          title: events[0].title,
          starts_at: events[0].starts_at,
          provider: events[0].provider,
        }
        : null,
    });

    if (error) {
      throw error;
    }

    const isLatinEvent = (event: any): boolean => {
      const text =
        `${event?.title || ""} ${event?.venue_name || ""} ${(event?.tags || []).join(" ")}`
          .toLowerCase();
      return LATIN_EXCLUSION_TERMS.some((term) => text.includes(term));
    };

    const isNycScopedEvent = (event: any): boolean => {
      const region = String(event?.region || "").toLowerCase().trim();
      if (region === "nyc") return true;
      if (region && region !== "nyc") return false;
      const loc =
        `${event?.city || ""} ${event?.location || ""} ${event?.venue_name || ""}`
          .toLowerCase();
      if (
        /\b(lagos|abuja|nigeria|ibadan|port harcourt|lekki|victoria island)\b/
          .test(loc)
      ) {
        return false;
      }
      return true;
    };

    const nowMs = Date.now();
    const filtered = (events || [])
      .filter((event: any) =>
        event?.starts_at && !Number.isNaN(Date.parse(event.starts_at))
      )
      .filter((event: any) => {
        if (!onlyUpcoming) return true;
        const endMs = event.ends_at
          ? Date.parse(event.ends_at)
          : Date.parse(event.starts_at);
        return !Number.isNaN(endMs) && endMs > nowMs;
      })
      .filter((event: any) => isNycScopedEvent(event))
      .filter((event: any) => !isLatinEvent(event));

    filtered.sort((a: any, b: any) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return String(a.starts_at || "").localeCompare(String(b.starts_at || ""));
    });

    const deduped = Array.from(
      new Map(
        filtered.map((event: any) => {
          const normalizedTitle = (event.title || "").trim().toLowerCase();
          const normalizedVenue = (event.venue_name || event.city || "")
            .trim()
            .toLowerCase();
          const eventDate = event.starts_at ? event.starts_at.slice(0, 10) : "";
          const key = `${normalizedTitle}|${normalizedVenue}|${eventDate}`;
          return [key, event];
        }),
      ).values(),
    );

    const mappedEvents = deduped.map((event) => {
      const rawDesc = typeof event.description === "string"
        ? event.description
        : "";
      const description = rawDesc
        ? rawDesc
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, DESCRIPTION_SNIPPET_CHARS)
        : "";
      return {
        id: event.id,
        provider_id: event.provider_id,
        title: event.title,
        description,
        starts_at: event.starts_at,
        ends_at: event.ends_at,
        venue_name: event.venue_name,
        city: event.city,
        location: event.location,
        address: event.address || null,
        borough: event.borough || null,
        neighborhood: event.neighborhood || null,
        organizer_name: event.organizer_name || null,
        image_url: event.image_url,
        url: event.url,
        source: event.source,
        provider: event.provider,
        region: event.region,
        tags: Array.isArray(event.tags) ? event.tags.slice(0, 12) : [],
        is_featured: event.is_featured || false,
        category: event.category || null,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        events: mappedEvents,
        count: mappedEvents.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("❌ Error fetching NYC events:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to fetch events",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
