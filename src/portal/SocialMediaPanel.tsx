import {
  Archive,
  BarChart3,
  CalendarClock,
  Eye,
  Heart,
  Instagram,
  Megaphone,
  MessageCircle,
  Pencil,
  Plus,
  Send,
  Share2,
  Sparkles,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { EmptyState, MetricCard } from "./PortalUi";
import type { AdminAction, SocialContentItem, SocialPlatform } from "./types";

type SocialMediaPanelProps = {
  items: SocialContentItem[];
  busy: boolean;
  onAction: (action: AdminAction, successMessage: string) => Promise<boolean>;
};

type Draft = {
  platform: SocialPlatform;
  title: string;
  contentType: SocialContentItem["content_type"];
  status: SocialContentItem["status"];
  goal: SocialContentItem["goal"];
  hook: string;
  caption: string;
  callToAction: string;
  ownerName: string;
  scheduledFor: string;
  publishedAt: string;
  postUrl: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  saves: string;
  follows: string;
  linkClicks: string;
};

const emptyDraft = (): Draft => ({
  platform: "tiktok",
  title: "",
  contentType: "short_video",
  status: "idea",
  goal: "awareness",
  hook: "",
  caption: "",
  callToAction: "Download BawoSocial and explore NYC.",
  ownerName: "",
  scheduledFor: "",
  publishedAt: "",
  postUrl: "",
  views: "0",
  likes: "0",
  comments: "0",
  shares: "0",
  saves: "0",
  follows: "0",
  linkClicks: "0",
});

const toLocalDate = (value: string | null) => value ? new Date(value).toISOString().slice(0, 16) : "";
const fromItem = (item: SocialContentItem): Draft => ({
  platform: item.platform,
  title: item.title,
  contentType: item.content_type,
  status: item.status,
  goal: item.goal,
  hook: item.hook,
  caption: item.caption,
  callToAction: item.call_to_action,
  ownerName: item.owner_name,
  scheduledFor: toLocalDate(item.scheduled_for),
  publishedAt: toLocalDate(item.published_at),
  postUrl: item.post_url || "",
  views: String(item.views),
  likes: String(item.likes),
  comments: String(item.comments),
  shares: String(item.shares),
  saves: String(item.saves),
  follows: String(item.follows),
  linkClicks: String(item.link_clicks),
});

const formatDate = (value: string | null) => value
  ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value))
  : "Not scheduled";

