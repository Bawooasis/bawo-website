import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Compass,
  KeyRound,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import AdminPortal from "./AdminPortal";
import BusinessPortal from "./BusinessPortal";
import PortalLayout, { type PortalTab } from "./PortalLayout";
import {
  clearAuthRedirectFromUrl,
  getPortalConfig,
  isPortalConfigured,
  OWNER_ADMIN_PHONE_DISPLAY,
  parseAuthRedirectParams,
  PlatformApi,
  resolveAdminIdentifier,
} from "./platformApi";
import type {
  AdminAction,
  AdminOverview,
  PortalMode,
  PortalSession,
  VendorClaimInput,
  VendorOverview,
} from "./types";
import "./portal.css";

type PortalAppProps = { mode: PortalMode };
type AuthSubMode = "signin" | "signup" | "reset" | "set-password";

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
  events:
    "Review community-submitted and organizer-created events before they appear in the NYC Culture Hub feed.",
  groups: "Shape community spaces, review requests, and keep group presentation current.",
  businesses: "Review submitted businesses before they appear in the community directory.",
  social:
    "Plan, publish, and measure TikTok and Instagram content from one accountable pipeline.",
  crm: "Track potential customers from research through outreach, replies, proposals, and verified partnerships.",
  access: "Manage privileged access and review the record of administrative actions.",
  dashboard: "See your BawoSocial presence and the systems being prepared for growth.",
  listings: "Review owned listings and submit new businesses for administrator approval.",
  growth: "Follow the path from verified presence to measurable customer outcomes.",
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

