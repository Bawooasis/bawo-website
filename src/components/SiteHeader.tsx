import { Building2, Menu, X } from "lucide-react";
import { memo, useEffect, useState, type MouseEvent } from "react";
import BawoPillButton from "./BawoPillButton";
import SiteLogo from "./SiteLogo";
import { CONTENT } from "../constants/content";

/** Top-center pill destinations (replaces left sidebar + mid-page pill). */
const PILL_LINKS = [
  { label: "Circles", href: "#community-circles" },
  { label: "Network", href: "#building-the-network" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Events", href: "#events" },
  { label: "Businesses", href: "/businesses" },
  { label: "FAQ", href: "#faq" },
] as const;

const MOBILE_LINKS = [
  ...PILL_LINKS,
  { label: "Try the App", href: "#early-access" },
] as const;

type SiteHeaderProps = {
  onJoinClick: () => void;
};

function SiteHeader({ onJoinClick }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bawo-site-header__bar">
          <div className="bawo-site-header__leading">
            <SiteLogo className="bawo-site-header__logo" onClick={scrollHome} />
          </div>

          <nav className="bawo-site-header__pill" aria-label="Main">
            <div className="bawo-site-header__pill-track">
              {PILL_LINKS.map((link, index) => (
                <span key={link.href} className="bawo-site-header__pill-segment">
                  {index > 0 ? (
                    <span className="bawo-site-header__pill-divider" aria-hidden />
                  ) : null}
                  <a href={link.href} className="bawo-site-header__pill-item">
                    {link.label}
                  </a>
                </span>
              ))}
            </div>
          </nav>

          <div className="bawo-site-header__actions">
            <a
              href="/businesses"
              className="bawo-site-header__businesses-chip"
              aria-label="Businesses Log In and Sign In"
            >
              <Building2 className="h-3.5 w-3.5 text-[#D6B26A] shrink-0" aria-hidden />
              <span className="bawo-site-header__businesses-chip-label">Businesses</span>
            </a>

            <a
              href={CONTENT.hero.testflightLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bawo-site-header__founding-chip hidden lg:inline-flex"
            >
              <span className="bawo-site-header__founding-chip-label">
                <span className="bawo-site-header__founding-chip-line">Download via</span>
                <span className="bawo-site-header__founding-chip-line">TestFlight</span>
              </span>
            </a>

            <BawoPillButton
              label={CONTENT.hero.ctaSecondary}
              variant="primary"
              appearance="outline"
              size="sm"
              polished
              className="bawo-site-header__join-btn hidden sm:inline-flex"
              onClick={onJoinClick}
            />

            <button
              type="button"
              className="bawo-site-header__menu-btn xl:hidden"
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
        <div className="bawo-site-header__mobile-panel">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobile">
            {MOBILE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="bawo-site-header__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="px-2 pt-3 flex flex-col gap-2">
              <BawoPillButton
                label="Businesses Log In / Sign In"
                variant="primary"
                appearance="outline"
                size="md"
                polished
                fullWidth
                onClick={() => {
                  setMobileOpen(false);
                  window.location.assign("/businesses");
                }}
              />
              <BawoPillButton
                label={CONTENT.hero.ctaTestFlight}
                variant="primary"
                size="md"
                polished
                fullWidth
                onClick={() => {
                  setMobileOpen(false);
                  window.open(CONTENT.hero.testflightLink, "_blank", "noopener,noreferrer");
                }}
              />
              <BawoPillButton
                label={CONTENT.hero.ctaSecondary}
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
