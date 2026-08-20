import { LockKeyhole } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import AdminPortal from "./AdminPortal";
import BusinessPortal from "./BusinessPortal";
import PortalLayout, { type PortalTab } from "./PortalLayout";
import { getPortalConfig, isPortalConfigured, PlatformApi } from "./platformApi";
import type { AdminAction, AdminOverview, PortalMode, PortalSession, VendorClaimInput, VendorOverview } from "./types";

type PortalAppProps = { mode: PortalMode };

const titles: Record<PortalTab, string> = {
  overview: "Platform overview",
  users: "Consumer accounts",
  groups: "Community groups",
  businesses: "Business approvals",
  access: "Access and audit",
  dashboard: "Business dashboard",
  listings: "Listings and claims",
  growth: "Growth and billing",
};

export default function PortalApp({ mode }: PortalAppProps) {
  const config = useMemo(() => getPortalConfig(), []);
  const api = useMemo(() => new PlatformApi(config), [config]);
  const [session, setSession] = useState<PortalSession | null>(() => api.getSession());
  const [activeTab, setActiveTab] = useState<PortalTab>(mode === "admin" ? "overview" : "dashboard");
  const [adminData, setAdminData] = useState<AdminOverview | null>(null);
  const [vendorData, setVendorData] = useState<VendorOverview | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const previousTitle = document.title;
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.content;
    document.title = `${mode === "admin" ? "Control Center" : "Business Portal"} | BawoSocial`;
    if (robots) robots.content = "noindex, nofollow";
    return () => {
      document.title = previousTitle;
      if (robots && previousRobots) robots.content = previousRobots;
    };
  }, [mode]);

  const load = useCallback(async () => {
    if (!session) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "admin") {
        setAdminData(await api.invoke<AdminOverview>("platform-control-center", { action: "overview" }));
      } else {
        setVendorData(await api.invoke<VendorOverview>("vendor-portal", { action: "overview" }));
      }
      setSession(api.getSession());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load portal.");
    } finally {
      setBusy(false);
    }
  }, [api, mode, session]);

  useEffect(() => { void load(); }, [load]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      setSession(await api.signIn(email.trim(), password));
      setPassword("");
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = () => {
    api.signOut();
    setSession(null);
    setAdminData(null);
    setVendorData(null);
    setNotice("");
  };

  const runAdminAction = async (action: AdminAction, successMessage: string) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.invoke("platform-control-center", action);
      setNotice(successMessage);
      if (mode === "admin") setAdminData(await api.invoke<AdminOverview>("platform-control-center", { action: "overview" }));
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  };

  const submitClaim = async (input: VendorClaimInput) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.invoke("vendor-portal", { action: "submit_claim", ...input });
      setNotice("Claim submitted for BawoSocial review.");
      setVendorData(await api.invoke<VendorOverview>("vendor-portal", { action: "overview" }));
    } catch (claimError) {
      setError(claimError instanceof Error ? claimError.message : "Unable to submit claim.");
      throw claimError;
    } finally {
      setBusy(false);
    }
  };

  if (!isPortalConfigured(config)) {
    return <PortalGate icon={<LockKeyhole />} title="Portal configuration pending" body="Add the public Supabase URL and publishable key to the Vercel environment before this portal can authenticate. No service-role key belongs in this website." />;
  }

  if (!session) {
    return (
      <div className="portal-auth-shell">
        <a className="portal-auth-brand" href="/"><img src="/bawo-logo.png" alt="" /><span>BawoSocial</span></a>
        <form className="portal-auth-card" onSubmit={signIn}>
          <span className="portal-kicker">{mode === "admin" ? "Restricted operations" : "Verified business access"}</span>
          <h1>{mode === "admin" ? "Control Center" : "Business Portal"}</h1>
          <p>Use your existing BawoSocial account. Access is verified by the backend after sign-in.</p>
          {error && <div className="portal-alert is-error">{error}</div>}
          <label>Email<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="portal-primary-button" disabled={busy}>{busy ? "Signing in…" : "Sign in securely"}</button>
          <small>Never share passwords, API keys, or signing certificates with BawoSocial support.</small>
        </form>
      </div>
    );
  }

  const dataReady = mode === "admin" ? Boolean(adminData) : Boolean(vendorData);
  return (
    <PortalLayout mode={mode} activeTab={activeTab} email={session.user?.email || email || "Signed in"} title={titles[activeTab]} notice={notice} error={error} onTabChange={setActiveTab} onRefresh={() => void load()} onSignOut={signOut}>
      {busy && !dataReady && <div className="portal-loading">Loading secure workspace…</div>}
      {mode === "admin" && adminData && <AdminPortal data={adminData} activeTab={activeTab} busy={busy} onAction={runAdminAction} />}
      {mode === "business" && vendorData && <BusinessPortal data={vendorData} activeTab={activeTab} busy={busy} onSubmit={submitClaim} />}
    </PortalLayout>
  );
}

function PortalGate({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <div className="portal-auth-shell"><div className="portal-auth-card portal-gate">{icon}<span className="portal-kicker">Setup required</span><h1>{title}</h1><p>{body}</p><a className="portal-primary-button" href="/">Return to JoinBawo.com</a></div></div>;
}
