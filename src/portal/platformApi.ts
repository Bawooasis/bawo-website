import type {
  AdminBootstrapResponse,
  BusinessProfilePatch,
  DirectoryListing,
  ModerationAction,
  PortalConfig,
  PortalSession,
  SocialPostDraft,
  VendorClaimSubmission,
  VendorPortalBootstrapResponse,
} from "./types";

const SESSION_KEY = "bawo.portal.session.v1";
const PROD_SUPABASE_URL = "https://wyarfsymnyrraowwluhf.supabase.co";
const PROD_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5YXJmc3ltbnlycmFvd3dsdWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NjkyNDksImV4cCI6MjA4MzA0NTI0OX0.c9c43u8c2v2l-t3cW2h8z-xT8B0s2N9mG7qR5vY1wE0";

export function readPortalConfig(): PortalConfig {
  const env = import.meta.env as Record<string, string | undefined>;
  const supabaseUrl = (env.VITE_SUPABASE_URL || PROD_SUPABASE_URL).replace(/\/+$/, "");
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || PROD_SUPABASE_ANON_KEY;

  return {
    supabaseUrl,
    supabaseAnonKey,
    adminPortalUrl: env.VITE_ADMIN_PORTAL_URL || `${supabaseUrl}/functions/v1/admin-portal`,
    vendorPortalUrl: env.VITE_VENDOR_PORTAL_URL || `${supabaseUrl}/functions/v1/vendor-portal`,
  };
}

export class PlatformApi {
  readonly config: PortalConfig;

  constructor(config = readPortalConfig()) {
    this.config = config;
  }

  get isConfigured(): boolean {
    return Boolean(this.config.supabaseUrl && this.config.supabaseAnonKey);
  }

