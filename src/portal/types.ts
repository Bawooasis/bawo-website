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
    | "review_business_claim";
  targetId?: string;
  reason?: string;
  adminLevel?: "admin" | "moderator";
  permissions?: string[];
  groupState?: {
    isActive?: boolean;
    isFeatured?: boolean;
  };
  decision?: "approved" | "rejected";
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
