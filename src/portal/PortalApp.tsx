import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Compass,
  KeyRound,
  Lock,
  MapPin,
  ShieldAlert,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";
import AdminPortal from "./AdminPortal";
import BusinessPortal from "./BusinessPortal";
import PortalLayout from "./PortalLayout";
import { PlatformApi } from "./platformApi";
import type {
  AdminBootstrapResponse,
  AdminTab,
  BusinessProfilePatch,
  BusinessTab,
  DirectoryListing,
  ModerationAction,
  PortalMode,
  PortalSession,
  SocialPostDraft,
  VendorClaimSubmission,
  VendorPortalBootstrapResponse,
} from "./types";
import "./portal.css";

const ADMIN_TITLES: Record<AdminTab, string> = {
  overview: "Platform Overview",
  events: "Event Approval Queue",
  businesses: "Business Claim Verification",
  reports: "Safety & Abuse Reports",
  groups: "Community Spaces",
  users: "Directory & Role Controls",
  waitlist: "Waitlist Leads",
  social: "Social Media Control Center",
};

const BUSINESS_TITLES: Record<BusinessTab, string> = {
  dashboard: "Business Portal",
  claim: "Claim Your Business",
  profile: "Listing Profile",
};

const ADMIN_SUBTITLES: Record<AdminTab, string> = {
  overview: "Monitor the launch queue and the health of BawoSocial's core operations.",
  events: "Approve cultural programming before it reaches the public feed.",
  businesses: "Verify ownership before unlocking vendor profile management.",
  reports: "Resolve member reports with documented moderation outcomes.",
  groups: "Keep community rooms active, clear, and aligned with the launch standard.",
  users: "Assign trusted roles and protect member access.",
  waitlist: "Track incoming demand from the public marketing site.",
  social: "Plan, approve, schedule, and review posts across Instagram, TikTok, X, LinkedIn, and YouTube.",
};

const BUSINESS_SUBTITLES: Record<BusinessTab, string> = {
  dashboard: "See your BawoSocial presence and manage how the Nigerian community in NYC discovers your business.",
  claim: "Connect your BawoSocial account to the directory listing you own or manage.",
  profile: "Keep your address, hours, photos, and contact links accurate for the community.",
};

const BUSINESS_HIGHLIGHTS = [
  {
    icon: MapPin,
    title: "Put your business on the BawoSocial Explore Map",
    body: "Help thousands of Nigerians across all five boroughs of NYC find your restaurant, buka, suya spot, lounge, salon, African market, or service.",
  },
  {
    icon: BadgeCheck,
    title: "Claim & verify your official listing",
    body: "Take ownership of your storefront profile, earn a verified badge, and keep your hours, menu links, and contact details accurate.",
  },
  {
    icon: TrendingUp,
    title: "Turn cultural discovery into real foot traffic",
    body: "Connect directly with members searching for authentic Nigerian food, beauty, nightlife, faith spaces, and community services in NYC.",
  },
];

const BUSINESS_CATEGORIES = [
  "Nigerian Restaurants, Bukas & Suya",
  "Afrobeats Lounges & Event Spaces",
  "Salons, Barbers, Gele & Fashion",
  "African Food Markets & Groceries",
  "Churches, Mosques & Associations",
  "Legal, Immigration, Tax & Cargo",
];

type AuthSubMode = "signin" | "signup" | "reset";

