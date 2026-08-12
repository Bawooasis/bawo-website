import { memo } from "react";

const LINKS = [
  { label: "Network", href: "#building-the-network" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Events", href: "#events" },
  { label: "FAQ", href: "#faq" },
] as const;

type SectionPillNavProps = {
  className?: string;
};

function SectionPillNav({ className = "" }: SectionPillNavProps) {
  return (
    <nav
      className={`bawo-pill-nav ${className}`.trim()}
      aria-label="Page sections"
    >
      <div className="bawo-pill-nav__track">
        {LINKS.map((link, index) => (
          <span key={link.href} className="bawo-pill-nav__segment">
            {index > 0 ? (
              <span className="bawo-pill-nav__divider" aria-hidden />
            ) : null}
            <a href={link.href} className="bawo-pill-nav__item">
              {link.label}
            </a>
          </span>
        ))}
      </div>
    </nav>
  );
}

export default memo(SectionPillNav);
