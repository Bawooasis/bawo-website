import {
  Calendar,
  CalendarClock,
  Copy,
  EyeOff,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Star,
  Upload,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { EmptyState } from "../PortalUi";
import type { ManagedEvent, ManagedEventInput } from "../types";
import {
  fromNyDatetimeLocal,
  panelStatusFromDb,
  panelStatusLabel,
  panelStatusTone,
  parseTagsInput,
  toNyDatetimeLocal,
  type PanelEventStatus,
} from "./eventStatus";

type EventsPanelProps = {
  busy: boolean;
  events: ManagedEvent[];
  onRefresh: () => Promise<void>;
  onSave: (input: ManagedEventInput, eventId?: string) => Promise<boolean>;
  onDuplicate: (eventId: string) => Promise<boolean>;
  onUploadCover: (eventId: string, file: File) => Promise<string | null>;
};

type Draft = {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  venueName: string;
  address: string;
  neighborhood: string;
  borough: string;
  city: string;
  ticketUrl: string;
  organizerName: string;
  category: string;
  tags: string;
  imageUrl: string;
  isFeatured: boolean;
  status: PanelEventStatus;
};

const emptyDraft = (): Draft => ({
  title: "",
  description: "",
  startsAt: "",
  endsAt: "",
  venueName: "",
  address: "",
  neighborhood: "",
  borough: "",
  city: "New York",
  ticketUrl: "",
  organizerName: "",
  category: "Social",
  tags: "diaspora, nigerian, community",
  imageUrl: "",
  isFeatured: false,
  status: "draft",
});

const draftFromEvent = (event: ManagedEvent): Draft => ({
  title: event.title || "",
  description: event.description || "",
  startsAt: toNyDatetimeLocal(event.starts_at),
  endsAt: toNyDatetimeLocal(event.ends_at),
  venueName: event.venue_name || "",
  address: event.address || event.location || "",
  neighborhood: event.neighborhood || "",
  borough: event.borough || "",
  city: event.city || "New York",
  ticketUrl: event.url || event.source_url || "",
  organizerName: event.organizer_name || "",
  category: event.category || "Social",
  tags: (event.tags || []).join(", "),
  imageUrl: event.image_url || "",
  isFeatured: Boolean(event.is_featured),
  status: event.panel_status ||
    panelStatusFromDb(event.status, event.moderation_status),
});

const formatWhen = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value))
    : "n/a";

