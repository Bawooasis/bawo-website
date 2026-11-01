import { Crown } from "lucide-react";
import BawoPillButton, { type BawoPillButtonProps } from "./BawoPillButton";

type FoundingMemberButtonProps = Omit<BawoPillButtonProps, "icon">;

export default function FoundingMemberButton({
  className = "",
  appearance = "quiet",
  variant = "primary",
  ...props
}: FoundingMemberButtonProps) {
  // Only filled gold CTAs get the surface recipe. Outline/secondary must stay
  // light-on-dark so sticky-bar "Businesses" (and other outline uses) stay readable.
  const useGoldSurface = appearance !== "outline" && variant === "primary";

  return (
    <BawoPillButton
      icon={Crown}
      appearance={appearance}
      variant={variant}
      {...props}
      className={`${useGoldSurface ? "bawo-pill-cta-surface" : ""} ${className}`.trim()}
    />
  );
}