export default function PortalApp({ mode }: { mode: PortalMode }) {
  const api = useMemo(() => new PlatformApi(), []);
  const [session, setSession] = useState<PortalSession | null>(() => api.getStoredSession());
  const [adminTab, setAdminTab] = useState<AdminTab>("overview");
  const [businessTab, setBusinessTab] = useState<BusinessTab>("dashboard");
  const [authSubMode, setAuthSubMode] = useState<AuthSubMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactName, setContactName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [adminData, setAdminData] = useState<AdminBootstrapResponse | null>(null);
  const [vendorData, setVendorData] = useState<VendorPortalBootstrapResponse | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${mode === "admin" ? "Control Center" : "Businesses · Sign In & Portal"} | BawoSocial`;
  }, [mode]);

  const loadPortal = useCallback(
    async (activeSession = session) => {
      if (!activeSession) return;
      setIsBusy(true);
      setError(null);
      try {
        if (mode === "admin") {
          const data = await api.fetchAdminBootstrap(activeSession);
          setAdminData(data);
        } else {
          const data = await api.fetchVendorBootstrap(activeSession);
          setVendorData(data);
          if (data.listings.length === 0 && data.claims.length === 0) {
            setBusinessTab("claim");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load portal data.");
      } finally {
        setIsBusy(false);
      }
    },
    [api, mode, session]
  );

  useEffect(() => {
    if (session) {
      void loadPortal(session);
    }
  }, [loadPortal, session]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const instagramStatus = params.get("instagram");
    const message = params.get("message");
    if (!instagramStatus) return;

    if (mode === "admin") setAdminTab("social");
    if (instagramStatus === "connected") {
      setNotice(`Instagram connected${params.get("username") ? ` as @${params.get("username")}` : ""}.`);
    } else {
      setError(message || "Instagram connection could not be completed.");
    }

    params.delete("instagram");
    params.delete("username");
    params.delete("message");
    const nextQuery = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`);
  }, [mode]);

  async function handleAuthSubmit(event: FormEvent) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (authSubMode === "reset") {
        await api.requestPasswordReset(email);
        setNotice("Password reset instructions have been sent to your email.");
        setAuthSubMode("signin");
        return;
      }

      if (mode === "business" && authSubMode === "signup") {
        const result = await api.signUpBusiness(email, password, contactName, businessName);
        if (result.session) {
          setSession(result.session);
          setPassword("");
          setNotice("Welcome to BawoSocial for Businesses! Search and claim your listing below.");
        } else {
          setNotice(
            "Your BawoSocial business account has been created! Check your email to confirm your address, then sign in below to claim your listing."
          );
          setAuthSubMode("signin");
          setPassword("");
        }
        return;
      }

      const nextSession = await api.signIn(email, password);
      setSession(nextSession);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setIsBusy(false);
    }
  }

  function signOut() {
    api.clearSession();
    setSession(null);
    setAdminData(null);
    setVendorData(null);
    setError(null);
    setNotice(null);
  }

  async function handleModerationAction(action: ModerationAction, targetId: string, notes?: string) {
    if (!session) return;
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      await api.runModerationAction(session, action, targetId, notes);
      setNotice("Action recorded.");
      await loadPortal(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
      setIsBusy(false);
    }
  }

  async function handleCreateSocialDraft(draft: SocialPostDraft) {
    if (!session) return;
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      await api.createSocialDraft(session, draft);
      setNotice(draft.status === "scheduled" ? "Social post scheduled." : "Social draft saved.");
      await loadPortal(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save social post.");
      setIsBusy(false);
    }
  }

  async function handleUpdateSocialStatus(
    postId: string,
    status: "draft" | "scheduled" | "published" | "archived",
    postUrl?: string
  ) {
    if (!session) return;
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      await api.updateSocialPostStatus(session, postId, status, postUrl);
      setNotice(`Social post moved to ${status}.`);
      await loadPortal(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update social post.");
      setIsBusy(false);
    }
  }

  async function handleConnectInstagram() {
    if (!session) return;
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      const authUrl = await api.startInstagramOAuth(session, `${window.location.origin}/admin`);
      window.location.assign(authUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start Instagram connection.");
      setIsBusy(false);
    }
  }

  async function handleDisconnectInstagram(connectionId?: string) {
    if (!session) return;
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      await api.disconnectInstagram(session, connectionId);
      setNotice("Instagram account disconnected.");
      await loadPortal(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not disconnect Instagram.");
      setIsBusy(false);
    }
  }

  async function handleUploadSocialMedia(file: File): Promise<string> {
    if (!session) throw new Error("Sign in before uploading media.");
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      const mediaUrl = await api.uploadSocialMedia(session, file);
      setNotice("Media uploaded to BawoSocial storage.");
      return mediaUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not upload media.";
      setError(message);
      throw err;
    } finally {
      setIsBusy(false);
    }
  }

  async function handlePublishInstagram(
    draft: SocialPostDraft & { postId?: string; mode: "publish_now" | "schedule" }
  ) {
    if (!session) return;
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await api.publishInstagramPost(session, draft);
      setNotice(
        result.status === "published"
          ? "Published to Instagram."
          : "Scheduled in the Instagram publishing queue."
      );
      await loadPortal(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Instagram publish failed.");
      setIsBusy(false);
    }
  }

  async function handleSearchListings(query: string): Promise<DirectoryListing[]> {
    if (!session) return [];
    return api.searchClaimableListings(session, query);
  }

  async function handleSubmitClaim(claim: VendorClaimSubmission) {
    if (!session) return;
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      await api.submitVendorClaim(session, claim);
      setNotice("Claim submitted for BawoSocial review.");
      await loadPortal(session);
      setBusinessTab("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Claim submission failed.");
      setIsBusy(false);
    }
  }

  async function handleSaveListing(patch: BusinessProfilePatch) {
    if (!session) return;
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      await api.updateVendorListing(session, patch);
      setNotice("Listing updated.");
      await loadPortal(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Listing update failed.");
      setIsBusy(false);
    }
  }

  if (!api.isConfigured) {
    return (
      <PortalGate
        icon={<AlertTriangle size={28} />}
        title="Portal backend configuration missing"
        body="Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the deployment environment, then deploy the admin-portal and vendor-portal Supabase Edge Functions."
      />
    );
  }

  if (!session) {
    if (mode === "business") {
      return (
        <div className="portal-business-auth-page">
          <header className="portal-business-auth-header">
            <a className="portal-business-auth-logo" href="/" aria-label="BawoSocial home">
              <img src="/bawo-logo.png" alt="BawoSocial" />
              <div>
                <strong>BawoSocial</strong>
                <span>For Nigerian Businesses</span>
              </div>
            </a>
            <div className="portal-business-auth-header-actions">
              <a className="portal-ghost-button" href="/">
                <ArrowLeft size={16} />
                <span>Back to BawoSocial</span>
              </a>
            </div>
          </header>

          <div className="portal-business-auth-grid">
            <section className="portal-business-showcase" aria-label="BawoSocial for Businesses">
              <div className="portal-business-badge-row">
                <span className="portal-kicker">
                  <Compass size={14} /> Nigerian Community in the Diaspora · NYC
                </span>
              </div>
              <h1>Put your Nigerian business on the map with BawoSocial.</h1>
              <p className="portal-business-lead">
                From Nigerian restaurants, bukas, suya spots, and Afrobeats lounges to African food
                markets, salons, churches, mosques, and professional services across all five
                boroughs of NYC — sign in or create a business account to claim and manage your
                official listing on <strong>BawoSocial</strong>.
              </p>

              <div className="portal-business-highlights">
                {BUSINESS_HIGHLIGHTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="portal-business-highlight-card">
                      <div className="portal-business-highlight-icon">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="portal-business-categories">
                <span className="portal-business-categories-label">
                  <Sparkles size={14} /> Who BawoSocial for Businesses is built for:
                </span>
                <div className="portal-business-category-pills">
                  {BUSINESS_CATEGORIES.map((category) => (
                    <span key={category} className="portal-business-category-pill">
                      <CheckCircle2 size={13} />
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="portal-business-auth-column">
              <form className="portal-auth-card portal-business-auth-card" onSubmit={handleAuthSubmit}>
                <div className="portal-auth-tabs" role="tablist" aria-label="Business account access">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authSubMode === "signin"}
                    className={authSubMode === "signin" ? "portal-auth-tab is-active" : "portal-auth-tab"}
                    onClick={() => {
                      setAuthSubMode("signin");
                      setError(null);
                      setNotice(null);
                    }}
                  >
                    <KeyRound size={15} />
                    <span>Log In / Sign In</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authSubMode === "signup"}
                    className={authSubMode === "signup" ? "portal-auth-tab is-active" : "portal-auth-tab"}
                    onClick={() => {
                      setAuthSubMode("signup");
                      setError(null);
                      setNotice(null);
                    }}
                  >
                    <Store size={15} />
                    <span>Create Business Account</span>
                  </button>
                </div>

                <span className="portal-kicker">
                  {authSubMode === "signin"
                    ? "Verified Business Access"
                    : authSubMode === "signup"
                      ? "New Business Partner"
                      : "Account Recovery"}
                </span>
                <h2>
                  {authSubMode === "signin"
                    ? "Sign in to BawoSocial Businesses"
                    : authSubMode === "signup"
                      ? "Create your BawoSocial Business Account"
                      : "Reset your BawoSocial password"}
                </h2>
                <p>
                  {authSubMode === "signin"
                    ? "Sign in with your BawoSocial account to manage your claimed listings, submit a new business claim, or update your storefront details."
                    : authSubMode === "signup"
                      ? "Create your BawoSocial account in seconds, then search the Explore directory to claim your Nigerian restaurant, lounge, shop, or service."
                      : "Enter the email associated with your BawoSocial account and we will send you a password reset link."}
                </p>

                {error ? <div className="portal-alert is-error">{error}</div> : null}
                {notice ? <div className="portal-alert is-success">{notice}</div> : null}

                {authSubMode === "signup" ? (
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
                ) : null}

                <label>
                  Work or account email
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourbusiness.com"
                    required
                  />
                </label>

                {authSubMode !== "reset" ? (
                  <label>
                    Password
                    <input
                      type="password"
                      autoComplete={authSubMode === "signup" ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={authSubMode === "signup" ? "Create a password (min. 6 characters)" : "Enter your password"}
                      minLength={6}
                      required
                    />
                  </label>
                ) : null}

                <button type="submit" className="portal-primary-button" disabled={isBusy}>
                  <Building2 size={16} />
                  <span>
                    {isBusy
                      ? authSubMode === "signup"
                        ? "Creating account..."
                        : authSubMode === "reset"
                          ? "Sending reset link..."
                          : "Signing in..."
                      : authSubMode === "signup"
                        ? "Create Business Account"
                        : authSubMode === "reset"
                          ? "Send Password Reset Link"
                          : "Sign In to Business Portal"}
                  </span>
                </button>

                <div className="portal-auth-footer-links">
                  {authSubMode === "signin" ? (
                    <>
                      <button
                        type="button"
                        className="portal-text-link"
                        onClick={() => {
                          setAuthSubMode("reset");
                          setError(null);
                          setNotice(null);
                        }}
                      >
                        Forgot your password?
                      </button>
                      <button
                        type="button"
                        className="portal-text-link"
                        onClick={() => {
                          setAuthSubMode("signup");
                          setError(null);
                          setNotice(null);
                        }}
                      >
                        Need an account? Claim your business →
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="portal-text-link"
                      onClick={() => {
                        setAuthSubMode("signin");
                        setError(null);
                        setNotice(null);
                      }}
                    >
                      ← Back to Sign In
                    </button>
                  )}
                </div>

                <small>
                  Already using the BawoSocial mobile app? Sign in with the exact same email and
                  password. Need partner support? Email{" "}
                  <a href="mailto:Hello@joinbawo.com?subject=BawoSocial%20Business%20Portal%20Support">
                    Hello@joinbawo.com
                  </a>
                  .
                </small>
              </form>
            </section>
          </div>
        </div>
      );
    }

    return (
      <div className="portal-auth-shell">
        <a className="portal-auth-brand" href="/">
          <img src="/bawo-logo.png" alt="BawoSocial" />
          <span>BawoSocial</span>
        </a>
        <form className="portal-auth-card" onSubmit={handleAuthSubmit}>
          <span className="portal-kicker">Restricted operations</span>
          <h1>Control Center</h1>
          <p>Use your existing BawoSocial account. Access is verified by the backend after sign-in.</p>
          {error ? <div className="portal-alert is-error">{error}</div> : null}
          {notice ? <div className="portal-alert is-success">{notice}</div> : null}
          <label>
            Email
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="portal-primary-button" disabled={isBusy}>
            <Lock size={16} />
            <span>{isBusy ? "Signing in..." : "Sign in"}</span>
          </button>
          <small>Never share passwords, API keys, or signing certificates with BawoSocial support.</small>
        </form>
      </div>
    );
  }

  if (mode === "admin" && error?.toLowerCase().includes("forbidden")) {
    return (
      <PortalGate
        icon={<ShieldAlert size={28} />}
        title="Admin permission required"
        body="This BawoSocial account is signed in, but it does not have an admin or moderator role."
        actionLabel="Sign out"
        onAction={signOut}
      />
    );
  }

  const activeTitle = mode === "admin" ? ADMIN_TITLES[adminTab] : BUSINESS_TITLES[businessTab];
  const activeSubtitle = mode === "admin" ? ADMIN_SUBTITLES[adminTab] : BUSINESS_SUBTITLES[businessTab];

  return (
    <PortalLayout
      mode={mode}
      session={session}
      title={activeTitle}
      subtitle={activeSubtitle}
      activeTab={mode === "admin" ? adminTab : businessTab}
      onTabChange={(tab) => (mode === "admin" ? setAdminTab(tab as AdminTab) : setBusinessTab(tab as BusinessTab))}
      onRefresh={() => void loadPortal(session)}
      onSignOut={signOut}
      isBusy={isBusy}
      badges={
        mode === "admin" && adminData
          ? {
              events: adminData.metrics.pendingEvents,
              businesses: adminData.metrics.pendingClaims,
              reports: adminData.metrics.openReports,
              waitlist: adminData.metrics.waitlistCount,
              social: adminData.metrics.scheduledSocialPosts,
            }
          : undefined
      }
    >
      {error ? <div className="portal-alert is-error">{error}</div> : null}
      {notice ? <div className="portal-alert is-success">{notice}</div> : null}

      {mode === "admin" ? (
        adminData ? (
          <AdminPortal
            tab={adminTab}
            data={adminData}
            isBusy={isBusy}
            onAction={handleModerationAction}
            onCreateSocialDraft={handleCreateSocialDraft}
            onUpdateSocialStatus={handleUpdateSocialStatus}
            onConnectInstagram={handleConnectInstagram}
            onDisconnectInstagram={handleDisconnectInstagram}
            onUploadSocialMedia={handleUploadSocialMedia}
            onPublishInstagram={handlePublishInstagram}
          />
        ) : (
          <div className="portal-loading">Loading Control Center...</div>
        )
      ) : vendorData ? (
        <BusinessPortal
          tab={businessTab}
          data={vendorData}
          isBusy={isBusy}
          onTabChange={setBusinessTab}
          onSearchListings={handleSearchListings}
          onSubmitClaim={handleSubmitClaim}
          onSaveListing={handleSaveListing}
        />
      ) : (
        <div className="portal-loading">Loading BawoSocial Business Portal...</div>
      )}
    </PortalLayout>
  );
}

function PortalGate({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: JSX.Element;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="portal-auth-shell">
      <div className="portal-auth-card portal-gate">
        {icon}
        <span className="portal-kicker">Setup required</span>
        <h1>{title}</h1>
        <p>{body}</p>
        {actionLabel && onAction ? (
          <button type="button" className="portal-primary-button" onClick={onAction}>
            {actionLabel}
          </button>
        ) : (
          <a className="portal-primary-button" href="/">
            Back to BawoSocial
          </a>
        )}
      </div>
    </div>
  );
}