export default function PortalApp({ mode }: PortalAppProps) {
  const config = useMemo(() => getPortalConfig(), []);
  const api = useMemo(() => new PlatformApi(config), [config]);
  const redirectPath = mode === "admin" ? "/admin" : "/businesses";

  const [session, setSession] = useState<PortalSession | null>(() =>
    api.getSession(),
  );
  const [activeTab, setActiveTab] = useState<PortalTab>(
    mode === "admin" ? "overview" : "dashboard",
  );
  const [adminData, setAdminData] = useState<AdminOverview | null>(null);
  const [vendorData, setVendorData] = useState<VendorOverview | null>(null);
  const [authSubMode, setAuthSubMode] = useState<AuthSubMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [phoneMatchNote, setPhoneMatchNote] = useState("");
  const [authBootstrapping, setAuthBootstrapping] = useState(true);

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

  // Handle Supabase recovery / OAuth redirects (#access_token=...&type=recovery)
  useEffect(() => {
    let cancelled = false;

    const bootstrapAuthRedirect = async () => {
      const params = parseAuthRedirectParams();
      const hasRedirectAuth =
        Boolean(params.accessToken && params.refreshToken) ||
        Boolean(params.tokenHash);

      if (!hasRedirectAuth) {
        if (!cancelled) setAuthBootstrapping(false);
        return;
      }

      setBusy(true);
      setError("");
      try {
        let nextSession: PortalSession | null = null;

        if (params.accessToken && params.refreshToken) {
          nextSession = api.saveHashSession(
            params.accessToken,
            params.refreshToken,
            params.expiresIn,
          );
        } else if (params.tokenHash) {
          nextSession = await api.verifyTokenHash(
            params.tokenHash,
            params.type || "recovery",
          );
        }

        clearAuthRedirectFromUrl();

        if (cancelled || !nextSession) return;

        setSession(nextSession);
        if (params.type === "recovery") {
          setAuthSubMode("set-password");
          setNotice(
            mode === "admin"
              ? "Recovery link verified. Set a new Control Center password to finish."
              : "Recovery link verified. Set a new password to finish.",
          );
        } else {
          setNotice(
            mode === "admin"
              ? "Signed in with your linked account."
              : "Signed in successfully.",
          );
        }
      } catch (bootstrapError) {
        if (!cancelled) {
          setError(
            bootstrapError instanceof Error
              ? bootstrapError.message
              : "Unable to complete sign-in from the recovery link.",
          );
          clearAuthRedirectFromUrl();
        }
      } finally {
        if (!cancelled) {
          setBusy(false);
          setAuthBootstrapping(false);
        }
      }
    };

    void bootstrapAuthRedirect();
    return () => {
      cancelled = true;
    };
  }, [api, mode]);

  const load = useCallback(async () => {
    if (!session || authSubMode === "set-password") return;
    setBusy(true);
    setError("");
    try {
      if (mode === "admin") {
        setAdminData(
          await api.invoke<AdminOverview>("platform-control-center", {
            action: "overview",
          }),
        );
      } else {
        setVendorData(
          await api.invoke<VendorOverview>("vendor-portal", {
            action: "overview",
          }),
        );
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load portal.",
      );
    } finally {
      setBusy(false);
    }
  }, [api, mode, session, authSubMode]);

  useEffect(() => {
    void load();
  }, [load]);

  const resolveIdentifier = (raw: string) => {
    if (mode !== "admin") {
      return {
        email: raw.trim().toLowerCase(),
        matchedPhone: false,
      };
    }
    return resolveAdminIdentifier(raw);
  };

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    setPhoneMatchNote("");

    try {
      if (authSubMode === "reset") {
        const resolved = resolveIdentifier(email);
        if (resolved.matchedPhone) {
          setPhoneMatchNote(
            `Matched owner phone ${OWNER_ADMIN_PHONE_DISPLAY} → sending recovery to your linked admin email`,
          );
        }
        await api.requestPasswordReset(resolved.email, redirectPath);
        setNotice(
          mode === "admin"
            ? `Recovery email sent to your Control Center inbox. Check your email for a reset link, or enter the 6-digit code below.`
            : "Password reset instructions have been sent to your email.",
        );
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
          setNotice(
            "Welcome to BawoSocial for Businesses! Submit or claim your listing below.",
          );
        } else {
          setNotice(
            "Your BawoSocial business account has been created! Check your email to confirm your address, then sign in below to claim your listing.",
          );
          setAuthSubMode("signin");
          setPassword("");
        }
        return;
      }

      const resolved = resolveIdentifier(email);
      if (resolved.matchedPhone) {
        setPhoneMatchNote(
          `Matched owner phone ${OWNER_ADMIN_PHONE_DISPLAY} → signing in with your linked admin email`,
        );
      }
      setSession(await api.signIn(resolved.email, password));
      setPassword("");
    } catch (signInError) {
      setError(
        signInError instanceof Error ? signInError.message : "Sign in failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const verifyRecoveryCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const resolved = resolveIdentifier(email);
      if (resolved.matchedPhone) {
        setPhoneMatchNote(
          `Matched owner phone ${OWNER_ADMIN_PHONE_DISPLAY} → verifying code for your linked admin email`,
        );
      }
      let nextSession: PortalSession;
      try {
        nextSession = await api.verifyEmailCode(
          resolved.email,
          recoveryCode,
          "recovery",
        );
      } catch {
        nextSession = await api.verifyEmailCode(
          resolved.email,
          recoveryCode,
          "email",
        );
      }
      setSession(nextSession);
      setAuthSubMode("set-password");
      setRecoveryCode("");
      setNotice(
        mode === "admin"
          ? "Recovery code verified. Set your new Control Center password."
          : "Recovery code verified. Set your new password.",
      );
    } catch (verifyError) {
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "Invalid or expired recovery code.",
      );
    } finally {
      setBusy(false);
    }
  };

  const submitNewPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      await api.updatePassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setAuthSubMode("signin");
      setNotice(
        mode === "admin"
          ? `Control Center password updated! You can now sign in anytime with your email or phone number ${OWNER_ADMIN_PHONE_DISPLAY} and this password.`
          : "Password updated! You can use it to sign in anytime.",
      );
      // Load dashboard directly (load() still sees set-password in its closure)
      if (mode === "admin") {
        setAdminData(
          await api.invoke<AdminOverview>("platform-control-center", {
            action: "overview",
          }),
        );
      } else {
        setVendorData(
          await api.invoke<VendorOverview>("vendor-portal", {
            action: "overview",
          }),
        );
      }
    } catch (passwordError) {
      setError(
        passwordError instanceof Error
          ? passwordError.message
          : "Unable to update password.",
      );
    } finally {
      setBusy(false);
    }
  };

  const startOAuth = (provider: "google" | "apple") => {
    window.location.assign(api.getOAuthUrl(provider, redirectPath));
  };

  const openChangePassword = () => {
    setAuthSubMode("set-password");
    setError("");
    setNotice(
      mode === "admin"
        ? "Choose a new Control Center password (minimum 6 characters)."
        : "Choose a new password (minimum 6 characters).",
    );
    setNewPassword("");
    setConfirmPassword("");
  };

  const signOut = () => {
    api.signOut();
    setSession(null);
    setAdminData(null);
    setVendorData(null);
    setNotice("");
    setAuthSubMode("signin");
    setPhoneMatchNote("");
  };

  const runAdminAction = async (
    action: AdminAction,
    successMessage: string,
  ) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.invoke("platform-control-center", action);
      setNotice(successMessage);
      if (mode === "admin") {
        setAdminData(
          await api.invoke<AdminOverview>("platform-control-center", {
            action: "overview",
          }),
        );
      }
      return true;
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Action failed.",
      );
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
      const result = await api.invoke<{ authorizationUrl: string }>(
        "platform-control-center",
        {
          action: "start_instagram_connection",
          targetId: "instagram",
          returnUrl: `${window.location.origin}/admin`,
        },
      );
      window.location.assign(result.authorizationUrl);
    } catch (connectionError) {
      setError(
        connectionError instanceof Error
          ? connectionError.message
          : "Unable to connect Instagram.",
      );
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
      setAdminData(
        await api.invoke<AdminOverview>("platform-control-center", {
          action: "overview",
        }),
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload media.",
      );
      throw uploadError;
    } finally {
      setBusy(false);
    }
  };

  const queueSocialPublish = async (contentId: string, scheduledFor: string) =>
    runAdminAction(
      {
        action: "queue_social_publish",
        targetId: contentId,
        socialPublish: { scheduledFor },
      },
      new Date(scheduledFor).getTime() <= Date.now() + 60_000
        ? "Instagram post queued now."
        : "Instagram post scheduled.",
    );

  const scheduleTikTok = async (contentId: string, scheduledFor: string) =>
    runAdminAction(
      {
        action: "schedule_tiktok_reminder",
        targetId: contentId,
        socialPublish: { scheduledFor },
      },
      "TikTok manual post added to the schedule.",
    );

  const submitClaim = async (input: VendorClaimInput) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.invoke("vendor-portal", { action: "submit_claim", ...input });
      setNotice("Claim submitted for BawoSocial review.");
      setVendorData(
        await api.invoke<VendorOverview>("vendor-portal", {
          action: "overview",
        }),
      );
    } catch (claimError) {
      setError(
        claimError instanceof Error
          ? claimError.message
          : "Unable to submit claim.",
      );
      throw claimError;
    } finally {
      setBusy(false);
    }
  };

  if (!isPortalConfigured(config)) {
    return (
      <PortalGate
        icon={<LockKeyhole />}
        title="Portal configuration pending"
        body="Add the public Supabase URL and publishable key to the Vercel environment before this portal can authenticate. No service-role key belongs in this website."
      />
    );
  }

  if (authBootstrapping) {
    return (
      <div className="portal-auth-shell">
        <div className="portal-auth-card">
          <span className="portal-kicker">Secure access</span>
          <h1>{mode === "admin" ? "Control Center" : "Business Portal"}</h1>
          <p>Finishing sign-in…</p>
        </div>
      </div>
    );
  }

  // Set / change password view (after recovery link, OTP, or Change Password)
  if (session && authSubMode === "set-password") {
    return (
      <div className="portal-auth-shell">
        <a className="portal-auth-brand" href="/">
          <img src="/bawo-logo.png" alt="" />
          <span>BawoSocial</span>
        </a>
        <form className="portal-auth-card" onSubmit={submitNewPassword}>
          <span className="portal-kicker">
            {mode === "admin" ? "Control Center security" : "Account security"}
          </span>
          <h1>
            {mode === "admin"
              ? "Set New Control Center Password"
              : "Set New Password"}
          </h1>
          <p>
            Choose a password of at least 6 characters. You will stay signed in
            after saving.
          </p>
          {error ? <div className="portal-alert is-error">{error}</div> : null}
          {notice ? <div className="portal-alert is-success">{notice}</div> : null}
          <label>
            New password
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Minimum 6 characters"
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter password"
            />
          </label>
          <button className="portal-primary-button" disabled={busy} type="submit">
            <KeyRound size={16} />
            <span>{busy ? "Saving…" : "Save new password"}</span>
          </button>
          <button
            type="button"
            className="portal-text-link"
            onClick={() => {
              setAuthSubMode("signin");
              setNotice("");
              setError("");
              // load() still closes over set-password; trigger via session keep + tab
              setActiveTab(mode === "admin" ? "overview" : "dashboard");
            }}
          >
            Skip for now — continue to{" "}
            {mode === "admin" ? "Control Center" : "Business Portal"}
          </button>
        </form>
      </div>
    );
  }

  if (!session) {
    if (mode === "business") {
      return (
        <div className="portal-business-auth-page">
          <header className="portal-business-auth-header">
            <a
              className="portal-business-auth-logo"
              href="/"
              aria-label="BawoSocial home"
            >
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
            <section
              className="portal-business-showcase"
              aria-label="BawoSocial for Businesses"
            >
              <div className="portal-business-badge-row">
                <span className="portal-kicker">
                  <Compass size={14} /> Nigerian Community in the Diaspora · NYC
                </span>
              </div>
              <h1>Put your Nigerian business on the map with BawoSocial.</h1>
              <p className="portal-business-lead">
                From Nigerian restaurants, bukas, suya spots, and Afrobeats
                lounges to African food markets, salons, churches, mosques, and
                professional services across all five boroughs of NYC — sign in
                or create a business account to claim and manage your official
                listing on <strong>BawoSocial</strong>.
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
                  <Sparkles size={14} /> Who BawoSocial for Businesses is built
                  for:
                </span>
                <div className="portal-business-category-pills">
                  {BUSINESS_CATEGORIES.map((category) => (
                    <span
                      key={category}
                      className="portal-business-category-pill"
                    >
                      <CheckCircle2 size={13} />
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="portal-business-auth-column">
              <form
                className="portal-auth-card portal-business-auth-card"
                onSubmit={signIn}
              >
                <div
                  className="portal-auth-tabs"
                  role="tablist"
                  aria-label="Business account access"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authSubMode === "signin"}
                    className={
                      authSubMode === "signin"
                        ? "portal-auth-tab is-active"
                        : "portal-auth-tab"
                    }
                    onClick={() => {
                      setAuthSubMode("signin");
                      setError("");
                      setNotice("");
                    }}
                  >
                    <KeyRound size={15} />
                    <span>Log In / Sign In</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authSubMode === "signup"}
                    className={
                      authSubMode === "signup"
                        ? "portal-auth-tab is-active"
                        : "portal-auth-tab"
                    }
                    onClick={() => {
                      setAuthSubMode("signup");
                      setError("");
                      setNotice("");
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
                {notice ? (
                  <div className="portal-alert is-success">{notice}</div>
                ) : null}

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
                      autoComplete={
                        authSubMode === "signup"
                          ? "new-password"
                          : "current-password"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        authSubMode === "signup"
                          ? "Create a password (min. 6 characters)"
                          : "Enter your password"
                      }
                      minLength={6}
                      required
                    />
                  </label>
                ) : null}

                <button
                  type="submit"
                  className="portal-primary-button"
                  disabled={busy}
                >
                  <Building2 size={16} />
                  <span>
                    {busy
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

                {authSubMode === "signin" || authSubMode === "reset" ? (
                  <>
                    <div className="portal-auth-divider">
                      <span>or continue with</span>
                    </div>
                    <div className="portal-oauth-row">
                      <button
                        type="button"
                        className="portal-oauth-button"
                        onClick={() => startOAuth("google")}
                      >
                        Continue with Google
                      </button>
                      <button
                        type="button"
                        className="portal-oauth-button"
                        onClick={() => startOAuth("apple")}
                      >
                        Continue with Apple
                      </button>
                    </div>
                  </>
                ) : null}

                <div className="portal-auth-footer-links">
                  {authSubMode === "signin" ? (
                    <>
                      <button
                        type="button"
                        className="portal-text-link"
                        onClick={() => {
                          setAuthSubMode("reset");
                          setError("");
                          setNotice("");
                        }}
                      >
                        Forgot your password?
                      </button>
                      <button
                        type="button"
                        className="portal-text-link"
                        onClick={() => {
                          setAuthSubMode("signup");
                          setError("");
                          setNotice("");
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
                        setError("");
                        setNotice("");
                      }}
                    >
                      ← Back to Sign In
                    </button>
                  )}
                </div>

                <small>
                  Already using the BawoSocial mobile app? Sign in with the exact
                  same email and password. Need partner support? Email{" "}
                  <a href="mailto:Hello@joinbawo.com?subject=BawoSocial%20Business%20Portal%20Support">
                    Hello@joinbawo.com
                  </a>
                  .
                </small>
              </form>

              {authSubMode === "reset" ? (
                <form
                  className="portal-auth-card portal-business-auth-card portal-recovery-code-block"
                  onSubmit={verifyRecoveryCode}
                >
                  <label>
                    6-digit recovery code
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={8}
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                      placeholder="123456"
                    />
                  </label>
                  <button
                    type="submit"
                    className="portal-ghost-button portal-recovery-verify"
                    disabled={busy || recoveryCode.trim().length < 6}
                  >
                    Verify code & set password
                  </button>
                </form>
              ) : null}
            </section>
          </div>
        </div>
      );
    }

    // Control Center (/admin) auth
    return (
      <div className="portal-auth-shell">
        <a className="portal-auth-brand" href="/">
          <img src="/bawo-logo.png" alt="" />
          <span>BawoSocial</span>
        </a>
        <div className="portal-auth-card portal-admin-auth-card">
          <div
            className="portal-auth-tabs"
            role="tablist"
            aria-label="Control Center access"
          >
            <button
              type="button"
              role="tab"
              aria-selected={authSubMode === "signin"}
              className={
                authSubMode === "signin"
                  ? "portal-auth-tab is-active"
                  : "portal-auth-tab"
              }
              onClick={() => {
                setAuthSubMode("signin");
                setError("");
                setNotice("");
                setPhoneMatchNote("");
              }}
            >
              <KeyRound size={15} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={authSubMode === "reset"}
              className={
                authSubMode === "reset"
                  ? "portal-auth-tab is-active"
                  : "portal-auth-tab"
              }
              onClick={() => {
                setAuthSubMode("reset");
                setError("");
                setNotice("");
                setPhoneMatchNote("");
              }}
            >
              <ShieldCheck size={15} />
              <span>Reset Access</span>
            </button>
          </div>

          <span className="portal-kicker">Restricted operations</span>
          <h1>Control Center</h1>
          <p>
            {authSubMode === "reset"
              ? `Enter your admin email or phone ${OWNER_ADMIN_PHONE_DISPLAY}. We send a free Supabase recovery email — no SMS fees.`
              : `Sign in with your admin email or phone ${OWNER_ADMIN_PHONE_DISPLAY}, or continue with Google / Apple.`}
          </p>

          {error ? <div className="portal-alert is-error">{error}</div> : null}
          {notice ? <div className="portal-alert is-success">{notice}</div> : null}
          {phoneMatchNote ? (
            <div className="portal-alert is-info">{phoneMatchNote}</div>
          ) : null}

          <form onSubmit={signIn} className="portal-admin-auth-form">
            <label>
              Admin email or phone
              <input
                type="text"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={`you@email.com or ${OWNER_ADMIN_PHONE_DISPLAY}`}
              />
            </label>

            {authSubMode === "signin" ? (
              <label>
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
              </label>
            ) : null}

            <button
              className="portal-primary-button"
              disabled={busy}
              type="submit"
            >
              <LockKeyhole size={16} />
              <span>
                {busy
                  ? authSubMode === "reset"
                    ? "Sending recovery…"
                    : "Signing in…"
                  : authSubMode === "reset"
                    ? "Send recovery email"
                    : "Sign in securely"}
              </span>
            </button>
          </form>

          {authSubMode === "signin" ? (
            <button
              type="button"
              className="portal-text-link portal-forgot-link"
              onClick={() => {
                setAuthSubMode("reset");
                setError("");
                setNotice("");
                setPhoneMatchNote("");
              }}
            >
              Forgot password or need to reset Control Center access?
            </button>
          ) : null}

          {authSubMode === "reset" ? (
            <form
              className="portal-recovery-code-block"
              onSubmit={verifyRecoveryCode}
            >
              <p className="portal-recovery-hint">
                Already have a 6-digit code from your email? Enter it here (free
                Supabase OTP — no Twilio).
              </p>
              <label>
                6-digit recovery code
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6,8}"
                  maxLength={8}
                  value={recoveryCode}
                  onChange={(event) => setRecoveryCode(event.target.value)}
                  placeholder="123456"
                />
              </label>
              <button
                type="submit"
                className="portal-ghost-button portal-recovery-verify"
                disabled={busy || recoveryCode.trim().length < 6}
              >
                Verify code & set new password
              </button>
            </form>
          ) : null}

          <div className="portal-auth-divider">
            <span>or</span>
          </div>
          <div className="portal-oauth-row">
            <button
              type="button"
              className="portal-oauth-button"
              onClick={() => startOAuth("google")}
            >
              Continue with Google
            </button>
            <button
              type="button"
              className="portal-oauth-button"
              onClick={() => startOAuth("apple")}
            >
              Continue with Apple
            </button>
          </div>

          <small>
            Never share passwords, API keys, or signing certificates with
            BawoSocial support. Recovery uses free Supabase Auth email only.
          </small>
        </div>
      </div>
    );
  }

  const dataReady = mode === "admin" ? Boolean(adminData) : Boolean(vendorData);
  return (
    <PortalLayout
      mode={mode}
      activeTab={activeTab}
      email={session.user?.email || email || "Signed in"}
      title={titles[activeTab]}
      description={descriptions[activeTab]}
      notice={notice}
      error={error}
      onTabChange={setActiveTab}
      onRefresh={() => void load()}
      onSignOut={signOut}
      onChangePassword={openChangePassword}
    >
      {busy && !dataReady && (
        <div className="portal-loading">Loading secure workspace…</div>
      )}
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
      {mode === "business" && vendorData && (
        <BusinessPortal
          data={vendorData}
          activeTab={activeTab}
          busy={busy}
          onSubmit={submitClaim}
        />
      )}
    </PortalLayout>
  );
}

function PortalGate({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="portal-auth-shell">
      <div className="portal-auth-card portal-gate">
        {icon}
        <span className="portal-kicker">Setup required</span>
        <h1>{title}</h1>
        <p>{body}</p>
        <a className="portal-primary-button" href="/">
          Return to JoinBawo.com
        </a>
      </div>
    </div>
  );
}
