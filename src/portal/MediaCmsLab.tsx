import { useMemo } from "react";
import MediaPanel from "./MediaPanel";
import { PlatformApi } from "./platformApi";
import "./portal.css";
import type { PlatformGroup } from "./types";

/**
 * Read-only preview of the Control Center Media CMS against the live
 * BawoSocial schema (public SELECT). Writes stay disabled until an admin
 * signs into /admin.
 */
export default function MediaCmsLab() {
  const api = useMemo(() => new PlatformApi(), []);
  const seedGroups: PlatformGroup[] = [
    {
      id: "secure_the_bag",
      name: "Secure the Bag",
      description: "Jobs & career circle",
      category: "career",
      member_count: 0,
      is_public: true,
      is_featured: true,
      is_active: true,
      image_url:
        "https://wyarfsymnyrraowwluhf.supabase.co/storage/v1/object/public/group-images/control-center/secure_the_bag.jpg",
      cover_image_url:
        "https://wyarfsymnyrraowwluhf.supabase.co/storage/v1/object/public/group-images/control-center/secure_the_bag.jpg",
      created_at: null,
      last_activity: null,
    },
  ];

  return (
    <div className="media-lab-shell">
      <MediaPanel api={api} groups={seedGroups} readOnly />
    </div>
  );
}
