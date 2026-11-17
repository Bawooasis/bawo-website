import type { Config, Context } from "@netlify/functions";
import { runSubscribe } from "../../api/_lib/subscribeCore";

/**
 * Netlify port of api/subscribe.ts. Same Mailchimp behavior via shared core.
 * Keep api/subscribe.ts for Vercel rollback until DNS cutover is complete.
 */

declare const Netlify: {
  env: { get(key: string): string | undefined };
};

function readEnv(key: string) {
  try {
    return Netlify.env.get(key) ?? process.env[key];
  } catch {
    return process.env[key];
  }
}

export default async (req: Request, context: Context) => {
  void context;

  let body: { email?: unknown; name?: unknown } = {};
  if (req.method === "POST") {
    try {
      body = (await req.json()) as { email?: unknown; name?: unknown };
    } catch {
      body = {};
    }
  }

  const result = await runSubscribe({
    method: req.method,
    email: body.email,
    name: body.name,
    env: {
      apiKey: readEnv("MAILCHIMP_API_KEY"),
      server: readEnv("MAILCHIMP_SERVER"),
      audienceId: readEnv("MAILCHIMP_AUDIENCE_ID"),
    },
  });

  return Response.json(result.body, { status: result.status });
};

// Served via redirects: /api/subscribe -> /.netlify/functions/subscribe
export const config: Config = {
  method: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
