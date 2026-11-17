import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runSubscribe } from "./_lib/subscribeCore";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const body = (req.body ?? {}) as { email?: unknown; name?: unknown };
  const result = await runSubscribe({
    method: req.method || "GET",
    email: body.email,
    name: body.name,
    env: {
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER,
      audienceId: process.env.MAILCHIMP_AUDIENCE_ID,
    },
  });
  return res.status(result.status).json(result.body);
}
