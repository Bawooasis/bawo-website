import { createHash } from "node:crypto";
import type { Config, Context } from "@netlify/functions";

/**
 * Netlify port of api/subscribe.ts (Vercel). Same Mailchimp behavior and JSON
 * shapes so joinbawo.com can move to Netlify without changing the frontend.
 * Keep api/subscribe.ts for Vercel rollback until DNS cutover is complete.
 */

declare const Netlify: {
  env: { get(key: string): string | undefined };
};

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status });
}

function mailchimpEnv() {
  // Prefer Netlify.env; fall back to process.env for local `netlify functions:serve`.
  const get = (key: string) => {
    try {
      return Netlify.env.get(key) ?? process.env[key];
    } catch {
      return process.env[key];
    }
  };
  return {
    apiKey: get("MAILCHIMP_API_KEY"),
    server: get("MAILCHIMP_SERVER"),
    audienceId: get("MAILCHIMP_AUDIENCE_ID"),
  };
}

export default async (req: Request, _context: Context) => {
  void _context;
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const { apiKey, server, audienceId } = mailchimpEnv();
  if (!apiKey || !server || !audienceId) {
    console.error("Missing Mailchimp env vars");
    return json(500, { error: "Server configuration error" });
  }

  let body: { email?: unknown; name?: unknown } = {};
  try {
    body = (await req.json()) as { email?: unknown; name?: unknown };
  } catch {
    body = {};
  }

  const { email, name } = body;

  if (!email || typeof email !== "string") {
    return json(400, { error: "Email is required" });
  }

  const subscriberHash = createHash("md5")
    .update(email.toLowerCase())
    .digest("hex");

  const mergeFields: Record<string, string> = {};
  if (name && typeof name === "string") {
    mergeFields.FNAME = name;
  }

  const url = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
        merge_fields: mergeFields,
      }),
    });

    const data = (await response.json()) as {
      id?: string;
      message?: string;
      title?: string;
      status?: number | string;
    };

    if (!response.ok) {
      console.error("Mailchimp API error:", data);
      const message =
        data.title === "Member Exists"
          ? "You're already on the list!"
          : "Subscription failed. Please try again.";
      return json(response.status, { error: message });
    }

    return json(200, { success: true, status: data.status });
  } catch (err) {
    console.error("Mailchimp request failed:", err);
    return json(500, { error: "Internal server error" });
  }
};

// Served via redirects: /api/subscribe -> /.netlify/functions/subscribe
export const config: Config = {
  method: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