  getStoredSession(): PortalSession | null {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PortalSession;
      if (!parsed?.accessToken || !parsed?.user?.id) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore storage failures in restricted browser modes.
    }
  }

  async signIn(email: string, password: string): Promise<PortalSession> {
    if (!this.isConfigured) {
      throw new Error("Portal backend is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    }

    const response = await fetch(`${this.config.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: this.config.supabaseAnonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload?.access_token || !payload?.user?.id) {
      throw new Error(payload?.error_description || payload?.msg || "Unable to sign in with those credentials.");
    }

    const session: PortalSession = {
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
      expiresAt: payload.expires_at,
      user: {
        id: payload.user.id,
        email: payload.user.email,
      },
    };

    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Session still works in-memory for the active tab.
    }

    return session;
  }

  async signUpBusiness(
    email: string,
    password: string,
    contactName: string,
    businessName: string
  ): Promise<{ session: PortalSession | null; confirmationRequired: boolean }> {
    if (!this.isConfigured) {
      throw new Error("Portal backend is not configured.");
    }

    const response = await fetch(`${this.config.supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        apikey: this.config.supabaseAnonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
        data: {
          full_name: contactName.trim(),
          business_name: businessName.trim(),
          account_type: "business",
        },
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        payload?.error_description || payload?.msg || payload?.message || "Unable to create your BawoSocial business account."
      );
    }

    if (payload?.access_token && payload?.user?.id) {
      const session: PortalSession = {
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
        expiresAt: payload.expires_at,
        user: {
          id: payload.user.id,
          email: payload.user.email,
        },
      };
      try {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch {
        // Ignore storage failures
      }
      return { session, confirmationRequired: false };
    }

    return { session: null, confirmationRequired: true };
  }

  async requestPasswordReset(email: string): Promise<void> {
    if (!this.isConfigured) {
      throw new Error("Portal backend is not configured.");
    }

    const response = await fetch(`${this.config.supabaseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        apikey: this.config.supabaseAnonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.trim() }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.error_description || payload?.msg || "Unable to send password reset email.");
    }
  }

  async fetchAdminBootstrap(session: PortalSession): Promise<AdminBootstrapResponse> {
    return this.callFunction<AdminBootstrapResponse>(this.config.adminPortalUrl, session, {
      action: "bootstrap",
    });
  }

  async runModerationAction(
    session: PortalSession,
    action: ModerationAction,
    targetId: string,
    notes?: string
  ): Promise<void> {
    await this.callFunction(this.config.adminPortalUrl, session, {
      action,
      targetId,
      notes,
    });
  }

  async createSocialDraft(session: PortalSession, draft: SocialPostDraft): Promise<void> {
    await this.callFunction(this.config.adminPortalUrl, session, {
      action: "create_social_draft",
      draft,
    });
  }

  async startInstagramOAuth(session: PortalSession, returnTo = window.location.origin + "/admin"): Promise<string> {
    const result = await this.callFunction<{ authUrl: string }>(this.config.adminPortalUrl, session, {
      action: "start_instagram_oauth",
      returnTo,
    });
    if (!result?.authUrl) throw new Error("Instagram OAuth did not return a redirect URL.");
    return result.authUrl;
  }

  async disconnectInstagram(session: PortalSession, connectionId?: string): Promise<void> {
    await this.callFunction(this.config.adminPortalUrl, session, {
      action: "disconnect_instagram",
      connectionId,
    });
  }

  async uploadSocialMedia(session: PortalSession, file: File): Promise<string> {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      throw new Error("Choose an image or video file.");
    }
    if (file.size > 8 * 1024 * 1024) {
      throw new Error("Keep uploads under 8 MB for direct portal publishing.");
    }

    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read that media file."));
      reader.onload = () => {
        const value = String(reader.result || "");
        resolve(value.includes(",") ? value.split(",")[1] : value);
      };
      reader.readAsDataURL(file);
    });

    const result = await this.callFunction<{ mediaUrl: string }>(this.config.adminPortalUrl, session, {
      action: "upload_social_media",
      fileName: file.name,
      contentType: file.type,
      base64Data,
    });
    if (!result?.mediaUrl) throw new Error("Upload completed without a public media URL.");
    return result.mediaUrl;
  }

  async publishInstagramPost(
    session: PortalSession,
    draft: SocialPostDraft & { postId?: string; mode: "publish_now" | "schedule" }
  ): Promise<{ status: string; externalPostId?: string | null }> {
    return this.callFunction(this.config.adminPortalUrl, session, {
      action: "publish_instagram_post",
      draft,
    });
  }

  async updateSocialPostStatus(
    session: PortalSession,
    postId: string,
    status: "draft" | "scheduled" | "published" | "archived",
    postUrl?: string
  ): Promise<void> {
    await this.callFunction(this.config.adminPortalUrl, session, {
      action: "update_social_post_status",
      postId,
      status,
      postUrl,
    });
  }

  async fetchVendorBootstrap(session: PortalSession): Promise<VendorPortalBootstrapResponse> {
    return this.callFunction<VendorPortalBootstrapResponse>(this.config.vendorPortalUrl, session, {
      action: "bootstrap",
    });
  }

  async searchClaimableListings(session: PortalSession, query: string): Promise<DirectoryListing[]> {
    const result = await this.callFunction<{ listings: DirectoryListing[] }>(
      this.config.vendorPortalUrl,
      session,
      { action: "search_listings", query }
    );
    return result.listings || [];
  }

  async submitVendorClaim(session: PortalSession, claim: VendorClaimSubmission): Promise<void> {
    await this.callFunction(this.config.vendorPortalUrl, session, {
      action: "submit_claim",
      claim,
    });
  }

  async updateVendorListing(session: PortalSession, patch: BusinessProfilePatch): Promise<void> {
    await this.callFunction(this.config.vendorPortalUrl, session, {
      action: "update_listing",
      patch,
    });
  }

  private async callFunction<T = Record<string, unknown>>(
    url: string,
    session: PortalSession,
    body: Record<string, unknown>
  ): Promise<T> {
    if (!url) {
      throw new Error("Portal Edge Function URL is not configured.");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        apikey: this.config.supabaseAnonKey,
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message =
        payload?.error ||
        payload?.message ||
        `Portal request failed with status ${response.status}. Deploy the portal Edge Functions before using live data.`;
      throw new Error(message);
    }

    return payload as T;
  }
}
