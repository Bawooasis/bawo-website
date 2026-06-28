import { Menu, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import BawoPillButton from "./BawoPillButton";
import { formatCountdownShort, useBatchCountdown } from "../hooks/useBatchCountdown";
import { IMAGES } from "../constants/images";

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

  return (
    <header className="bawo-site-header fixed top-0 left-0 right-0 z-50">
      <div className="bawo-site-header__glow" aria-hidden />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid h-14 sm:h-[3.75rem] grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-6">
          <a
            href="#"
            className="shrink-0 flex items-center"
            onClick={(e) => {
              e.preventDefault();
              setMobileOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src={IMAGES.assets.logo}
              alt="BawoSocial"
              className="block h-7 sm:h-8 w-auto"
              width={168}
              height={32}
              decoding="async"
            />
          </a>

          <nav
            className="hidden md:flex items-center justify-center gap-0.5 lg:gap-1 min-w-0"
            aria-label="Main"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 lg:px-4 py-2 text-sm font-museo-medium text-white/72 hover:text-white rounded-full hover:bg-white/[0.06] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0">
            <a
              href="#pricing"
              className="hidden lg:inline-flex flex-col items-end leading-tight rounded-lg border border-[#ff6b00]/30 bg-[#ff6b00]/10 px-2.5 py-1 hover:bg-[#ff6b00]/15 transition-colors"
            >
              <span className="text-[10px] font-museo-bold uppercase tracking-wider text-[#ff8a33]">
                Founding · $25
              </span>
              <span className="text-[11px] font-museo-medium text-white/75 tabular-nums">
                {countdown}
              </span>
            </a>

            <BawoPillButton
              label="Join Now"
              variant="primary"
              appearance="outline"
              size="sm"
              polished
              className="inline-flex min-w-[4.5rem] sm:min-w-[6.75rem] text-xs sm:text-sm"
              onClick={onJoinClick}
            />

            <button
              type="button"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/90 hover:bg-white/[0.06] transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[rgba(18,8,15,0.32)]">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm font-museo-medium text-white/88 hover:bg-white/[0.06]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <p className="px-4 pt-2 text-xs text-white/50 font-museo-medium tabular-nums">
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