export default function SocialMediaPanel({ items, busy, onAction }: SocialMediaPanelProps) {
  const [platform, setPlatform] = useState<"all" | SocialPlatform>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const visibleItems = useMemo(
    () => platform === "all" ? items : items.filter((item) => item.platform === platform),
    [items, platform],
  );
  const totals = useMemo(() => items.reduce((result, item) => ({
    views: result.views + Number(item.views || 0),
    engagement: result.engagement + Number(item.likes || 0) + Number(item.comments || 0) + Number(item.shares || 0) + Number(item.saves || 0),
  }), { views: 0, engagement: 0 }), [items]);
  const published = items.filter((item) => item.status === "published").length;
  const scheduled = items.filter((item) => item.status === "scheduled").length;
  const engagementRate = totals.views > 0 ? `${((totals.engagement / totals.views) * 100).toFixed(1)}%` : "0%";

  const openNew = () => {
    setEditingId("new");
    setDraft(emptyDraft());
  };
  const openEdit = (item: SocialContentItem) => {
    setEditingId(item.id);
    setDraft(fromItem(item));
  };
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const count = (value: string) => Math.max(0, Number.parseInt(value || "0", 10) || 0);
    const saved = await onAction({
      action: "save_social_content",
      targetId: editingId || "new",
      socialContent: {
        platform: draft.platform,
        title: draft.title,
        contentType: draft.contentType,
        status: draft.status,
        goal: draft.goal,
        hook: draft.hook,
        caption: draft.caption,
        callToAction: draft.callToAction,
        ownerName: draft.ownerName,
        scheduledFor: draft.scheduledFor || null,
        publishedAt: draft.publishedAt || null,
        postUrl: draft.postUrl || null,
        views: count(draft.views),
        likes: count(draft.likes),
        comments: count(draft.comments),
        shares: count(draft.shares),
        saves: count(draft.saves),
        follows: count(draft.follows),
        linkClicks: count(draft.linkClicks),
      },
    }, editingId === "new" ? "Content plan created." : "Content plan updated.");
    if (saved) setEditingId(null);
  };

  return (
    <div className="portal-stack social-ops">
      <section className="social-ops-hero">
        <div><span className="portal-kicker">Growth studio</span><h2>Make the next post measurable</h2><p>TikTok leads the launch. Instagram follows with reusable cuts, carousels, and community proof.</p></div>
        <button className="portal-primary-button" type="button" onClick={openNew}><Plus aria-hidden /> New content</button>
      </section>

      <section className="portal-metrics" aria-label="Social performance">
        <MetricCard icon={Megaphone} label="Pipeline" value={items.length - published} detail="Ideas through scheduled posts" tone="accent" />
        <MetricCard icon={CalendarClock} label="Scheduled" value={scheduled} detail="Posts with a publish time" tone={scheduled > 0 ? "success" : "warning"} />
        <MetricCard icon={Eye} label="Total views" value={totals.views.toLocaleString()} detail={`${published} published posts`} />
        <MetricCard icon={BarChart3} label="Engagement rate" value={engagementRate} detail="Likes, comments, shares, and saves" tone="success" />
      </section>

      {editingId && (
        <section className="portal-panel social-editor">
          <div className="portal-panel-heading"><div><span className="portal-kicker">Content record</span><h2>{editingId === "new" ? "Plan a post" : "Update performance"}</h2></div></div>
          <form className="portal-form" onSubmit={save}>
            <div className="portal-form-grid social-form-grid-3">
              <label>Platform<select value={draft.platform} onChange={(event) => update("platform", event.target.value as SocialPlatform)}><option value="tiktok">TikTok</option><option value="instagram">Instagram</option></select></label>
              <label>Format<select value={draft.contentType} onChange={(event) => update("contentType", event.target.value as Draft["contentType"])}><option value="short_video">Short video</option><option value="carousel">Carousel</option><option value="story">Story</option><option value="static">Static</option><option value="live">Live</option></select></label>
              <label>Status<select value={draft.status} onChange={(event) => update("status", event.target.value as Draft["status"])}><option value="idea">Idea</option><option value="scripted">Scripted</option><option value="ready">Ready</option><option value="scheduled">Scheduled</option><option value="published">Published</option></select></label>
            </div>
            <div className="portal-form-grid">
              <label>Content title<input required minLength={2} maxLength={120} value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder="Three NYC jollof spots" /></label>
              <label>Growth goal<select value={draft.goal} onChange={(event) => update("goal", event.target.value as Draft["goal"])}><option value="awareness">Awareness</option><option value="engagement">Engagement</option><option value="downloads">App downloads</option><option value="leads">Leads</option><option value="vendors">Vendors</option><option value="events">Events</option></select></label>
            </div>
            <label>Opening hook<textarea rows={2} maxLength={500} value={draft.hook} onChange={(event) => update("hook", event.target.value)} placeholder="NYC, stop scrolling—your next jollof spot is here." /></label>
            <label>Caption / script<textarea rows={4} maxLength={2200} value={draft.caption} onChange={(event) => update("caption", event.target.value)} /></label>
            <div className="portal-form-grid">
              <label>Call to action<input maxLength={240} value={draft.callToAction} onChange={(event) => update("callToAction", event.target.value)} /></label>
              <label>Owner<input maxLength={100} value={draft.ownerName} onChange={(event) => update("ownerName", event.target.value)} placeholder="Alexander" /></label>
              <label>Scheduled for<input type="datetime-local" value={draft.scheduledFor} onChange={(event) => update("scheduledFor", event.target.value)} /></label>
              <label>Published at<input type="datetime-local" value={draft.publishedAt} onChange={(event) => update("publishedAt", event.target.value)} /></label>
            </div>
            <label>Live post URL<input type="url" value={draft.postUrl} onChange={(event) => update("postUrl", event.target.value)} placeholder="https://www.tiktok.com/@bawo/..." /></label>
            <div className="social-metric-inputs">
              {(["views", "likes", "comments", "shares", "saves", "follows", "linkClicks"] as const).map((key) => <label key={key}>{key.replace(/([A-Z])/g, " $1")}<input min="0" type="number" value={draft[key]} onChange={(event) => update(key, event.target.value)} /></label>)}
            </div>
            <div className="portal-row-actions social-editor-actions"><button type="button" onClick={() => setEditingId(null)}>Cancel</button><button className="is-primary" disabled={busy}><Send aria-hidden /> Save content</button></div>
          </form>
        </section>
      )}

      <section className="portal-panel">
        <div className="portal-panel-heading social-pipeline-heading">
          <div><span className="portal-kicker">Content pipeline</span><h2>What ships next</h2></div>
          <div className="social-platform-filter" role="group" aria-label="Filter platform">
            <button className={platform === "all" ? "is-active" : ""} onClick={() => setPlatform("all")}>All</button>
            <button className={platform === "tiktok" ? "is-active" : ""} onClick={() => setPlatform("tiktok")}><Sparkles aria-hidden /> TikTok</button>
            <button className={platform === "instagram" ? "is-active" : ""} onClick={() => setPlatform("instagram")}><Instagram aria-hidden /> Instagram</button>
          </div>
        </div>
        <div className="social-content-grid">
          {visibleItems.length === 0 && <EmptyState icon={Megaphone} title="No content tracked yet" body="Create the first TikTok idea, assign an owner, and move it through the publishing pipeline." />}
          {visibleItems.map((item) => (
            <article className="social-content-card" key={item.id}>
              <div className="social-content-top"><span className={`social-platform is-${item.platform}`}>{item.platform === "tiktok" ? <Sparkles aria-hidden /> : <Instagram aria-hidden />}{item.platform}</span><span className={`portal-status is-${item.status === "published" ? "success" : item.status === "scheduled" ? "warning" : "muted"}`}>{item.status}</span></div>
              <div><span className="social-goal">{item.goal}</span><h3>{item.title}</h3><p>{item.hook || "Add a hook that earns the first three seconds."}</p></div>
              <div className="social-card-meta"><span><CalendarClock aria-hidden /> {formatDate(item.scheduled_for || item.published_at)}</span><span>{item.owner_name || "Unassigned"}</span></div>
              <div className="social-card-stats"><span><Eye aria-hidden /> {Number(item.views).toLocaleString()}</span><span><Heart aria-hidden /> {Number(item.likes).toLocaleString()}</span><span><MessageCircle aria-hidden /> {Number(item.comments).toLocaleString()}</span><span><Share2 aria-hidden /> {Number(item.shares).toLocaleString()}</span></div>
              <div className="portal-row-actions"><button onClick={() => openEdit(item)}><Pencil aria-hidden /> Edit</button>{item.post_url && <a className="social-post-link" href={item.post_url} target="_blank" rel="noreferrer">View post</a>}<button className="is-danger" disabled={busy} onClick={() => { if (window.confirm(`Archive ${item.title}?`)) void onAction({ action: "archive_social_content", targetId: item.id }, "Content item archived."); }}><Archive aria-hidden /> Archive</button></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
