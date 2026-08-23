import {
  BadgeCheck,
  BarChart3,
  Building2,
  Clock3,
  MapPinned,
  MousePointerClick,
  Route,
  Sparkles,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import type { PortalTab } from "./PortalLayout";
import { EmptyState, MetricCard } from "./PortalUi";
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
          <MetricCard icon={MapPinned} label="Live listings" value={data.metrics.listings} detail="Approved directory presence" tone="success" />
          <MetricCard icon={Clock3} label="Pending claims" value={data.metrics.pendingClaims} detail="Waiting for BawoSocial review" tone={data.metrics.pendingClaims > 0 ? "warning" : "neutral"} />
          <MetricCard icon={MousePointerClick} label="Tracked actions" value={data.metrics.trackedClicks ?? "—"} detail={data.metrics.trackedClicks === null ? "Measurement is being connected" : "All time"} tone="accent" />
          <MetricCard icon={BadgeCheck} label="Current plan" value={data.metrics.plan || "Free"} detail={data.metrics.plan === null ? "Billing is not active yet" : "Current subscription"} />
        </section>
        <section className="portal-panel portal-callout portal-business-hero">
          <div><span className="portal-kicker">NYC launch workspace</span><h2>Build a trusted presence before paid growth begins.</h2><p>Claim your business, keep its directory identity accurate, and prepare for customer-action reporting without exposing member information.</p><div className="portal-feature-row"><span><BadgeCheck aria-hidden />Admin-reviewed claims</span><span><Route aria-hidden />Outcome tracking next</span><span><Sparkles aria-hidden />Growth plans later</span></div></div>
          <Building2 aria-hidden />
        </section>
      </>
    );
  }

  if (activeTab === "growth") {
    return (
      <div className="portal-stack">
        <section className="portal-panel">
          <div className="portal-panel-heading"><div><span className="portal-kicker">Business growth path</span><h2>What unlocks next</h2></div><BarChart3 aria-hidden /></div>
          <div className="portal-roadmap-grid">
            <article className="is-ready"><span>01</span><strong>Verified presence</strong><p>Claim approval and owned listings are already connected.</p></article>
            <article className="is-next"><span>02</span><strong>Customer outcomes</strong><p>Views, calls, directions, and website clicks are the next system.</p></article>
            <article><span>03</span><strong>Growth plans</strong><p>$29 and $49 subscriptions remain targets until reporting is trustworthy.</p></article>
          </div>
        </section>
        <section className="portal-panel portal-callout"><div><span className="portal-kicker">Measurement promise</span><h2>No invented performance numbers.</h2><p>The dashboard will stay honest and unavailable until secure aggregate reporting is deployed for each verified listing.</p></div><MousePointerClick aria-hidden /></section>
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
          {data.listings.length === 0 && <EmptyState icon={MapPinned} title="No approved listings yet" body="Submit your business for review to start building an owned directory presence." />}
          {data.listings.map((listing) => (
            <article className="portal-list-row portal-listing-row" key={listing.id}>
              <div className="portal-listing-summary">
                <div className="portal-listing-thumb">{listing.image_url ? <img src={listing.image_url} alt="" /> : <span>{listing.name.slice(0, 1).toUpperCase()}</span>}</div>
                <div className="portal-list-main"><strong>{listing.name}</strong><span>{listing.category || "Restaurant"} · {listing.neighborhood || listing.borough || "NYC"}</span></div>
              </div>
              <span className={`portal-status ${listing.is_active === false ? "is-muted" : "is-success"}`}>{listing.is_active === false ? "Inactive" : "Live"}</span>
            </article>
          ))}
        </div>
        <div className="portal-panel-heading portal-panel-heading-spaced"><div><span className="portal-kicker">Review history</span><h2>Claims</h2></div></div>
        <div className="portal-list">
          {data.claims.length === 0 && <EmptyState icon={Clock3} title="No claims submitted" body="New submissions and their review status will appear here." />}
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
