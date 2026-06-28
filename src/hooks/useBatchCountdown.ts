import { useEffect, useState } from "react";

const BATCH_END = new Date("2026-08-01T23:59:59").getTime();

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function computeCountdown(): CountdownParts {
  const diff = Math.max(0, BATCH_END - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/** Isolated countdown — avoids re-rendering the full page every second. */
export function useBatchCountdown(active = true) {
  const [timeLeft, setTimeLeft] = useState(computeCountdown);

  useEffect(() => {
    if (!active) return;
    setTimeLeft(computeCountdown());
    const id = window.setInterval(() => setTimeLeft(computeCountdown()), 1000);
    return () => window.clearInterval(id);
  }, [active]);

  return timeLeft;
}

export function formatCountdownShort(t: CountdownParts) {
  return `${t.days}d ${String(t.hours).padStart(2, "0")}h ${String(t.minutes).padStart(2, "0")}m`;
}

export function formatCountdownClock(t: CountdownParts) {
  return {
    days: t.days,
    hours: String(t.hours).padStart(2, "0"),
    minutes: String(t.minutes).padStart(2, "0"),
    seconds: String(t.seconds).padStart(2, "0"),
  };
}
