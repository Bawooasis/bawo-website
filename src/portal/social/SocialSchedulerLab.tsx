import "../portal.css";
import SocialMediaPanel from "../SocialMediaPanel";
import type {
  SocialConnection,
  SocialContentItem,
  SocialPublishJob,
} from "../types";

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=900&q=80";
const SAMPLE_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const now = Date.now();
const hours = (n: number) => new Date(now + n * 3600_000).toISOString();

const fixtureItems: SocialContentItem[] = [
  {
    id: "lab-ig-feed",
    platform: "instagram",
    title: "Sunday jollof table",
    content_type: "static",
    status: "ready",
    goal: "engagement",
    hook: "When the pot comes off the fire,",
    caption:
      "the whole block already knows. Tag the cousin who brings the best plantain. #BawoSocial #NYCNaija #Jollof",
    call_to_action: "Download BawoSocial and find your people in NYC.",
    owner_name: "Content",
    scheduled_for: hours(26),
    published_at: null,
    post_url: null,
    drive_asset_url: SAMPLE_IMAGE,
    drive_file_id: null,
    media_path: null,
    media_type: "image",
    views: 1200,
    likes: 84,
    comments: 11,
    shares: 6,
    saves: 19,
    follows: 3,
    link_clicks: 8,
    created_at: hours(-40),
    updated_at: hours(-2),
  },
  {
    id: "lab-ig-reel",
    platform: "instagram",
    title: "Night market reel",
    content_type: "short_video",
    status: "scheduled",
    goal: "awareness",
    hook: "Follow the drums down Flatbush.",
    caption:
      "Soft life is a group activity. Save this route for Friday. #BawoSocial #Brooklyn",
    call_to_action: "Open BawoSocial for tonight's circle.",
    owner_name: "Content",
    scheduled_for: hours(8),
    published_at: null,
    post_url: null,
    drive_asset_url: SAMPLE_VIDEO,
    drive_file_id: null,
    media_path: null,
    media_type: "video",
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    follows: 0,
    link_clicks: 0,
    created_at: hours(-12),
    updated_at: hours(-1),
  },
  {
    id: "lab-tiktok",
    platform: "tiktok",
    title: "Afrobeats commute",
    content_type: "short_video",
    status: "scheduled",
    goal: "downloads",
    hook: "POV: your playlist knows the borough better than Maps.",
    caption:
      "Drop a borough in the comments if you want the next meetup map. Original sound ready. #BawoSocial #Afrobeats #NYC",
    call_to_action: "Get BawoSocial on the App Store.",
    owner_name: "Growth",
    scheduled_for: hours(50),
    published_at: null,
    post_url: null,
    drive_asset_url: SAMPLE_VIDEO,
    drive_file_id: null,
    media_path: null,
    media_type: "video",
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    follows: 0,
    link_clicks: 0,
    created_at: hours(-20),
    updated_at: hours(-3),
  },
  {
    id: "lab-idea",
    platform: "tiktok",
    title: "Vendor spotlight draft",
    content_type: "short_video",
    status: "idea",
    goal: "vendors",
    hook: "Three Nigerian owned shops you keep walking past.",
    caption: "Draft only. Media coming soon. #BawoSocial",
    call_to_action: "Claim your shop on BawoSocial.",
    owner_name: "Partnerships",
    scheduled_for: null,
    published_at: null,
    post_url: null,
    drive_asset_url: null,
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
    created_at: hours(-5),
    updated_at: hours(-5),
  },
];

const fixtureConnections: SocialConnection[] = [
  {
    id: "lab-ig-conn",
    platform: "instagram",
    platform_account_id: "demo",
    username: "bawosocial",
    account_type: "BUSINESS",
    status: "connected",
    scopes: ["instagram_basic"],
    token_expires_at: hours(720),
    connected_at: hours(-200),
    updated_at: hours(-10),
  },
];

const fixtureJobs: SocialPublishJob[] = [];

/** Fixture lab for Control Center social scheduler screenshots (no auth). */
export default function SocialSchedulerLab() {
  return (
    <div className="social-lab-shell">
      <SocialMediaPanel
        items={fixtureItems}
        connections={fixtureConnections}
        publishJobs={fixtureJobs}
        busy={false}
        onAction={async () => true}
        onConnectInstagram={async () => undefined}
        onUploadMedia={async () => undefined}
        onQueuePublish={async () => true}
        onScheduleTikTok={async () => true}
      />
    </div>
  );
}
