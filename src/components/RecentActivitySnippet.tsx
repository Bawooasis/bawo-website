/**
 * Compact social proof beside conversion — avoids duplicating the long feed in Stats.
 */
const ROWS = [
  { name: "Adanna", initials: "A", place: "Brooklyn", ring: "from-[#ff6b00] to-[#5a260c]" },
  { name: "Tunde", initials: "T", place: "Harlem", ring: "from-[#10b981] to-[#059669]" },
  { name: "Ngozi", initials: "N", place: "Brooklyn", ring: "from-[#ec4899] to-[#be185d]" },
] as const;

type RecentActivitySnippetProps = {
  className?: string;
};

export default function RecentActivitySnippet({ className = "" }: RecentActivitySnippetProps) {
  return (
    <div
      className={`rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 ${className}`.trim()}
      aria-label="Recent member activity"
    >
      <h3 className="mb-3 text-[10px] font-museo-bold uppercase tracking-wider text-white/45">
        Joining now
      </h3>
      <ul className="space-y-2.5">
        {ROWS.map((row) => (
          <li key={`${row.initials}-${row.place}`} className="flex items-center gap-3 text-sm">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${row.ring} text-xs font-bold text-white`}
            >
              {row.initials}
            </div>
            <p className="min-w-0 font-museo-medium text-white/85">
              <span className="font-museo-bold text-[var(--bawo-brand-cta-orange)]">{row.name}</span>{" "}
              from <span className="text-[var(--bawo-brand-cta-orange)]">{row.place}</span>
              <span className="text-white/45"> · founding</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
