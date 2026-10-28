import {
  Ban,
  CheckCheck,
  Flag,
  MessageSquareWarning,
  ShieldAlert,
  ShieldCheck,
  TimerReset,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PlatformApi } from "./platformApi";
import { EmptyState } from "./PortalUi";
import type {
  GroupChatAlertFilter,
  GroupChatModerationAction,
  GroupChatModerationItem,
  ListingIssueModerationAction,
  ListingIssueReportItem,
  ModerationQueues,
} from "./types";

type ModerationSafetyPanelProps = {
  api: PlatformApi;
  busy?: boolean;
  compact?: boolean;
  onNotice?: (message: string) => void;
  onError?: (message: string) => void;
};

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(value))
    : "n/a";

const pretty = (value: string) =>
  value.split("_").join(" ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const GROUP_FILTERS: Array<{ id: GroupChatAlertFilter; label: string }> = [
  { id: "pending_review", label: "Pending Review" },
  { id: "safety_alert", label: "Safety / Alert Triggered" },
  { id: "resolved", label: "Resolved" },
  { id: "all", label: "All" },
];

export default function ModerationSafetyPanel({
  api,
  busy = false,
  compact = false,
  onNotice,
  onError,
}: ModerationSafetyPanelProps) {
  const [queues, setQueues] = useState<ModerationQueues | null>(null);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [groupFilter, setGroupFilter] =
    useState<GroupChatAlertFilter>("pending_review");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const next = await api.fetchModerationQueues();
        if (!cancelled) setQueues(next);
      } catch (error) {
        if (!cancelled) {
          onError?.(
            error instanceof Error
              ? error.message
              : "Unable to load BawoSocial moderation queues.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [api, onError]);

  const groupItems = useMemo(() => {
    const items = queues?.groupChatAlerts || [];
    if (groupFilter === "all") return items;
    return items.filter((item) => item.status === groupFilter);
  }, [queues, groupFilter]);

  const listingItems = useMemo(() => {
    const items = queues?.listingIssues || [];
    return compact
      ? items.filter((item) => item.status === "pending").slice(0, 6)
      : items;
  }, [queues, compact]);

  const visibleGroupItems = compact ? groupItems.slice(0, 6) : groupItems;

  const runGroupAction = async (
    item: GroupChatModerationItem,
    action: GroupChatModerationAction,
  ) => {
    const labels: Record<GroupChatModerationAction, string> = {
      dismiss_report: "Dismiss this report?",
      delete_message: "Delete the reported group message?",
      mute_user_24h: `Mute ${item.reported_user_name} from this group for 24 hours?`,
      ban_from_group: `Ban ${item.reported_user_name} from ${item.group_name}?`,
    };
    if (!window.confirm(labels[action])) return;
    setActingId(item.id);
    try {
      const next = await api.applyGroupChatModeration(item.id, action);
      setQueues(next);
      onNotice?.(`BawoSocial moderation action recorded: ${pretty(action)}.`);
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error.message
          : "Unable to apply moderation action.",
      );
    } finally {
      setActingId(null);
    }
  };

  const runListingAction = async (
    item: ListingIssueReportItem,
    action: ListingIssueModerationAction,
  ) => {
    const labels: Record<ListingIssueModerationAction, string> = {
      verified_updated: `Mark ${item.listing_name} as Verified & Updated?`,
      dismissed: `Dismiss the listing issue for ${item.listing_name}?`,
      approve_claim_dispute: `Approve the claim dispute for ${item.listing_name}?`,
    };
    if (!window.confirm(labels[action])) return;
    setActingId(item.id);
    try {
      const next = await api.applyListingIssueModeration(item.id, action);
      setQueues(next);
      onNotice?.(`Listing issue updated: ${pretty(action)}.`);
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error.message
          : "Unable to update listing issue.",
      );
    } finally {
      setActingId(null);
    }
  };

  const pendingGroup = (queues?.groupChatAlerts || []).filter(
    (item) => item.status !== "resolved",
  ).length;
  const pendingListing = (queues?.listingIssues || []).filter(
    (item) => item.status === "pending",
  ).length;

  return (
    <div className="portal-stack moderation-ops">
      <section className="portal-panel moderation-panel">
        <div className="portal-panel-heading">
          <div>
            <span className="portal-kicker">
              <ShieldCheck size={14} aria-hidden /> Build 183 · Safety sync
            </span>
            <h2>Group Chat Alerts &amp; Moderation Queue</h2>
            <p className="moderation-lead">
              Monitor reported group messages, keyword/safety alerts, and flagged
              spam for BawoSocial communities. One-click actions stay available
              even when moderation tables are empty or RLS-restricted in preview.
            </p>
          </div>
          <div className="moderation-count-pills">
            <span>{pendingGroup} open chat alerts</span>
            <span>{pendingListing} listing issues</span>
          </div>
        </div>

        {queues?.usedSeedFallback ? (
          <div className="portal-alert is-info">
            Live moderation tables are empty or unavailable — showing a clean
            seeded BawoSocial queue aligned with mobile Build 183 so operators can
            rehearse the workflow.
          </div>
        ) : null}

        <div className="moderation-filters" role="tablist" aria-label="Group chat alert filters">
          {GROUP_FILTERS.map((filter) => {
            const count =
              filter.id === "all"
                ? queues?.groupChatAlerts.length || 0
                : (queues?.groupChatAlerts || []).filter(
                    (item) => item.status === filter.id,
                  ).length;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={groupFilter === filter.id}
                className={
                  groupFilter === filter.id
                    ? "moderation-filter is-active"
                    : "moderation-filter"
                }
                onClick={() => setGroupFilter(filter.id)}
              >
                {filter.label}
                <em>{count}</em>
              </button>
            );
          })}
        </div>

        <div className="portal-list">
          {loading ? (
            <div className="portal-loading">Loading BawoSocial moderation queue…</div>
          ) : visibleGroupItems.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No group chat alerts in this filter"
              body="New spam, harassment, scam, and keyword safety flags will appear here."
            />
          ) : (
            visibleGroupItems.map((item) => (
              <article className="portal-list-row moderation-row" key={item.id}>
                <div className="portal-list-main">
                  <strong>
                    {item.group_name}
                    <span
                      className={`portal-status is-${item.status === "resolved" ? "success" : item.status === "safety_alert" ? "danger" : "warning"}`}
                    >
                      {pretty(item.status)}
                    </span>
                    <span className="portal-status is-muted">
                      {pretty(item.alert_type)}
                    </span>
                  </strong>
                  <span>
                    “{item.message_preview}” · reported by {item.reporter_name} ·{" "}
                    {item.reported_user_name}
                    {item.keyword_hit ? ` · keyword: ${item.keyword_hit}` : ""} ·{" "}
                    {formatDate(item.created_at)}
                  </span>
                  {item.resolution ? (
                    <span className="moderation-resolution">
                      Resolved: {pretty(item.resolution)}
                      {item.resolved_at ? ` · ${formatDate(item.resolved_at)}` : ""}
                    </span>
                  ) : null}
                </div>
                {item.status !== "resolved" ? (
                  <div className="portal-row-actions">
                    <button
                      type="button"
                      disabled={busy || actingId === item.id}
                      onClick={() => void runGroupAction(item, "dismiss_report")}
                    >
                      <Flag size={14} aria-hidden /> Dismiss Report
                    </button>
                    <button
                      type="button"
                      disabled={busy || actingId === item.id}
                      onClick={() => void runGroupAction(item, "delete_message")}
                    >
                      <Trash2 size={14} aria-hidden /> Delete Message
                    </button>
                    <button
                      type="button"
                      disabled={busy || actingId === item.id}
                      onClick={() => void runGroupAction(item, "mute_user_24h")}
                    >
                      <TimerReset size={14} aria-hidden /> Mute User (24h)
                    </button>
                    <button
                      type="button"
                      className="is-danger"
                      disabled={busy || actingId === item.id}
                      onClick={() => void runGroupAction(item, "ban_from_group")}
                    >
                      <Ban size={14} aria-hidden /> Ban from Group
                    </button>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>

      <section className="portal-panel moderation-panel">
        <div className="portal-panel-heading">
          <div>
            <span className="portal-kicker">
              <MessageSquareWarning size={14} aria-hidden /> Explore directory
            </span>
            <h2>Listing Issue &amp; Claim Dispute Queue</h2>
            <p className="moderation-lead">
              Track wrong hours, closed venues, bad pins/links, and ownership
              disputes across the 6 NYC founding BawoSocial storefronts and live
              Explore listings.
            </p>
          </div>
        </div>
        <div className="portal-list">
          {loading ? (
            <div className="portal-loading">Loading listing issue reports…</div>
          ) : listingItems.length === 0 ? (
            <EmptyState
              icon={ShieldAlert}
              title="No listing issues waiting"
              body="Member reports and claim disputes for Explore listings will appear here."
            />
          ) : (
            listingItems.map((item) => (
              <article className="portal-list-row moderation-row" key={item.id}>
                <div className="portal-list-main">
                  <strong>
                    {item.listing_name}
                    <span
                      className={`portal-status is-${item.status === "resolved" ? "success" : "warning"}`}
                    >
                      {pretty(item.status)}
                    </span>
                    <span className="portal-status is-muted">
                      {pretty(item.issue_type)}
                    </span>
                  </strong>
                  <span>
                    {item.listing_handle ? `${item.listing_handle} · ` : ""}
                    {item.listing_address || "NYC"} · {item.reporter_name} ·{" "}
                    {formatDate(item.created_at)}
                  </span>
                  <span>{item.details}</span>
                  {item.resolution ? (
                    <span className="moderation-resolution">
                      Resolution: {pretty(item.resolution)}
                    </span>
                  ) : null}
                </div>
                {item.status !== "resolved" ? (
                  <div className="portal-row-actions">
                    <button
                      type="button"
                      disabled={busy || actingId === item.id}
                      onClick={() =>
                        void runListingAction(item, "verified_updated")
                      }
                    >
                      <CheckCheck size={14} aria-hidden /> Verified &amp; Updated
                    </button>
                    <button
                      type="button"
                      disabled={busy || actingId === item.id}
                      onClick={() => void runListingAction(item, "dismissed")}
                    >
                      <Flag size={14} aria-hidden /> Dismissed
                    </button>
                    {item.issue_type === "claim_dispute" ? (
                      <button
                        type="button"
                        disabled={busy || actingId === item.id}
                        onClick={() =>
                          void runListingAction(item, "approve_claim_dispute")
                        }
                      >
                        <ShieldCheck size={14} aria-hidden /> Approve Claim Dispute
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
