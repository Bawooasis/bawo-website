import FoundingMemberButton from "./FoundingMemberButton";
import { CONTENT } from "../constants/content";
import { scrollToWaitlist } from "../utils/scrollToWaitlist";

type MobileAppDownloadRowProps = {
  className?: string;
};

/**
 * Primary on-site CTA — Join BawoSocial (stays on joinbawo.com).
 */
export default function MobileAppDownloadRow({ className = "" }: MobileAppDownloadRowProps) {
  return (
    <div className={`flex w-full max-w-[19.5rem] flex-col gap-2 sm:gap-2.5 ${className}`.trim()}>
      <FoundingMemberButton
        label={CONTENT.hero.ctaPrimary}
        variant="primary"
        size="md"
        fullWidth
        onClick={scrollToWaitlist}
      />
    </div>
  );
}
