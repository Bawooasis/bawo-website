const MAILCHIMP_ACTION =
  "https://joinbawo.us10.list-manage.com/subscribe/post?u=7c2523b0334a02fe77eebddb3&id=842ac1ad64&f_id=00bb32e3f0";
const HONEYPOT_NAME = "b_7c2523b0334a02fe77eebddb3_842ac1ad64";

type MailchimpSignupRowProps = {
  className?: string;
  buttonLabel?: string;
  compact?: boolean;
  /** Ghost outline — use for email list so paid CTAs stay visually primary. */
  variant?: "default" | "ghost";
};

export default function MailchimpSignupRow({
  className = "",
  buttonLabel = "Join Waitlist",
  compact = false,
  variant = "default",
}: MailchimpSignupRowProps) {
  const inputTypography = compact ? "py-3 text-base" : "py-4 text-lg";
  const btnPad = compact ? "px-6 py-3 text-sm min-h-[44px]" : "px-10 py-4 text-base min-h-[48px]";
  const ghostButton =
    variant === "ghost"
      ? "relative border-2 border-white/25 bg-white/[0.03] backdrop-blur-md text-white/90 " +
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.25)] " +
        "hover:bg-white/[0.08] hover:border-[#D4AF37]/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_6px_20px_rgba(0,0,0,0.3),0_0_40px_rgba(212,175,55,0.15)] " +
        "hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 " +
        "transition-[transform,box-shadow,border-color,background-color] duration-200"
      : "border-2 border-white text-white hover:bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)]";

  return (
    <form
      action={MAILCHIMP_ACTION}
      method="post"
      target="_self"
      className={`relative ${className}`.trim()}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 sm:items-end">
        <input
          type="email"
          name="EMAIL"
          placeholder="Enter email for launch updates"
          required
          autoComplete="email"
          className={`flex-1 min-w-0 bg-transparent border-0 border-b-2 border-white/25 rounded-none shadow-none focus:ring-0 focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 font-museo-medium text-white placeholder:text-[#D4AF37] placeholder:opacity-90 ${inputTypography}`}
        />
        <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
          <input
            type="text"
            name={HONEYPOT_NAME}
            tabIndex={-1}
            defaultValue=""
            aria-label="Do not fill this field"
            title="Do not fill this field"
          />
        </div>
        <button
          type="submit"
          className={`rounded-full font-bold flex items-center justify-center transition-[transform,background-color,border-color] duration-200 font-museo-bold shrink-0 ${btnPad} ${ghostButton}`}
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
