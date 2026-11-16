/** Stable public slug: name + short id suffix for uniqueness. */
export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function makeSlug(name: string, id: string): string {
  const base = slugifyName(name) || "listing";
  const short = id.replace(/-/g, "").slice(0, 8);
  return `${base}-${short}`;
}

/** Extract the short id suffix from a public slug. */
export function idFromSlug(slug: string): string | null {
  const parts = slug.split("-");
  const short = parts[parts.length - 1];
  if (!short || short.length < 6) return null;
  return short.toLowerCase();
}

export function matchesSlugId(id: string, slug: string): boolean {
  const short = idFromSlug(slug);
  if (!short) return false;
  return id.replace(/-/g, "").toLowerCase().startsWith(short);
}
