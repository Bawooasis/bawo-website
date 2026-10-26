import type { LucideIcon } from "lucide-react";

export type BawoPillButtonProps = {
  label: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  /** `quiet` = signature gold CTA; `premium` = signature gold CTA; `outline` = liquid glass outline. */
  appearance?: "quiet" | "premium" | "outline";
  size?: "sm" | "md" | "lg";
  /** Stretch to 100% of parent (pair with `max-w-md` on parent for app-like width). */
  fullWidth?: boolean;
  /** Inviting glow + shimmer motion (hero / header CTAs). */
  polished?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

const metrics = {
  sm: {
    h: "min-h-[44px]",
    px: "px-5",
    text: "text-[13px]",
    icon: 17,
  },
  md: {
    h: "min-h-[48px]",
    px: "px-6 sm:px-7",
    text: "text-[15px]",
    icon: 19,
  },
  lg: {
    h: "min-h-[52px]",
    px: "px-7 sm:px-8",
    text: "text-[15px] sm:text-base",
    icon: 20,
  },
} as const;

export default function BawoPillButton({
  label,
  icon: Icon,
  variant = "primary",
  appearance = "quiet",
  size = "md",
  fullWidth,
  polished,
  disabled,
  className = "",
  onClick,
  type = "button",
}: BawoPillButtonProps) {
  const m = metrics[size];
  const isQuiet = appearance === "quiet";
  const isOutline = appearance === "outline";
  const isGoldPrimary = variant === "primary" && !isOutline;

  const baseQuiet =
    "inline-flex flex-row items-center justify-center gap-2 rounded-full font-bold outline-none relative overflow-hidden " +
    "transition-[filter,transform,border-color,box-shadow] duration-200 ease-out " +
    "disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100 " +
    "focus-visible:ring-2 focus-visible:ring-[#E8B959]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bawo-canvas,#0E0A14)]";

  const basePremium =
    "inline-flex flex-row items-center justify-center gap-2.5 rounded-full font-bold outline-none overflow-hidden relative " +
    "transition-[transform,box-shadow,filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
    "active:translate-y-0 active:scale-[0.98] " +
    "disabled:opacity-[0.55] disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 " +
    "focus-visible:ring-2 focus-visible:ring-[#E8B959]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bawo-canvas,#0E0A14)] " +
    "before:absolute before:inset-0 before:rounded-full before:opacity-0 before:transition-opacity before:duration-300 " +
    "hover:before:opacity-100";

  const primaryQuiet = isOutline
    ? "text-[#F7F3FA] bawo-cta-outline"
    : "text-[#0E0A14] bawo-cta-quiet";

  const primaryPremium =
    "text-[#0E0A14] bawo-cta-premium hover:-translate-y-0.5 disabled:hover:translate-y-0 active:brightness-[0.95] " +
    "before:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.35)_0%,transparent_60%)]";

  const secondaryPremium =
    "bawo-cta-secondary text-[#F7F3FA] hover:-translate-y-0.5 " +
    "before:bg-[radial-gradient(circle_at_50%_0%,rgba(232,185,89,0.2)_0%,transparent_55%)]";

  const base =
    variant === "secondary"
      ? basePremium
      : isQuiet || isOutline
        ? baseQuiet
        : basePremium;

  const primaryClass =
    variant === "primary"
      ? isQuiet || isOutline
        ? primaryQuiet
        : primaryPremium
      : secondaryPremium;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${m.h} ${m.px} ${m.text} ${primaryClass} ${
        polished ? "bawo-cta-polished" : ""
      } ${fullWidth ? "w-full" : "w-fit max-w-full"} ${className}`}
      style={{
        letterSpacing: isQuiet || isOutline ? "0.015em" : "0.02em",
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      }}
    >
      {Icon ? (
        <Icon
          className={`relative z-[1] shrink-0 ${
            isGoldPrimary
              ? "text-[#0E0A14]"
              : "text-[#E8B959] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          }`}
          size={m.icon}
          strokeWidth={2.35}
          aria-hidden
        />
      ) : null}
      <span
        className={`relative z-[1] min-w-0 leading-snug [text-wrap:balance] font-bold ${
          isGoldPrimary ? "text-[#0E0A14]" : "text-[#F7F3FA]"
        } ${fullWidth ? "flex-1 text-center" : "shrink-0 text-center px-0.5"}`}
      >
        {label}
      </span>
    </button>
  );
}
