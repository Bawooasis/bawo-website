import { ImagePlus, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { prepareMediaUpload } from "./mediaImage";
import type { PlatformApi } from "./platformApi";
import type { MediaListItem } from "./mediaTypes";

type EntityMediaEditorProps = {
  api: PlatformApi;
  item: MediaListItem;
  readOnly?: boolean;
  busy?: boolean;
  onSaved?: () => Promise<void> | void;
  onGroupCoverSaved?: (
    groupUuid: string,
    imageUrl: string | null,
  ) => Promise<void>;
};

function cacheBust(url: string | null): string | null {
  if (!url) return null;
  return `${url.split("?")[0]}?v=${Date.now()}`;
}

export default function EntityMediaEditor({
  api,
  item,
  readOnly = false,
  busy = false,
  onSaved,
  onGroupCoverSaved,
}: EntityMediaEditorProps) {
  const [draftFile, setDraftFile] = useState<File | null>(null);
  const [draftUrl, setDraftUrl] = useState<string | null>(null);
  const [attribution, setAttribution] = useState(item.attribution || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setAttribution(item.attribution || "");
    setDraftFile(null);
    setDraftUrl((prior) => {
      if (prior?.startsWith("blob:")) URL.revokeObjectURL(prior);
      return null;
    });
    setError("");
    setNotice("");
  }, [item.key, item.attribution, item.currentUrl]);

  useEffect(
    () => () => {
      if (draftUrl?.startsWith("blob:")) URL.revokeObjectURL(draftUrl);
    },
    [draftUrl],
  );

  const preview = draftUrl || cacheBust(item.currentUrl);
  const pending = Boolean(draftFile);

  const onPickFile = async (file: File | null) => {
    if (!file) return;
    setError("");
    setNotice("");
    try {
      const prepared = await prepareMediaUpload(file);
      const nextPreview = URL.createObjectURL(prepared);
      setDraftFile(prepared);
      setDraftUrl((prior) => {
        if (prior?.startsWith("blob:")) URL.revokeObjectURL(prior);
        return nextPreview;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not prepare image.");
    }
  };

  const save = async () => {
    if (readOnly) {
      setError("Sign into the BawoSocial Control Center as an admin to save.");
      return;
    }
    if (!draftFile) {
      setError("Choose a replacement image before saving.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const publicUrl = await api.uploadCmsMediaObject(
        item.bucketId,
        item.objectPath,
        draftFile,
      );
      const cleanUrl = publicUrl.split("?")[0];
      await api.upsertCmsMediaAsset({
        entityType: item.entityType,
        entityId: item.entityId,
        bucketId: item.bucketId,
        objectPath: item.objectPath,
        publicUrl: cleanUrl,
        sourceAttribution: attribution.trim() || item.attribution || null,
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
      } else if (item.entityType === "directory_photo") {
        await api.updateDirectoryResourceImage(item.entityId, cleanUrl);
      }

      setDraftFile(null);
      setDraftUrl((prior) => {
        if (prior?.startsWith("blob:")) URL.revokeObjectURL(prior);
        return null;
      });
      setNotice(`Saved ${item.name} for BawoSocial.`);
      await onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const revert = async () => {
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
    setSaving(true);
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
      } else if (item.entityType === "directory_photo") {
        await api.updateDirectoryResourceImage(item.entityId, null);
      }
      setNotice(`Reverted ${item.name}. BawoSocial will fall back to the prior image.`);
      await onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revert failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="entity-media-editor">
      <div className="media-cms-thumb entity-media-thumb">
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

      <div className="entity-media-body">
        <label className="media-cms-field">
          <span>Source attribution</span>
          <input
            value={attribution}
            onChange={(event) => setAttribution(event.target.value)}
            placeholder="Optional credit / source"
            disabled={readOnly || saving || busy}
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
              disabled={readOnly || saving || busy}
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                event.target.value = "";
                void onPickFile(file);
              }}
            />
          </label>
          <button
            type="button"
            className="portal-button"
            disabled={readOnly || saving || busy || !pending}
            onClick={() => void save()}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            className="portal-button is-ghost"
            disabled={readOnly || saving || busy || !item.asset?.is_active}
            onClick={() => void revert()}
            title="Deactivate managed image and clear live mirror"
          >
            <RotateCcw aria-hidden />
            Revert
          </button>
        </div>

        {notice ? <div className="portal-alert is-success">{notice}</div> : null}
        {error ? <div className="portal-alert is-error">{error}</div> : null}
      </div>
    </div>
  );
}
