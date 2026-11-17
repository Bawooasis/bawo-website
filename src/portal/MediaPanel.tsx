import {
  ImagePlus,
  Images,
  MapPin,
  RefreshCw,
  RotateCcw,
  Store,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { prepareMediaUpload } from "./mediaImage";
import type { PlatformApi } from "./platformApi";
import type { PlatformGroup } from "./types";
import type {
  CmsMediaAsset,
  MediaListItem,
  MediaTabId,
} from "./mediaTypes";
import { EmptyState } from "./PortalUi";

type MediaPanelProps = {
  api: PlatformApi;
  groups: PlatformGroup[];
  busy?: boolean;
  onGroupCoverSaved?: (groupUuid: string, imageUrl: string | null) => Promise<void>;
  readOnly?: boolean;
};

const TAB_LABELS: Record<MediaTabId, string> = {
  circles: "Circle covers",
  places: "Places",
  directory: "Directory",
};

function cacheBust(url: string | null): string | null {
  if (!url) return null;
  const base = url.split("?")[0];
  return `${base}?v=${Date.now()}`;
}

function buildCircleItems(
  assets: CmsMediaAsset[],
  groups: PlatformGroup[],
): MediaListItem[] {
  const coverAssets = assets.filter((a) => a.entity_type === "group_cover");
  const byEntity = new Map(coverAssets.map((a) => [a.entity_id, a]));
  const items: MediaListItem[] = [];
  const seen = new Set<string>();

  for (const group of groups) {
    const asset =
      byEntity.get(group.id) ||
      [...byEntity.values()].find(
        (row) =>
          row.public_url &&
          group.image_url &&
          row.public_url.split("?")[0] === group.image_url.split("?")[0],
      ) ||
      null;
    const entityId = asset?.entity_id || group.id;
    seen.add(entityId);
    items.push({
      key: `circle:${entityId}`,
      tab: "circles",
      entityType: "group_cover",
      entityId,
      name: group.name,
      currentUrl: asset?.public_url || group.cover_image_url || group.image_url,
      attribution: asset?.source_attribution || null,
      licenseNote: asset?.license_note || null,
      updatedAt: asset?.updated_at || group.last_activity || group.created_at,
      asset,
      groupUuid: group.id,
      restaurant: null,
      directory: null,
      bucketId: "group-images",
      objectPath: `control-center/${entityId}.jpg`,
    });
  }

  for (const asset of coverAssets) {
    if (seen.has(asset.entity_id)) continue;
    items.push({
      key: `circle:${asset.entity_id}`,
      tab: "circles",
      entityType: "group_cover",
      entityId: asset.entity_id,
      name: humanizeId(asset.entity_id),
      currentUrl: asset.public_url,
      attribution: asset.source_attribution,
      licenseNote: asset.license_note,
      updatedAt: asset.updated_at,
      asset,
      groupUuid: null,
      restaurant: null,
      directory: null,
      bucketId: "group-images",
      objectPath: asset.object_path || `control-center/${asset.entity_id}.jpg`,
    });
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

function buildPlaceItems(
  assets: CmsMediaAsset[],
  restaurants: Awaited<ReturnType<PlatformApi["listMediaRestaurants"]>>,
): MediaListItem[] {
  const venueAssets = assets.filter((a) => a.entity_type === "venue_photo");
  const byEntity = new Map(venueAssets.map((a) => [a.entity_id, a]));
  const seen = new Set<string>();
  const items: MediaListItem[] = restaurants
    .slice()
    .sort(
      (a, b) =>
        Number(b.is_active) - Number(a.is_active) ||
        a.name.localeCompare(b.name),
    )
    .map((restaurant) => {
      const asset =
        byEntity.get(restaurant.id) ||
        [...byEntity.values()].find(
          (row) =>
            row.public_url &&
            restaurant.image_url &&
            row.public_url.split("?")[0] === restaurant.image_url.split("?")[0],
        ) ||
        null;
      const entityId = asset?.entity_id || restaurant.id;
      seen.add(entityId);
      return {
        key: `place:${entityId}`,
        tab: "places" as const,
        entityType: "venue_photo" as const,
        entityId,
        name: restaurant.name,
        currentUrl: asset?.public_url || restaurant.image_url,
        attribution: asset?.source_attribution || null,
        licenseNote: asset?.license_note || null,
        updatedAt: asset?.updated_at || null,
        asset,
        groupUuid: null,
        restaurant,
        directory: null,
        bucketId: "resource-images" as const,
        objectPath:
          asset?.object_path || `restaurants/${restaurant.id}.jpg`,
      };
    });

  for (const asset of venueAssets) {
    if (seen.has(asset.entity_id)) continue;
    items.push({
      key: `place:${asset.entity_id}`,
      tab: "places",
      entityType: "venue_photo",
      entityId: asset.entity_id,
      name: humanizeId(asset.entity_id),
      currentUrl: asset.public_url,
      attribution: asset.source_attribution,
      licenseNote: asset.license_note,
      updatedAt: asset.updated_at,
      asset,
      groupUuid: null,
      restaurant: null,
      directory: null,
      bucketId: "resource-images",
      objectPath: asset.object_path || `restaurants/${asset.entity_id}.jpg`,
    });
  }

  return items;
}

function buildDirectoryItems(
  assets: CmsMediaAsset[],
  resources: Awaited<ReturnType<PlatformApi["listMediaDirectoryResources"]>>,
): MediaListItem[] {
  const dirAssets = assets.filter((a) => a.entity_type === "directory_photo");
  const byEntity = new Map(dirAssets.map((a) => [a.entity_id, a]));
  const items: MediaListItem[] = resources.map((resource) => {
    const asset = byEntity.get(resource.id) || null;
    return {
      key: `directory:${resource.id}`,
      tab: "directory" as const,
      entityType: "directory_photo" as const,
      entityId: resource.id,
      name: resource.name,
      currentUrl: asset?.public_url || resource.image_url,
      attribution: asset?.source_attribution || null,
      licenseNote: asset?.license_note || null,
      updatedAt: asset?.updated_at || null,
      asset,
      groupUuid: null,
      restaurant: null,
      directory: resource,
      bucketId: "resource-images" as const,
      objectPath: asset?.object_path || `stores/${resource.id}.jpg`,
    };
  });

  for (const asset of dirAssets) {
    if (items.some((item) => item.entityId === asset.entity_id)) continue;
    items.push({
      key: `directory:${asset.entity_id}`,
      tab: "directory",
      entityType: "directory_photo",
      entityId: asset.entity_id,
      name: humanizeId(asset.entity_id),
      currentUrl: asset.public_url,
      attribution: asset.source_attribution,
      licenseNote: asset.license_note,
      updatedAt: asset.updated_at,
      asset,
      groupUuid: null,
      restaurant: null,
      directory: null,
      bucketId: "resource-images",
      objectPath: asset.object_path || `stores/${asset.entity_id}.jpg`,
    });
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

function humanizeId(id: string): string {
  return id
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatUpdated(value: string | null): string {
  if (!value) return "Not managed yet";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function MediaPanel({
  api,
  groups,
  busy = false,
  onGroupCoverSaved,
  readOnly = false,
}: MediaPanelProps) {
  const [tab, setTab] = useState<MediaTabId>("circles");
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [assets, setAssets] = useState<CmsMediaAsset[]>([]);
  const [restaurants, setRestaurants] = useState<
    Awaited<ReturnType<PlatformApi["listMediaRestaurants"]>>
  >([]);
  const [directory, setDirectory] = useState<
    Awaited<ReturnType<PlatformApi["listMediaDirectoryResources"]>>
  >([]);
  const [draftUrl, setDraftUrl] = useState<Record<string, string>>({});
  const [draftFile, setDraftFile] = useState<Record<string, File>>({});
  const [attributionDraft, setAttributionDraft] = useState<Record<string, string>>(
    {},
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextAssets, nextRestaurants, nextDirectory] = await Promise.all([
        api.listCmsMediaAssets(true),
        api.listMediaRestaurants(),
        api.listMediaDirectoryResources(),
      ]);
      setAssets(nextAssets);
      setRestaurants(nextRestaurants);
      setDirectory(nextDirectory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load media.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const items = useMemo(() => {
    if (tab === "circles") return buildCircleItems(assets, groups);
    if (tab === "places") return buildPlaceItems(assets, restaurants);
    return buildDirectoryItems(assets, directory);
  }, [tab, assets, groups, restaurants, directory]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.name, item.entityId, item.attribution]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q)),
    );
  }, [items, query]);

  const onPickFile = async (item: MediaListItem, file: File | null) => {
    if (!file) return;
    setError("");
    setNotice("");
    try {
      const prepared = await prepareMediaUpload(file);
      const preview = URL.createObjectURL(prepared);
      setDraftFile((prev) => ({ ...prev, [item.key]: prepared }));
      setDraftUrl((prev) => {
        const prior = prev[item.key];
        if (prior?.startsWith("blob:")) URL.revokeObjectURL(prior);
        return { ...prev, [item.key]: preview };
      });
      setAttributionDraft((prev) => ({
        ...prev,
        [item.key]: prev[item.key] ?? item.attribution ?? "",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not prepare image.");
    }
  };

  const saveItem = async (item: MediaListItem) => {
    if (readOnly) {
      setError("Sign into the BawoSocial Control Center as an admin to save.");
      return;
    }
    const file = draftFile[item.key];
    if (!file) {
      setError("Choose a replacement image before saving.");
      return;
    }
    setSavingKey(item.key);
    setError("");
    setNotice("");
    try {
      const publicUrl = await api.uploadCmsMediaObject(
        item.bucketId,
        item.objectPath,
        file,
      );
      const cleanUrl = publicUrl.split("?")[0];
      const asset = await api.upsertCmsMediaAsset({
        entityType: item.entityType,
        entityId: item.entityId,
        bucketId: item.bucketId,
        objectPath: item.objectPath,
        publicUrl: cleanUrl,
        sourceAttribution:
          attributionDraft[item.key]?.trim() || item.attribution || null,
        licenseNote: item.licenseNote,
      });

      if (item.entityType === "group_cover") {
        await api.updateGroupChatCover(item.entityId, cleanUrl);
        if (item.groupUuid && onGroupCoverSaved) {
          await onGroupCoverSaved(item.groupUuid, cleanUrl);
        }
      } else if (item.entityType === "venue_photo") {
        await api.updateRestaurantHero(
          item.entityId,
          cleanUrl,
          item.restaurant?.photo_urls || [],
        );
      } else {
        await api.updateDirectoryResourceImage(item.entityId, cleanUrl);
      }

      setDraftFile((prev) => {
        const next = { ...prev };
        delete next[item.key];
        return next;
      });
      setDraftUrl((prev) => {
        const prior = prev[item.key];
        if (prior?.startsWith("blob:")) URL.revokeObjectURL(prior);
        const next = { ...prev };
        delete next[item.key];
        return next;
      });
      setNotice(`Saved ${item.name} for BawoSocial.`);
      setAssets((prev) => {
        const without = prev.filter(
          (row) =>
            !(
              row.entity_type === asset.entity_type &&
              row.entity_id === asset.entity_id
            ),
        );
        return [asset, ...without];
      });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSavingKey(null);
    }
  };

  const revertItem = async (item: MediaListItem) => {
    if (readOnly) {
      setError("Sign into the BawoSocial Control Center as an admin to revert.");
      return;
    }
    if (
      !window.confirm(
        `Revert ${item.name} to the previous / bundled image? The managed Control Center photo will be deactivated.`,
      )
    ) {
      return;
    }
    setSavingKey(item.key);
    setError("");
    setNotice("");
    try {
      if (item.asset?.id) {
        await api.deactivateCmsMediaAsset(item.asset.id);
      }
      if (item.entityType === "group_cover") {
        await api.updateGroupChatCover(item.entityId, null);
        if (item.groupUuid && onGroupCoverSaved) {
          await onGroupCoverSaved(item.groupUuid, null);
        }
      } else if (item.entityType === "venue_photo") {
        await api.updateRestaurantHero(
          item.entityId,
          null,
          item.restaurant?.photo_urls || [],
        );
      } else {
        await api.updateDirectoryResourceImage(item.entityId, null);
      }
      setNotice(`Reverted ${item.name}. BawoSocial will fall back to the prior image.`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revert failed.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <section className="portal-panel media-cms-panel">
      <div className="portal-panel-heading">
        <div>
          <span className="portal-kicker">BawoSocial Media CMS</span>
          <h2>Circle covers & place photos</h2>
          <p className="media-cms-lead">
            Replace BawoSocial circle covers and place photos without an app
            rebuild. Uploads go to Supabase Storage; the app prefers these
            managed remotes and keeps bundled images as offline fallback.
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

      <div className="media-cms-tabs" role="tablist" aria-label="Media categories">
        {(Object.keys(TAB_LABELS) as MediaTabId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`media-cms-tab ${tab === id ? "is-active" : ""}`}
            onClick={() => setTab(id)}
          >
            {id === "circles" ? (
              <UsersRound aria-hidden />
            ) : id === "places" ? (
              <MapPin aria-hidden />
            ) : (
              <Store aria-hidden />
            )}
            <span>{TAB_LABELS[id]}</span>
          </button>
        ))}
      </div>

      <div className="media-cms-toolbar">
        <label className="media-cms-search">
          <span className="sr-only">Search media</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${TAB_LABELS[tab].toLowerCase()}…`}
          />
        </label>
        <span className="media-cms-count">
          {visible.length} item{visible.length === 1 ? "" : "s"}
        </span>
      </div>

      {notice ? <div className="portal-alert is-success">{notice}</div> : null}
      {error ? <div className="portal-alert is-error">{error}</div> : null}
      {readOnly ? (
        <div className="portal-alert is-info">
          Preview mode: browsing the live BawoSocial schema. Sign into Control
          Center as an admin to upload, save, or revert.
        </div>
      ) : null}

      {loading ? (
        <div className="portal-loading">Loading BawoSocial media…</div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No media in this tab"
          body="Approved circle covers and place photos will appear here once they are registered for BawoSocial."
        />
      ) : (
        <div className="media-cms-grid">
          {visible.map((item) => {
            const preview =
              draftUrl[item.key] || cacheBust(item.currentUrl) || null;
            const pending = Boolean(draftFile[item.key]);
            const rowBusy = savingKey === item.key;
            return (
              <article key={item.key} className="media-cms-card">
                <div className="media-cms-thumb">
                  {preview ? (
                    <img src={preview} alt="" />
                  ) : (
                    <div className="media-cms-thumb-empty">
                      <ImagePlus aria-hidden />
                      <span>No image yet</span>
                    </div>
                  )}
                  {pending ? (
                    <span className="media-cms-badge">Preview</span>
                  ) : item.asset ? (
                    <span className="media-cms-badge is-live">Managed</span>
                  ) : null}
                </div>
                <div className="media-cms-body">
                  <div className="media-cms-meta">
                    <h3>{item.name}</h3>
                    <p>
                      <code>{item.entityId}</code>
                      <span aria-hidden> · </span>
                      Updated {formatUpdated(item.updatedAt)}
                    </p>
                    {item.attribution ? (
                      <p className="media-cms-attr">{item.attribution}</p>
                    ) : null}
                  </div>

                  <label className="media-cms-field">
                    <span>Source attribution</span>
                    <input
                      value={
                        attributionDraft[item.key] ?? item.attribution ?? ""
                      }
                      onChange={(event) =>
                        setAttributionDraft((prev) => ({
                          ...prev,
                          [item.key]: event.target.value,
                        }))
                      }
                      placeholder="Optional credit / source"
                      disabled={readOnly || rowBusy}
                    />
                  </label>

                  <div className="media-cms-actions">
                    <label className="portal-button is-ghost media-cms-file">
                      <ImagePlus aria-hidden />
                      <span>Replace</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                        disabled={readOnly || rowBusy || busy}
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null;
                          event.target.value = "";
                          void onPickFile(item, file);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="portal-button"
                      disabled={readOnly || rowBusy || busy || !pending}
                      onClick={() => void saveItem(item)}
                    >
                      {rowBusy ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      className="portal-button is-ghost"
                      disabled={
                        readOnly || rowBusy || busy || !item.asset?.is_active
                      }
                      onClick={() => void revertItem(item)}
                      title="Deactivate managed image and clear live mirror"
                    >
                      <RotateCcw aria-hidden />
                      Revert
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
