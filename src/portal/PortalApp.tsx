import { BadgeCheck, Building2, LockKeyhole, ShieldCheck, Sparkles, Store, TrendingUp } from "lucide-react";
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
  events: "Event submissions",
  groups: "Community groups",
  businesses: "Business approvals",
  social: "Social media growth",
  crm: "Outreach and revenue pipeline",
  access: "Access and audit",
  dashboard: "Business dashboard",
  listings: "Listings and claims",
  growth: "Growth and billing",
};

const descriptions: Record<PortalTab, string> = {
  overview: "Monitor the launch queue and the health of BawoSocial's core operations.",
  users: "Review member access, account standing, and trusted operations roles.",
  events: "Review community-submitted and organizer-created events before they appear in the NYC Culture Hub feed.",
  groups: "Shape community spaces, review requests, and keep group presentation current.",
  businesses: "Review submitted businesses before they appear in the community directory.",
  social: "Plan, publish, and measure TikTok and Instagram content from one accountable pipeline.",
  crm: "Track potential customers from research through outreach, replies, proposals, and verified partnerships.",
  access: "Manage privileged access and review the record of administrative actions.",
  dashboard: "See your BawoSocial presence and the systems being prepared for growth.",
  listings: "Review owned listings and submit new businesses for administrator approval.",
  growth: "Follow the path from verified presence to measurable customer outcomes.",
};

