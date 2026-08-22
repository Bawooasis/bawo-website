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
const DEFAULT_SUPABASE_URL = "https://wyarfsymnyrraowwluhf.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5YXJmc3ltbnlycmFvd3dsdWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTY3MTYsImV4cCI6MjA4NzMxNjcxNn0.wmET17KAduP60VHCSmKeVADKfHcpM3-m53EzeGnQy2I";

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
    const extension = file.type === "image/jpeg"
      ? "jpg"
      : file.type.split("/")[1];
    const safeGroupId = groupId.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
    const objectPath =
      `control-center/${safeGroupId}/${crypto.randomUUID()}.${extension}`;
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

  signOut(): void {
    window.localStorage.removeItem(SESSION_KEY);
  }
}
