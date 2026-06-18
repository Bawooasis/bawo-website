import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash } from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const server = process.env.MAILCHIMP_SERVER;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !server || !audienceId) {
    console.error("Missing Mailchimp env vars");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const { email, name } = req.body ?? {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
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

    const data = await response.json();

    if (!response.ok) {
      console.error("Mailchimp API error:", data);
      const message =
        data.title === "Member Exists"
          ? "You're already on the list!"
          : "Subscription failed. Please try again.";
      return res.status(response.status).json({ error: message });
    }

    return res.status(200).json({ success: true, status: data.status });
  } catch (err) {
    console.error("Mailchimp request failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
