import { ImagePlus, Save, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { PlatformGroup } from "./types";

export type GroupEditorInput = {
  name: string;
  imageUrl: string;
  file: File | null;
};

type GroupEditorProps = {
  group: PlatformGroup;
  busy: boolean;
  onCancel: () => void;
  onSave: (input: GroupEditorInput) => Promise<boolean>;
};

export default function GroupEditor({
  group,
  busy,
  onCancel,
  onSave,
}: GroupEditorProps) {
  const [name, setName] = useState(group.name);
  const [imageUrl, setImageUrl] = useState(group.image_url || "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(group.image_url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const selectFile = (selectedFile: File | null) => {
    setFile(selectedFile);
    setError("");
    setPreviewUrl(
      selectedFile ? URL.createObjectURL(selectedFile) : imageUrl.trim(),
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedName = name.trim();
    if (cleanedName.length < 2 || cleanedName.length > 80) {
      setError("Group names must be between 2 and 80 characters.");
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Group pictures must be 5 MB or smaller.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const saved = await onSave({
        name: cleanedName,
        imageUrl: imageUrl.trim(),
        file,
      });
      if (saved) onCancel();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Unable to save group.",
      );
    } finally {
      setSaving(false);
    }
  };

  const disabled = busy || saving;

  return (
    <form className="portal-group-editor" onSubmit={submit}>
      <div className="portal-group-editor-preview">
        {previewUrl ? (
          <img src={previewUrl} alt="" />
        ) : (
          <ImagePlus aria-hidden />
        )}
      </div>
      <div className="portal-form portal-group-editor-fields">
        <div className="portal-form-grid">
          <label>
            Group name
            <input
              type="text"
              minLength={2}
              maxLength={80}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label>
            Picture URL
            <input
              type="url"
              inputMode="url"
              placeholder="https://…"
              value={imageUrl}
              onChange={(event) => {
                setImageUrl(event.target.value);
                setFile(null);
                setPreviewUrl(event.target.value.trim());
              }}
            />
          </label>
        </div>
        <label>
          Upload a new picture
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(event) => selectFile(event.target.files?.[0] || null)}
          />
        </label>
        <p className="portal-form-note">
          JPG, PNG, GIF, or WebP · 5 MB maximum. Uploading replaces the URL above.
        </p>
        {error && <div className="portal-inline-error">{error}</div>}
        <div className="portal-row-actions portal-group-editor-actions">
          <button type="button" disabled={disabled} onClick={onCancel}>
            <X aria-hidden /> Cancel
          </button>
          <button className="is-primary" disabled={disabled}>
            <Save aria-hidden /> {saving ? "Saving…" : "Save group"}
          </button>
        </div>
      </div>
    </form>
  );
}
