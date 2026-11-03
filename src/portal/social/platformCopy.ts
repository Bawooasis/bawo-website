import type { SocialContentItem, SocialPlatform } from "../types";

/** Preview layouts we can render without changing stored platforms. */
export type PreviewPlatform =
  | "instagram_feed"
  | "instagram_reel"
  | "tiktok"
  | "linkedin"
  | "x"
  | "facebook";

export const PLATFORM_LIMITS: Record<PreviewPlatform, number> = {
  instagram_feed: 2200,
  instagram_reel: 2200,
  tiktok: 4000,
  linkedin: 3000,
  x: 280,
  facebook: 63206,
};

export const PREVIEW_LABELS: Record<PreviewPlatform, string> = {
  instagram_feed: "Instagram feed",
  instagram_reel: "Instagram Reels",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
  facebook: "Facebook",
};

export const DEFAULT_HANDLE = "@bawosocial";

export function previewForItem(item: SocialContentItem): PreviewPlatform {
  if (item.platform === "tiktok") return "tiktok";
  if (item.content_type === "story" || item.content_type === "short_video") {
    return "instagram_reel";
  }
  return "instagram_feed";
}

export function truncateForPreview(
  text: string,
  platform: PreviewPlatform,
): { visible: string; truncated: boolean } {
  const soft: Record<PreviewPlatform, number> = {
    instagram_feed: 125,
    instagram_reel: 90,
    tiktok: 100,
    linkedin: 140,
    x: 280,
    facebook: 125,
  };
  const limit = soft[platform];
  if (text.length <= limit) return { visible: text, truncated: false };
  return { visible: `${text.slice(0, limit).trimEnd()}…`, truncated: true };
}

export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w]+/g);
  return matches ? Array.from(new Set(matches)) : [];
}

export function formatNyDateTime(value: string | null | undefined): string {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

export function formatNyDayKey(value: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function handleForConnection(
  platform: SocialPlatform,
  username: string | null | undefined,
): string {
  if (!username) return DEFAULT_HANDLE;
  return username.startsWith("@") ? username : `@${username}`;
}

export function characterCountLabel(
  length: number,
  platform: PreviewPlatform,
): string {
  const limit = PLATFORM_LIMITS[platform];
  return `${length} / ${limit}`;
}
