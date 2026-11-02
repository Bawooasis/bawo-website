import { useState } from "react";
import EventsPanel from "./EventsPanel";
import type { ManagedEvent, ManagedEventInput } from "../types";
import "../portal.css";

const fixtureEvents: ManagedEvent[] = [
  {
    id: "f5dc04c9-cdd3-4108-9244-72a21f85fe8c",
    provider: "curated",
    provider_id: "halloween-afterdark-2026-cigarro-p-la-cangri",
    title: "La Cangri · Halloween AfterDark",
    description: "Curated NYC Culture Hub spotlight event.",
    starts_at: "2026-11-01T04:00:00.000Z",
    ends_at: "2026-11-01T08:00:00.000Z",
    venue_name: "Cigarro",
    address: "Brooklyn, NY",
    location: "Brooklyn, NY",
    neighborhood: "Williamsburg",
    borough: "Brooklyn",
    city: "New York",
    image_url: null,
    url: "https://www.joinbawo.com",
    source_url: "https://www.joinbawo.com",
    organizer_name: "La Cangri",
    category: "nightlife",
    tags: ["diaspora", "nightlife"],
    is_featured: true,
    status: "approved",
    moderation_status: "approved",
    panel_status: "published",
    region: "nyc",
    source: "curated",
    submitted_by: null,
    created_at: "2026-10-01T00:00:00.000Z",
    updated_at: "2026-10-01T00:00:00.000Z",
  },
  {
    id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
    provider: "bawosocial",
    provider_id: "bawosocial_aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
    title: "Afrobeats Night Draft",
    description: "Draft event waiting for publish.",
    starts_at: "2026-12-12T01:00:00.000Z",
    ends_at: null,
    venue_name: "Elsewhere",
    address: "599 Johnson Ave",
    location: "599 Johnson Ave",
    neighborhood: "Bushwick",
    borough: "Brooklyn",
    city: "New York",
    image_url: null,
    url: null,
    source_url: null,
    organizer_name: "BawoSocial",
    category: "Social",
    tags: ["diaspora", "afrobeats"],
    is_featured: false,
    status: "draft",
    moderation_status: "pending",
    panel_status: "draft",
    region: "nyc",
    source: "bawosocial",
    submitted_by: null,
    created_at: "2026-11-01T00:00:00.000Z",
    updated_at: "2026-11-01T00:00:00.000Z",
  },
];

/** Local QA harness for Events Manager screenshots (not linked from nav). */
export default function EventsUiPreview() {
  const [events, setEvents] = useState(fixtureEvents);

  return (
    <div className="portal-shell" style={{ minHeight: "100vh", padding: "1rem" }}>
      <EventsPanel
        busy={false}
        events={events}
        onRefresh={async () => undefined}
        onSave={async (input: ManagedEventInput, eventId?: string) => {
          if (!eventId) {
            setEvents((current) => [
              {
                ...fixtureEvents[1],
                id: crypto.randomUUID(),
                title: input.title,
                description: input.description,
                starts_at: input.startsAt,
                ends_at: input.endsAt,
                venue_name: input.venueName,
                address: input.address,
                neighborhood: input.neighborhood,
                borough: input.borough,
                city: input.city,
                image_url: input.imageUrl,
                url: input.ticketUrl,
                organizer_name: input.organizerName,
                category: input.category,
                tags: input.tags,
                is_featured: input.isFeatured,
                status: input.status === "published" ? "approved" : input.status,
                moderation_status:
                  input.status === "published" || input.status === "hidden"
                    ? "approved"
                    : "pending",
                panel_status: input.status,
              },
              ...current,
            ]);
          } else {
            setEvents((current) =>
              current.map((event) =>
                event.id === eventId
                  ? {
                    ...event,
                    title: input.title,
                    description: input.description,
                    starts_at: input.startsAt,
                    ends_at: input.endsAt,
                    venue_name: input.venueName,
                    address: input.address,
                    neighborhood: input.neighborhood,
                    borough: input.borough,
                    city: input.city,
                    image_url: input.imageUrl,
                    url: input.ticketUrl,
                    organizer_name: input.organizerName,
                    category: input.category,
                    tags: input.tags,
                    is_featured: input.isFeatured,
                    panel_status: input.status,
                  }
                  : event
              )
            );
          }
          return true;
        }}
        onDuplicate={async (eventId) => {
          const source = events.find((event) => event.id === eventId);
          if (!source) return false;
          setEvents((current) => [
            {
              ...source,
              id: crypto.randomUUID(),
              title: `${source.title} (copy)`,
              panel_status: "draft",
              status: "draft",
              moderation_status: "pending",
              is_featured: false,
            },
            ...current,
          ]);
          return true;
        }}
        onUploadCover={async () => null}
      />
    </div>
  );
}
