import type {
  ClientDirectoryResource,
  ClientJobPartner,
  ClientRestaurant,
  CmsListingRelationship,
} from "./clientTypes";
import type {
  CmsMediaAsset,
  MediaDirectoryResource,
  MediaRestaurant,
} from "./mediaTypes";
import type { PortalSession } from "./types";

const SESSION_KEY = "bawo-platform-session";
const GROUP_IMAGE_BUCKET = "group-images";
const RESOURCE_IMAGE_BUCKET = "resource-images";
const GROUP_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const MAX_GROUP_IMAGE_BYTES = 5 * 1024 * 1024;
const CMS_MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_CMS_MEDIA_BYTES = 5 * 1024 * 1024;
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
export function parseAuthRedirectParams(
  rawUrl?: string,
): AuthRedirectParams {
  if (rawUrl && rawUrl.trim()) {
    return parsePastedAuthUrl(rawUrl.trim());
  }

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
    tokenHash: read("token_hash") || read("token") || undefined,
  };
}

/**
 * Parse a pasted recovery artifact from email or browser address bar:
 * - Supabase verify link: .../auth/v1/verify?token=<hex>&type=recovery
 * - Broken SITE_URL redirect: http://localhost:3000/#access_token=...&type=recovery
 * - Raw hex token / token_hash
 * - 6–8 digit OTP
 */
export type RecoveryPasteKind =
  | "session_hash"
  | "verify_link"
  | "raw_token"
  | "otp_code"
  | "unknown";

export type ParsedRecoveryPaste = {
  kind: RecoveryPasteKind;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  type?: string;
  token?: string;
  tokenHash?: string;
  email?: string;
};

