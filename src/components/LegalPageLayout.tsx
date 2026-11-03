import type { ReactNode } from "react";
import SiteLogo from "./SiteLogo";
import { AFFILIATE_DISCLOSURE_LINE } from "../constants/legal";

type LegalPageLayoutProps = {
  kicker?: string;
  title: string;
  updated?: string;
  children: ReactNode;
};

export default function LegalPageLayout({
  kicker = "Legal",
  title,
  updated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0E0A14] text-[#F7F3FA]">
      <header className="border-b border-[#D6B26A]/20">
        <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-5">
          <SiteLogo
            onClick={(event) => {
              event.preventDefault();
              window.location.assign("/");
            }}
          />
          <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm font-semibold text-[#F7E7C4]/80">
            <a href="/privacy" className="hover:text-[#D6B26A]">
              Privacy
            </a>
            <a href="/terms" className="hover:text-[#D6B26A]">
              Terms
            </a>
            <a href="/support" className="hover:text-[#D6B26A]">
              Support
            </a>
            <a href="/" className="hover:text-[#D6B26A]">
              Home
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D6B26A]">
          {kicker}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-[#F7F3FA] sm:text-5xl">
          {title}
        </h1>
        {updated ? (
          <p className="mt-3 text-sm text-[#F7F3FA]/65">Last updated: {updated}</p>
        ) : null}
        <div className="mt-8 space-y-8">{children}</div>
      </main>

      <footer className="border-t border-[#D6B26A]/15 py-8">
        <div className="container mx-auto space-y-3 px-6 text-center text-sm text-[#F7F3FA]/65">
          <p>{AFFILIATE_DISCLOSURE_LINE}</p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a href="/privacy" className="text-[#D6B26A] hover:underline">
              Privacy
            </a>
            <a href="/terms" className="text-[#D6B26A] hover:underline">
              Terms
            </a>
            <a href="/support" className="text-[#D6B26A] hover:underline">
              Support
            </a>
            <a href="/affiliate-disclosure" className="text-[#D6B26A] hover:underline">
              Affiliate disclosure
            </a>
          </p>
          <p>
            <a href="mailto:hello@joinbawo.com" className="text-[#D6B26A] hover:underline">
              hello@joinbawo.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
