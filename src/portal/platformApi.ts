import type { PortalSession } from "./types";

const SESSION_KEY = "bawo-platform-session";
const GROUP_IMAGE_BUCKET = "group-images";
const GROUP_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const MAX_GROUP_IMAGE_BYTES = 5 * 1024 * 1024;
const SOCIAL_MEDIA_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
]);
const MAX_SOCIAL_MEDIA_BYTES = 100 * 1024 * 1024;
const DEFAULT_SUPABASE_URL = "https://wyarfsymnyrraowwluhf.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5YXJmc3ltbnlycmFvd3dsdWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTY3MTYsImV4cCI6MjA4NzMxNjcxNn0.wmET17KAduP60VHCSmKeVADKfHcpM3-m53EzeGnQy2I";

/** Owner Control Center account linked in Supabase auth.users / public.users */
export const OWNER_ADMIN_EMAIL = "adegbenroalexander15@gmail.com";
export const OWNER_ADMIN_PHONE_DISPLAY = "(646) 853-8208";
const OWNER_ADMIN_PHONE_DIGITS = "6468538208";
const OWNER_ADMIN_EMAIL_ALIAS = "adegbenroalexxander15@gmail.com";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  error?: string;
  error_description?: string;
  msg?: string;
};

export type PortalConfig = {
  supabaseUrl: string;
  publishableKey: string;
};

export type ResolvedAdminIdentifier = {
  email: string;
  matchedPhone: boolean;
};

export type AuthRedirectParams = {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  type?: string;
  tokenHash?: string;
};

export function getPortalConfig(): PortalConfig {
  return {
    supabaseUrl: String(
      import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL,
    )
      .trim()
      .replace(/\/+$/, ""),
    publishableKey: String(
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        DEFAULT_SUPABASE_PUBLISHABLE_KEY,
    ).trim(),
  };
}

export function isPortalConfigured(config: PortalConfig): boolean {
  return (
    config.supabaseUrl.startsWith("https://") &&
    config.publishableKey.length > 20
  );
}

/**
 * Accepts an email OR Alexander's admin phone in any common format
 * ((646) 853-8208, 646-853-8208, +16468538208, 6468538208) and resolves
 * to the owner admin email at $0 cost (no SMS gateway).
 */
export function resolveAdminIdentifier(
  identifier: string,
): ResolvedAdminIdentifier {
  const trimmed = identifier.trim();
  const digits = trimmed.replace(/\D/g, "");
  const matchedPhone =
    digits === OWNER_ADMIN_PHONE_DIGITS ||
    digits === `1${OWNER_ADMIN_PHONE_DIGITS}` ||
    (digits.length >= 10 && digits.endsWith(OWNER_ADMIN_PHONE_DIGITS));

  if (matchedPhone) {
    return { email: OWNER_ADMIN_EMAIL, matchedPhone: true };
  }

  let email = trimmed.toLowerCase();
  if (email === OWNER_ADMIN_EMAIL_ALIAS) {
    email = OWNER_ADMIN_EMAIL;
  }
  return { email, matchedPhone: false };
}

/** Parse Supabase recovery / OAuth redirect tokens from hash or query string. */
export function parseAuthRedirectParams(): AuthRedirectParams {
  const hash = window.location.hash.replace(/^#/, "");
  const search = window.location.search.replace(/^\?/, "");
  const fromHash = new URLSearchParams(hash);
  const fromSearch = new URLSearchParams(search);

  const read = (key: string) =>
    fromHash.get(key) || fromSearch.get(key) || undefined;

  const expiresRaw = read("expires_in");
  return {
    accessToken: read("access_token") || undefined,
    refreshToken: read("refresh_token") || undefined,
    expiresIn: expiresRaw ? Number(expiresRaw) : undefined,
    type: read("type") || undefined,
    tokenHash: read("token_hash") || undefined,
  };
}

export function clearAuthRedirectFromUrl(): void {
  const params = new URLSearchParams(window.location.search);
  for (const key of [
    "access_token",
    "refresh_token",
    "expires_in",
    "token_hash",
    "type",
    "error",
    "error_description",
  ]) {
    params.delete(key);
  }
  const query = params.toString();
  const clean = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState({}, document.title, clean);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!response.ok || body.success === false) {
    throw new Error(
      body.error_description ||
        body.msg ||
        body.error ||
        `Request failed (${response.status})`,
    );
  }
  return (body.data ?? body) as T;
}

