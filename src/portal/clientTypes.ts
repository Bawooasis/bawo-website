import type { CmsMediaAsset } from "./mediaTypes";

export type ClientRelationshipStatus =
  | "client"
  | "prospect"
  | "not_contacted";

export type ClientEntityType = "venue" | "directory" | "job_partner";

export type CmsListingRelationship = {
  id: string;
  entity_type: ClientEntityType;
  entity_id: string;
  status: ClientRelationshipStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientRestaurant = {
  id: string;
  name: string;
  category: string | null;
  cuisine_type: string | null;
  borough: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  image_url: string | null;
  photo_urls: string[] | null;
  listing_kind: string | null;
  map_pin_enabled: boolean | null;
  is_active: boolean | null;
  owner_user_id: string | null;
  description: string | null;
};

export type ClientDirectoryResource = {
  id: string;
  name: string;
  category: string | null;
  borough: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  image_url: string | null;
  function: string | null;
  is_verified: boolean | null;
  owner_user_id: string | null;
  metadata: Record<string, unknown> | null;
};

export type ClientJobPartner = {
  id: string;
  name: string;
  organization: string | null;
  category: string | null;
  boroughs: string[] | null;
  summary: string | null;
  website: string | null;
  enroll_url: string | null;
  careers_url: string | null;
  address: string | null;
  phone: string | null;
  is_partner: boolean | null;
  partner_status: string | null;
  verified_at: string | null;
};

export type ClientListItem = {
  key: string;
  entityType: ClientEntityType;
  entityId: string;
  name: string;
  category: string;
  borough: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  imageUrl: string | null;
  photoUrls: string[];
  status: ClientRelationshipStatus;
  statusSource: "stored" | "derived";
  notes: string | null;
  summary: string | null;
  restaurant: ClientRestaurant | null;
  directory: ClientDirectoryResource | null;
  partner: ClientJobPartner | null;
  asset: CmsMediaAsset | null;
};

export const CLIENT_STATUS_LABELS: Record<ClientRelationshipStatus, string> = {
  client: "Client",
  prospect: "Prospect",
  not_contacted: "Not contacted",
};

export function normalizePartnerStatus(
  value: string | null | undefined,
): ClientRelationshipStatus | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (
    normalized === "client" ||
    normalized === "partner" ||
    normalized === "partnered" ||
    normalized === "active"
  ) {
    return "client";
  }
  if (
    normalized === "prospect" ||
    normalized === "outreach" ||
    normalized === "contacted"
  ) {
    return "prospect";
  }
  if (
    normalized === "not_contacted" ||
    normalized === "none" ||
    normalized === "new"
  ) {
    return "not_contacted";
  }
  return null;
}

/**
 * Preview fallback until `cms_listing_relationships` is approved and applied.
 * Prefers a stored relationship row when present.
 */
export function deriveListingStatus(input: {
  stored?: CmsListingRelationship | null;
  partnerStatus?: string | null;
  isPartner?: boolean | null;
  ownerUserId?: string | null;
}): { status: ClientRelationshipStatus; source: "stored" | "derived" } {
  if (input.stored?.status) {
    return { status: input.stored.status, source: "stored" };
  }

  const fromPartner = normalizePartnerStatus(input.partnerStatus);
  if (fromPartner) {
    return { status: fromPartner, source: "derived" };
  }
  if (input.isPartner) {
    return { status: "prospect", source: "derived" };
  }
  if (input.ownerUserId) {
    return { status: "prospect", source: "derived" };
  }
  return { status: "not_contacted", source: "derived" };
}
