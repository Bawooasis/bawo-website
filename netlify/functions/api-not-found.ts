import type { Config, Context } from "@netlify/functions";

/** Catch-all for unknown /api/* so SPA fallback never serves index.html for APIs. */
export default async (req: Request, context: Context) => {
  void req;
  void context;
  return Response.json({ error: "Not found" }, { status: 404 });
};

export const config: Config = {
  method: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
};
