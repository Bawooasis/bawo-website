import FoundingMemberButton from "./FoundingMemberButton";
import { CONTENT } from "../constants/content";

type HeroActionStackProps = {
  onJoinClick: () => void;
};

export default function HeroActionStack({ onJoinClick }: HeroActionStackProps) {
  const { ctaPrimary, ctaMicrocopy, trustIndicators } = CONTENT.hero;

  return (
    <div className="bawo-hero-actions w-full max-w-[26rem] sm:max-w-[28rem] mx-auto">
      <div className="flex flex-col items-center gap-2.5">
        <FoundingMemberButton
          label={ctaPrimary}
          variant="primary"
          size="md"
          fullWidth
          onClick={onJoinClick}
        />
        <p className="text-[11px] sm:text-xs text-white/45 font-museo-medium text-center leading-snug">
          {ctaMicrocopy}
        </p>
      </div>

      <p className="mt-4 text-[10px] sm:text-[11px] text-white/38 font-museo-medium text-center leading-relaxed">
        {trustIndicators.stripe}
        <span className="mx-1.5 text-white/20" aria-hidden>
          ·
        </span>
        {trustIndicators.oneTime}
        <span className="mx-1.5 text-white/20" aria-hidden>
          ·
        </span>
        {trustIndicators.cancel}
      </p>
    </div>
  );
}
