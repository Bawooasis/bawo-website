import { BadgeCheck, BookOpen, Crown, ShieldCheck } from "lucide-react";
import { CONTENT } from "../constants/content";
import RecentActivitySnippet from "./RecentActivitySnippet";

export default function FoundingMemberCheckoutCard() {
  const openCheckout = () => {
    window.open(CONTENT.revenue.foundingStripeCheckoutUrl, "_blank", "noopener,noreferrer");
    const win = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof win.gtag !== "undefined") {
      win.gtag("event", "founding_member_checkout_click", {
        event_category: "conversion",
        event_label: "stripe_payment",
      });
    }
  };

  return (
    <div className="animate-on-scroll mx-auto w-full max-w-2xl">
      <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 border border-[rgba(212,175,55,0.22)] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D4AF37]/[0.07] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-[#F37021]/[0.08] blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-museo-bold uppercase tracking-[0.2em] text-[#D4AF37]/90">
                {CONTENT.foundingMemberCheckout.kicker}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                {CONTENT.foundingMemberCheckout.title}
              </h2>
              <p className="text-sm sm:text-base text-white/70 font-museo-medium max-w-md leading-relaxed">
                {CONTENT.foundingMemberCheckout.description}
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-center sm:text-right backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-white/50 font-museo-medium mb-1">
                One-time
              </p>
              <p className="font-display text-4xl sm:text-5xl font-bold tabular-nums text-[#D4AF37]">
                {CONTENT.foundingMemberCheckout.price}
              </p>
            </div>
          </div>

          <ul className="space-y-3.5">
            {CONTENT.foundingMemberCheckout.benefits.map((line) => (
              <li key={line} className="flex items-start gap-3">
                <BadgeCheck
                  className="w-5 h-5 shrink-0 mt-0.5 text-[#D4AF37]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-sm sm:text-base text-white/88 font-museo-medium leading-snug">
                  {line}
                </span>
              </li>
            ))}
          </ul>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#1a1008]/90 to-[#06030c]/80 p-4 flex gap-4 items-center">
              <div
                className="relative h-[4.5rem] w-[3.25rem] shrink-0 rounded-md border border-[#D4AF37]/40 shadow-[0_12px_28px_rgba(0,0,0,0.5)] bg-gradient-to-b from-[#3d2818] to-[#120a06]"
                aria-hidden
              >
                <div className="absolute inset-y-2 left-1.5 w-[3px] rounded-full bg-[#D4AF37]/70" />
                <BookOpen
                  className="absolute bottom-2 right-2 h-7 w-7 text-[#D4AF37]/90 drop-shadow-md"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-museo-bold uppercase tracking-wider text-[#D4AF37]/90">
                  Included: The Black Book
                </p>
                <p className="mt-1 text-sm text-white/75 font-museo-medium leading-snug">
                  Vetted contacts, pros, and cultural resources — unlocked with your pass.
                </p>
              </div>
            </div>

            <RecentActivitySnippet />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-white/45 font-museo-medium">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-white/50" aria-hidden />
              {CONTENT.hero.trustIndicators.stripe}
            </span>
            <span className="text-white/25" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]/80" aria-hidden />
              Limited founding allocation
            </span>
          </div>

          <button
            type="button"
            onClick={openCheckout}
            className="bawo-cta-glass-primary group relative z-0 w-full rounded-[var(--bawo-radius-pill)] min-h-[3.25rem] px-6 font-museo-bold text-[15px] sm:text-base tracking-wide text-white transition-[transform,box-shadow,filter] duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] active:translate-y-0 active:scale-[0.99] active:brightness-[0.94]"
          >
            <span className="relative z-[1]">{CONTENT.foundingMemberCheckout.ctaLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
