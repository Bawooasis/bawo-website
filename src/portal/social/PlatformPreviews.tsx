import { Heart, MessageCircle, Send, Bookmark, Music2, MoreHorizontal } from "lucide-react";
import type { SocialContentItem } from "../types";
import {
  DEFAULT_HANDLE,
  PLATFORM_LIMITS,
  PREVIEW_LABELS,
  type PreviewPlatform,
  characterCountLabel,
  extractHashtags,
  truncateForPreview,
} from "./platformCopy";
import { socialItemMediaUrl } from "./mediaUrl";

type PreviewProps = {
  item: SocialContentItem;
  platform: PreviewPlatform;
  handle?: string;
  fullCaption?: boolean;
  compact?: boolean;
};

function MediaFrame({
  item,
  aspect,
}: {
  item: SocialContentItem;
  aspect: "square" | "portrait" | "wide";
}) {
  const url = socialItemMediaUrl(item);
  const className = `social-preview-media is-${aspect}`;
  if (!url) {
    return (
      <div className={`${className} is-empty`} aria-hidden>
        <span>No media yet</span>
      </div>
    );
  }
  if (item.media_type === "video" || /\.(mp4|mov|webm)(\?|$)/i.test(url)) {
    return (
      <video
        className={className}
        src={url}
        controls
        playsInline
        preload="metadata"
      />
    );
  }
  return <img className={className} src={url} alt="" />;
}

function CaptionBlock({
  text,
  platform,
  full,
}: {
  text: string;
  platform: PreviewPlatform;
  full?: boolean;
}) {
  const tags = extractHashtags(text);
  const withoutTrailingTags = text
    .replace(/(?:\s*#[\w]+)+\s*$/g, "")
    .trimEnd();
  const source = full ? text : withoutTrailingTags || text;
  const truncatedResult = truncateForPreview(source, platform);
  const body = full ? text : truncatedResult.visible;
  const truncated = !full && truncatedResult.truncated;
  return (
    <div className="social-preview-caption">
      <p>
        {body}
        {truncated ? (
          <span className="social-preview-more"> more</span>
        ) : null}
      </p>
      {!full && tags.length > 0 && (
        <p className="social-preview-hashtags">{tags.join(" ")}</p>
      )}
    </div>
  );
}

function CountBar({
  length,
  platform,
}: {
  length: number;
  platform: PreviewPlatform;
}) {
  const limit = PLATFORM_LIMITS[platform];
  const over = length > limit;
  return (
    <div className={`social-preview-count ${over ? "is-over" : ""}`}>
      <span>{PREVIEW_LABELS[platform]}</span>
      <span>{characterCountLabel(length, platform)}</span>
    </div>
  );
}

export function PlatformPreview({
  item,
  platform,
  handle = DEFAULT_HANDLE,
  fullCaption = false,
  compact = false,
}: PreviewProps) {
  const caption = [item.hook, item.caption, item.call_to_action]
    .filter(Boolean)
    .join("\n\n");
  const shell = `social-preview social-preview--${platform} ${compact ? "is-compact" : ""}`;

  if (platform === "instagram_feed") {
    return (
      <article className={shell}>
        <header className="social-preview-header">
          <span className="social-preview-avatar" aria-hidden />
          <div>
            <strong>{handle.replace(/^@/, "")}</strong>
            <small>Instagram feed</small>
          </div>
          <MoreHorizontal aria-hidden />
        </header>
        <MediaFrame item={item} aspect="square" />
        <div className="social-preview-actions">
          <Heart aria-hidden />
          <MessageCircle aria-hidden />
          <Send aria-hidden />
          <Bookmark aria-hidden className="is-end" />
        </div>
        <CaptionBlock text={caption} platform={platform} full={fullCaption} />
        <CountBar length={caption.length} platform={platform} />
      </article>
    );
  }

  if (platform === "instagram_reel" || platform === "tiktok") {
    return (
      <article className={shell}>
        <div className="social-preview-portrait-wrap">
          <MediaFrame item={item} aspect="portrait" />
          <div className="social-preview-portrait-overlay">
            <div className="social-preview-side-rail">
              <Heart aria-hidden />
              <MessageCircle aria-hidden />
              <Send aria-hidden />
            </div>
            <div className="social-preview-portrait-meta">
              <strong>{handle}</strong>
              <CaptionBlock text={caption} platform={platform} full={fullCaption} />
              <p className="social-preview-sound">
                <Music2 aria-hidden /> Original sound · BawoSocial
              </p>
            </div>
          </div>
        </div>
        <CountBar length={caption.length} platform={platform} />
      </article>
    );
  }

  if (platform === "linkedin") {
    return (
      <article className={shell}>
        <header className="social-preview-header">
          <span className="social-preview-avatar is-square" aria-hidden />
          <div>
            <strong>BawoSocial</strong>
            <small>Culture hub for Nigerians in the diaspora · LinkedIn</small>
          </div>
        </header>
        <CaptionBlock text={caption} platform={platform} full={fullCaption} />
        {!fullCaption && truncateForPreview(caption, platform).truncated ? (
          <button type="button" className="social-preview-see-more">
            see more
          </button>
        ) : null}
        <MediaFrame item={item} aspect="wide" />
        <CountBar length={caption.length} platform={platform} />
      </article>
    );
  }

  if (platform === "x") {
    return (
      <article className={shell}>
        <header className="social-preview-header">
          <span className="social-preview-avatar" aria-hidden />
          <div>
            <strong>BawoSocial</strong>
            <small>{handle} · X</small>
          </div>
        </header>
        <CaptionBlock text={caption} platform={platform} full />
        <MediaFrame item={item} aspect="wide" />
        <CountBar length={caption.length} platform={platform} />
      </article>
    );
  }

  return (
    <article className={shell}>
      <header className="social-preview-header">
        <span className="social-preview-avatar" aria-hidden />
        <div>
          <strong>BawoSocial</strong>
          <small>Facebook</small>
        </div>
      </header>
      <CaptionBlock text={caption} platform={platform} full={fullCaption} />
      <MediaFrame item={item} aspect="wide" />
      <CountBar length={caption.length} platform={platform} />
    </article>
  );
}

export function PlatformBadge({
  platform,
}: {
  platform: SocialContentItem["platform"] | PreviewPlatform | string;
}) {
  const label =
    platform === "instagram"
      ? "Instagram"
      : platform === "tiktok"
        ? "TikTok"
        : PREVIEW_LABELS[platform as PreviewPlatform] || String(platform);
  return <span className={`social-platform-badge is-${platform}`}>{label}</span>;
}
