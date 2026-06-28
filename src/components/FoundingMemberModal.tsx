import { useEffect, useRef } from "react";
import { BadgeCheck, X } from "lucide-react";
import FoundingMemberButton from "./FoundingMemberButton";
import { AppleIcon } from "./icons/BrandIcons";
import { CONTENT } from "../constants/content";
import { openFoundingCheckout, scrollToWaitlist } from "../utils/foundingCheckout";

type FoundingMemberModalProps = {
  open: boolean;
  onClose: () => void;
};

const IOS_BETA_BENEFIT_INDEX = 2;

export default function FoundingMemberModal({ open, onClose }: FoundingMemberModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { foundingMemberModal, hero } = CONTENT;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleCheckout = () => {
    onClose();
    openFoundingCheckout("modal_checkout");
  };

  const handleWaitlist = () => {
    onClose();
    scrollToWaitlist();
  };

  return (
    <div
      className="bawo-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="founding-modal-title"
        aria-describedby="founding-modal-desc"
        tabIndex={-1}
        className="bawo-modal-panel"
      >
        <button
          type="button"
          onClick={onClose}
          className="bawo-modal-close"
          aria-label="Close"
        >
          <X className="w-4 h-4" strokeWidth={2} aria-hidden />
        </button>

        <div className="space-y-6">
          <div className="space-y-2 pr-8">
            <p className="text-xs font-museo-bold uppercase tracking-[0.16em] text-[#ff8a33]">
              {foundingMemberModal.kicker}
            </p>
            <h2
              id="founding-modal-title"
              className="font-display text-2xl sm:text-[1.75rem] font-bold text-white leading-tight"
            >
              {foundingMemberModal.title}
            </h2>
            <p
              id="founding-modal-desc"
              className="text-sm sm:text-base text-white/65 font-museo-medium leading-relaxed"
            >
              {foundingMemberModal.subtitle}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tabular-nums text-[#ff6b00]">
              {foundingMemberModal.price}
            </span>
            <span className="text-sm text-white/50 font-museo-medium">
              {foundingMemberModal.priceNote}
            </span>
          </div>

          <ul className="space-y-3">
            {foundingMemberModal.benefits.map((line, index) => (
              <li key={line} className="flex items-start gap-2.5">
                <BadgeCheck
                  className="w-4 h-4 shrink-0 mt-0.5 text-[#ff6b00]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-sm text-white/85 font-museo-medium inline-flex flex-wrap items-center gap-1.5">
                  {line}
                  {index === IOS_BETA_BENEFIT_INDEX && (
                    <AppleIcon className="w-3.5 h-3.5 text-white/70 shrink-0" aria-label="iOS" />
                  )}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-white/45 font-museo-medium leading-relaxed border-t border-white/[0.08] pt-4">
            {foundingMemberModal.footerNote}
          </p>

          <div className="space-y-3 pt-1">
            <FoundingMemberButton
              label={foundingMemberModal.checkoutCta}
              variant="primary"
              size="md"
              fullWidth
              onClick={handleCheckout}
            />

            <button type="button" onClick={handleWaitlist} className="bawo-modal-waitlist-link">
              {foundingMemberModal.waitlistCta}
            </button>

            <p className="text-[11px] text-white/40 font-museo-medium text-center leading-relaxed">
              {foundingMemberModal.waitlistHint}
            </p>

            <p className="text-[10px] text-white/35 font-museo-medium text-center">
              {hero.trustIndicators.stripe} · {hero.trustIndicators.oneTime} ·{" "}
              {hero.trustIndicators.cancel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
