export type PortalMode = "admin" | "business";

export type PortalSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in?: number;
  user?: {
    id: string;
    email?: string;
  };
};

export type PlatformMetrics = {
  users: number;
  suspendedUsers: number;
  admins: number;
  groups: number;
  activeGroups: number;
  pendingGroupRequests: number;
  pendingBusinessClaims: number;
  pendingReports: number;
};

export type PlatformUser = {
  id: string;
  email: string | null;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  is_active: boolean | null;
  account_status: string | null;
  suspended_at: string | null;
  suspension_reason: string | null;
  is_admin: boolean | null;
  role: string | null;
  admin_level: string | null;
  admin_permissions: string[] | null;
  created_at: string | null;
  last_active: string | null;
};

export type PlatformGroup = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  member_count: number | null;
  is_public: boolean | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  image_url: string | null;
  cover_image_url: string | null;
  created_at: string | null;
  last_activity: string | null;
};

export type GroupRequest = {
  id: string;
  user_id: string;
  group_name: string;
  description: string;
  status: string;
  votes: number;
  created_at: string;
};

export type BusinessClaim = {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  contact?: string | null;
  status: string;
  approved_resource_id?: string | null;
  created_at: string | null;
};

export type AuditEntry = {
  id: string;
  actor_user_id: string;
  action: string;
  target_type: string;
  target_id: string;
  outcome: string;
  reason: string | null;
  created_at: string;
};

export type SocialPlatform = "tiktok" | "instagram";
export type SocialContentStatus = "idea" | "scripted" | "ready" | "scheduled" | "published";

export type SocialContentItem = {
  id: string;
  platform: SocialPlatform;
  title: string;
  content_type: "short_video" | "carousel" | "story" | "static" | "live";
  status: SocialContentStatus;
  goal: "awareness" | "engagement" | "downloads" | "leads" | "vendors" | "events";
  hook: string;
  caption: string;
  call_to_action: string;
  owner_name: string;
  scheduled_for: string | null;
  published_at: string | null;
  post_url: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  follows: number;
  link_clicks: number;
  created_at: string;
  updated_at: string;
};

export type AdminOverview = {
  currentAdmin: {
    id: string;
    email: string | null;
    displayName: string | null;
    adminLevel: string | null;
    permissions: string[];
  };
  metrics: PlatformMetrics;
  users: PlatformUser[];
  groups: PlatformGroup[];
  groupRequests: GroupRequest[];
  businessClaims: BusinessClaim[];
  socialContent: SocialContentItem[];
  auditLog: AuditEntry[];
};

export type VendorOverview = {
  account: {
    id: string;
    email: string | null;
  };
  metrics: {
    listings: number;
    pendingClaims: number;
    trackedClicks: number | null;
    plan: string | null;
  };
  claims: BusinessClaim[];
  listings: Array<{
    id: string;
    name: string;
    category?: string | null;
    borough?: string | null;
    neighborhood?: string | null;
    image_url?: string | null;
    is_active?: boolean | null;
  }>;
};

export type AdminAction = {
  action:
    | "overview"
    | "suspend_user"
    | "restore_user"
    | "grant_admin"
    | "revoke_admin"
    | "set_group_state"
    | "review_group_request"
    | "review_business_claim"
    | "save_social_content"
    | "archive_social_content";
  targetId?: string;
  reason?: string;
  adminLevel?: "admin" | "moderator";
  permissions?: string[];
  groupState?: {
    isActive?: boolean;
    isFeatured?: boolean;
    name?: string;
    imageUrl?: string | null;
  };
  decision?: "approved" | "rejected";
  socialContent?: {
    platform: SocialPlatform;
    title: string;
    contentType: SocialContentItem["content_type"];
    status: SocialContentStatus;
    goal: SocialContentItem["goal"];
    hook: string;
    caption: string;
    callToAction: string;
    ownerName: string;
    scheduledFor: string | null;
    publishedAt: string | null;
    postUrl: string | null;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    follows: number;
    linkClicks: number;
  };
};

export type VendorClaimInput = {
  businessName: string;
  category: string;
  city: string;
  email: string;
  phone: string;
  website: string;
  message: string;
};
