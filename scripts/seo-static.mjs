/**
 * Build-time SEO shells for /nyc, /places/:slug, /e/:slug + sitemap.xml.
 * Fetches public Supabase rows (anon key) and writes static HTML with meta / OG / JSON-LD.
 * Does not fail the marketing build if the network is unavailable.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const SITE = "https://www.joinbawo.com";
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://wyarfsymnyrraowwluhf.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5YXJmc3ltbnlycmFvd3dsdWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTY3MTYsImV4cCI6MjA4NzMxNjcxNn0.wmET17KAduP60VHCSmKeVADKfHcpM3-m53EzeGnQy2I";

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function makeSlug(name, id) {
  const base = slugify(name) || "listing";
  const short = String(id).replace(/-/g, "").slice(0, 8);
  return `${base}-${short}`;
}

function hasLagos(title) {
  return /\blagos\b/i.test(title || "");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function rest(table, query) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`${table} ${res.status}`);
  return res.json();
}

function injectHead(html, { title, description, url, image, jsonLd }) {
  let next = html;
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeUrl = escapeHtml(url);
  const safeImage = escapeHtml(image || `${SITE}/og-image.png`);

  if (next.includes("<title>")) {
    next = next.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  } else {
    next = next.replace("</head>", `<title>${safeTitle}</title>\n</head>`);
  }

  const metaBlock = `
    <meta name="description" content="${safeDesc}" />
    <link rel="canonical" href="${safeUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImage}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `;

  next = next.replace("</head>", `${metaBlock}\n</head>`);
  return next;
}

/**
 * Directory / partners shells must not embed the prerendered homepage body
 * (share strip + mobile sticky CTA), which can flash fixed bottom chrome over
 * Kit preview QR codes before React mounts PartnersPage / directory routes.
 */
function withEmptyRoot(html, placeholderText) {
  const safe = escapeHtml(placeholderText);
  return html.replace(
    /<div id="root">[\s\S]*?<\/div>\s*(?=<script)/i,
    `<div id="root"><div class="dir-page" style="min-height:100vh;padding:2rem 1.25rem;color:#F7F2EA;background:#0E0A14;font-family:Outfit,system-ui,sans-serif"><p>${safe}</p></div></div>\n    `,
  );
}

async function writeRoute(routePath, html) {
  const filePath = path.join(dist, routePath, "index.html");
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, html, "utf8");
}

