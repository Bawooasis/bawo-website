import type { ReactNode } from "react";
import SiteLogo from "../components/SiteLogo";

const LEGAL_NAV = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/support", label: "Support" },
] as const;

type LegalLayoutProps = {
  title: string;
  children: ReactNode;
  activePath: "/privacy" | "/terms" | "/support";
};

export default function LegalLayout({
  title,
  children,
  activePath,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0E0A14] text-[#F4F4F5] font-sans">
      <div
        className="pointer-events-none fixed inset-0 opacity-80"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,107,0,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 20%, rgba(255,188,66,0.08), transparent 50%), radial-gradient(ellipse 50% 35% at 10% 60%, rgba(184,115,51,0.1), transparent 45%)",
        }}
      />

      <header className="relative z-10 border-b border-[#E8B959]/15 bg-[#0E0A14]/80 backdrop-blur-xl">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <SiteLogo
            onClick={(event) => {
              event.preventDefault();
              window.location.assign("/");
            }}
          />
          <nav
            className="flex flex-wrap items-center gap-1 sm:gap-2"
            aria-label="Legal pages"
          >
            {LEGAL_NAV.map((item) => {
              const active = item.href === activePath;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "inline-flex min-h-10 items-center rounded-full bg-[#FF6B00]/20 px-3 text-sm font-semibold text-[#FFBC42]"
                      : "inline-flex min-h-10 items-center rounded-full px-3 text-sm font-medium text-[#F7F3FA]/75 hover:text-[#E8B959]"
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="relative z-10 container mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        <p className="bawo-eyebrow mb-3 text-xs">BawoSocial</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#F7F3FA] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm font-medium text-[#FFE8B3]/80">
          Last updated: October 30, 2026
        </p>

        <article className="glass-card mt-8 space-y-8 rounded-3xl p-6 text-[#F4F4F5]/90 sm:p-8 md:p-10">
          {children}
        </article>
      </main>

      <footer className="relative z-10 border-t border-[#E8B959]/15 py-10">
        <div className="container mx-auto max-w-3xl space-y-3 px-5 text-center text-sm text-[#F7F3FA]/65 sm:px-6">
          <p>
            Questions? Email{" "}
            <a
              href="mailto:support@bawosocial.com"
              className="font-semibold text-[#E8B959] hover:text-[#FFBC42]"
            >
              support@bawosocial.com
            </a>
          </p>
          <p>
            <a href="/" className="hover:text-[#E8B959]">
              Back to joinbawo.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-bold text-[#F7F3FA]">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[#F4F4F5]/85">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-[#FF8C42]">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
