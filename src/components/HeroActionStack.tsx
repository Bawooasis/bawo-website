import FoundingMemberButton from "./FoundingMemberButton";
import { CONTENT } from "../constants/content";

type HeroActionStackProps = {
  onJoinClick: () => void;
};

export default function HeroActionStack({ onJoinClick }: HeroActionStackProps) {
  const { ctaPrimary, ctaMicrocopy, partnerCta, partnerHref } = CONTENT.hero;

  return (
    <div className="bawo-hero-actions w-full max-w-[22rem] sm:max-w-[24rem] mx-auto">
      <div className="flex flex-col items-center gap-3">
        <FoundingMemberButton
          label={ctaPrimary}
          variant="primary"
          size="md"
          fullWidth
          onClick={onJoinClick}
        />
        <FoundingMemberButton
          label={partnerCta}
          variant="primary"
          appearance="outline"
          size="md"
          fullWidth
          onClick={() => {
            window.location.assign(partnerHref);
          }}
        />
        <p className="text-sm text-white/45 font-medium text-center leading-snug">
          {ctaMicrocopy}
        </p>
      </div>
    </div>
  );
}
