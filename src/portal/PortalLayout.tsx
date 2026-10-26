import type { ReactNode } from "react";
import {
  BadgeCheck,
  BarChart3,
  Building2,
  ClipboardCheck,
  FileWarning,
  Flag,
  Layers,
  LogOut,
  Megaphone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import type { AdminTab, BusinessTab, PortalMode, PortalSession } from "./types";

interface NavItem<T extends string> {
  id: T;
  label: string;
  icon: typeof ShieldCheck;
  badge?: number;
}

interface PortalLayoutProps<T extends string> {
  mode: PortalMode;
  session: PortalSession;
  title: string;
  subtitle: string;
  activeTab: T;
  onTabChange: (tab: T) => void;
  onRefresh: () => void;
  onSignOut: () => void;
  isBusy?: boolean;
  badges?: Partial<Record<T, number>>;
  children: ReactNode;
}

const ADMIN_ITEMS: Array<NavItem<AdminTab>> = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "events", label: "Event Approval", icon: ClipboardCheck },
  { id: "businesses", label: "Business Claims", icon: BadgeCheck },
  { id: "reports", label: "Safety Reports", icon: Flag },
  { id: "groups", label: "Community Spaces", icon: Layers },
  { id: "users", label: "Directory & Roles", icon: Users },
  { id: "waitlist", label: "Waitlist Leads", icon: FileWarning },
  { id: "social", label: "Social Media", icon: Megaphone },
];

const BUSINESS_ITEMS: Array<NavItem<BusinessTab>> = [
  { id: "dashboard", label: "Business Overview", icon: Building2 },
  { id: "claim", label: "Claim a Listing", icon: Store },
  { id: "profile", label: "Edit Listing", icon: Sparkles },
];

export default function PortalLayout<T extends string>({
  mode,
  session,
  title,
  subtitle,
  activeTab,
  onTabChange,
  onRefresh,
  onSignOut,
  isBusy,
  badges,
  children,
}: PortalLayoutProps<T>) {
  const navItems = (mode === "admin" ? ADMIN_ITEMS : BUSINESS_ITEMS) as Array<NavItem<T>>;

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <a href="/" className="portal-brand" aria-label="BawoSocial home">
          <img src="/bawo-logo.png" alt="BawoSocial" />
          <div>
            <strong>BawoSocial</strong>
            <span>{mode === "admin" ? "Control Center" : "Business Portal"}</span>
          </div>
        </a>

        <nav aria-label={mode === "admin" ? "admin portal" : "business portal"}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const badge = badges?.[item.id];
            return (
              <button
                key={item.id}
                type="button"
                className={activeTab === item.id ? "portal-nav-item is-active" : "portal-nav-item"}
                onClick={() => onTabChange(item.id)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {typeof badge === "number" && badge > 0 ? <em>{badge}</em> : null}
              </button>
            );
          })}
        </nav>

        <div className="portal-sidebar-footer">
          <a href="/">← Back to BawoSocial</a>
          <p>Zero service keys in browser code. Actions run through authenticated Edge Functions.</p>
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <div className="portal-topbar-copy">
            <span className="portal-kicker">
              {mode === "admin" ? "Platform Administration" : "BawoSocial for Businesses"}
            </span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="portal-topbar-actions">
            <div className="portal-account" title={session.user.email || session.user.id}>
              <ShieldCheck size={16} />
              <span>{session.user.email || "Authenticated user"}</span>
            </div>
            <button type="button" className="portal-ghost-button" onClick={onRefresh} disabled={isBusy}>
              <RefreshCw size={16} className={isBusy ? "is-spinning" : ""} />
              <span>Refresh</span>
            </button>
            <button type="button" className="portal-ghost-button" onClick={onSignOut}>
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        <main className="portal-content">{children}</main>
      </div>
    </div>
  );
}