export default function EventsPanel({
  busy,
  events,
  onRefresh,
  onSave,
  onDuplicate,
  onUploadCover,
}: EventsPanelProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "past" | "hidden" | "expired" | "draft" | "published"
  >("upcoming");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [baseline, setBaseline] = useState<string>(JSON.stringify(emptyDraft()));
  const [localError, setLocalError] = useState<string | null>(null);
  const [coverBusy, setCoverBusy] = useState(false);

  const dirty = JSON.stringify(draft) !== baseline;
  const editing = creating || Boolean(editingId);

  useEffect(() => {
    if (!editing || !dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [editing, dirty]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const q = query.trim().toLowerCase();
    return events.filter((event) => {
      const panelStatus = event.panel_status ||
        panelStatusFromDb(event.status, event.moderation_status);
      const startMs = event.starts_at ? Date.parse(event.starts_at) : NaN;
      if (statusFilter === "draft" && panelStatus !== "draft") return false;
      if (statusFilter === "published" && panelStatus !== "published") {
        return false;
      }
      if (statusFilter === "hidden" && panelStatus !== "hidden") return false;
      if (statusFilter === "expired" && panelStatus !== "expired") return false;
      if (statusFilter === "upcoming") {
        if (panelStatus === "hidden" || panelStatus === "expired") return false;
        if (!Number.isNaN(startMs) && startMs < now) return false;
      }
      if (statusFilter === "past") {
        if (Number.isNaN(startMs) || startMs >= now) return false;
      }
      if (!q) return true;
      return [
        event.title,
        event.venue_name,
        event.city,
        event.borough,
        event.neighborhood,
        event.organizer_name,
        event.category,
        ...(event.tags || []),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [events, query, statusFilter]);

  const openCreate = () => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    const next = emptyDraft();
    setCreating(true);
    setEditingId(null);
    setDraft(next);
    setBaseline(JSON.stringify(next));
    setLocalError(null);
  };

  const openEdit = (event: ManagedEvent) => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    const next = draftFromEvent(event);
    setCreating(false);
    setEditingId(event.id);
    setDraft(next);
    setBaseline(JSON.stringify(next));
    setLocalError(null);
  };

  const closeEditor = () => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setCreating(false);
    setEditingId(null);
    setDraft(emptyDraft());
    setBaseline(JSON.stringify(emptyDraft()));
    setLocalError(null);
  };

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const buildInput = (): ManagedEventInput | null => {
    const startsAt = fromNyDatetimeLocal(draft.startsAt);
    if (!startsAt) {
      setLocalError("Start date/time is required (America/New_York).");
      return null;
    }
    const endsAt = draft.endsAt ? fromNyDatetimeLocal(draft.endsAt) : null;
    if (draft.endsAt && !endsAt) {
      setLocalError("End date/time is invalid.");
      return null;
    }
    if (endsAt && Date.parse(endsAt) < Date.parse(startsAt)) {
      setLocalError("End must be after start.");
      return null;
    }
    if (draft.ticketUrl.trim()) {
      try {
        const parsed = new URL(draft.ticketUrl.trim());
        if (!["http:", "https:"].includes(parsed.protocol)) {
          setLocalError("Ticket/RSVP link must be http(s).");
          return null;
        }
      } catch {
        setLocalError("Ticket/RSVP link must be a valid URL.");
        return null;
      }
    }
    if (draft.imageUrl.trim()) {
      try {
        const parsed = new URL(draft.imageUrl.trim());
        if (!["http:", "https:"].includes(parsed.protocol)) {
          setLocalError("Cover image URL must be http(s).");
          return null;
        }
      } catch {
        setLocalError("Cover image URL must be a valid URL.");
        return null;
      }
    }
    if (draft.title.trim().length < 2) {
      setLocalError("Title is required.");
      return null;
    }
    setLocalError(null);
    return {
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      startsAt,
      endsAt,
      venueName: draft.venueName.trim() || null,
      address: draft.address.trim() || null,
      neighborhood: draft.neighborhood.trim() || null,
      borough: draft.borough.trim() || null,
      city: draft.city.trim() || "New York",
      imageUrl: draft.imageUrl.trim() || null,
      ticketUrl: draft.ticketUrl.trim() || null,
      organizerName: draft.organizerName.trim() || null,
      category: draft.category.trim() || null,
      tags: parseTagsInput(draft.tags),
      isFeatured: draft.isFeatured,
      status: draft.status,
      region: "nyc",
      provider: "bawosocial",
    };
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const input = buildInput();
    if (!input) return;
    const ok = await onSave(input, editingId || undefined);
    if (!ok) return;
    setBaseline(JSON.stringify(draft));
    setCreating(false);
    setEditingId(null);
    await onRefresh();
  };

  const hideEvent = async (event: ManagedEvent) => {
    if (
      !window.confirm(
        `Hide "${event.title}" from the NYC feed? This does not delete the row.`,
      )
    ) {
      return;
    }
    const input: ManagedEventInput = {
      title: event.title,
      description: event.description,
      startsAt: event.starts_at,
      endsAt: event.ends_at,
      venueName: event.venue_name,
      address: event.address || event.location,
      neighborhood: event.neighborhood,
      borough: event.borough,
      city: event.city || "New York",
      imageUrl: event.image_url,
      ticketUrl: event.url || event.source_url,
      organizerName: event.organizer_name,
      category: event.category,
      tags: event.tags || [],
      isFeatured: Boolean(event.is_featured),
      status: "hidden",
      region: event.region || "nyc",
      provider: event.provider || "bawosocial",
    };
    const ok = await onSave(input, event.id);
    if (ok) await onRefresh();
  };

  const handleCover = async (file: File | null) => {
    if (!file) return;
    if (!editingId) {
      setLocalError("Save the event once before uploading a cover image.");
      return;
    }
    setCoverBusy(true);
    try {
      const url = await onUploadCover(editingId, file);
      if (url) update("imageUrl", url);
    } finally {
      setCoverBusy(false);
    }
  };

  if (editing) {
    return (
      <section className="portal-panel events-manager">
        <div className="portal-panel-heading">
          <div>
            <span className="portal-kicker">Events Manager</span>
            <h2>{creating ? "Create event" : "Edit event"}</h2>
            <p className="events-manager-note">
              Times are America/New_York. Saving writes `external_events` (NYC
              feed) and syncs native `events` / `public_events` when applicable.
              No hard deletes — use Hidden or Expired.
            </p>
          </div>
          <button type="button" className="portal-secondary-button" onClick={closeEditor}>
            Back to list
          </button>
        </div>

        <form className="events-editor" onSubmit={(event) => void submit(event)}>
          {localError && <p className="portal-inline-error">{localError}</p>}

          <label>
            Title
            <input
              required
              minLength={2}
              maxLength={200}
              value={draft.title}
              onChange={(event) => update("title", event.target.value)}
            />
          </label>

          <div className="portal-form-grid">
            <label>
              Start (NY)
              <input
                required
                type="datetime-local"
                value={draft.startsAt}
                onChange={(event) => update("startsAt", event.target.value)}
              />
            </label>
            <label>
              End (NY)
              <input
                type="datetime-local"
                value={draft.endsAt}
                onChange={(event) => update("endsAt", event.target.value)}
              />
            </label>
          </div>

          <div className="portal-form-grid">
            <label>
              Venue name
              <input
                maxLength={200}
                value={draft.venueName}
                onChange={(event) => update("venueName", event.target.value)}
              />
            </label>
            <label>
              Address
              <input
                maxLength={300}
                value={draft.address}
                onChange={(event) => update("address", event.target.value)}
              />
            </label>
          </div>

          <div className="portal-form-grid">
            <label>
              Neighborhood
              <input
                maxLength={120}
                value={draft.neighborhood}
                onChange={(event) => update("neighborhood", event.target.value)}
              />
            </label>
            <label>
              Borough
              <input
                maxLength={80}
                value={draft.borough}
                onChange={(event) => update("borough", event.target.value)}
                placeholder="Brooklyn, Bronx…"
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              rows={5}
              maxLength={8000}
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </label>

          <div className="events-cover-row">
            <label className="events-cover-preview">
              {draft.imageUrl
                ? (
                  <img src={draft.imageUrl} alt="" />
                )
                : (
                  <span>
                    <ImagePlus aria-hidden /> Cover preview
                  </span>
                )}
            </label>
            <div className="events-cover-controls">
              <label>
                Cover image URL
                <input
                  type="url"
                  value={draft.imageUrl}
                  onChange={(event) => update("imageUrl", event.target.value)}
                  placeholder="https://"
                />
              </label>
              <label className="social-upload-button">
                <Upload aria-hidden />{" "}
                {coverBusy ? "Uploading…" : "Upload / replace cover"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={busy || coverBusy || creating}
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    void handleCover(file);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              {creating && (
                <p className="portal-form-note">
                  Save once to enable cover uploads to Supabase Storage.
                </p>
              )}
            </div>
          </div>

          <div className="portal-form-grid">
            <label>
              Ticket / RSVP link
              <input
                type="url"
                value={draft.ticketUrl}
                onChange={(event) => update("ticketUrl", event.target.value)}
                placeholder="https://"
              />
            </label>
            <label>
              Organizer / partner
              <input
                maxLength={160}
                value={draft.organizerName}
                onChange={(event) => update("organizerName", event.target.value)}
              />
            </label>
          </div>

          <div className="portal-form-grid">
            <label>
              Category
              <input
                maxLength={80}
                value={draft.category}
                onChange={(event) => update("category", event.target.value)}
              />
            </label>
            <label>
              Tags
              <input
                value={draft.tags}
                onChange={(event) => update("tags", event.target.value)}
                placeholder="diaspora, nightlife"
              />
            </label>
          </div>

          <div className="portal-form-grid">
            <label>
              Status
              <select
                value={draft.status}
                onChange={(event) =>
                  update("status", event.target.value as PanelEventStatus)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
                <option value="expired">Expired</option>
              </select>
            </label>
            <label className="events-featured-toggle">
              <input
                type="checkbox"
                checked={draft.isFeatured}
                onChange={(event) => update("isFeatured", event.target.checked)}
              />
              <span>
                <Star aria-hidden /> Featured / Spotlight
              </span>
            </label>
          </div>

          <div className="events-editor-actions">
            <button
              type="submit"
              className="portal-primary-button"
              disabled={busy || !dirty}
            >
              {busy ? "Saving…" : "Save event"}
            </button>
            <button
              type="button"
              className="portal-secondary-button"
              disabled={busy}
              onClick={closeEditor}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="portal-panel events-manager">
      <div className="portal-panel-heading">
        <div>
          <span className="portal-kicker">Culture Hub</span>
          <h2>Events Manager</h2>
        </div>
        <button
          type="button"
          className="portal-primary-button events-new-button"
          disabled={busy}
          onClick={openCreate}
        >
          <Plus aria-hidden /> New event
        </button>
      </div>

      <div className="events-toolbar">
        <label className="crm-search">
          <Search aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, venue, borough…"
          />
        </label>
        <select
          aria-label="Filter events"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as typeof statusFilter,
            )}
        >
          <option value="upcoming">Upcoming</option>
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="hidden">Hidden</option>
          <option value="expired">Expired</option>
          <option value="past">Past</option>
        </select>
      </div>

      <div className="portal-list">
        {filtered.length === 0 && (
          <EmptyState
            icon={Calendar}
            title="No events in this view"
            body="Create a curated NYC event or widen the filter. Community submissions still appear in moderation when pending."
          />
        )}
        {filtered.map((event) => {
          const panelStatus = event.panel_status ||
            panelStatusFromDb(event.status, event.moderation_status);
          return (
            <article className="portal-list-row events-list-row" key={event.id}>
              <div className="events-list-thumb" aria-hidden>
                {event.image_url
                  ? <img src={event.image_url} alt="" />
                  : <CalendarClock />}
              </div>
              <div className="portal-list-main">
                <strong>
                  {event.is_featured ? <Star aria-hidden /> : null}
                  {event.title}
                </strong>
                <span>
                  {formatWhen(event.starts_at)} ·{" "}
                  {event.venue_name || event.borough || event.city || "NYC"} ·{" "}
                  {event.provider || "source"}
                </span>
              </div>
              <span className={`portal-status ${panelStatusTone(panelStatus)}`}>
                {panelStatusLabel(panelStatus)}
              </span>
              <div className="portal-row-actions">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => openEdit(event)}
                >
                  <Pencil aria-hidden /> Edit
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void onDuplicate(event.id).then((ok) => {
                    if (ok) void onRefresh();
                  })}
                >
                  <Copy aria-hidden /> Duplicate
                </button>
                {panelStatus !== "hidden" && (
                  <button
                    type="button"
                    className="is-danger"
                    disabled={busy}
                    onClick={() => void hideEvent(event)}
                  >
                    <EyeOff aria-hidden /> Hide
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
