import { BadgeCheck } from "lucide-react";
import BawoPillButton from "./BawoPillButton";
import { CONTENT } from "../constants/content";

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
    <div className="animate-on-scroll mx-auto w-full max-w-xl">
      <div className="glass-card relative overflow-hidden rounded-2xl border border-white/[0.1] p-6 sm:p-8">
        <div className="relative flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 min-w-0">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {CONTENT.foundingMemberCheckout.title}
              </h2>
              <p className="text-sm text-white/70 font-museo-medium leading-relaxed">
                {CONTENT.foundingMemberCheckout.description}
              </p>
            </div>
            <p className="shrink-0 font-display text-3xl sm:text-4xl font-bold tabular-nums text-[#ff6b00]">
              {CONTENT.foundingMemberCheckout.price}
            </p>
          </div>

          <ul className="space-y-2.5">
            {CONTENT.foundingMemberCheckout.benefits.map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <BadgeCheck
                  className="w-4 h-4 shrink-0 mt-0.5 text-[#ff6b00]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-sm text-white/85 font-museo-medium">{line}</span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-white/55 font-museo-medium leading-relaxed border-t border-white/[0.08] pt-4">
            Includes the Resource Directory — Black-owned businesses, community resources, and verified professionals.
          </p>

          <BawoPillButton
            label={CONTENT.foundingMemberCheckout.ctaLabel}
            variant="primary"
            size="md"
            className="w-full"
            onClick={openCheckout}
          />

          <p className="text-center text-[11px] text-white/45 font-museo-medium">
            {CONTENT.hero.trustIndicators.stripe} · {CONTENT.hero.trustIndicators.oneTime}
          </p>
        </div>
      </div>
    </div>
  );
}
