import { BadgeCheck } from "lucide-react";
import FoundingMemberButton from "./FoundingMemberButton";
import HeroSecondaryBar from "./HeroSecondaryBar";
import { AppleIcon } from "./icons/BrandIcons";
import { CONTENT } from "../constants/content";

const IOS_BETA_BENEFIT_INDEX = 2;

type FoundingMemberCheckoutCardProps = {
  onJoinClick: () => void;
};

export default function FoundingMemberCheckoutCard({ onJoinClick }: FoundingMemberCheckoutCardProps) {
  const { title, description, price, benefits, ctaLabel } = CONTENT.foundingMemberCheckout;

  return (
    <div className="animate-on-scroll mx-auto w-full max-w-xl text-center">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-center gap-1 sm:gap-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              {title}
            </h2>
            <p className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-[#ff6b00]">
              {price}
            </p>
          </div>
          <p className="text-sm sm:text-base text-white/65 font-museo-medium leading-relaxed max-w-md mx-auto">
            {description}
          </p>
        </div>

        <ul className="space-y-3 text-left max-w-sm mx-auto">
          {benefits.map((line, index) => (
            <li key={line} className="flex items-start gap-2.5">
              <BadgeCheck
                className="w-4 h-4 shrink-0 mt-0.5 text-[#ff6b00]"
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-sm text-white/80 font-museo-medium inline-flex flex-wrap items-center gap-1.5">
                {line}
                {index === IOS_BETA_BENEFIT_INDEX && (
                  <AppleIcon className="w-3.5 h-3.5 text-white/70 shrink-0" aria-label="iOS" />
                )}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-white/45 font-museo-medium leading-relaxed max-w-sm mx-auto">
          Includes the Resource Directory — Black-owned businesses, community resources, and verified professionals.
        </p>

        <div className="space-y-4 pt-1">
          <FoundingMemberButton
            label={ctaLabel}
            variant="primary"
            size="md"
            className="w-full max-w-xs mx-auto"
            onClick={onJoinClick}
          />

          <p className="text-[11px] text-white/40 font-museo-medium">
            {CONTENT.hero.trustIndicators.stripe} · {CONTENT.hero.trustIndicators.oneTime}
          </p>

          <div className="pt-4 border-t border-white/[0.06] max-w-[26rem] mx-auto">
            <HeroSecondaryBar />
          </div>
        </div>
      </div>
    </div>
  );
}
