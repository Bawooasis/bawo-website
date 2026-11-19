import { getPortalConfig } from "../portal/platformApi";

type RestError = {
  message?: string;
  code?: string;
  details?: string;
};

async function restGet<T>(pathAndQuery: string): Promise<T> {
  const { supabaseUrl, publishableKey } = getPortalConfig();
  const url = `${supabaseUrl}/rest/v1/${pathAndQuery}`;
  const response = await fetch(url, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = (await response.json()) as RestError;
      detail = body.message || body.details || detail;
    } catch {
      /* ignore */
    }
    throw new Error(`Supabase REST ${response.status}: ${detail}`);
  }

  return (await response.json()) as T;
}

export async function fetchTableRows<T>(
  table: string,
  query: string,
): Promise<T[]> {
  return restGet<T[]>(`${table}?${query}`);
}

export async function fetchTableCount(
  table: string,
  query = "select=id",
): Promise<number> {
  const { supabaseUrl, publishableKey } = getPortalConfig();
  const url = `${supabaseUrl}/rest/v1/${table}?${query}`;
  const response = await fetch(url, {
    method: "HEAD",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      Prefer: "count=exact",
    },
  });
  const range = response.headers.get("content-range");
  if (!range) return 0;
  const total = range.split("/")[1];
  const n = Number(total);
  return Number.isFinite(n) ? n : 0;
}
