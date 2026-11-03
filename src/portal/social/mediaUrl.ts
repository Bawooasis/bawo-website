import { getPortalConfig } from "../platformApi";
import type { SocialContentItem } from "../types";

const SOCIAL_MEDIA_BUCKET = "social-media";

/** Public storage URL for uploaded Control Center social media. */
export function resolveSocialMediaUrl(
  mediaPath: string | null | undefined,
): string | null {
  if (!mediaPath) return null;
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;
  const { supabaseUrl } = getPortalConfig();
  const encoded = mediaPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${supabaseUrl}/storage/v1/object/public/${SOCIAL_MEDIA_BUCKET}/${encoded}`;
}

export function socialItemMediaUrl(item: SocialContentItem): string | null {
  return resolveSocialMediaUrl(item.media_path) || item.drive_asset_url || null;
}