function parseQueryAndHash(raw: string): URLSearchParams {
  const params = new URLSearchParams();
  try {
    const url = new URL(raw);
    url.searchParams.forEach((value, key) => params.set(key, value));
    const hash = url.hash.replace(/^#/, "");
    if (hash) {
      const hashParams = new URLSearchParams(hash);
      hashParams.forEach((value, key) => {
        if (!params.has(key)) params.set(key, value);
      });
    }
  } catch {
    // Not a full URL — try bare query/hash fragments.
    const cleaned = raw.replace(/^[?#]/, "");
    const asParams = new URLSearchParams(cleaned);
    asParams.forEach((value, key) => params.set(key, value));
  }
  return params;
}

export function parsePastedAuthUrl(rawInput: string): AuthRedirectParams {
  const params = parseQueryAndHash(rawInput.trim());
  const expiresRaw = params.get("expires_in") || undefined;
  return {
    accessToken: params.get("access_token") || undefined,
    refreshToken: params.get("refresh_token") || undefined,
    expiresIn: expiresRaw ? Number(expiresRaw) : undefined,
    type: params.get("type") || undefined,
    tokenHash: params.get("token_hash") || params.get("token") || undefined,
  };
}

export function parseRecoveryPaste(rawInput: string): ParsedRecoveryPaste {
  const trimmed = rawInput.trim().replace(/^['"]|['"]$/g, "");
  if (!trimmed) return { kind: "unknown" };

  // Option B: localhost / any origin hash with access_token after clicking email link
  if (
    /access_token=/i.test(trimmed) ||
    /#access_token=/i.test(trimmed) ||
    trimmed.includes("refresh_token=")
  ) {
    const parsed = parsePastedAuthUrl(trimmed);
    if (parsed.accessToken && parsed.refreshToken) {
      return {
        kind: "session_hash",
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        expiresIn: parsed.expiresIn,
        type: parsed.type || "recovery",
      };
    }
  }

  // Option A: full ConfirmationURL / verify link from email
  if (
    /\/auth\/v1\/verify/i.test(trimmed) ||
    /[?&]token=/i.test(trimmed) ||
    /[?&]token_hash=/i.test(trimmed)
  ) {
    const params = parseQueryAndHash(trimmed);
    const token = params.get("token") || undefined;
    const tokenHash = params.get("token_hash") || token || undefined;
    const type = params.get("type") || "recovery";
    const email = params.get("email") || undefined;
    if (tokenHash || token) {
      return {
        kind: "verify_link",
        token,
        tokenHash,
        type,
        email: email || undefined,
      };
    }
  }

  // Raw 56-char (or similar) hex token from the email URL's token= param
  if (/^[a-f0-9]{20,128}$/i.test(trimmed)) {
    return {
      kind: "raw_token",
      token: trimmed,
      tokenHash: trimmed,
      type: "recovery",
    };
  }

  // Option C: 6–8 digit OTP
  if (/^\d{6,8}$/.test(trimmed)) {
    return { kind: "otp_code", token: trimmed, type: "recovery" };
  }

  // Last resort: if it looks like a URL with a token somewhere, try again
  if (/^https?:\/\//i.test(trimmed)) {
    const parsed = parsePastedAuthUrl(trimmed);
    if (parsed.accessToken && parsed.refreshToken) {
      return {
        kind: "session_hash",
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        expiresIn: parsed.expiresIn,
        type: parsed.type || "recovery",
      };
    }
    if (parsed.tokenHash) {
      return {
        kind: "verify_link",
        tokenHash: parsed.tokenHash,
        token: parsed.tokenHash,
        type: parsed.type || "recovery",
      };
    }
  }

  return { kind: "unknown", token: trimmed };
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

function extractFallbackToken(rawInput: string): string | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;
  const hex = trimmed.match(/[a-f0-9]{20,128}/i)?.[0];
  if (hex) return hex;
  const digits = trimmed.match(/\b\d{6,8}\b/)?.[0];
  return digits || null;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  return parseResponseFromText<T>(text, response.ok, response.status);
}

function parseResponseFromText<T>(
  text: string,
  ok: boolean,
  status: number,
): T {
  let body: ApiEnvelope<T> | T = {} as T;
  if (text) {
    try {
      body = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      if (!ok) throw new Error(`Request failed (${status})`);
      throw new Error("Unexpected response from BawoSocial.");
    }
  }
  const envelope = body as ApiEnvelope<T>;
  if (
    !ok ||
    (envelope &&
      typeof envelope === "object" &&
      "success" in envelope &&
      envelope.success === false)
  ) {
    throw new Error(
      envelope.error_description ||
        envelope.msg ||
        envelope.error ||
        (typeof envelope === "object" &&
        envelope &&
        "message" in envelope &&
        typeof (envelope as { message?: string }).message === "string"
          ? (envelope as { message: string }).message
          : null) ||
        `Request failed (${status})`,
    );
  }
  if (
    envelope &&
    typeof envelope === "object" &&
    "data" in envelope &&
    envelope.data !== undefined
  ) {
    return envelope.data as T;
  }
  return body as T;
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

  /**
   * Prefer the branded `portal-auth-recovery` Edge Function (direct
   * joinbawo.com/admin?token_hash=… email + 6-digit OTP). Only fall back to
   * GoTrue `/auth/v1/recover` when the edge function itself is unreachable,
   * because hosted recover rewrites redirect_to to SITE_URL (localhost:3000).
   */
  async requestPasswordReset(
    email: string,
    redirectTo: string = "/businesses",
  ): Promise<void> {
    const trimmedEmail = email.trim();
    const mode = redirectTo.includes("/admin") ? "admin" : "business";
    const redirectPath = mode === "admin" ? "/admin" : "/businesses";
    const redirectUrl = redirectTo.startsWith("http")
      ? redirectTo
      : `${typeof window !== "undefined" ? window.location.origin : "https://www.joinbawo.com"}${redirectPath}`;

    let edgeUnreachable = false;
    try {
      const edgeResponse = await fetch(
        `${this.config.supabaseUrl}/functions/v1/portal-auth-recovery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: this.config.publishableKey,
            Authorization: `Bearer ${this.config.publishableKey}`,
          },
          body: JSON.stringify({
            identifier: trimmedEmail,
            mode,
          }),
        },
      );

      const payload = (await edgeResponse.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (edgeResponse.ok && payload.success === true) {
        // Clean branded email already sent — do NOT also call /auth/v1/recover.
        return;
      }

      if (edgeResponse.status === 400 || edgeResponse.status === 403) {
        throw new Error(
          payload.error ||
            `Unable to send recovery email (${edgeResponse.status}).`,
        );
      }

      if (edgeResponse.status >= 500) {
        edgeUnreachable = true;
      } else {
        throw new Error(
          payload.error ||
            `Unable to send recovery email (${edgeResponse.status}).`,
        );
      }
    } catch (error) {
      if (!edgeUnreachable) {
        // Network / DNS / CORS failures from fetch()
        const isNetwork =
          error instanceof TypeError ||
          (error instanceof Error &&
            (/Failed to fetch|NetworkError|Load failed|network/i.test(
              error.message,
            ) ||
              error.message.includes("fetch")));
        if (!isNetwork) throw error;
        edgeUnreachable = true;
      }
    }

    if (!edgeUnreachable) return;

    const query = new URLSearchParams({ redirect_to: redirectUrl });
    const response = await fetch(
      `${this.config.supabaseUrl}/auth/v1/recover?${query.toString()}`,
      {
        method: "POST",
        headers: {
          apikey: this.config.publishableKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          redirect_to: redirectUrl,
        }),
      },
    );
    if (!response.ok) {
      await parseResponse<Record<string, unknown>>(response);
    }
  }

  /** Optional magic-link / OTP email (still free Supabase Auth, no SMS). */
  async requestEmailOtp(
    email: string,
    redirectPath: "/admin" | "/businesses" = "/admin",
  ): Promise<void> {
    const redirectUrl = `${window.location.origin}${redirectPath}`;
    const query = new URLSearchParams({ redirect_to: redirectUrl });
    const response = await fetch(
      `${this.config.supabaseUrl}/auth/v1/otp?${query.toString()}`,
      {
        method: "POST",
        headers: {
          apikey: this.config.publishableKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          create_user: false,
          redirect_to: redirectUrl,
        }),
      },
    );
    if (!response.ok) {
      await parseResponse<Record<string, unknown>>(response);
    }
  }

  /** Verify a 6-digit email recovery / OTP code (free Supabase Auth). */
  async verifyEmailCode(
    email: string,
    token: string,
    type: "recovery" | "email" | "magiclink" = "recovery",
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

  /**
   * Verify the 56-char hex `token` from Supabase ConfirmationURL via
   * POST /auth/v1/verify { token_hash, type } — returns session JSON with
   * no redirect to SITE_URL / localhost.
   */
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
      body: JSON.stringify({ type, token_hash: tokenHash.trim() }),
    });
    return this.saveSession(await parseResponse<PortalSession>(response));
  }

  /**
   * Redeem whatever the user pasted from the recovery email or browser bar:
   * verify link, localhost hash URL, raw hex token, or 6–8 digit OTP.
   */
  async redeemRecoveryPaste(
    rawInput: string,
    emailHint?: string,
  ): Promise<PortalSession> {
    const parsed = parseRecoveryPaste(rawInput);
    const email = (emailHint || parsed.email || "").trim().toLowerCase();
    const type = parsed.type || "recovery";

    if (
      parsed.kind === "session_hash" &&
      parsed.accessToken &&
      parsed.refreshToken
    ) {
      return this.saveHashSession(
        parsed.accessToken,
        parsed.refreshToken,
        parsed.expiresIn,
      );
    }

    if (
      (parsed.kind === "verify_link" || parsed.kind === "raw_token") &&
      (parsed.tokenHash || parsed.token)
    ) {
      const hash = (parsed.tokenHash || parsed.token || "").trim();
      const errors: string[] = [];

      try {
        return await this.verifyTokenHash(hash, type);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }

      // Some GoTrue builds accept `token` instead of `token_hash` when email is known.
      if (email) {
        try {
          const response = await fetch(
            `${this.config.supabaseUrl}/auth/v1/verify`,
            {
              method: "POST",
              headers: {
                apikey: this.config.publishableKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ type, email, token: hash }),
            },
          );
          return this.saveSession(await parseResponse<PortalSession>(response));
        } catch (error) {
          errors.push(error instanceof Error ? error.message : String(error));
        }
      }

      throw new Error(
        errors[0] ||
          "That recovery link is invalid or has expired. Send a new recovery email and paste the fresh Reset Password link.",
      );
    }

    if (parsed.kind === "otp_code" && parsed.token) {
      if (!email) {
        throw new Error(
          "Enter your admin email or phone above, then paste the 6-digit code.",
        );
      }
      const errors: string[] = [];
      for (const otpType of ["recovery", "email", "magiclink"] as const) {
        try {
          return await this.verifyEmailCode(email, parsed.token, otpType);
        } catch (error) {
          errors.push(error instanceof Error ? error.message : String(error));
        }
      }
      // Also try treating a long pasted value as token_hash if OTP path failed
      throw new Error(errors[0] || "Invalid or expired recovery code.");
    }

    // Unknown paste — try token_hash then OTP with email hint
    const fallback = extractFallbackToken(rawInput);
    if (fallback) {
      try {
        return await this.verifyTokenHash(fallback, "recovery");
      } catch {
        /* continue */
      }
      if (email) {
        try {
          return await this.verifyEmailCode(email, fallback, "recovery");
        } catch {
          /* continue */
        }
        try {
          return await this.verifyEmailCode(email, fallback, "email");
        } catch {
          /* continue */
        }
      }
    }

    throw new Error(
      "Paste the full Reset Password link from your email, the localhost URL from your browser bar, or a recovery code.",
    );
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

  /** Public-read CMS media registry (RLS allows anon SELECT for active rows). */
  async listCmsMediaAssets(activeOnly = true): Promise<CmsMediaAsset[]> {
    const filter = activeOnly ? "&is_active=eq.true" : "";
    return this.restGet<CmsMediaAsset[]>(
      `/rest/v1/cms_media_assets?select=*${filter}&order=updated_at.desc`,
      false,
    );
  }

  async listMediaRestaurants(): Promise<MediaRestaurant[]> {
    return this.restGet<MediaRestaurant[]>(
      "/rest/v1/nigerian_restaurants?select=id,name,image_url,photo_urls,listing_kind,map_pin_enabled,is_active&order=name.asc",
      false,
    );
  }

  async listMediaDirectoryResources(): Promise<MediaDirectoryResource[]> {
    return this.restGet<MediaDirectoryResource[]>(
      "/rest/v1/community_resources?select=id,name,image_url,metadata&order=name.asc&limit=200",
      false,
    );
  }

  async listClientRestaurants(): Promise<ClientRestaurant[]> {
    return this.restGet<ClientRestaurant[]>(
      "/rest/v1/nigerian_restaurants?select=id,name,category,cuisine_type,borough,address,phone,website,image_url,photo_urls,listing_kind,map_pin_enabled,is_active,owner_user_id,description&order=name.asc",
      false,
    );
  }

  async listClientDirectoryResources(): Promise<ClientDirectoryResource[]> {
    return this.restGet<ClientDirectoryResource[]>(
      "/rest/v1/community_resources?select=id,name,category,borough,address,phone,website,image_url,function,is_verified,owner_user_id,metadata&order=name.asc&limit=300",
      false,
    );
  }

  async listClientJobPartners(): Promise<ClientJobPartner[]> {
    return this.restGet<ClientJobPartner[]>(
      "/rest/v1/nyc_job_partners?select=id,name,organization,category,boroughs,summary,website,enroll_url,careers_url,address,phone,is_partner,partner_status,verified_at&order=name.asc",
      false,
    );
  }

  /**
   * Optional relationship table. Returns available=false when the migration
   * has not been applied yet so the UI can use derived status.
   */
  async listCmsListingRelationships(): Promise<{
    available: boolean;
    rows: CmsListingRelationship[];
  }> {
    try {
      const rows = await this.restGet<CmsListingRelationship[]>(
        "/rest/v1/cms_listing_relationships?select=*&order=updated_at.desc",
        false,
      );
      return { available: true, rows: Array.isArray(rows) ? rows : [] };
    } catch {
      return { available: false, rows: [] };
    }
  }

  /**
   * Upload (upsert) a Media CMS image into the public group-images or
   * resource-images bucket. Requires an admin session (storage write RLS).
   */
  async uploadCmsMediaObject(
    bucketId: "group-images" | "resource-images",
    objectPath: string,
    file: File,
    retry = true,
  ): Promise<string> {
    if (!CMS_MEDIA_TYPES.has(file.type)) {
      throw new Error("Choose a JPEG, PNG, or WebP image.");
    }
    if (file.size > MAX_CMS_MEDIA_BYTES) {
      throw new Error("Media uploads must be 5 MB or smaller after compression.");
    }
    if (
      bucketId !== GROUP_IMAGE_BUCKET &&
      bucketId !== RESOURCE_IMAGE_BUCKET
    ) {
      throw new Error("Unsupported media bucket.");
    }

    const session = await this.activeSession();
    const encodedPath = objectPath
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const response = await fetch(
      `${this.config.supabaseUrl}/storage/v1/object/${bucketId}/${encodedPath}`,
      {
        method: "POST",
        headers: {
          apikey: this.config.publishableKey,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": file.type,
          "Cache-Control": "3600",
          "x-upsert": "true",
        },
        body: file,
      },
    );
    if (response.status === 401 && retry) {
      await this.refreshSession();
      return this.uploadCmsMediaObject(bucketId, objectPath, file, false);
    }
    await parseResponse<Record<string, string>>(response);
    const bust = `v=${Date.now()}`;
    return `${this.config.supabaseUrl}/storage/v1/object/public/${bucketId}/${encodedPath}?${bust}`;
  }

  async upsertCmsMediaAsset(input: {
    entityType: CmsMediaAsset["entity_type"];
    entityId: string;
    bucketId: string;
    objectPath: string;
    publicUrl: string;
    sourceAttribution?: string | null;
    licenseNote?: string | null;
  }): Promise<CmsMediaAsset> {
    const cleanUrl = input.publicUrl.split("?")[0];
    const payload = {
      entity_type: input.entityType,
      entity_id: input.entityId,
      bucket_id: input.bucketId,
      object_path: input.objectPath,
      public_url: cleanUrl,
      source_attribution: input.sourceAttribution ?? null,
      license_note: input.licenseNote ?? null,
      is_active: true,
      updated_at: new Date().toISOString(),
    };
    const rows = await this.restMutate<CmsMediaAsset[]>(
      "/rest/v1/cms_media_assets?on_conflict=entity_type,entity_id",
      "POST",
      payload,
      {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
    );
    if (!rows[0]) throw new Error("Could not save the BawoSocial media registry row.");
    return rows[0];
  }

  async deactivateCmsMediaAsset(assetId: string): Promise<void> {
    await this.restMutate(
      `/rest/v1/cms_media_assets?id=eq.${encodeURIComponent(assetId)}`,
      "PATCH",
      { is_active: false, updated_at: new Date().toISOString() },
      { Prefer: "return=minimal" },
    );
  }

  async updateRestaurantHero(
    restaurantId: string,
    imageUrl: string | null,
    previousPhotoUrls: string[] | null,
  ): Promise<void> {
    const prior = Array.isArray(previousPhotoUrls) ? previousPhotoUrls : [];
    const photoUrls = imageUrl
      ? [imageUrl, ...prior.filter((url) => url !== imageUrl)].slice(0, 12)
      : prior;
    await this.restMutate(
      `/rest/v1/nigerian_restaurants?id=eq.${encodeURIComponent(restaurantId)}`,
      "PATCH",
      {
        image_url: imageUrl,
        photo_urls: photoUrls,
      },
      { Prefer: "return=minimal" },
    );
  }

  async updateDirectoryResourceImage(
    resourceId: string,
    imageUrl: string | null,
  ): Promise<void> {
    await this.restMutate(
      `/rest/v1/community_resources?id=eq.${encodeURIComponent(resourceId)}`,
      "PATCH",
      { image_url: imageUrl },
      { Prefer: "return=minimal" },
    );
  }

  /**
   * Best-effort live mirror for circle covers. Some entity ids are slugs
   * (e.g. secure_the_bag) rather than UUIDs; ignore missing rows.
   */
  async updateGroupChatCover(
    entityId: string,
    imageUrl: string | null,
  ): Promise<void> {
    try {
      await this.restMutate(
        `/rest/v1/group_chats?id=eq.${encodeURIComponent(entityId)}`,
        "PATCH",
        {
          image_url: imageUrl,
          cover_image_url: imageUrl,
        },
        { Prefer: "return=minimal" },
      );
    } catch {
      /* Group may only exist as a mobile bundled id; storage + cms still win. */
    }
  }

  private async restGet<T>(path: string, requireAuth: boolean): Promise<T> {
    const headers: Record<string, string> = {
      apikey: this.config.publishableKey,
      Authorization: `Bearer ${this.config.publishableKey}`,
    };
    if (requireAuth) {
      const session = await this.activeSession();
      headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      try {
        const session = this.getSession();
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
      } catch {
        /* anon is fine for public-read tables */
      }
    }
    const response = await fetch(`${this.config.supabaseUrl}${path}`, {
      headers,
    });
    return parseResponse<T>(response);
  }

  private async restMutate<T = unknown>(
    path: string,
    method: "POST" | "PATCH" | "DELETE",
    body: unknown,
    extraHeaders: Record<string, string> = {},
    retry = true,
  ): Promise<T> {
    const session = await this.activeSession();
    const response = await fetch(`${this.config.supabaseUrl}${path}`, {
      method,
      headers: {
        apikey: this.config.publishableKey,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        ...extraHeaders,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (response.status === 401 && retry) {
      await this.refreshSession();
      return this.restMutate<T>(path, method, body, extraHeaders, false);
    }
    if (response.status === 204) return undefined as T;
    const text = await response.text();
    if (!text) return undefined as T;
    return parseResponseFromText<T>(text, response.ok, response.status);
  }

  signOut(): void {
    window.localStorage.removeItem(SESSION_KEY);
  }
}
