import { Crown } from "lucide-react";
import BawoPillButton, { type BawoPillButtonProps } from "./BawoPillButton";

type FoundingMemberButtonProps = Omit<BawoPillButtonProps, "icon">;

export default function FoundingMemberButton({
  className = "",
  ...props
}: FoundingMemberButtonProps) {
  return (
    <BawoPillButton
      icon={Crown}
      {...props}
      className={`bawo-pill-cta-surface ${className}`.trim()}
    />
  );
}
