import {
  Bookmark,
  MapPin,
  Navigation,
  Phone,
  Share2,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DirectoryShell from "../directory/DirectoryShell";
import { loadEvents, loadPlaceBySlug, loadPlaces } from "../directory/data";
import type { EventRecord, PlaceRecord } from "../directory/types";
import { scrollToWaitlist } from "../utils/scrollToWaitlist";

type PlacePageProps = {
  slug: string;
};

function joinCta() {
  window.location.assign("/#join");
  window.setTimeout(() => scrollToWaitlist(), 350);
}

async function sharePlace(place: PlaceRecord) {
  const url = `${window.location.origin}/places/${place.slug}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: place.name, url });
      return;
    }
  } catch {
    /* fall through */
  }
  await navigator.clipboard?.writeText(url);
}

export default function PlacePage({ slug }: PlacePageProps) {
  const [place, setPlace] = useState<PlaceRecord | null>(null);
  const [nearbyEvents, setNearbyEvents] = useState<EventRecord[]>([]);
  const [morePlaces, setMorePlaces] = useState<PlaceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const found = await loadPlaceBySlug(slug);
        if (cancelled) return;
        if (!found) {
          setError("This place could not be found.");
          setLoading(false);
          return;
        }
        setPlace(found);
        const [events, places] = await Promise.all([loadEvents(), loadPlaces()]);
        if (cancelled) return;
        const neighborhood = (found.neighborhood || found.borough || "").toLowerCase();
        setNearbyEvents(
          events
            .filter((e) => {
              const blob = `${e.venueName || ""} ${e.city || ""} ${e.location || ""}`.toLowerCase();
              return neighborhood
                ? blob.includes(neighborhood.split(" ")[0] || "")
                : true;
            })
            .slice(0, 4),
        );
        setMorePlaces(
          places
            .filter(
              (p) =>
                p.id !== found.id &&
                (p.neighborhood === found.neighborhood ||
                  p.borough === found.borough),
            )
            .slice(0, 4),
        );
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load place");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const mapsUrl = useMemo(() => {
    if (!place?.address && !place?.name) return null;
    const q = encodeURIComponent(place.address || `${place.name} NYC`);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }, [place]);

  if (loading) {
    return (
      <DirectoryShell active="nyc">
        <div className="dir-detail">
          <div className="dir-detail__photo dir-skel" />
        </div>
      </DirectoryShell>
    );
  }

  if (error || !place) {
    return (
      <DirectoryShell active="nyc">
        <div className="dir-detail">
          <div className="dir-empty">{error || "Place not found."}</div>
          <a href="/nyc" className="dir-btn-secondary mt-4 inline-flex">
            Back to NYC directory
          </a>
        </div>
      </DirectoryShell>
    );
  }

  return (
    <DirectoryShell active="nyc">
      <article className="dir-detail">
        <div className="dir-detail__hero">
          <div className="dir-detail__photo">
            {place.imageUrl ? (
              <img src={place.imageUrl} alt={place.name} />
            ) : (
              <div className="flex h-full items-center justify-center text-[#F7E7C4]/5">
                {place.category}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D6B26A]">
              {[place.cuisine || place.category, place.neighborhood || place.borough]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{place.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#F7F2EA]/75">
              {place.rating != null ? (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 text-[#D6B26A]" aria-hidden />
                  {place.rating.toFixed(1)}
                </span>
              ) : null}
              {place.priceRange ? <span>{place.priceRange}</span> : null}
              {place.isOpen != null ? (
                <span className={place.isOpen ? "text-emerald-400" : "text-[#F7F2EA]/55"}>
                  {place.isOpen ? "Open now" : "Hours vary"}
                </span>
              ) : null}
            </div>
            {place.description ? (
              <p className="mt-4 text-[#F7F2EA]/72 leading-relaxed">{place.description}</p>
            ) : null}
            {place.hours ? (
              <p className="mt-3 text-sm text-[#F7F2EA]/65">Hours: {place.hours}</p>
            ) : null}
            {place.address ? (
              <p className="mt-3 inline-flex items-start gap-2 text-sm text-[#F7E7C4]/85">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D6B26A]" aria-hidden />
                {place.address}
              </p>
            ) : null}

            <div className="dir-actions">
              <button type="button" className="dir-btn-primary" onClick={joinCta}>
                <Bookmark className="h-4 w-4" aria-hidden />
                Save in BawoSocial
              </button>
              <button
                type="button"
                className="dir-btn-secondary"
                onClick={() => sharePlace(place)}
              >
                <Share2 className="h-4 w-4" aria-hidden />
                Share
              </button>
              {mapsUrl ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dir-btn-secondary"
                >
                  <Navigation className="h-4 w-4" aria-hidden />
                  Directions
                </a>
              ) : null}
              {place.phone ? (
                <a href={`tel:${place.phone}`} className="dir-btn-secondary">
                  <Phone className="h-4 w-4" aria-hidden />
                  Call
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {nearbyEvents.length ? (
          <section className="mt-10">
            <h2 className="text-xl font-bold">Nearby events</h2>
            <div className="dir-grid mt-4">
              {nearbyEvents.map((event) => (
                <a key={event.id} href={`/e/${event.slug}`} className="dir-card block">
                  <div className="dir-event-card__media">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt="" loading="lazy" />
                    ) : null}
                  </div>
                  <div className="dir-card__body">
                    <h3>{event.title}</h3>
                    <p className="dir-card__meta">{event.venueName}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {morePlaces.length ? (
          <section className="mt-10">
            <h2 className="text-xl font-bold">
              More in {place.neighborhood || place.borough || "NYC"}
            </h2>
            <div className="dir-grid mt-4">
              {morePlaces.map((item) => (
                <a
                  key={item.id}
                  href={`/places/${item.slug}`}
                  className="dir-card block"
                >
                  <div className="dir-place-card__media">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" loading="lazy" />
                    ) : null}
                  </div>
                  <div className="dir-card__body">
                    <h3>{item.name}</h3>
                    <p className="dir-card__meta">{item.category}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <div className="dir-claim-strip">
          <p className="text-sm font-bold text-[#F7E7C4]">Own this listing?</p>
          <p className="mt-1 text-sm text-[#F7F2EA]/65">
            Claim your business on BawoSocial to update hours, photos, and offers.
          </p>
          <a href="/businesses" className="dir-btn-secondary mt-3 inline-flex">
            Claim in Business Portal
          </a>
        </div>
      </article>

      <div className="dir-sticky-save">
        <button type="button" className="dir-btn-primary w-full" onClick={joinCta}>
          Save in BawoSocial
        </button>
      </div>
    </DirectoryShell>
  );
}
