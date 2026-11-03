import {
  BarChart3,
  CalendarClock,
  Eye,
  FolderOpen,
  Megaphone,
  Plus,
  Link2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, MetricCard } from "./PortalUi";
import type {
  AdminAction,
  SocialConnection,
  SocialContentItem,
  SocialPlatform,
  SocialPublishJob,
} from "./types";
import { PlatformBadge, PlatformPreview } from "./social/PlatformPreviews";
import SocialPostDetail, {
  type SocialDetailDraft,
} from "./social/SocialPostDetail";
import {
  formatNyDateTime,
  formatNyDayKey,
  previewForItem,
} from "./social/platformCopy";
import { socialItemMediaUrl } from "./social/mediaUrl";

type SocialMediaPanelProps = {
  items: SocialContentItem[];
  connections: SocialConnection[];
  publishJobs: SocialPublishJob[];
  busy: boolean;
  onAction: (action: AdminAction, successMessage: string) => Promise<boolean>;
  onConnectInstagram: () => Promise<void>;
  onUploadMedia: (contentId: string, file: File) => Promise<void>;
  onQueuePublish: (contentId: string, scheduledFor: string) => Promise<boolean>;
  onScheduleTikTok: (contentId: string, scheduledFor: string) => Promise<boolean>;
};

const driveLibraryUrl =
  import.meta.env.VITE_SOCIAL_DRIVE_FOLDER_URL ||
  "https://drive.google.com/drive/folders/1eL45S1A5pqs8-bDBeANPR8-V8D5mjiz9";