export default function PortalApp({ mode }: PortalAppProps) {
  const config = useMemo(() => getPortalConfig(), []);
  const api = useMemo(() => new PlatformApi(config), [config]);
  const [session, setSession] = useState<PortalSession | null>(() => api.getSession());
  const [activeTab, setActiveTab] = useState<PortalTab>(mode === "admin" ? "overview" : "dashboard");
  const [adminData, setAdminData] = useState<AdminOverview | null>(null);
  const [vendorData, setVendorData] = useState<VendorOverview | null>(null);
  const [authSubMode, setAuthSubMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
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
    setNotice("");
    try {
      if (authSubMode === "reset") {
        await api.requestPasswordReset(email.trim());
        setNotice("Password reset instructions have been sent to your email.");
        setAuthSubMode("signin");
        return;
      }
      if (mode === "business" && authSubMode === "signup") {
        const result = await api.signUpBusiness(
          email.trim(),
          password,
          contactName.trim(),
          businessName.trim(),
        );
        if (result.session) {
          setSession(result.session);
          setPassword("");
          setActiveTab("listings");
          setNotice("Welcome to BawoSocial for Businesses! Submit or claim your listing below.");
        } else {
          setNotice(
            "Your BawoSocial business account has been created! Check your email to confirm your address, then sign in below to claim your listing.",
          );
          setAuthSubMode("signin");
          setPassword("");
        }
        return;
      }
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
      return true;
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Action failed.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const uploadGroupImage = (groupId: string, file: File) =>
    api.uploadGroupImage(groupId, file);

  const connectInstagram = async () => {
    setBusy(true);
    setError("");
    try {
      const result = await api.invoke<{ authorizationUrl: string }>("platform-control-center", {
        action: "start_instagram_connection",
        targetId: "instagram",
        returnUrl: `${window.location.origin}/admin`,
      });
      window.location.assign(result.authorizationUrl);
    } catch (connectionError) {
      setError(connectionError instanceof Error ? connectionError.message : "Unable to connect Instagram.");
      setBusy(false);
    }
  };

  const uploadSocialMedia = async (contentId: string, file: File) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.uploadSocialMedia(contentId, file);
      setNotice("Media uploaded securely.");
      setAdminData(await api.invoke<AdminOverview>("platform-control-center", { action: "overview" }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload media.");
      throw uploadError;
    } finally {
      setBusy(false);
    }
  };

  const queueSocialPublish = async (contentId: string, scheduledFor: string) =>
    runAdminAction({
      action: "queue_social_publish",
      targetId: contentId,
      socialPublish: { scheduledFor },
    }, new Date(scheduledFor).getTime() <= Date.now() + 60_000 ? "Instagram post queued now." : "Instagram post scheduled.");

  const scheduleTikTok = async (contentId: string, scheduledFor: string) =>
    runAdminAction({
      action: "schedule_tiktok_reminder",
      targetId: contentId,
      socialPublish: { scheduledFor },
    }, "TikTok manual post added to the schedule.");

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
    if (mode === "business") {
      return (
        <div className="portal-business-landing">
          <header className="portal-business-topbar">
            <a className="portal-auth-brand" href="/">
              <img src="/bawo-logo.png" alt="BawoSocial" />
              <span>BawoSocial</span>
              <em className="portal-brand-pill">for Businesses</em>
            </a>
            <a className="portal-back-home" href="/">
              ← Back to BawoSocial
            </a>
          </header>

          <div className="portal-business-split">
            <section className="portal-business-pitch" aria-label="BawoSocial for Businesses">
              <span className="portal-kicker">Verified Nigerian &amp; Diaspora Directory · NYC</span>
              <h1>Put your Nigerian business at the center of the community in NYC.</h1>
              <p className="portal-business-lead">
                From Nigerian restaurants, suya spots, and lounges to fashion houses, salons, and
                professional services across the five boroughs — claim your verified BawoSocial
                profile, showcase your offerings, and connect directly with Nigerians in New York.
              </p>

              <div className="portal-business-benefits">
                <div className="portal-benefit-row">
                  <div className="portal-benefit-icon"><BadgeCheck size={18} /></div>
                  <div>
                    <strong>Verified Ownership Badge</strong>
                    <span>Stand out in the Explore map and directory with an official verified partner badge.</span>
                  </div>
                </div>
                <div className="portal-benefit-row">
                  <div className="portal-benefit-icon"><Sparkles size={18} /></div>
                  <div>
                    <strong>Direct Bookings, Orders &amp; Inquiries</strong>
                    <span>Add your website, reservation link, WhatsApp, or phone number so members act in one tap.</span>
                  </div>
                </div>
                <div className="portal-benefit-row">
                  <div className="portal-benefit-icon"><TrendingUp size={18} /></div>
                  <div>
                    <strong>Cultural Events &amp; Community Spotlights</strong>
                    <span>Get featured in curated city guides, weekend event roundups, and neighborhood circles.</span>
                  </div>
                </div>
              </div>

              <div className="portal-business-steps">
                <span><Store size={14} /> 1. Sign in or create account</span>
                <span>→</span>
                <span><Building2 size={14} /> 2. Claim or add your business</span>
                <span>→</span>
                <span><ShieldCheck size={14} /> 3. Verified &amp; live in app</span>
              </div>
            </section>

            <section className="portal-business-auth-col">
              <form className="portal-auth-card portal-auth-card--business" onSubmit={signIn}>
                <div className="portal-auth-tabs" role="tablist" aria-label="Business portal authentication">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authSubMode === "signin"}
                    className={authSubMode === "signin" ? "portal-auth-tab is-active" : "portal-auth-tab"}
                    onClick={() => { setAuthSubMode("signin"); setError(""); setNotice(""); }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authSubMode === "signup"}
                    className={authSubMode === "signup" ? "portal-auth-tab is-active" : "portal-auth-tab"}
                    onClick={() => { setAuthSubMode("signup"); setError(""); setNotice(""); }}
                  >
                    Create Business Account
                  </button>
                </div>

                <span className="portal-kicker">
                  {authSubMode === "signup"
                    ? "New business partner"
                    : authSubMode === "reset"
                      ? "Account recovery"
                      : "Verified business access"}
                </span>
                <h2>
                  {authSubMode === "signup"
                    ? "Claim your business on BawoSocial"
                    : authSubMode === "reset"
                      ? "Reset your password"
                      : "Sign in to Business Portal"}
                </h2>
                <p>
                  {authSubMode === "signup"
                    ? "Create your BawoSocial account in seconds, then submit or claim your Nigerian restaurant, lounge, shop, or service."
                    : authSubMode === "reset"
                      ? "Enter the email associated with your BawoSocial account and we will send you a password reset link."
                      : "Use your BawoSocial account credentials to manage your verified listing, update hours, and track engagement."}
                </p>

                {error && <div className="portal-alert is-error">{error}</div>}
                {notice && <div className="portal-alert is-success">{notice}</div>}

                {authSubMode === "signup" && (
                  <>
                    <label>
                      Business or venue name
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. BUKA, Lagos TSQ, Eko Market, Crown Braids"
                        required
                      />
                    </label>
                    <label>
                      Your full name
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Owner or manager name"
                        required
                      />
                    </label>
                  </>
                )}

                <label>
                  Work or account email
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@yourbusiness.com"
                  />
                </label>

                {authSubMode !== "reset" && (
                  <label>
                    Password
                    <input
                      type="password"
                      autoComplete={authSubMode === "signup" ? "new-password" : "current-password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={authSubMode === "signup" ? "Create a password (min. 6 characters)" : "Enter your password"}
                    />
                  </label>
                )}

                <button className="portal-primary-button" disabled={busy}>
                  {busy
                    ? authSubMode === "signup"
                      ? "Creating account…"
                      : authSubMode === "reset"
                        ? "Sending reset link…"
                        : "Signing in…"
                    : authSubMode === "signup"
                      ? "Create Business Account"
                      : authSubMode === "reset"
                        ? "Send Password Reset Link"
                        : "Sign In to Business Portal"}
                </button>

                <div className="portal-auth-footer-links">
                  {authSubMode === "signin" ? (
                    <>
                      <button
                        type="button"
                        className="portal-text-link"
                        onClick={() => { setAuthSubMode("reset"); setError(""); setNotice(""); }}
                      >
                        Forgot your password?
                      </button>
                      <button
                        type="button"
                        className="portal-text-link"
                        onClick={() => { setAuthSubMode("signup"); setError(""); setNotice(""); }}
                      >
                        Need an account? Claim your business →
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="portal-text-link"
                      onClick={() => { setAuthSubMode("signin"); setError(""); setNotice(""); }}
                    >
                      ← Back to Sign In
                    </button>
                  )}
                </div>
              </form>
            </section>
          </div>
        </div>
      );
    }

    return (
      <div className="portal-auth-shell">
        <a className="portal-auth-brand" href="/"><img src="/bawo-logo.png" alt="" /><span>BawoSocial</span></a>
        <form className="portal-auth-card" onSubmit={signIn}>
          <span className="portal-kicker">Restricted operations</span>
          <h1>Control Center</h1>
          <p>Use your existing BawoSocial account. Access is verified by the backend after sign-in.</p>
          {error && <div className="portal-alert is-error">{error}</div>}
          {notice && <div className="portal-alert is-success">{notice}</div>}
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
    <PortalLayout mode={mode} activeTab={activeTab} email={session.user?.email || email || "Signed in"} title={titles[activeTab]} description={descriptions[activeTab]} notice={notice} error={error} onTabChange={setActiveTab} onRefresh={() => void load()} onSignOut={signOut}>
      {busy && !dataReady && <div className="portal-loading">Loading secure workspace…</div>}
      {mode === "admin" && adminData && (
        <AdminPortal
          data={adminData}
          activeTab={activeTab}
          busy={busy}
          onAction={runAdminAction}
          onUploadGroupImage={uploadGroupImage}
          onConnectInstagram={connectInstagram}
          onUploadSocialMedia={uploadSocialMedia}
          onQueueSocialPublish={queueSocialPublish}
          onScheduleTikTok={scheduleTikTok}
        />
      )}
      {mode === "business" && vendorData && <BusinessPortal data={vendorData} activeTab={activeTab} busy={busy} onSubmit={submitClaim} />}
    </PortalLayout>
  );
}

function PortalGate({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <div className="portal-auth-shell"><div className="portal-auth-card portal-gate">{icon}<span className="portal-kicker">Setup required</span><h1>{title}</h1><p>{body}</p><a className="portal-primary-button" href="/">Return to JoinBawo.com</a></div></div>;
}
