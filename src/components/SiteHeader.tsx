import { Building2, Menu, X } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
} from "react";
import BawoPillButton from "./BawoPillButton";
import SiteLogo from "./SiteLogo";
import { CONTENT } from "../constants/content";

/** Top-center pill destinations (replaces left sidebar + mid-page pill). */
const PILL_LINKS = [
  { label: "Circles", href: "#community-circles" },
  { label: "Network", href: "#building-the-network" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Events", href: "/nyc#events" },
  { label: "Partner with us", href: "/businesses" },
  { label: "FAQ", href: "#faq" },
] as const;

const MOBILE_LINKS = [
  ...PILL_LINKS,
  { label: "Join BawoSocial", href: "#join" },
] as const;

/** Full pill nav + no hamburger at this width and above (Tailwind `xl`). */
export const HEADER_DESKTOP_MIN_WIDTH = 1280;

type SiteHeaderProps = {
  onJoinClick: () => void;
};

function SiteHeader({ onJoinClick }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        menuBtnRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const firstLink = panelRef.current?.querySelector<HTMLElement>(
      "a, button:not([disabled])",
    );
    firstLink?.focus();
  }, [mobileOpen]);

  const scrollHome = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <header className="bawo-site-header fixed inset-x-0 top-0 z-50" data-bawo-header>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bawo-site-header__bar" data-bawo-header-bar>
          <div className="bawo-site-header__leading" data-bawo-header-leading>
            <SiteLogo className="bawo-site-header__logo" onClick={scrollHome} />
          </div>

          <nav className="bawo-site-header__pill" aria-label="Main" data-bawo-header-pill>
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

          <div className="bawo-site-header__actions" data-bawo-header-actions>
            <a
              href="/businesses"
              className="bawo-site-header__businesses-chip"
              aria-label="Partner with us"
              data-bawo-header-partner
            >
              <Building2 className="h-3.5 w-3.5 text-[#D6B26A] shrink-0" aria-hidden />
              <span className="bawo-site-header__businesses-chip-label">Partner with us</span>
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
              ref={menuBtnRef}
              type="button"
              className="bawo-site-header__menu-btn xl:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls={panelId}
              aria-haspopup="true"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              data-bawo-header-menu
            >
              {mobileOpen ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id={panelId}
          ref={panelRef}
          className="bawo-site-header__mobile-panel"
          data-bawo-header-mobile-panel
          onKeyDown={onPanelKeyDown}
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobile">
            {MOBILE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="bawo-site-header__mobile-link"
                onClick={closeMobile}
              >
                {link.label}
              </a>
            ))}
            <div className="px-2 pt-3 flex flex-col gap-2">
              <BawoPillButton
                label="Partner with us"
                variant="primary"
                appearance="outline"
                size="md"
                polished
                fullWidth
                onClick={() => {
                  closeMobile();
                  window.location.assign("/businesses");
                }}
              />
              <BawoPillButton
                label={CONTENT.hero.ctaSecondary}
                variant="primary"
                size="md"
                polished
                fullWidth
                onClick={() => {
                  closeMobile();
                  onJoinClick();
                }}
              />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export default memo(SiteHeader);