export default function SocialMediaPanel({
  items,
  connections,
  publishJobs,
  busy,
  onAction,
  onConnectInstagram,
  onUploadMedia,
  onQueuePublish,
  onScheduleTikTok,
}: SocialMediaPanelProps) {
  const [platform, setPlatform] = useState<"all" | SocialPlatform>("all");
  const [status, setStatus] = useState<"all" | SocialContentItem["status"]>("all");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const jobsByContent = useMemo(
    () => new Map(publishJobs.map((job) => [job.content_id, job])),
    [publishJobs],
  );

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      if (platform !== "all" && item.platform !== platform) return false;
      if (status !== "all" && item.status !== status) return false;
      return true;
    });
  }, [items, platform, status]);

  const calendarGroups = useMemo(() => {
    const groups = new Map<string, SocialContentItem[]>();
    for (const item of visibleItems) {
      const key = item.scheduled_for
        ? formatNyDayKey(item.scheduled_for)
        : "Unscheduled";
      const list = groups.get(key) || [];
      list.push(item);
      groups.set(key, list);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === "Unscheduled") return 1;
      if (b === "Unscheduled") return -1;
      return a.localeCompare(b);
    });
  }, [visibleItems]);

  const totals = useMemo(
    () =>
      items.reduce(
        (result, item) => ({
          views: result.views + Number(item.views || 0),
          engagement:
            result.engagement +
            Number(item.likes || 0) +
            Number(item.comments || 0) +
            Number(item.shares || 0) +
            Number(item.saves || 0),
        }),
        { views: 0, engagement: 0 },
      ),
    [items],
  );
  const published = items.filter((item) => item.status === "published").length;
  const scheduled = items.filter((item) => item.status === "scheduled").length;
  const engagementRate =
    totals.views > 0
      ? `${((totals.engagement / totals.views) * 100).toFixed(1)}%`
      : "0%";
  const instagramConnection = connections.find(
    (connection) =>
      connection.platform === "instagram" && connection.status === "connected",
  );

  const selectedItem =
    selectedId === "new"
      ? ("new" as const)
      : items.find((item) => item.id === selectedId) || null;

  const saveDetail = async (targetId: string, draft: SocialDetailDraft) => {
    const existing =
      targetId === "new" ? null : items.find((item) => item.id === targetId);
    const saved = await onAction(
      {
        action: "save_social_content",
        targetId,
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
          driveAssetUrl: draft.driveAssetUrl || null,
          views: Number(existing?.views || 0),
          likes: Number(existing?.likes || 0),
          comments: Number(existing?.comments || 0),
          shares: Number(existing?.shares || 0),
          saves: Number(existing?.saves || 0),
          follows: Number(existing?.follows || 0),
          linkClicks: Number(existing?.link_clicks || 0),
        },
      },
      targetId === "new" ? "Content plan created." : "Content plan updated.",
    );
    if (saved && targetId === "new") setSelectedId(null);
    return saved;
  };

  return (
    <div className="portal-stack social-ops">
      <section
        className={`social-connection-card ${instagramConnection ? "is-connected" : ""}`}
      >
        <div>
          <span className="portal-kicker">Publishing connection</span>
          <h2>
            {instagramConnection
              ? `Instagram @${instagramConnection.username || "connected"}`
              : "Connect Instagram securely"}
          </h2>
          <p>
            {instagramConnection
              ? "OAuth is active. Upload media, then post now or schedule it."
              : "Use Meta OAuth. BawoSocial never receives or stores your Instagram password."}
          </p>
        </div>
        <button
          className="portal-primary-button"
          type="button"
          disabled={busy}
          onClick={() => void onConnectInstagram()}
        >
          <Link2 aria-hidden />{" "}
          {instagramConnection ? "Reconnect" : "Connect Instagram"}
        </button>
      </section>

      <section className="social-ops-hero">
        <div>
          <span className="portal-kicker">Growth studio</span>
          <h2>Schedule BawoSocial posts with platform accurate previews</h2>
          <p>
            Review Instagram and TikTok layouts before you queue. LinkedIn, X,
            and Facebook previews help you check caption fit for future
            crossposts.
          </p>
        </div>
        <div className="social-hero-actions">
          <a
            className="portal-secondary-link"
            href={driveLibraryUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FolderOpen aria-hidden /> Media library
          </a>
          <button
            className="portal-primary-button"
            type="button"
            onClick={() => setSelectedId("new")}
          >
            <Plus aria-hidden /> New content
          </button>
        </div>
      </section>

      <section className="portal-metrics" aria-label="Social performance">
        <MetricCard
          icon={Megaphone}
          label="Pipeline"
          value={items.length - published}
          detail="Ideas through scheduled posts"
          tone="accent"
        />
        <MetricCard
          icon={CalendarClock}
          label="Scheduled"
          value={scheduled}
          detail="Posts with a publish time"
          tone={scheduled > 0 ? "success" : "warning"}
        />
        <MetricCard
          icon={Eye}
          label="Total views"
          value={totals.views.toLocaleString()}
          detail={`${published} published posts`}
        />
        <MetricCard
          icon={BarChart3}
          label="Engagement rate"
          value={engagementRate}
          detail="Likes, comments, shares, and saves"
          tone="success"
        />
      </section>

      <section className="portal-panel">
        <div className="portal-panel-heading social-pipeline-heading">
          <div>
            <span className="portal-kicker">Upcoming posts</span>
            <h2>Content calendar</h2>
          </div>
          <div className="social-toolbar">
            <div className="social-platform-filter" role="group" aria-label="Filter platform">
              <button
                className={platform === "all" ? "is-active" : ""}
                onClick={() => setPlatform("all")}
              >
                All
              </button>
              <button
                className={platform === "instagram" ? "is-active" : ""}
                onClick={() => setPlatform("instagram")}
              >
                Instagram
              </button>
              <button
                className={platform === "tiktok" ? "is-active" : ""}
                onClick={() => setPlatform("tiktok")}
              >
                TikTok
              </button>
            </div>
            <label className="social-status-filter">
              Status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as typeof status)
                }
              >
                <option value="all">All</option>
                <option value="idea">Idea</option>
                <option value="scripted">Scripted</option>
                <option value="ready">Ready</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </label>
            <div className="social-platform-filter" role="group" aria-label="View mode">
              <button
                className={viewMode === "grid" ? "is-active" : ""}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </button>
              <button
                className={viewMode === "calendar" ? "is-active" : ""}
                onClick={() => setViewMode("calendar")}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>

        {visibleItems.length === 0 && (
          <EmptyState
            icon={Megaphone}
            title="No content tracked yet"
            body="Create the first BawoSocial TikTok or Instagram idea, then open it to preview and schedule."
          />
        )}

        {viewMode === "grid" && visibleItems.length > 0 && (
          <div className="social-preview-grid">
            {visibleItems.map((item) => {
              const layout = previewForItem(item);
              const thumb = socialItemMediaUrl(item);
              return (
                <button
                  type="button"
                  key={item.id}
                  className="social-preview-card"
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="social-preview-card-top">
                    <PlatformBadge platform={item.platform} />
                    <span
                      className={`portal-status is-${item.status === "published" ? "success" : item.status === "scheduled" ? "warning" : "muted"}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="social-preview-thumb">
                    {thumb ? (
                      item.media_type === "video" ? (
                        <video src={thumb} muted playsInline preload="metadata" />
                      ) : (
                        <img src={thumb} alt="" />
                      )
                    ) : (
                      <span>No media</span>
                    )}
                  </div>
                  <div className="social-preview-card-body">
                    <h3>{item.title}</h3>
                    <p>{formatNyDateTime(item.scheduled_for)}</p>
                  </div>
                  <div className="social-preview-card-mock" aria-hidden>
                    <PlatformPreview item={item} platform={layout} compact />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {viewMode === "calendar" && visibleItems.length > 0 && (
          <div className="social-calendar">
            {calendarGroups.map(([day, dayItems]) => (
              <section key={day} className="social-calendar-day">
                <h3>{day === "Unscheduled" ? "Unscheduled" : day}</h3>
                <div className="social-calendar-row">
                  {dayItems.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className="social-calendar-chip"
                      onClick={() => setSelectedId(item.id)}
                    >
                      <PlatformBadge platform={item.platform} />
                      <strong>{item.title}</strong>
                      <span>{formatNyDateTime(item.scheduled_for)}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      {selectedItem && (
        <SocialPostDetail
          item={selectedItem}
          connections={connections}
          publishJob={
            selectedItem === "new"
              ? undefined
              : jobsByContent.get(selectedItem.id)
          }
          busy={busy}
          onClose={() => setSelectedId(null)}
          onSave={saveDetail}
          onUploadMedia={onUploadMedia}
          onQueuePublish={onQueuePublish}
          onScheduleTikTok={onScheduleTikTok}
        />
      )}
    </div>
  );
}