export class PlatformApi {
  private readonly config: PortalConfig;

  constructor(config = getPortalConfig()) {
    this.config = config;
  }

  getConfig(): PortalConfig {
    return this.config;
  }

  getSession(): PortalSession | null {
    try {
      const stored = window.localStorage.getItem(SESSION_KEY);
      return stored ? (JSON.parse(stored) as PortalSession) : null;
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  private saveSession(session: PortalSession): PortalSession {
    const expiresAt =
      session.expires_at ||
      Math.floor(Date.now() / 1000) + Number(session.expires_in || 3600);
    const stored = { ...session, expires_at: expiresAt };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
    return stored;
  }

  /** Persist a session recovered from a Supabase email link hash. */
  saveHashSession(
    accessToken: string,
    refreshToken: string,
    expiresIn?: number,
  ): PortalSession {
    return this.saveSession({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn || 3600,
      expires_at: Math.floor(Date.now() / 1000) + Number(expiresIn || 3600),
    });
  }

  getOAuthUrl(
    provider: "google" | "apple",
    redirectPath: "/admin" | "/businesses",
  ): string {
    const redirectTo = `${window.location.origin}${redirectPath}`;
    return `${this.config.supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
  }

  async signIn(email: string, password: string): Promise<PortalSession> {
    const response = await fetch(
      `${this.config.supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          apikey: this.config.publishableKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );
    return this.saveSession(await parseResponse<PortalSession>(response));
  }

  async signUpBusiness(
    email: string,
    password: string,
    contactName: string,
    businessName: string,
  ): Promise<{ session: PortalSession | null }> {
    const response = await fetch(`${this.config.supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        apikey: this.config.publishableKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          display_name: contactName,
          first_name: contactName.split(" ")[0] || contactName,
          last_name: contactName.split(" ").slice(1).join(" ") || "",
          business_name: businessName,
          account_type: "business",
        },
      }),
    });
    const payload = await parseResponse<
      PortalSession & { access_token?: string }
    >(response);
    if (
      payload &&
      typeof payload.access_token === "string" &&
      payload.access_token
    ) {
      return { session: this.saveSession(payload) };
    }
    return { session: null };
  }

  async requestPasswordReset(
    email: string,
    redirectPath: "/admin" | "/businesses" = "/businesses",
  ): Promise<void> {
    const response = await fetch(`${this.config.supabaseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        apikey: this.config.publishableKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        redirect_to: `${window.location.origin}${redirectPath}`,
      }),
    });
    if (!response.ok) {
      await parseResponse<Record<string, unknown>>(response);
    }
  }

