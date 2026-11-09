import { useMemo } from "react";
import ClientsProspectsPanel from "./ClientsProspectsPanel";
import { PlatformApi } from "./platformApi";
import "./portal.css";

/**
 * Read-only Clients & Prospects preview against the live BawoSocial schema.
 * Status is derived until cms_listing_relationships is approved and applied.
 */
export default function ClientsProspectsLab() {
  const api = useMemo(() => new PlatformApi(), []);
  return (
    <div className="media-lab-shell">
      <ClientsProspectsPanel api={api} readOnly />
    </div>
  );
}