async function main() {
  const indexHtml = await readFile(path.join(dist, "index.html"), "utf8");
  const urls = [
    { loc: `${SITE}/`, priority: "1.0" },
    { loc: `${SITE}/nyc`, priority: "0.95" },
    { loc: `${SITE}/partners`, priority: "0.8" },
    { loc: `${SITE}/privacy`, priority: "0.3" },
    { loc: `${SITE}/terms`, priority: "0.3" },
    { loc: `${SITE}/support`, priority: "0.3" },
    { loc: `${SITE}/affiliate-disclosure`, priority: "0.3" },
  ];

  const nycHtml = withEmptyRoot(
    injectHead(indexHtml, {
      title: "Nigerian & Afro NYC Directory | BawoSocial",
      description:
        "Discover Nigerian and Afro events, restaurants, markets, and community services across NYC boroughs and New Jersey.",
      url: `${SITE}/nyc`,
      image: `${SITE}/og-image.png`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Nigerian & Afro NYC Directory",
        url: `${SITE}/nyc`,
        isPartOf: { "@type": "WebSite", name: "BawoSocial", url: SITE },
      },
    }),
    "Loading NYC directory…",
  );
  await writeRoute("nyc", nycHtml);

  const partnersHtml = withEmptyRoot(
    injectHead(indexHtml, {
      title: "Partner with BawoSocial | NYC promoters, venues & societies",
      description:
        "Partner kits for promoters, restaurants, salons, stores, and student societies across Nigerian & Afro NYC.",
      url: `${SITE}/partners`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Partner with BawoSocial",
        url: `${SITE}/partners`,
      },
    }),
    "Loading partner kits…",
  );
  await writeRoute("partners", partnersHtml);

  let places = [];
  let events = [];
  try {
    const [restaurants, resources, upcoming] = await Promise.all([
      rest(
        "nigerian_restaurants",
        "select=id,name,borough,neighborhood,address,phone,website,description,image_url,cuisine_type,category,rating,price_range,hours&is_active=eq.true&limit=200",
      ),
      rest(
        "community_resources",
        "select=id,name,category,borough,neighborhood,address,phone,website,description,image_url&limit=200",
      ),
      rest(
        "external_events",
        `select=id,title,description,starts_at,ends_at,venue_name,city,location,image_url,url,promoter_ticket_url&starts_at=gte.${new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()}&order=starts_at.asc&limit=200`,
      ),
    ]);

    places = [
      ...restaurants.map((row) => ({
        ...row,
        kind: "restaurant",
        slug: makeSlug(row.name, row.id),
      })),
      ...resources.map((row) => ({
        ...row,
        kind: "resource",
        slug: makeSlug(row.name, row.id),
      })),
    ].filter((row) => !hasLagos(row.name));

    events = upcoming
      .filter((row) => !hasLagos(row.title))
      .map((row) => ({ ...row, slug: makeSlug(row.title, row.id) }));
  } catch (err) {
    console.warn(
      "[seo-static] Supabase fetch failed; wrote /nyc and /partners shells only.",
      err instanceof Error ? err.message : err,
    );
  }

  for (const place of places.slice(0, 250)) {
    const url = `${SITE}/places/${place.slug}`;
    const title = `${place.name} | BawoSocial NYC`;
    const description =
      place.description ||
      `${place.name} — ${place.category || place.cuisine_type || "Nigerian & Afro"} in ${place.neighborhood || place.borough || "NYC"}.`;
    const html = withEmptyRoot(
      injectHead(indexHtml, {
        title,
        description,
        url,
        image: place.image_url || undefined,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: place.name,
          image: place.image_url || undefined,
          telephone: place.phone || undefined,
          url,
          address: place.address
            ? { "@type": "PostalAddress", streetAddress: place.address }
            : undefined,
          aggregateRating:
            place.rating != null
              ? {
                  "@type": "AggregateRating",
                  ratingValue: Number(place.rating),
                  ratingCount: 1,
                }
              : undefined,
        },
      }),
      place.name || "Loading place…",
    );
    await writeRoute(path.join("places", place.slug), html);
    urls.push({ loc: url, priority: "0.7" });
  }

  for (const event of events.slice(0, 150)) {
    const url = `${SITE}/e/${event.slug}`;
    const title = `${event.title} | BawoSocial Events`;
    const description =
      event.description ||
      `${event.title} at ${event.venue_name || event.city || "NYC"}.`;
    const html = withEmptyRoot(
      injectHead(indexHtml, {
        title,
        description,
        url,
        image: event.image_url || undefined,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          startDate: event.starts_at,
          endDate: event.ends_at || undefined,
          image: event.image_url || undefined,
          url,
          location: {
            "@type": "Place",
            name: event.venue_name || event.city || "NYC",
            address: event.location || event.city || "New York, NY",
          },
          offers: event.url
            ? { "@type": "Offer", url: event.promoter_ticket_url || event.url }
            : undefined,
        },
      }),
      event.title || "Loading event…",
    );
    await writeRoute(path.join("e", event.slug), html);
    urls.push({ loc: url, priority: "0.75" });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
  await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");
  console.log(
    `[seo-static] Wrote /nyc, /partners, ${places.length} places, ${events.length} events, sitemap (${urls.length} urls)`,
  );
}

main().catch((err) => {
  console.warn("[seo-static] Non-fatal failure:", err instanceof Error ? err.message : err);
  process.exit(0);
});
