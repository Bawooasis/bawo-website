/**
 * Proportional mesh behind the 3+2 borough grid (viewBox matches % layout).
 * Spokes tie each borough to a central hub; chains link neighbors.
 */
export default function BoroughNetworkGraphic({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="bawo-net-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.22" />
          <stop offset="40%" stopColor="#F37021" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="bawo-net-stroke-soft" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#F37021" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id="bawo-net-hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#F37021" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#06030C" stopOpacity="0" />
        </radialGradient>
        <filter id="bawo-net-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.35" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer faint rings */}
      <ellipse
        cx="50"
        cy="48"
        rx="36"
        ry="30"
        fill="none"
        stroke="url(#bawo-net-stroke-soft)"
        strokeWidth="0.12"
        className="bawo-net-ring"
      />
      <ellipse
        cx="50"
        cy="48"
        rx="28"
        ry="23"
        fill="none"
        stroke="url(#bawo-net-stroke-soft)"
        strokeWidth="0.1"
        opacity="0.7"
        className="bawo-net-ring bawo-net-ring--delay"
      />

      {/* Borough-to-borough chains */}
      <path
        d="M 17 22 L 50 22 L 83 22"
        fill="none"
        stroke="url(#bawo-net-stroke)"
        strokeWidth="0.28"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="bawo-net-path bawo-net-path--mesh"
      />
      <path
        d="M 38 78 L 62 78"
        fill="none"
        stroke="url(#bawo-net-stroke)"
        strokeWidth="0.24"
        strokeLinecap="round"
        className="bawo-net-path bawo-net-path--mesh"
        opacity="0.85"
      />
      {/* Cross-links (diaspora bridges) */}
      <path
        d="M 83 22 Q 62 48 38 78"
        fill="none"
        stroke="url(#bawo-net-stroke-soft)"
        strokeWidth="0.18"
        strokeLinecap="round"
        className="bawo-net-path bawo-net-path--cross"
      />
      <path
        d="M 17 22 Q 48 50 62 78"
        fill="none"
        stroke="url(#bawo-net-stroke-soft)"
        strokeWidth="0.16"
        strokeLinecap="round"
        className="bawo-net-path bawo-net-path--cross"
      />
      <path
        d="M 50 22 L 50 48 L 50 78"
        fill="none"
        stroke="url(#bawo-net-stroke-soft)"
        strokeWidth="0.14"
        strokeLinecap="round"
        opacity="0.65"
        className="bawo-net-path bawo-net-path--cross"
      />

      {/* Hub ↔ each borough */}
      <g
        fill="none"
        stroke="url(#bawo-net-stroke)"
        strokeWidth="0.32"
        strokeLinecap="round"
        filter="url(#bawo-net-glow)"
        className="bawo-net-spokes"
      >
        <path d="M 50 48 L 17 22" />
        <path d="M 50 48 L 50 22" />
        <path d="M 50 48 L 83 22" />
        <path d="M 50 48 L 38 78" />
        <path d="M 50 48 L 62 78" />
      </g>

      {/* Hub */}
      <circle cx="50" cy="48" r="5.2" fill="url(#bawo-net-hub-glow)" className="bawo-net-hub-aura" />
      <circle
        cx="50"
        cy="48"
        r="1.35"
        fill="#D4AF37"
        stroke="rgba(255,248,235,0.45)"
        strokeWidth="0.12"
        className="bawo-net-hub-core"
      />
    </svg>
  );
}
