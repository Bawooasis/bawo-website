import { useEffect, useState } from "react";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Anchoring the reset to one timezone keeps the clock identical for every
 *  visitor instead of following their local midnight. */
const BATCH_TIMEZONE = "America/New_York";

export type CountdownParts = {
  hours: number;
  minutes: number;
  seconds: number;
};

const zonedClock = new Intl.DateTimeFormat("en-US", {
  timeZone: BATCH_TIMEZONE,
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Milliseconds until the next midnight in `BATCH_TIMEZONE`.
 *  Treats the two DST-shifted days as a flat 24h; the drift lasts one day and
 *  corrects itself at the following reset. */
function msUntilReset(now: number): number {
  const parts = zonedClock.formatToParts(new Date(now));
  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const hours = read("hour") % 24; // some engines report midnight as hour 24
  const elapsed =
    ((hours * 60 + read("minute")) * 60 + read("second")) * 1000 + (now % 1000);

  return DAY_MS - elapsed;
}

function computeCountdown(): CountdownParts {
  const remaining = msUntilReset(Date.now());

  return {
    hours: Math.floor(remaining / (1000 * 60 * 60)),
    minutes: Math.floor((remaining / 1000 / 60) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
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

const pad = (value: number) => String(value).padStart(2, "0");

export function formatCountdownShort(t: CountdownParts) {
  return `${pad(t.hours)}:${pad(t.minutes)}:${pad(t.seconds)}`;
}

export function formatCountdownClock(t: CountdownParts) {
  return {
    hours: pad(t.hours),
    minutes: pad(t.minutes),
    seconds: pad(t.seconds),
  };
}
