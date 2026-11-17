export type CmsMediaEntityType =
  | "group_cover"
  | "venue_photo"
  | "directory_photo";

export type CmsMediaAsset = {
  id: string;
  entity_type: CmsMediaEntityType;
  entity_id: string;
  bucket_id: string;
  object_path: string;
  public_url: string;
  source_attribution: string | null;
  license_note: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MediaRestaurant = {
  id: string;
  name: string;
  image_url: string | null;
  photo_urls: string[] | null;
  listing_kind: string | null;
  map_pin_enabled: boolean | null;
  is_active: boolean | null;
};

export type MediaDirectoryResource = {
  id: string;
  name: string;
  image_url: string | null;
  metadata: Record<string, unknown> | null;
};

export type MediaTabId = "circles" | "places" | "directory";

export type MediaListItem = {
  key: string;
  tab: MediaTabId;
  entityType: CmsMediaEntityType;
  entityId: string;
  name: string;
  currentUrl: string | null;
  attribution: string | null;
  licenseNote: string | null;
  updatedAt: string | null;
  asset: CmsMediaAsset | null;
  /** Platform group UUID when the Control Center overview knows this circle */
  groupUuid: string | null;
  restaurant: MediaRestaurant | null;
  directory: MediaDirectoryResource | null;
  bucketId: "group-images" | "resource-images";
  objectPath: string;
};
