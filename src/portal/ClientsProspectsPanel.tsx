import {
  ArrowLeft,
  Briefcase,
  Building2,
  ExternalLink,
  Globe2,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Store,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CLIENT_STATUS_LABELS,
  deriveListingStatus,
  type ClientDirectoryResource,
  type ClientEntityType,
  type ClientJobPartner,
  type ClientListItem,
  type ClientRelationshipStatus,
  type ClientRestaurant,
  type CmsListingRelationship,
} from "./clientTypes";
import EntityMediaEditor from "./EntityMediaEditor";
import type { CmsMediaAsset, MediaListItem } from "./mediaTypes";
import type { PlatformApi } from "./platformApi";
import { EmptyState } from "./PortalUi";

type ClientsProspectsPanelProps = {
  api: PlatformApi;
  busy?: boolean;
  readOnly?: boolean;
};

const STATUS_OPTIONS: Array<ClientRelationshipStatus | "all"> = [
  "all",
  "client",
  "prospect",
  "not_contacted",
];

const SOURCE_LABELS: Record<ClientEntityType, string> = {
  venue: "Place",
  directory: "Directory",
  job_partner: "Job partner",
};

function buildClients(
  restaurants: ClientRestaurant[],
  resources: ClientDirectoryResource[],
  partners: ClientJobPartner[],
  relationships: CmsListingRelationship[],
  assets: CmsMediaAsset[],
): ClientListItem[] {
  const byKey = new Map(
    relationships.map((row) => [`${row.entity_type}:${row.entity_id}`, row]),
  );
  const venueAssets = new Map(
    assets
      .filter((row) => row.entity_type === "venue_photo")
      .map((row) => [row.entity_id, row]),
  );
  const directoryAssets = new Map(
    assets
      .filter((row) => row.entity_type === "directory_photo")
      .map((row) => [row.entity_id, row]),
  );

  const venueItems: ClientListItem[] = restaurants.map((restaurant) => {
    const stored = byKey.get(`venue:${restaurant.id}`) || null;
    const derived = deriveListingStatus({
      stored,
      ownerUserId: restaurant.owner_user_id,
    });
    const asset =
      venueAssets.get(restaurant.id) ||
      [...venueAssets.values()].find(
        (row) =>
          row.public_url &&
          restaurant.image_url &&
          row.public_url.split("?")[0] === restaurant.image_url.split("?")[0],
      ) ||
      null;
    return {
      key: `venue:${restaurant.id}`,
      entityType: "venue",
      entityId: restaurant.id,
      name: restaurant.name,
      category: restaurant.category || restaurant.cuisine_type || "Place",
      borough: restaurant.borough,
      address: restaurant.address,
      phone: restaurant.phone,
      website: restaurant.website,
      imageUrl: asset?.public_url || restaurant.image_url,
      photoUrls: restaurant.photo_urls || [],
      status: derived.status,
      statusSource: derived.source,
      notes: stored?.notes || null,
      summary: restaurant.description,
      restaurant,
      directory: null,
      partner: null,
      asset,
    };
  });

  const directoryItems: ClientListItem[] = resources.map((resource) => {
    const stored = byKey.get(`directory:${resource.id}`) || null;
    const derived = deriveListingStatus({
      stored,
      ownerUserId: resource.owner_user_id,
    });
    const asset = directoryAssets.get(resource.id) || null;
    return {
      key: `directory:${resource.id}`,
      entityType: "directory",
      entityId: resource.id,
      name: resource.name,
      category: resource.category || "Directory",
      borough: resource.borough,
      address: resource.address,
      phone: resource.phone,
      website: resource.website,
      imageUrl: asset?.public_url || resource.image_url,
      photoUrls: [],
      status: derived.status,
      statusSource: derived.source,
      notes: stored?.notes || null,
      summary: resource.function,
      restaurant: null,
      directory: resource,
      partner: null,
      asset,
    };
  });

  const partnerItems: ClientListItem[] = partners.map((partner) => {
    const stored = byKey.get(`job_partner:${partner.id}`) || null;
    const derived = deriveListingStatus({
      stored,
      partnerStatus: partner.partner_status,
      isPartner: partner.is_partner,
    });
    return {
      key: `job_partner:${partner.id}`,
      entityType: "job_partner",
      entityId: partner.id,
      name: partner.name,
      category: partner.category || "Job partner",
      borough: partner.boroughs?.[0] || null,
      address: partner.address,
      phone: partner.phone,
      website: partner.website || partner.careers_url || partner.enroll_url,
      imageUrl: null,
      photoUrls: [],
      status: derived.status,
      statusSource: derived.source,
      notes: stored?.notes || null,
      summary: partner.summary,
      restaurant: null,
      directory: null,
      partner,
      asset: null,
    };
  });

  return [...venueItems, ...directoryItems, ...partnerItems].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

function toMediaItem(client: ClientListItem): MediaListItem | null {
  if (client.entityType === "venue") {
    return {
      key: client.key,
      tab: "places",
      entityType: "venue_photo",
      entityId: client.entityId,
      name: client.name,
      currentUrl: client.imageUrl,
      attribution: client.asset?.source_attribution || null,
      licenseNote: client.asset?.license_note || null,
      updatedAt: client.asset?.updated_at || null,
      asset: client.asset,
      groupUuid: null,
      restaurant: client.restaurant
        ? {
            id: client.restaurant.id,
            name: client.restaurant.name,
            image_url: client.restaurant.image_url,
            photo_urls: client.restaurant.photo_urls,
            listing_kind: client.restaurant.listing_kind,
            map_pin_enabled: client.restaurant.map_pin_enabled,
            is_active: client.restaurant.is_active,
          }
        : null,
      directory: null,
      bucketId: "resource-images",
      objectPath:
        client.asset?.object_path || `restaurants/${client.entityId}.jpg`,
    };
  }
  if (client.entityType === "directory") {
    return {
      key: client.key,
      tab: "directory",
      entityType: "directory_photo",
      entityId: client.entityId,
      name: client.name,
      currentUrl: client.imageUrl,
      attribution: client.asset?.source_attribution || null,
      licenseNote: client.asset?.license_note || null,
      updatedAt: client.asset?.updated_at || null,
      asset: client.asset,
      groupUuid: null,
      restaurant: null,
      directory: client.directory
        ? {
            id: client.directory.id,
            name: client.directory.name,
            image_url: client.directory.image_url,
            metadata: client.directory.metadata,
          }
        : null,
      bucketId: "resource-images",
      objectPath: client.asset?.object_path || `stores/${client.entityId}.jpg`,
    };
  }
  return null;
}

function statusTone(status: ClientRelationshipStatus): string {
  if (status === "client") return "is-success";
  if (status === "prospect") return "is-warning";
  return "is-muted";
}

export default function ClientsProspectsPanel({
  api,
  busy = false,
  readOnly = false,
}: ClientsProspectsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ClientRelationshipStatus | "all"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [relationships, setRelationships] = useState<CmsListingRelationship[]>(
    [],
  );
  const [relationshipTableReady, setRelationshipTableReady] = useState(false);
  const [assets, setAssets] = useState<CmsMediaAsset[]>([]);
  const [restaurants, setRestaurants] = useState<ClientRestaurant[]>([]);
  const [resources, setResources] = useState<ClientDirectoryResource[]>([]);
  const [partners, setPartners] = useState<ClientJobPartner[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [
        nextAssets,
        nextRestaurants,
        nextResources,
        nextPartners,
        relationshipResult,
      ] = await Promise.all([
        api.listCmsMediaAssets(true),
        api.listClientRestaurants(),
        api.listClientDirectoryResources(),
        api.listClientJobPartners(),
        api.listCmsListingRelationships(),
      ]);
      setAssets(nextAssets);
      setRestaurants(nextRestaurants);
      setResources(nextResources);
      setPartners(nextPartners);
      setRelationships(relationshipResult.rows);
      setRelationshipTableReady(relationshipResult.available);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load BawoSocial clients and prospects.",
      );
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const items = useMemo(
    () =>
      buildClients(restaurants, resources, partners, relationships, assets),
    [restaurants, resources, partners, relationships, assets],
  );

  const categories = useMemo(() => {
    const set = new Set(items.map((item) => item.category).filter(Boolean));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      return [item.name, item.category, item.borough, item.phone, item.website]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [items, query, statusFilter, categoryFilter]);

  const selected = items.find((item) => item.key === selectedKey) || null;
  const mediaItem = selected ? toMediaItem(selected) : null;

  const counts = useMemo(() => {
    const tally = { client: 0, prospect: 0, not_contacted: 0 };
    for (const item of items) tally[item.status] += 1;
    return tally;
  }, [items]);

  if (selected) {
    return (
      <section className="portal-panel clients-panel">
        <div className="portal-panel-heading">
          <div>
            <button
              type="button"
              className="portal-button is-ghost clients-back"
              onClick={() => setSelectedKey(null)}
            >
              <ArrowLeft aria-hidden />
              Back to Clients & Prospects
            </button>
            <span className="portal-kicker">BawoSocial record</span>
            <h2>{selected.name}</h2>
            <p className="media-cms-lead">
              {SOURCE_LABELS[selected.entityType]} · {selected.category}
              {selected.borough ? ` · ${selected.borough}` : ""}
            </p>
          </div>
          <span className={`portal-status ${statusTone(selected.status)}`}>
            {CLIENT_STATUS_LABELS[selected.status]}
          </span>
        </div>

        {!relationshipTableReady ? (
          <div className="portal-alert is-info">
            Relationship status is derived for preview. Approve and apply{" "}
            <code>cms_listing_relationships</code> before status can be stored
            and edited in production.
          </div>
        ) : null}

        <div className="clients-detail-grid">
          <article className="clients-detail-card">
            <h3>Contact</h3>
            <dl className="clients-detail-list">
              <div>
                <dt>Phone</dt>
                <dd>
                  {selected.phone ? (
                    <a href={`tel:${selected.phone}`}>
                      <Phone aria-hidden /> {selected.phone}
                    </a>
                  ) : (
                    "Not in listing data"
                  )}
                </dd>
              </div>
              <div>
                <dt>Website</dt>
                <dd>
                  {selected.website ? (
                    <a
                      href={selected.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Globe2 aria-hidden /> {selected.website.replace(/^https?:\/\//, "")}
                      <ExternalLink aria-hidden />
                    </a>
                  ) : (
                    "Not in listing data"
                  )}
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>
                  {selected.address ? (
                    <>
                      <MapPin aria-hidden /> {selected.address}
                    </>
                  ) : (
                    "Not in listing data"
                  )}
                </dd>
              </div>
              <div>
                <dt>Status source</dt>
                <dd>
                  {selected.statusSource === "stored"
                    ? "Stored relationship row"
                    : "Derived preview fallback"}
                </dd>
              </div>
            </dl>
            {selected.summary ? (
              <p className="clients-summary">{selected.summary}</p>
            ) : null}
            {selected.partner?.organization ? (
              <p className="clients-summary">
                Organization: {selected.partner.organization}
              </p>
            ) : null}
          </article>

          <article className="clients-detail-card">
            <h3>Photos</h3>
            {mediaItem ? (
              <EntityMediaEditor
                api={api}
                item={mediaItem}
                readOnly={readOnly}
                busy={busy}
                onSaved={refresh}
              />
            ) : (
              <p className="clients-summary">
                Job partners do not yet have a BawoSocial photo slot in Storage.
                Place and directory records manage photos here with replace,
                save, and revert.
              </p>
            )}
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="portal-panel clients-panel">
      <div className="portal-panel-heading">
        <div>
          <span className="portal-kicker">BawoSocial pipeline</span>
          <h2>Clients & Prospects</h2>
          <p className="media-cms-lead">
            Every BawoSocial place, directory listing, and NYC job partner in
            one list. Open a record to manage contact context and photos.
          </p>
        </div>
        <button
          type="button"
          className="portal-button is-ghost"
          onClick={() => void refresh()}
          disabled={loading || busy}
        >
          <RefreshCw aria-hidden />
          Refresh
        </button>
      </div>

      <div className="clients-metrics">
        <div>
          <strong>{items.length}</strong>
          <span>Total records</span>
        </div>
        <div>
          <strong>{counts.client}</strong>
          <span>Clients</span>
        </div>
        <div>
          <strong>{counts.prospect}</strong>
          <span>Prospects</span>
        </div>
        <div>
          <strong>{counts.not_contacted}</strong>
          <span>Not contacted</span>
        </div>
      </div>

      {!relationshipTableReady ? (
        <div className="portal-alert is-info">
          Preview mode: status is derived from existing listing fields
          (`owner_user_id`, `nyc_job_partners.partner_status`). A new{" "}
          <code>cms_listing_relationships</code> table is staged in this PR and
          needs approval before it can be applied.
        </div>
      ) : null}
      {readOnly ? (
        <div className="portal-alert is-info">
          Preview mode: browsing the live BawoSocial schema. Sign into Control
          Center as an admin to upload, save, or revert photos.
        </div>
      ) : null}
      {error ? <div className="portal-alert is-error">{error}</div> : null}

      <div className="clients-toolbar">
        <label className="clients-search">
          <Search aria-hidden />
          <span className="sr-only">Search by name</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name…"
          />
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as ClientRelationshipStatus | "all",
              )
            }
          >
            {STATUS_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value === "all" ? "All statuses" : CLIENT_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by category</span>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categories.map((value) => (
              <option key={value} value={value}>
                {value === "all" ? "All categories" : value}
              </option>
            ))}
          </select>
        </label>
        <span className="media-cms-count">
          {visible.length} shown
        </span>
      </div>

      {loading ? (
        <div className="portal-loading">Loading BawoSocial clients…</div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No matching records"
          body="Try clearing filters or search to see every BawoSocial place and partner."
        />
      ) : (
        <div className="clients-list">
          {visible.map((item) => (
            <button
              key={item.key}
              type="button"
              className="clients-row"
              onClick={() => setSelectedKey(item.key)}
            >
              <div className="clients-row-thumb">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" />
                ) : (
                  <span>
                    {item.entityType === "job_partner" ? (
                      <Briefcase aria-hidden />
                    ) : item.entityType === "directory" ? (
                      <Store aria-hidden />
                    ) : (
                      <Building2 aria-hidden />
                    )}
                  </span>
                )}
              </div>
              <div className="clients-row-main">
                <div className="clients-row-heading">
                  <strong>{item.name}</strong>
                  <span className={`portal-status ${statusTone(item.status)}`}>
                    {CLIENT_STATUS_LABELS[item.status]}
                  </span>
                </div>
                <span>
                  {SOURCE_LABELS[item.entityType]} · {item.category}
                  {item.borough ? ` · ${item.borough}` : ""}
                </span>
                <div className="clients-contact-line">
                  {item.phone ? (
                    <span>
                      <Phone aria-hidden /> {item.phone}
                    </span>
                  ) : null}
                  {item.website ? (
                    <span>
                      <Globe2 aria-hidden />{" "}
                      {item.website.replace(/^https?:\/\//, "")}
                    </span>
                  ) : null}
                  {!item.phone && !item.website ? (
                    <span>No phone or website on file</span>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
