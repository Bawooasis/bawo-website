import { BarChart3, Building2, MousePointerClick } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { PortalTab } from "./PortalLayout";
import type { VendorClaimInput, VendorOverview } from "./types";

type BusinessPortalProps = {
  data: VendorOverview;
  activeTab: PortalTab;
  busy: boolean;
  onSubmit: (input: VendorClaimInput) => Promise<void>;
};

const initialClaim: VendorClaimInput = {
  businessName: "",
  category: "",
  city: "New York",
  email: "",
  phone: "",
  website: "",
  message: "",
};

export default function BusinessPortal({ data, activeTab, busy, onSubmit }: BusinessPortalProps) {
  const [claim, setClaim] = useState<VendorClaimInput>({ ...initialClaim, email: data.account.email || "" });

  if (activeTab === "dashboard") {
    return (
      <>
        <section className="portal-metrics" aria-label="Business metrics">
          <article className="portal-metric"><span>Live listings</span><strong>{data.metrics.listings}</strong></article>
          <article className="portal-metric"><span>Pending claims</span><strong>{data.metrics.pendingClaims}</strong></article>
          <article className="portal-metric"><span>Tracked clicks</span><strong>{data.metrics.trackedClicks ?? "—"}</strong><small>{data.metrics.trackedClicks === null ? "Not connected yet" : "All time"}</small></article>
          <article className="portal-metric"><span>Plan</span><strong>{data.metrics.plan || "Free"}</strong><small>{data.metrics.plan === null ? "Billing not connected" : "Current subscription"}</small></article>
        </section>
        <section className="portal-panel portal-callout">
          <div><span className="portal-kicker">NYC launch</span><h2>Put your business where the community looks first.</h2><p>Submit a claim, get reviewed by BawoSocial, then manage approved directory listings from one workspace.</p></div>
          <Building2 aria-hidden />
        </section>
      </>
    );
  }

  if (activeTab === "growth") {
    return (
      <div className="portal-stack">
        <section className="portal-panel portal-callout"><div><span className="portal-kicker">Measurement status</span><h2>Click analytics is the next connected system.</h2><p>The portal does not invent performance numbers. Tracked clicks remain unavailable until vendor click events and the reporting view are deployed.</p></div><MousePointerClick aria-hidden /></section>
        <section className="portal-panel portal-callout"><div><span className="portal-kicker">Revenue status</span><h2>$29 and $49 plans are targets—not active billing.</h2><p>Subscription checkout, entitlements, webhooks, and account enforcement still require an approved Stripe implementation before plans can be sold here.</p></div><BarChart3 aria-hidden /></section>
      </div>
    );
  }

  const submitClaim = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(claim);
    setClaim({ ...initialClaim, email: data.account.email || "" });
  };

  return (
    <div className="portal-stack portal-two-column">
      <section className="portal-panel">
        <div className="portal-panel-heading"><div><span className="portal-kicker">Owned directory presence</span><h2>Your listings</h2></div></div>
        <div className="portal-list">
          {data.listings.length === 0 && <p className="portal-empty">No approved listings yet. Submit your business for review.</p>}
          {data.listings.map((listing) => (
            <article className="portal-list-row" key={listing.id}>
              <div className="portal-list-main"><strong>{listing.name}</strong><span>{listing.category || "Restaurant"} · {listing.neighborhood || listing.borough || "NYC"}</span></div>
              <span className={`portal-status ${listing.is_active === false ? "is-muted" : "is-success"}`}>{listing.is_active === false ? "Inactive" : "Live"}</span>
            </article>
          ))}
        </div>
        <div className="portal-panel-heading portal-panel-heading-spaced"><div><span className="portal-kicker">Review history</span><h2>Claims</h2></div></div>
        <div className="portal-list">
          {data.claims.length === 0 && <p className="portal-empty">No claims submitted yet.</p>}
          {data.claims.map((item) => <article className="portal-list-row" key={item.id}><div className="portal-list-main"><strong>{item.name}</strong><span>{item.category || "Explore"} · {item.city || "NYC"}</span></div><span className={`portal-status ${item.status === "approved" ? "is-success" : item.status === "rejected" ? "is-danger" : "is-warning"}`}>{item.status}</span></article>)}
        </div>
      </section>
      <section className="portal-panel">
        <div className="portal-panel-heading"><div><span className="portal-kicker">Admin reviewed</span><h2>Claim a business</h2></div></div>
        <form className="portal-form" onSubmit={submitClaim}>
          <label>Business name<input required minLength={2} value={claim.businessName} onChange={(event) => setClaim({ ...claim, businessName: event.target.value })} /></label>
          <div className="portal-form-grid"><label>Category<input required value={claim.category} onChange={(event) => setClaim({ ...claim, category: event.target.value })} placeholder="Restaurant, legal, shipping…" /></label><label>City<input required value={claim.city} onChange={(event) => setClaim({ ...claim, city: event.target.value })} /></label></div>
          <label>Email<input required type="email" value={claim.email} onChange={(event) => setClaim({ ...claim, email: event.target.value })} /></label>
          <div className="portal-form-grid"><label>Phone<input type="tel" value={claim.phone} onChange={(event) => setClaim({ ...claim, phone: event.target.value })} /></label><label>Website<input type="url" value={claim.website} onChange={(event) => setClaim({ ...claim, website: event.target.value })} placeholder="https://" /></label></div>
          <label>Notes<textarea rows={4} value={claim.message} onChange={(event) => setClaim({ ...claim, message: event.target.value })} placeholder="Tell the review team what this business provides." /></label>
          <button className="portal-primary-button" type="submit" disabled={busy}>{busy ? "Submitting…" : "Submit for review"}</button>
          <p className="portal-form-note">Submitting does not publish automatically. A BawoSocial administrator must approve the claim.</p>
        </form>
      </section>
    </div>
  );
}
