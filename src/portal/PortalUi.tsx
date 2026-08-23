import type { LucideIcon } from "lucide-react";

type MetricTone = "neutral" | "success" | "warning" | "accent";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  detail?: string;
  tone?: MetricTone;
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "neutral",
}: MetricCardProps) {
  return (
    <article className={`portal-metric is-${tone}`}>
      <div className="portal-metric-topline">
        <span>{label}</span>
        <div className="portal-metric-icon"><Icon aria-hidden /></div>
      </div>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  );
}

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export function EmptyState({ icon: Icon, title, body }: EmptyStateProps) {
  return (
    <div className="portal-empty-state">
      <div className="portal-empty-state-icon"><Icon aria-hidden /></div>
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
    </div>
  );
}
