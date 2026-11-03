import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Clipboard,
  FolderOpen,
  Send,
  Upload,
  X,
} from "lucide-react";
import type {
  SocialConnection,
  SocialContentItem,
  SocialPlatform,
  SocialPublishJob,
} from "../types";
import { PlatformPreview } from "./PlatformPreviews";
import {
  DEFAULT_HANDLE,
  PREVIEW_LABELS,
  type PreviewPlatform,
  formatNyDateTime,
  handleForConnection,
  previewForItem,
} from "./platformCopy";

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
  driveAssetUrl: string;
};

type SocialPostDetailProps = {
  item: SocialContentItem | "new";
  connections: SocialConnection[];
  publishJob?: SocialPublishJob;
  busy: boolean;
  onClose: () => void;
  onSave: (targetId: string, draft: Draft) => Promise<boolean>;
  onUploadMedia: (contentId: string, file: File) => Promise<void>;
  onQueuePublish: (contentId: string, scheduledFor: string) => Promise<boolean>;
  onScheduleTikTok: (contentId: string, scheduledFor: string) => Promise<boolean>;
};

const toLocalDate = (value: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

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
  driveAssetUrl: item.drive_asset_url || "",
});

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
  driveAssetUrl: "",
});

export default function SocialPostDetail({
  item,
  connections,
  publishJob,
  busy,
  onClose,
  onSave,
  onUploadMedia,
  onQueuePublish,
  onScheduleTikTok,
}: SocialPostDetailProps) {
  const isNew = item === "new";
  const [draft, setDraft] = useState<Draft>(
    isNew ? emptyDraft() : fromItem(item),
  );
  const [previewPlatform, setPreviewPlatform] = useState<PreviewPlatform>(
    isNew ? "tiktok" : previewForItem(item),
  );
  const [scheduleAt, setScheduleAt] = useState(
    isNew ? "" : toLocalDate(item.scheduled_for),
  );
  const [confirmMode, setConfirmMode] = useState<"now" | "schedule" | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isNew) {
      setDraft(emptyDraft());
      setPreviewPlatform("tiktok");
      setScheduleAt("");
      return;
    }
    setDraft(fromItem(item));
    setPreviewPlatform(previewForItem(item));
    setScheduleAt(toLocalDate(item.scheduled_for));
  }, [item, isNew]);

  const previewItem: SocialContentItem = useMemo(() => {
    const base =
      isNew
        ? ({
            id: "new",
            platform: draft.platform,
            title: draft.title || "Untitled post",
            content_type: draft.contentType,
            status: draft.status,
            goal: draft.goal,
            hook: draft.hook,
            caption: draft.caption,
            call_to_action: draft.callToAction,
            owner_name: draft.ownerName,
            scheduled_for: draft.scheduledFor || null,
            published_at: draft.publishedAt || null,
            post_url: draft.postUrl || null,
            drive_asset_url: draft.driveAssetUrl || null,
            drive_file_id: null,
            media_path: null,
            media_type: null,
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            saves: 0,
            follows: 0,
            link_clicks: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } satisfies SocialContentItem)
        : {
            ...item,
            platform: draft.platform,
            title: draft.title,
            content_type: draft.contentType,
            status: draft.status,
            goal: draft.goal,
            hook: draft.hook,
            caption: draft.caption,
            call_to_action: draft.callToAction,
            owner_name: draft.ownerName,
            scheduled_for: draft.scheduledFor || null,
            published_at: draft.publishedAt || null,
            post_url: draft.postUrl || null,
            drive_asset_url: draft.driveAssetUrl || null,
          };
    return base;
  }, [draft, isNew, item]);

  const igConnection = connections.find(
    (connection) =>
      connection.platform === "instagram" && connection.status === "connected",
  );
  const handle = handleForConnection(
    draft.platform,
    draft.platform === "instagram" ? igConnection?.username : "bawosocial",
  );

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const targetId = isNew ? "new" : item.id;
    await onSave(targetId, draft);
  };

  const copyPacket = async () => {
    const packet = [draft.hook, draft.caption, draft.callToAction]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(packet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const runSchedule = async () => {
    if (isNew || !confirmMode) return;
    if (draft.platform === "instagram") {
      const when =
        confirmMode === "now"
          ? new Date().toISOString()
          : new Date(scheduleAt || draft.scheduledFor).toISOString();
      const ok = await onQueuePublish(item.id, when);
      if (ok) {
        setConfirmMode(null);
        onClose();
      }
      return;
    }
    if (!scheduleAt && !draft.scheduledFor) return;
    const ok = await onScheduleTikTok(
      item.id,
      new Date(scheduleAt || draft.scheduledFor).toISOString(),
    );
    if (ok) {
      setConfirmMode(null);
      onClose();
    }
  };

  const canScheduleIg =
    !isNew &&
    draft.platform === "instagram" &&
    !!igConnection &&
    !!item.media_path &&
    !["queued", "publishing", "published"].includes(publishJob?.status || "");

  const canScheduleTikTok =
    !isNew &&
    draft.platform === "tiktok" &&
    !!(scheduleAt || draft.scheduledFor);

  return (
    <div className="social-detail-overlay" role="presentation" onClick={onClose}>
      <div
        className="social-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Post detail"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="social-detail-header">
          <div>
            <span className="portal-kicker">Post detail</span>
            <h2>{isNew ? "Plan a BawoSocial post" : draft.title || "Untitled"}</h2>
          </div>
          <button type="button" className="social-detail-close" onClick={onClose} aria-label="Close">
            <X aria-hidden />
          </button>
        </header>

        <div className="social-detail-grid">
          <div className="social-detail-preview-pane">
            <div className="social-preview-switch" role="tablist" aria-label="Preview layout">
              {(Object.keys(PREVIEW_LABELS) as PreviewPlatform[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  className={previewPlatform === key ? "is-active" : ""}
                  onClick={() => setPreviewPlatform(key)}
                >
                  {PREVIEW_LABELS[key]}
                </button>
              ))}
            </div>
            <PlatformPreview
              item={previewItem}
              platform={previewPlatform}
              handle={handle || DEFAULT_HANDLE}
              fullCaption
            />
            <p className="social-detail-ny">
              <CalendarClock aria-hidden />
              Scheduled (America/New_York):{" "}
              {formatNyDateTime(
                draft.scheduledFor
                  ? new Date(draft.scheduledFor).toISOString()
                  : isNew
                    ? null
                    : item.scheduled_for,
              )}
            </p>
            <p className="social-detail-target">
              Target platform: {draft.platform === "tiktok" ? "TikTok" : "Instagram"}
            </p>
          </div>

          <form className="social-detail-form portal-form" onSubmit={save}>
            <div className="portal-form-grid social-form-grid-3">
              <label>
                Platform
                <select
                  value={draft.platform}
                  onChange={(event) => {
                    const next = event.target.value as SocialPlatform;
                    update("platform", next);
                    setPreviewPlatform(next === "tiktok" ? "tiktok" : "instagram_reel");
                  }}
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                </select>
              </label>
              <label>
                Format
                <select
                  value={draft.contentType}
                  onChange={(event) =>
                    update(
                      "contentType",
                      event.target.value as Draft["contentType"],
                    )
                  }
                >
                  <option value="short_video">Short video</option>
                  <option value="carousel">Carousel</option>
                  <option value="story">Story</option>
                  <option value="static">Static</option>
                  <option value="live">Live</option>
                </select>
              </label>
              <label>
                Status
                <select
                  value={draft.status}
                  onChange={(event) =>
                    update("status", event.target.value as Draft["status"])
                  }
                >
                  <option value="idea">Idea</option>
                  <option value="scripted">Scripted</option>
                  <option value="ready">Ready</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>

            <label>
              Content title
              <input
                required
                minLength={2}
                maxLength={120}
                value={draft.title}
                onChange={(event) => update("title", event.target.value)}
              />
            </label>
            <label>
              Opening hook
              <textarea
                rows={2}
                maxLength={500}
                value={draft.hook}
                onChange={(event) => update("hook", event.target.value)}
              />
            </label>
            <label>
              Caption
              <textarea
                rows={5}
                maxLength={4000}
                value={draft.caption}
                onChange={(event) => update("caption", event.target.value)}
              />
            </label>
            <div className="portal-form-grid">
              <label>
                Call to action
                <input
                  maxLength={240}
                  value={draft.callToAction}
                  onChange={(event) => update("callToAction", event.target.value)}
                />
              </label>
              <label>
                Owner
                <input
                  maxLength={100}
                  value={draft.ownerName}
                  onChange={(event) => update("ownerName", event.target.value)}
                />
              </label>
              <label>
                Scheduled for
                <input
                  type="datetime-local"
                  value={draft.scheduledFor}
                  onChange={(event) => {
                    update("scheduledFor", event.target.value);
                    setScheduleAt(event.target.value);
                  }}
                />
              </label>
              <label>
                Live post URL
                <input
                  type="url"
                  value={draft.postUrl}
                  onChange={(event) => update("postUrl", event.target.value)}
                />
              </label>
            </div>
            <label>
              Google Drive asset
              <input
                type="url"
                value={draft.driveAssetUrl}
                onChange={(event) => update("driveAssetUrl", event.target.value)}
              />
            </label>

            {!isNew && draft.platform === "instagram" && (
              <label className="social-upload-button">
                <Upload aria-hidden />{" "}
                {item.media_path ? "Replace media" : "Upload media"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                  disabled={busy}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void onUploadMedia(item.id, file);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            )}

            <div className="social-detail-actions">
              <button type="submit" className="is-primary" disabled={busy}>
                <Send aria-hidden /> Save content
              </button>
              {draft.platform === "tiktok" && (
                <button type="button" disabled={busy} onClick={() => void copyPacket()}>
                  <Clipboard aria-hidden /> {copied ? "Copied" : "Copy post packet"}
                </button>
              )}
              {draft.driveAssetUrl && (
                <a href={draft.driveAssetUrl} target="_blank" rel="noreferrer">
                  <FolderOpen aria-hidden /> Open media
                </a>
              )}
            </div>

            {!isNew && (canScheduleIg || canScheduleTikTok) && (
              <div className="social-detail-schedule">
                <h3>Submit or schedule</h3>
                <p>
                  Uses the existing BawoSocial publishing flow. Confirm before
                  anything is queued.
                </p>
                {draft.platform === "instagram" ? (
                  <div className="social-schedule-row">
                    <input
                      aria-label="Publishing time"
                      type="datetime-local"
                      value={scheduleAt}
                      onChange={(event) => setScheduleAt(event.target.value)}
                    />
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmMode("now")}
                    >
                      Post now
                    </button>
                    <button
                      type="button"
                      disabled={busy || !scheduleAt}
                      onClick={() => setConfirmMode("schedule")}
                    >
                      Schedule
                    </button>
                  </div>
                ) : (
                  <div className="social-schedule-row">
                    <input
                      aria-label="TikTok reminder time"
                      type="datetime-local"
                      value={scheduleAt}
                      onChange={(event) => setScheduleAt(event.target.value)}
                    />
                    <button
                      type="button"
                      disabled={busy || !scheduleAt}
                      onClick={() => setConfirmMode("schedule")}
                    >
                      Add to schedule
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {confirmMode && (
          <div className="social-confirm-sheet" role="alertdialog" aria-modal="true">
            <div>
              <h3>Confirm {confirmMode === "now" ? "post now" : "schedule"}</h3>
              <p>
                {draft.platform === "instagram"
                  ? confirmMode === "now"
                    ? "Queue this Instagram post for publishing now?"
                    : `Schedule this Instagram post for ${formatNyDateTime(new Date(scheduleAt).toISOString())}?`
                  : `Add this TikTok reminder for ${formatNyDateTime(new Date(scheduleAt).toISOString())}?`}
              </p>
              <div className="portal-row-actions">
                <button type="button" onClick={() => setConfirmMode(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="is-primary"
                  disabled={busy}
                  onClick={() => void runSchedule()}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export type { Draft as SocialDetailDraft };
