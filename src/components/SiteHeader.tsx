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

/**
 * Desktop pill = section anchors only.
 * Partner lives once as the gold header chip (not repeated in the pill).
 */
const PILL_LINKS = [
  { label: "Circles", href: "#community-circles" },
  { label: "Network", href: "#building-the-network" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Events", href: "/nyc#events" },
  { label: "FAQ", href: "#faq" },
] as const;

/** Menu panel links — Partner / Join stay in the header (or one phone CTA), not repeated here. */
const MENU_LINKS = PILL_LINKS;

/** Full pill nav + no hamburger at this width and above (Tailwind `xl`). */
export const HEADER_DESKTOP_MIN_WIDTH = 1280;

type SiteHeaderProps = {
  onJoinClick: () => void;
};

function SiteHeader({ onJoinClick }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    menuBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    document.body.classList.toggle("bawo-menu-open", mobileOpen);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("bawo-menu-open");
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      "a[href], button:not([disabled])",
    );
    firstLink?.focus();
  }, [mobileOpen]);

  const scrollHome = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFocusable = () => {
    const panelItems = panelRef.current
      ? Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
      : [];
    const menuBtn = menuBtnRef.current;
    return menuBtn ? [menuBtn, ...panelItems] : panelItems;
  };

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusable = getFocusable();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && (active === first || active === menuBtnRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const headerClass = [
    "bawo-site-header",
    "fixed",
    "inset-x-0",
    "top-0",
    "z-50",
    scrolled ? "bawo-site-header--scrolled" : "",
    mobileOpen ? "bawo-site-header--menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass} data-bawo-header>
      <div className="bawo-site-header__inner" data-bawo-header-inner>
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
              {mobileOpen ? (
                <X className="bawo-site-header__menu-icon h-5 w-5" strokeWidth={2} aria-hidden />
              ) : (
                <Menu className="bawo-site-header__menu-icon h-5 w-5" strokeWidth={2} aria-hidden />
              )}
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
          <nav
            className="bawo-site-header__mobile-nav"
            aria-label="Mobile"
            data-bawo-header-mobile-nav
          >
            {MENU_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="bawo-site-header__mobile-link"
                onClick={closeMobile}
                data-bawo-menu-link={link.label}
              >
                {link.label}
              </a>
            ))}
            {/* Phone-only primary CTA — Join is already in the header from sm up */}
            <div className="bawo-site-header__mobile-cta" data-bawo-header-mobile-cta>
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
