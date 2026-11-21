import { Bookmark, Calendar, MapPin, Ticket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DirectoryShell from "../directory/DirectoryShell";
import { loadEventBySlug } from "../directory/data";
import type { EventRecord } from "../directory/types";
import { scrollToWaitlist } from "../utils/scrollToWaitlist";

type EventPageProps = {
  slug: string;
};

function formatRange(start: string, end: string | null): string {
  const startDate = new Date(start);
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  const startLabel = new Intl.DateTimeFormat("en-US", opts).format(startDate);
  if (!end) return startLabel;
  const endLabel = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(end));
  return `${startLabel} – ${endLabel}`;
}

export default function EventPage({ slug }: EventPageProps) {
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const sharedByPartner = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get("ref"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const found = await loadEventBySlug(slug);
        if (cancelled) return;
        if (!found) {
          setError("This event could not be found.");
        } else {
          setEvent(found);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load event");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const joinCta = () => {
    window.location.assign("/#join");
    window.setTimeout(() => scrollToWaitlist(), 350);
  };

  if (loading) {
    return (
      <DirectoryShell active="nyc">
        <div className="dir-detail">
          <div className="dir-detail__photo dir-skel" />
        </div>
      </DirectoryShell>
    );
  }

  if (error || !event) {
    return (
      <DirectoryShell active="nyc">
        <div className="dir-detail">
          <div className="dir-empty">{error || "Event not found."}</div>
          <a href="/nyc#events" className="dir-btn-secondary mt-4 inline-flex">
            Back to events
          </a>
        </div>
      </DirectoryShell>
    );
  }

  const ticketHref = event.ticketUrl || event.url;

  return (
    <DirectoryShell active="nyc">
      <article className="dir-detail">
        <div className="dir-detail__hero">
          <div className="dir-detail__photo">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title} />
            ) : (
              <div className="flex h-full items-center justify-center text-[#F7E7C4]/5">
                Event flyer
              </div>
            )}
          </div>
          <div>
            {sharedByPartner ? (
              <span className="dir-badge mb-3">Shared by partner</span>
            ) : null}
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D6B26A]">
              NYC event
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{event.title}</h1>
            <p className="mt-3 inline-flex items-start gap-2 text-sm text-[#F7E7C4]/85">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#D6B26A]" aria-hidden />
              {formatRange(event.startsAt, event.endsAt)}
            </p>
            {(event.venueName || event.location || event.city) && (
              <p className="mt-2 inline-flex items-start gap-2 text-sm text-[#F7F2EA]/72">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D6B26A]" aria-hidden />
                {[event.venueName, event.location || event.city]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            {event.tags.length ? (
              <div className="dir-tag-row mt-4">
                {event.tags.map((tag) => (
                  <span key={tag} className="dir-tag">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            {event.description ? (
              <p className="mt-4 text-[#F7F2EA]/72 leading-relaxed line-clamp-6">
                {event.description}
              </p>
            ) : null}

            <div className="dir-actions">
              {ticketHref ? (
                <a
                  href={ticketHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dir-btn-primary"
                >
                  <Ticket className="h-4 w-4" aria-hidden />
                  Get tickets
                </a>
              ) : null}
              <button type="button" className="dir-btn-secondary" onClick={joinCta}>
                <Bookmark className="h-4 w-4" aria-hidden />
                Save in BawoSocial
              </button>
            </div>

            <div className="dir-claim-strip">
              <p className="text-sm font-bold text-[#F7E7C4]">Hosting here?</p>
              <p className="mt-1 text-sm text-[#F7F2EA]/65">
                Claim your venue listing to keep details accurate and promote
                upcoming nights.
              </p>
              <a href="/businesses" className="dir-btn-secondary mt-3 inline-flex">
                Claim venue
              </a>
            </div>
          </div>
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
