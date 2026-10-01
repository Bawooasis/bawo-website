import FoundingMemberButton from "./FoundingMemberButton";
import { CONTENT } from "../constants/content";

type HeroActionStackProps = {
  onJoinClick: () => void;
};

export default function HeroActionStack({ onJoinClick }: HeroActionStackProps) {
  const { ctaPrimary, ctaMicrocopy, ctaTestFlight, testflightLink } = CONTENT.hero;

  return (
    <div className="bawo-hero-actions w-full max-w-[22rem] sm:max-w-[24rem] mx-auto">
      <div className="flex flex-col items-center gap-3">
        <FoundingMemberButton
          label={ctaTestFlight}
          variant="primary"
          size="md"
          fullWidth
          onClick={() => {
            window.open(testflightLink, "_blank", "noopener,noreferrer");
          }}
        />
        <FoundingMemberButton
          label={ctaPrimary}
          variant="primary"
          appearance="outline"
          size="md"
          fullWidth
          onClick={onJoinClick}
        />
        <p className="text-[11px] sm:text-xs text-white/45 font-museo-medium text-center leading-snug">
          {ctaMicrocopy}
        </p>
      </div>
    </div>
  );
}
