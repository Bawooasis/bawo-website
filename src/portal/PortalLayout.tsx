import {
  Building2,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import type { PortalMode } from "./types";

export type PortalTab =
  | "overview"
  | "users"
  | "groups"
  | "businesses"
  | "access"
  | "dashboard"
  | "listings"
  | "growth";

type PortalLayoutProps = {
  mode: PortalMode;
  activeTab: PortalTab;
  email: string;
  title: string;
  notice: string;
  error: string;
  children: ReactNode;
  onTabChange: (tab: PortalTab) => void;
  onRefresh: () => void;
  onSignOut: () => void;
};

const icons = {
  overview: LayoutDashboard,
  users: UserRound,
  groups: UsersRound,
  businesses: Building2,
  access: ShieldCheck,
  dashboard: LayoutDashboard,
  listings: Building2,
  growth: TrendingUp,
};

export default function PortalLayout({
  mode,
  activeTab,
  email,
  title,
  notice,
  error,
  children,
  onTabChange,
  onRefresh,
  onSignOut,
}: PortalLayoutProps) {
  const tabs: Array<{ id: PortalTab; label: string }> =
    mode === "admin"
      ? [
          { id: "overview", label: "Overview" },
          { id: "users", label: "Consumers" },
          { id: "groups", label: "Groups" },
          { id: "businesses", label: "Businesses" },
          { id: "access", label: "Access & Audit" },
        ]
      : [
          { id: "dashboard", label: "Dashboard" },
          { id: "listings", label: "Listings & Claims" },
          { id: "growth", label: "Growth" },
        ];

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <a href="/" className="portal-brand" aria-label="BawoSocial home">
          <img src="/bawo-logo.png" alt="" />
          <span>
            <strong>BawoSocial</strong>
            <small>{mode === "admin" ? "Control Center" : "Business"}</small>
          </span>
        </a>
        <nav aria-label={`${mode} portal`}>
          {tabs.map(({ id, label }) => {
            const Icon = icons[id];
            return (
              <button
                key={id}
                type="button"
                className={`portal-nav-item ${activeTab === id ? "is-active" : ""}`}
                onClick={() => onTabChange(id)}
              >
                <Icon aria-hidden />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
        <div className="portal-sidebar-footer">
          <a href="/">View JoinBawo.com</a>
          <button type="button" className="portal-nav-item" onClick={onSignOut}>
            <LogOut aria-hidden />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="portal-workspace">
        <header className="portal-topbar">
          <div>
            <span className="portal-eyebrow">
              {mode === "admin" ? "NYC launch operations" : "Business workspace"}
            </span>
            <h1>{title}</h1>
          </div>
          <div className="portal-topbar-actions">
            <span>{email}</span>
            <button type="button" onClick={onRefresh} aria-label="Refresh portal">
              <RefreshCw aria-hidden />
            </button>
          </div>
        </header>
        {error && <div className="portal-alert is-error">{error}</div>}
        {notice && <div className="portal-alert is-success">{notice}</div>}
        <div className="portal-page">{children}</div>
      </main>
    </div>
  );
}