  /** Verify a 6-digit email recovery / OTP code (free Supabase Auth). */
  async verifyEmailCode(
    email: string,
    token: string,
    type: "recovery" | "email" = "recovery",
  ): Promise<PortalSession> {
    const response = await fetch(`${this.config.supabaseUrl}/auth/v1/verify`, {
      method: "POST",
      headers: {
        apikey: this.config.publishableKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, email, token: token.trim() }),
    });
    return this.saveSession(await parseResponse<PortalSession>(response));
  }

  /** Verify a token_hash from a recovery email link query param. */
  async verifyTokenHash(
    tokenHash: string,
    type: string = "recovery",
  ): Promise<PortalSession> {
    const response = await fetch(`${this.config.supabaseUrl}/auth/v1/verify`, {
      method: "POST",
      headers: {
        apikey: this.config.publishableKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, token_hash: tokenHash }),
    });
    return this.saveSession(await parseResponse<PortalSession>(response));
  }

  async updatePassword(newPassword: string): Promise<void> {
    const session = await this.activeSession();
    const response = await fetch(`${this.config.supabaseUrl}/auth/v1/user`, {
      method: "PUT",
      headers: {
        apikey: this.config.publishableKey,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    });
    await parseResponse<Record<string, unknown>>(response);
  }

  private async refreshSession(): Promise<PortalSession> {
    const session = this.getSession();
    if (!session?.refresh_token) {
      throw new Error("Your session expired. Sign in again.");
    }
    const response = await fetch(
      `${this.config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          apikey: this.config.publishableKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: session.refresh_token }),
      },
    );
    return this.saveSession(await parseResponse<PortalSession>(response));
  }

  private async activeSession(): Promise<PortalSession> {
    const session = this.getSession();
    if (!session?.access_token) throw new Error("Sign in to continue.");
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at <= now + 60) return this.refreshSession();
    return session;
  }

  async invoke<T>(
    functionName: "platform-control-center" | "vendor-portal",
    payload: object,
    retry = true,
  ): Promise<T> {
    const session = await this.activeSession();
    const response = await fetch(
      `${this.config.supabaseUrl}/functions/v1/${functionName}`,
      {
        method: "POST",
        headers: {
          apikey: this.config.publishableKey,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    if (response.status === 401 && retry) {
      await this.refreshSession();
      return this.invoke<T>(functionName, payload, false);
    }
    return parseResponse<T>(response);
  }

  async uploadGroupImage(
    groupId: string,
    file: File,
    retry = true,
  ): Promise<string> {
    if (!GROUP_IMAGE_TYPES.has(file.type)) {
      throw new Error("Choose a JPG, PNG, GIF, or WebP image.");
    }
    if (file.size > MAX_GROUP_IMAGE_BYTES) {
      throw new Error("Group pictures must be 5 MB or smaller.");
    }

    const session = await this.activeSession();
    const extension =
      file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const safeGroupId = groupId.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
    const objectPath = `control-center/${safeGroupId}/${crypto.randomUUID()}.${extension}`;
    const encodedPath = objectPath
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const response = await fetch(
      `${this.config.supabaseUrl}/storage/v1/object/${GROUP_IMAGE_BUCKET}/${encodedPath}`,
      {
        method: "POST",
        headers: {
          apikey: this.config.publishableKey,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": file.type,
          "Cache-Control": "3600",
          "x-upsert": "false",
        },
        body: file,
      },
    );
    if (response.status === 401 && retry) {
      await this.refreshSession();
      return this.uploadGroupImage(groupId, file, false);
    }
    await parseResponse<Record<string, string>>(response);
    return `${this.config.supabaseUrl}/storage/v1/object/public/${GROUP_IMAGE_BUCKET}/${encodedPath}`;
  }

  async uploadSocialMedia(contentId: string, file: File): Promise<void> {
    if (!SOCIAL_MEDIA_TYPES.has(file.type)) {
      throw new Error("Choose a JPG, PNG, WebP, MP4, or MOV file.");
    }
    if (file.size > MAX_SOCIAL_MEDIA_BYTES) {
      throw new Error("Social media files must be 100 MB or smaller.");
    }
    const upload = await this.invoke<{ signedUrl: string }>(
      "platform-control-center",
      {
        action: "create_social_upload",
        targetId: contentId,
        socialUpload: {
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
        },
      },
    );
    const response = await fetch(upload.signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type, "x-upsert": "false" },
      body: file,
    });
    if (!response.ok) throw new Error("Media upload failed. Try again.");
  }

  signOut(): void {
    window.localStorage.removeItem(SESSION_KEY);
  }
}
