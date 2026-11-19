import type { ReactNode } from "react";
import SiteLogo from "../components/SiteLogo";
import { scrollToWaitlist } from "../utils/scrollToWaitlist";
import "./directory.css";

type DirectoryShellProps = {
  children: ReactNode;
  active?: "nyc" | "partners" | "home";
  /** When true, Join scrolls to #join on this page instead of going home. */
  joinOnPage?: boolean;
};

const NAV = [
  { id: "home", label: "Circles", href: "/#community-circles" },
  { id: "nyc", label: "Places & Events", href: "/nyc" },
  { id: "partners", label: "Partner with us", href: "/partners" },
  { id: "faq", label: "FAQ", href: "/#faq" },
] as const;

export default function DirectoryShell({
  children,
  active = "nyc",
  joinOnPage = false,
}: DirectoryShellProps) {
  const onJoin = () => {
    if (joinOnPage) {
      const el =
        document.getElementById("join") ||
        document.getElementById("partners-apply");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.location.assign("/#join");
    window.setTimeout(() => scrollToWaitlist(), 400);
  };

  return (
    <div className="dir-page">
      <header className="dir-shell-header">
        <div className="dir-shell-header__inner">
          <SiteLogo
            onClick={(event) => {
              event.preventDefault();
              window.location.assign("/");
            }}
          />
          <nav className="dir-shell-nav" aria-label="Directory">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  item.id === active ||
                  (active === "nyc" && item.id === "nyc") ||
                  (active === "partners" && item.id === "partners")
                    ? "is-active"
                    : undefined
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="dir-shell-actions">
            <a href="/businesses" className="dir-btn-secondary">
              Partner with us
            </a>
            <button type="button" className="dir-btn-primary" onClick={onJoin}>
              Join BawoSocial
            </button>
          </div>
        </div>
      </header>
      {children}
      <footer className="dir-footer">
        <p>
          BawoSocial · Nigerian-rooted community across NYC &amp; New Jersey ·{" "}
          <a href="/affiliate-disclosure" className="text-[#D6B26A]">
            Affiliate disclosure
          </a>
        </p>
      </footer>
    </div>
  );
}
