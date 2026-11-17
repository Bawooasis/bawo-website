import { createHash } from "node:crypto";

export type SubscribeEnv = {
  apiKey?: string;
  server?: string;
  audienceId?: string;
};

export type SubscribeResult = {
  status: number;
  body: Record<string, unknown>;
};

/**
 * Shared Mailchimp subscribe behavior for Vercel (`api/subscribe.ts`) and
 * Netlify (`netlify/functions/subscribe.ts`). Keep response shapes identical.
 */
export async function runSubscribe(options: {
  method: string;
  email?: unknown;
  name?: unknown;
  env: SubscribeEnv;
}): Promise<SubscribeResult> {
  if (options.method !== "POST") {
    return { status: 405, body: { error: "Method not allowed" } };
  }

  const { apiKey, server, audienceId } = options.env;
  if (!apiKey || !server || !audienceId) {
    console.error("Missing Mailchimp env vars");
    return { status: 500, body: { error: "Server configuration error" } };
  }

  const { email, name } = options;
  if (!email || typeof email !== "string") {
    return { status: 400, body: { error: "Email is required" } };
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
      return { status: response.status, body: { error: message } };
    }

    return { status: 200, body: { success: true, status: data.status } };
  } catch (err) {
    console.error("Mailchimp request failed:", err);
    return { status: 500, body: { error: "Internal server error" } };
  }
}
