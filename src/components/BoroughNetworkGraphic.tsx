/**
 * Proportional mesh behind the 3+3 borough/NJ grid (viewBox matches % layout).
 * Spokes tie each hub to a central node; chains link neighbors.
 * Colors: build 165 gold / pumpkin / eggplant (no neon green).
 */
export default function BoroughNetworkGraphic({
  className = "",
}: {
  className?: string;
}) {
  // 3 top + 3 bottom node centers in viewBox units
  const top = [
    [17, 24],
    [50, 24],
    [83, 24],
  ] as const;
  const bottom = [
    [17, 76],
    [50, 76],
    [83, 76],
  ] as const;
  const hubs = [...top, ...bottom];

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="bawo-net-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D6B26A" stopOpacity="0.22" />
          <stop offset="40%" stopColor="#FF6B00" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3a1d48" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="bawo-net-stroke-soft" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D6B26A" stopOpacity="0.14" />
          <stop offset="50%" stopColor="#2a1438" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF8C42" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id="bawo-net-hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D6B26A" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#FF6B00" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#08060C" stopOpacity="0" />
        </radialGradient>
        <filter id="bawo-net-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.35" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse
        cx="50"
        cy="50"
        rx="38"
        ry="32"
        fill="none"
        stroke="url(#bawo-net-stroke-soft)"
        strokeWidth="0.12"
        className="bawo-net-ring"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="28"
        ry="24"
        fill="none"
        stroke="url(#bawo-net-stroke-soft)"
        strokeWidth="0.1"
        opacity="0.7"
        className="bawo-net-ring bawo-net-ring--delay"
      />

      {/* Row chains */}
      <path
        d="M 17 24 L 50 24 L 83 24"
        fill="none"
        stroke="url(#bawo-net-stroke)"
        strokeWidth="0.28"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1.1 1.35"
        className="bawo-net-path bawo-net-path--mesh"
      />
      <path
        d="M 17 76 L 50 76 L 83 76"
        fill="none"
        stroke="url(#bawo-net-stroke)"
        strokeWidth="0.24"
        strokeLinecap="round"
        strokeDasharray="1.1 1.35"
        className="bawo-net-path bawo-net-path--mesh"
        opacity="0.85"
      />

      {/* Soft cross-links */}
      <path
        d="M 83 24 Q 62 50 17 76"
        fill="none"
        stroke="url(#bawo-net-stroke-soft)"
        strokeWidth="0.18"
        strokeLinecap="round"
        strokeDasharray="0.9 1.4"
        className="bawo-net-path bawo-net-path--cross"
      />
      <path
        d="M 17 24 Q 38 50 83 76"
        fill="none"
        stroke="url(#bawo-net-stroke-soft)"
        strokeWidth="0.16"
        strokeLinecap="round"
        strokeDasharray="0.9 1.4"
        className="bawo-net-path bawo-net-path--cross"
      />

      {/* Hub ↔ each borough / NJ */}
      <g
        fill="none"
        stroke="url(#bawo-net-stroke)"
        strokeWidth="0.32"
        strokeLinecap="round"
        strokeDasharray="1.15 1.4"
        filter="url(#bawo-net-glow)"
        className="bawo-net-spokes"
      >
        {hubs.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M 50 50 L ${x} ${y}`} />
        ))}
      </g>

      <circle cx="50" cy="50" r="5.2" fill="url(#bawo-net-hub-glow)" className="bawo-net-hub-aura" />
      <circle
        cx="50"
        cy="50"
        r="1.35"
        fill="#D6B26A"
        stroke="rgba(255,248,235,0.45)"
        strokeWidth="0.12"
        className="bawo-net-hub-core"
      />
    </svg>
  );
}
