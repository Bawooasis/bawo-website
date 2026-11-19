import { Activity, Building2, CalendarDays, Target, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { loadGrowthSnapshot } from "../directory/data";
import { MetricCard } from "./PortalUi";

type GrowthPanelProps = {
  fallbackUsers?: number;
  fallbackListings?: number;
  fallbackEvents?: number;
};

const SUPPLY_TARGETS = [
  { day: 30, businesses: 40, events: 10 },
  { day: 60, businesses: 80, events: 30 },
  { day: 90, businesses: 120, events: 60 },
] as const;

function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / (24 * 60 * 60 * 1000)));
}

export default function GrowthPanel({
  fallbackUsers = 0,
  fallbackListings = 0,
  fallbackEvents = 0,
}: GrowthPanelProps) {
  const [signups, setSignups] = useState(fallbackUsers);
  const [listings, setListings] = useState(fallbackListings);
  const [events, setEvents] = useState(fallbackEvents);
  const [recent, setRecent] = useState<Array<{ created_at: string }>>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await loadGrowthSnapshot();
        if (cancelled) return;
        setSignups(snap.signups || fallbackUsers);
        setListings(snap.listings || fallbackListings);
        setEvents(snap.events || fallbackEvents);
        setRecent(snap.recentSignups);
      } catch {
        if (!cancelled) {
          setSignups(fallbackUsers);
          setListings(fallbackListings);
          setEvents(fallbackEvents);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fallbackUsers, fallbackListings, fallbackEvents]);

  const launchDay = useMemo(() => {
    if (!recent.length) return 0;
    const oldest = [...recent].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )[0];
    return daysSince(oldest?.created_at) ?? 0;
  }, [recent]);

  const activeTarget =
    SUPPLY_TARGETS.find((t) => launchDay <= t.day) || SUPPLY_TARGETS[2];

  const signupsByWeek = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const row of recent) {
      const d = new Date(row.created_at);
      if (!Number.isFinite(d.getTime())) continue;
      const key = `${d.getUTCFullYear()}-W${Math.ceil(
        ((d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7,
      )}`;
      buckets.set(key, (buckets.get(key) || 0) + 1);
    }
    return Array.from(buckets.entries()).slice(0, 6);
  }, [recent]);

  return (
    <div className="portal-stack">
      <section className="portal-metrics" aria-label="Growth metrics">
        <MetricCard
          icon={Users}
          label="Sign-ups"
          value={loaded ? signups : "…"}
          detail="users.created_at"
          tone="accent"
        />
        <MetricCard
          icon={Building2}
          label="Listings"
          value={loaded ? listings : "…"}
          detail="Restaurants + community resources"
          tone="success"
        />
        <MetricCard
          icon={CalendarDays}
          label="Upcoming events"
          value={loaded ? events : "…"}
          detail="external_events ahead"
        />
        <MetricCard
          icon={Target}
          label="Launch day"
          value={loaded ? `D${launchDay}` : "…"}
          detail={`Target window · day ${activeTarget.day}`}
        />
      </section>

      <section className="portal-panel">
        <div className="portal-panel-heading">
          <div>
            <span className="portal-kicker">Supply targets</span>
            <h2>Businesses &amp; events vs plan</h2>
          </div>
          <Target aria-hidden />
        </div>
        <div className="portal-roadmap-grid">
          {SUPPLY_TARGETS.map((target) => {
            const bizPct = Math.min(
              100,
              Math.round((listings / target.businesses) * 100),
            );
            const evtPct = Math.min(
              100,
              Math.round((events / target.events) * 100),
            );
            const isActive = target.day === activeTarget.day;
            return (
              <article key={target.day} className={isActive ? "is-next" : undefined}>
                <span>Day {target.day}</span>
                <strong>
                  {target.businesses} businesses / {target.events} events
                </strong>
                <p>
                  Actual: {listings} listings ({bizPct}%) · {events} events (
                  {evtPct}%)
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="portal-panel">
        <div className="portal-panel-heading">
          <div>
            <span className="portal-kicker">Recent sign-ups</span>
            <h2>From users.created_at</h2>
          </div>
          <Activity aria-hidden />
        </div>
        {signupsByWeek.length === 0 ? (
          <p className="portal-muted">No recent signup timestamps available via anon read.</p>
        ) : (
          <div className="portal-list">
            {signupsByWeek.map(([week, count]) => (
              <article className="portal-list-row" key={week}>
                <div className="portal-list-main">
                  <strong>{week}</strong>
                  <span>Sampled from latest users</span>
                </div>
                <span className="portal-status is-success">{count}</span>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="portal-panel portal-callout">
        <div>
          <span className="portal-kicker">Attribution</span>
          <h2>Sign-ups by source</h2>
          <p>Tracking starts soon — partner ref / UTM columns are not live yet.</p>
        </div>
      </section>

      <section className="portal-panel portal-callout">
        <div>
          <span className="portal-kicker">Activation</span>
          <h2>7-day activation</h2>
          <p>Tracking starts soon — needs first meaningful action timestamps.</p>
        </div>
      </section>

      <section className="portal-panel portal-callout">
        <div>
          <span className="portal-kicker">Retention</span>
          <h2>4-week retention</h2>
          <p>Tracking starts soon — cohort retention columns are not provisioned yet.</p>
        </div>
      </section>
    </div>
  );
}
