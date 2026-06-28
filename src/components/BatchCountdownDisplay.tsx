import { memo } from "react";
import { formatCountdownClock, useBatchCountdown } from "../hooks/useBatchCountdown";

type BatchCountdownDisplayProps = {
  className?: string;
  size?: "sm" | "lg";
};

/** Stats-section countdown — self-contained tick, no App re-renders. */
function BatchCountdownDisplay({ className = "", size = "lg" }: BatchCountdownDisplayProps) {
  const t = useBatchCountdown(true);
  const c = formatCountdownClock(t);
  const num = size === "lg" ? "text-2xl md:text-3xl" : "text-sm tabular-nums";

  return (
    <div className={`flex items-center justify-center gap-1 md:gap-2 font-museo-bold tabular-nums ${className}`}>
      <span className={`${num} text-[#ff6b00]`}>{c.days}</span>
      <span className="text-white/25 pb-1">:</span>
      <span className={`${num} text-[#ff6b00]`}>{c.hours}</span>
      <span className="text-white/25 pb-1">:</span>
      <span className={`${num} text-[#ff6b00]`}>{c.minutes}</span>
      <span className="text-white/25 pb-1">:</span>
      <span className={`${num} text-white/90`}>{c.seconds}</span>
    </div>
  );
}

export default memo(BatchCountdownDisplay);
