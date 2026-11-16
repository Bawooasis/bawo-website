import { Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DirectoryShell from "../directory/DirectoryShell";
import {
  BOROUGH_CHIPS,
  DIRECTORY_TABS,
  filterEvents,
  filterPlaces,
  loadEvents,
  loadPlaces,
} from "../directory/data";
import type {
  BoroughFilter,
  DirectoryCategoryTab,
  EventRecord,
  PlaceRecord,
} from "../directory/types";

function formatEventWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function PlaceCard({ place }: { place: PlaceRecord }) {
  return (
    <a href={`/places/${place.slug}`} className="dir-card dir-place-card block">
      <div className="dir-place-card__media">
        {place.imageUrl ? (
          <img src={place.imageUrl} alt="" loading="lazy" decoding="async" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#F7E7C4]/45">
            {place.category}
          </div>
        )}
      </div>
      <div className="dir-card__body">
        <h3>{place.name}</h3>
        <p className="dir-card__meta">
          {[place.category, place.neighborhood || place.borough]
            .filter(Boolean)
            .join(" · ")}
          {place.rating != null ? ` · ★ ${place.rating.toFixed(1)}` : ""}
          {place.priceRange ? ` · ${place.priceRange}` : ""}
        </p>
      </div>
    </a>
  );
}

function EventCard({ event }: { event: EventRecord }) {
  return (
    <a href={`/e/${event.slug}`} className="dir-card dir-event-card block">
      <div className="dir-event-card__media">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt="" loading="lazy" decoding="async" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#F7E7C4]/45">
            Event
          </div>
        )}
      </div>
      <div className="dir-card__body">
        <h3>{event.title}</h3>
        <p className="dir-card__meta">
          {formatEventWhen(event.startsAt)}
          {event.venueName ? ` · ${event.venueName}` : ""}
        </p>
        {event.tags.length ? (
          <div className="dir-tag-row">
            {event.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="dir-tag">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </a>
  );
}

export default function NycDirectoryPage() {
  const [places, setPlaces] = useState<PlaceRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DirectoryCategoryTab>("everything");
  const [borough, setBorough] = useState<BoroughFilter>("all");
  const [openNow, setOpenNow] = useState(false);
  const [thisWeekend, setThisWeekend] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, e] = await Promise.all([loadPlaces(), loadEvents()]);
        if (cancelled) return;
        setPlaces(p);
        setEvents(e);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load directory");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash === "#events") {
      document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

  const weekendEvents = useMemo(
    () =>
      filterEvents(events, {
        query,
        borough,
        thisWeekend: true,
      }).slice(0, 8),
    [events, query, borough],
  );

  const filteredEvents = useMemo(
    () =>
      filterEvents(events, {
        query,
        borough,
        thisWeekend,
      }),
    [events, query, borough, thisWeekend],
  );

  const savedPlaces = useMemo(() => {
    const foodAndStores = filterPlaces(places, {
      query,
      borough,
      openNow,
      category:
        category === "everything" || category === "events" ? undefined : category,
    }).filter((p) => p.categoryGroup === "food" || p.categoryGroup === "stores");
    const withImages = foodAndStores.filter((p) => p.imageUrl);
    const pool = withImages.length >= 4 ? withImages : foodAndStores;
    return pool.slice(0, 8);
  }, [places, query, borough, openNow, category]);

  const servicePlaces = useMemo(
    () =>
      filterPlaces(places, {
        query,
        borough,
        openNow,
        category: "services",
      }).slice(0, 8),
    [places, query, borough, openNow],
  );

  const showEvents =
    category === "everything" || category === "events" || thisWeekend;
  const showPlaces = category !== "events";

  return (
    <DirectoryShell active="nyc">
      <section className="dir-hero">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D6B26A]/30 bg-[#1C132B]/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#D6B26A]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          NYC Culture Directory
        </p>
        <h1>
          <span className="dir-gold-text">Nigerian &amp; Afro NYC,</span> all in
          one place.
        </h1>
        <p>
          Discover curated events, restaurants, markets, and community services
          across all five boroughs and New Jersey — then Join BawoSocial to save
          what you love.
        </p>

        <div className="dir-search">
          <label className="dir-search__field">
            <Search className="h-4 w-4 text-[#D6B26A]" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search places, events, neighborhoods…"
              aria-label="Search the NYC directory"
            />
          </label>
        </div>

        <div className="dir-tabs" role="tablist" aria-label="Categories">
          {DIRECTORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={category === tab.id}
              className={`dir-tab${category === tab.id ? " is-active" : ""}`}
              onClick={() => setCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="dir-chips" aria-label="Borough filters">
          {BOROUGH_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className={`dir-chip${borough === chip ? " is-active" : ""}`}
              onClick={() => setBorough(chip)}
            >
              {chip === "all" ? "All areas" : chip}
            </button>
          ))}
          <button
            type="button"
            className={`dir-chip${openNow ? " is-active" : ""}`}
            onClick={() => setOpenNow((v) => !v)}
          >
            Open now
          </button>
          <button
            type="button"
            className={`dir-chip${thisWeekend ? " is-active" : ""}`}
            onClick={() => setThisWeekend((v) => !v)}
          >
            This weekend
          </button>
        </div>
      </section>

      {error ? (
        <div className="dir-section">
          <div className="dir-empty">{error}</div>
        </div>
      ) : null}

      {loading ? (
        <div className="dir-section">
          <div className="dir-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="dir-card">
                <div className="dir-place-card__media dir-skel" />
                <div className="dir-card__body space-y-2">
                  <div className="dir-skel h-4 w-3/4 rounded" />
                  <div className="dir-skel h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {showEvents ? (
            <section className="dir-section" id="events">
              <div className="dir-section__head">
                <div>
                  <h2>This weekend in NYC</h2>
                  <p>Upcoming Afrobeats, culture, and community gatherings.</p>
                </div>
              </div>
              {(thisWeekend ? weekendEvents : filteredEvents).length === 0 ? (
                <div className="dir-empty">No upcoming events match these filters.</div>
              ) : (
                <div className="dir-grid">
                  {(thisWeekend ? weekendEvents : filteredEvents)
                    .slice(0, 8)
                    .map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                </div>
              )}
            </section>
          ) : null}

          {showPlaces ? (
            <section className="dir-section" id="places">
              <div className="dir-section__head">
                <div>
                  <h2>Places people save</h2>
                  <p>Restaurants, markets, and spots the community keeps coming back to.</p>
                </div>
              </div>
              {savedPlaces.length === 0 ? (
                <div className="dir-empty">No places match these filters yet.</div>
              ) : (
                <div className="dir-grid">
                  {savedPlaces.map((place) => (
                    <PlaceCard key={`${place.source}-${place.id}`} place={place} />
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {showPlaces && (category === "everything" || category === "services") ? (
            <section className="dir-section" id="services">
              <div className="dir-section__head">
                <div>
                  <h2>Community services</h2>
                  <p>Legal, logistics, wellness, and consulate resources.</p>
                </div>
              </div>
              {servicePlaces.length === 0 ? (
                <div className="dir-empty">No services match these filters yet.</div>
              ) : (
                <div className="dir-grid">
                  {servicePlaces.map((place) => (
                    <PlaceCard key={`${place.source}-${place.id}`} place={place} />
                  ))}
                </div>
              )}
            </section>
          ) : null}
        </>
      )}

      <div className="dir-partner-strip">
        <div className="dir-partner-strip__inner">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D6B26A]">
              Grow with BawoSocial
            </p>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              Partner with us — promoters, venues &amp; societies
            </h2>
            <p className="mt-1 max-w-xl text-sm text-[#F7F2EA]/65">
              Get a partner link, QR kit, and a path into the NYC directory after
              Alexander reviews your application.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/partners" className="dir-btn-primary">
              Explore partner kits
            </a>
            <a href="/businesses" className="dir-btn-secondary">
              Open Business Portal
            </a>
          </div>
        </div>
      </div>
    </DirectoryShell>
  );
}
