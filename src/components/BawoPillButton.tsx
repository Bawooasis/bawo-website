import type { LucideIcon } from "lucide-react";

export type BawoPillButtonProps = {
  label: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  /** Stretch to 100% of parent (pair with `max-w-md` on parent for app-like width). */
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

/** Horizontal ramp → `--bawo-brand-cta-orange` (`#ff6b00`): matches founding CTA reference (white label + glow). */
const metrics = {
  sm: {
    h: "min-h-[44px]",
    px: "px-4",
    text: "text-[14px]",
    icon: 18,
  },
  md: {
    h: "min-h-[52px]",
    px: "px-5",
    text: "text-[15px]",
    icon: 20,
  },
  lg: {
    h: "min-h-[56px]",
    px: "px-6",
    text: "text-lg",
    icon: 22,
  },
} as const;

export default function BawoPillButton({
  label,
  icon: Icon,
  variant = "primary",
  size = "md",
  fullWidth,
  disabled,
  className = "",
  onClick,
  type = "button",
}: BawoPillButtonProps) {
  const m = metrics[size];

  const base =
    "inline-flex flex-row items-center justify-center gap-2 rounded-full font-semibold outline-none overflow-hidden " +
    "transition-[transform,filter] duration-150 ease-out " +
    "active:scale-[0.98] " +
    "disabled:opacity-[0.55] disabled:cursor-not-allowed disabled:active:scale-100 " +
    "focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bawo-canvas,#06030C)]";

  const primary = "text-white bawo-pill-cta-surface";

  const secondary =
    "bg-white/[0.08] border border-white/[0.12] text-white/[0.92] " +
    "shadow-[0_8px_14px_rgba(0,0,0,0.28)] hover:bg-white/[0.1]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${m.h} ${m.px} ${m.text} ${
        variant === "primary" ? primary : secondary
      } ${fullWidth ? "w-full" : ""} ${className}`}
      style={{
        letterSpacing: "0.2px",
        fontFamily: "Montserrat, system-ui, sans-serif",
      }}
    >
      {Icon ? (
        <Icon
          className="shrink-0 text-white"
          size={m.icon}
          strokeWidth={2}
          aria-hidden
        />
      ) : null}
      <span className="min-w-0 flex-1 text-center leading-snug text-white [text-wrap:balance]">
        {label}
      </span>
    </button>
  );
}
