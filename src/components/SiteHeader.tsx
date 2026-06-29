import { Menu, X } from "lucide-react";
import { memo, useEffect, useState, type MouseEvent } from "react";
import BawoPillButton from "./BawoPillButton";
import SiteLogo from "./SiteLogo";
import { formatCountdownShort, useBatchCountdown } from "../hooks/useBatchCountdown";

const NAV_LINKS = [
  { label: "Network", href: "#building-the-network" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Events", href: "#events" },
  { label: "FAQ", href: "#faq" },
] as const;

type SiteHeaderProps = {
  onJoinClick: () => void;
};

function SiteHeader({ onJoinClick }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeLeft = useBatchCountdown(true);
  const countdown = formatCountdownShort(timeLeft);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollHome = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="bawo-site-header fixed inset-x-0 top-0 z-50">
      <div className="bawo-site-header__glow" aria-hidden />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bawo-site-header__bar">
          <SiteLogo className="bawo-site-header__logo" onClick={scrollHome} />

          <nav className="bawo-site-header__nav" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="bawo-site-header__nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="bawo-site-header__actions">
            <a href="#pricing" className="bawo-site-header__founding-chip hidden md:inline-flex">
              <span className="bawo-site-header__founding-chip-label">Founding · $25</span>
              <span className="bawo-site-header__founding-chip-countdown tabular-nums">{countdown}</span>
            </a>

            <BawoPillButton
              label="Join Now"
              variant="primary"
              appearance="outline"
              size="sm"
              polished
              className="bawo-site-header__join-btn"
              onClick={onJoinClick}
            />

            <button
              type="button"
              className="bawo-site-header__menu-btn md:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="bawo-site-header__mobile-panel md:hidden">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="bawo-site-header__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <p className="px-4 pt-3 text-xs text-white/50 font-museo-medium tabular-nums">
              Founding pass $25 · Batch 1 closes in {countdown}
            </p>
            <div className="px-2 pt-3">
              <BawoPillButton
                label="Join Now — $25"
                variant="primary"
                appearance="outline"
                size="md"
                polished
                fullWidth
                onClick={() => {
                  setMobileOpen(false);
                  onJoinClick();
                }}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default memo(SiteHeader);
