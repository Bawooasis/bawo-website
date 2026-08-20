import { Check, ShieldAlert, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { PortalTab } from "./PortalLayout";
import type { AdminAction, AdminOverview, PlatformUser } from "./types";

type AdminPortalProps = {
  data: AdminOverview;
  activeTab: PortalTab;
  busy: boolean;
  onAction: (action: AdminAction, successMessage: string) => Promise<void>;
};

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "—";

const userName = (user: PlatformUser) =>
  user.display_name ||
  [user.first_name, user.last_name].filter(Boolean).join(" ") ||
  user.email ||
  "Unnamed member";

export default function AdminPortal({
  data,
  activeTab,
  busy,
  onAction,
}: AdminPortalProps) {
  const [query, setQuery] = useState("");
  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data.users;
    return data.users.filter((user) =>
      [userName(user), user.email, user.city]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [data.users, query]);

  const confirmAction = async (
    message: string,
    action: AdminAction,
    successMessage: string,
  ) => {
    if (!window.confirm(message)) return;
    await onAction(action, successMessage);
  };

  if (activeTab === "overview") {
    const metrics = [
      ["Members", data.metrics.users],
      ["Active groups", data.metrics.activeGroups],
      ["Pending group requests", data.metrics.pendingGroupRequests],
      ["Pending business claims", data.metrics.pendingBusinessClaims],
      ["Suspended accounts", data.metrics.suspendedUsers],
      ["Pending reports", data.metrics.pendingReports],
    ];
    return (
      <>
        <section className="portal-metrics" aria-label="Platform metrics">
          {metrics.map(([label, value]) => (
            <article className="portal-metric" key={label}>
              <span>{label}</span>
              <strong>{Number(value).toLocaleString()}</strong>
            </article>
          ))}
        </section>
        <section className="portal-panel">
          <div className="portal-panel-heading">
            <div>
              <span className="portal-kicker">Launch queue</span>
              <h2>What needs attention</h2>
            </div>
          </div>
          <div className="portal-queue-grid">
            <div><strong>{data.metrics.pendingGroupRequests}</strong><span>group requests</span></div>
            <div><strong>{data.metrics.pendingBusinessClaims}</strong><span>business claims</span></div>
            <div><strong>{data.metrics.pendingReports}</strong><span>member reports</span></div>
          </div>
        </section>
      </>
    );
  }

  if (activeTab === "users") {
    return (
      <section className="portal-panel">
        <div className="portal-panel-heading">
          <div><span className="portal-kicker">Consumer access</span><h2>Members</h2></div>
          <input
            className="portal-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, city"
          />
        </div>
        <div className="portal-list">
          {filteredUsers.map((user) => {
            const suspended = user.account_status === "suspended" || Boolean(user.suspended_at);
            return (
              <article className="portal-list-row" key={user.id}>
                <div className="portal-list-main">
                  <strong>{userName(user)}</strong>
                  <span>{user.email || "No email"} · {user.city || "City not set"}</span>
                </div>
                <span className={`portal-status ${suspended ? "is-danger" : "is-success"}`}>
                  {suspended ? "Suspended" : "Active"}
                </span>
                <div className="portal-row-actions">
                  {!user.is_admin && user.role !== "admin" && (
                    <button disabled={busy} onClick={() => confirmAction(
                      `Grant operations access to ${userName(user)}? They will be able to manage users, groups, businesses, and view analytics, but cannot grant other administrators.`,
                      {
                        action: "grant_admin",
                        targetId: user.id,
                        adminLevel: "moderator",
                        permissions: ["manage_users", "manage_groups", "manage_businesses", "view_analytics"],
                      },
                      "Operations access granted.",
                    )}>Grant access</button>
                  )}
                  {suspended ? (
                    <button disabled={busy} onClick={() => confirmAction(
                      `Restore ${userName(user)}?`,
                      { action: "restore_user", targetId: user.id },
                      "Member access restored.",
                    )}>Restore</button>
                  ) : (
                    <button className="is-danger" disabled={busy} onClick={async () => {
                      const reason = window.prompt("Reason for suspension (required):")?.trim();
                      if (!reason) return;
                      await confirmAction(
                        `Suspend ${userName(user)} across the platform?`,
                        { action: "suspend_user", targetId: user.id, reason },
                        "Member suspended and signed-out sessions blocked.",
                      );
                    }}>Suspend</button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  if (activeTab === "groups") {
    return (
      <div className="portal-stack">
        <section className="portal-panel">
          <div className="portal-panel-heading"><div><span className="portal-kicker">Community</span><h2>Groups</h2></div></div>
          <div className="portal-list">
            {data.groups.map((group) => (
              <article className="portal-list-row" key={group.id}>
                <div className="portal-list-main">
                  <strong>{group.name}</strong>
                  <span>{group.category || "Uncategorized"} · {group.member_count || 0} members</span>
                </div>
                <span className={`portal-status ${group.is_active ? "is-success" : "is-muted"}`}>
                  {group.is_active ? "Active" : "Inactive"}
                </span>
                <div className="portal-row-actions">
                  <button disabled={busy} onClick={() => onAction({
                    action: "set_group_state",
                    targetId: group.id,
                    groupState: { isFeatured: !group.is_featured },
                  }, group.is_featured ? "Group removed from featured." : "Group featured.")}>
                    <Star aria-hidden /> {group.is_featured ? "Unfeature" : "Feature"}
                  </button>
                  <button disabled={busy} onClick={() => confirmAction(
                    `${group.is_active ? "Deactivate" : "Activate"} ${group.name}?`,
                    { action: "set_group_state", targetId: group.id, groupState: { isActive: !group.is_active } },
                    `Group ${group.is_active ? "deactivated" : "activated"}.`,
                  )}>{group.is_active ? "Deactivate" : "Activate"}</button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="portal-panel">
          <div className="portal-panel-heading"><div><span className="portal-kicker">Member requests</span><h2>Pending groups</h2></div></div>
          <div className="portal-list">
            {data.groupRequests.length === 0 && <p className="portal-empty">No pending group requests.</p>}
            {data.groupRequests.map((request) => (
              <article className="portal-list-row" key={request.id}>
                <div className="portal-list-main"><strong>{request.group_name}</strong><span>{request.description} · {request.votes} votes</span></div>
                <div className="portal-row-actions">
                  <button disabled={busy} onClick={() => confirmAction("Approve this group request?", { action: "review_group_request", targetId: request.id, decision: "approved" }, "Group request approved.")}><Check aria-hidden /> Approve</button>
                  <button className="is-danger" disabled={busy} onClick={() => confirmAction("Reject this group request?", { action: "review_group_request", targetId: request.id, decision: "rejected" }, "Group request rejected.")}><X aria-hidden /> Reject</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (activeTab === "businesses") {
    return (
      <section className="portal-panel">
        <div className="portal-panel-heading"><div><span className="portal-kicker">Directory onboarding</span><h2>Business claims</h2></div></div>
        <div className="portal-list">
          {data.businessClaims.length === 0 && <p className="portal-empty">No pending business claims.</p>}
          {data.businessClaims.map((claim) => (
            <article className="portal-list-row" key={claim.id}>
              <div className="portal-list-main"><strong>{claim.name}</strong><span>{claim.category || "Explore"} · {claim.city || "NYC"} · {claim.contact || "No contact"}</span></div>
              <span className="portal-status is-warning">{claim.status}</span>
              <div className="portal-row-actions">
                <button disabled={busy} onClick={() => confirmAction("Approve and publish this business listing?", { action: "review_business_claim", targetId: claim.id, decision: "approved" }, "Business approved and listing created.")}><Check aria-hidden /> Approve</button>
                <button className="is-danger" disabled={busy} onClick={() => confirmAction("Reject this business claim?", { action: "review_business_claim", targetId: claim.id, decision: "rejected" }, "Business claim rejected.")}><X aria-hidden /> Reject</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  const admins = data.users.filter((user) => user.is_admin || user.role === "admin");
  return (
    <div className="portal-stack">
      <section className="portal-panel">
        <div className="portal-panel-heading"><div><span className="portal-kicker">Privileged accounts</span><h2>Administrators</h2></div></div>
        <div className="portal-list">
          {admins.map((user) => (
            <article className="portal-list-row" key={user.id}>
              <div className="portal-list-main"><strong>{userName(user)}</strong><span>{user.email || "No email"} · {user.admin_level || "admin"}</span></div>
              <span className="portal-status is-success">Admin</span>
              {user.id !== data.currentAdmin.id && <div className="portal-row-actions"><button className="is-danger" disabled={busy} onClick={() => confirmAction(`Revoke administrator access for ${userName(user)}?`, { action: "revoke_admin", targetId: user.id }, "Administrator access revoked.")}>Revoke</button></div>}
            </article>
          ))}
        </div>
      </section>
      <section className="portal-panel">
        <div className="portal-panel-heading"><div><span className="portal-kicker">Immutable record</span><h2>Recent audit activity</h2></div><ShieldAlert aria-hidden /></div>
        <div className="portal-list">
          {data.auditLog.length === 0 && <p className="portal-empty">No control-center actions recorded yet.</p>}
          {data.auditLog.map((entry) => (
            <article className="portal-list-row" key={entry.id}>
              <div className="portal-list-main"><strong>{entry.action.replaceAll("_", " ")}</strong><span>{entry.target_type} · {formatDate(entry.created_at)}{entry.reason ? ` · ${entry.reason}` : ""}</span></div>
              <span className={`portal-status ${entry.outcome === "success" ? "is-success" : "is-danger"}`}>{entry.outcome}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
