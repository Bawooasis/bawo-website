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
    px: "px-7 sm:px-8",
    text: "text-[15px]",
    icon: 20,
  },
  lg: {
    h: "min-h-[56px]",
    px: "px-8 sm:px-9",
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
    "inline-flex flex-row items-center justify-center gap-2.5 rounded-full font-semibold outline-none overflow-hidden relative " +
    "transition-[transform,box-shadow,filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
    "active:translate-y-0 active:scale-[0.98] " +
    "disabled:opacity-[0.55] disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 " +
    "focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bawo-canvas,#06030C)] " +
    "before:absolute before:inset-0 before:rounded-full before:opacity-0 before:transition-opacity before:duration-300 " +
    "hover:before:opacity-100";

  const primary =
    "text-white bawo-cta-premium hover:-translate-y-1 disabled:hover:translate-y-0 active:brightness-[0.93] " +
    "before:bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.3)_0%,transparent_60%)]";

  const secondary =
    "bawo-cta-secondary text-white/[0.92] hover:-translate-y-1 " +
    "before:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15)_0%,transparent_50%)]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${m.h} ${m.px} ${m.text} ${
        variant === "primary" ? primary : secondary
      } ${fullWidth ? "w-full" : "w-fit max-w-full"} ${className}`}
      style={{
        letterSpacing: "0.2px",
        fontFamily: "Montserrat, system-ui, sans-serif",
      }}
    >
      {Icon ? (
        <Icon
          className={`relative z-[1] shrink-0 ${
            variant === "primary" 
              ? "text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.6)] filter brightness-110" 
              : "text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          }`}
          size={m.icon}
          strokeWidth={2.25}
          aria-hidden
        />
      ) : null}
      <span
        className={`relative z-[1] min-w-0 leading-snug text-white [text-wrap:balance] drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${
          fullWidth ? "flex-1 text-center" : "shrink-0 text-center px-0.5"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
