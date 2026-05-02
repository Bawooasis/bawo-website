const MAILCHIMP_ACTION =
  "https://joinbawo.us10.list-manage.com/subscribe/post?u=7c2523b0334a02fe77eebddb3&id=842ac1ad64&f_id=00bb32e3f0";
const HONEYPOT_NAME = "b_7c2523b0334a02fe77eebddb3_842ac1ad64";

type MailchimpSignupRowProps = {
  className?: string;
  buttonLabel?: string;
  compact?: boolean;
};

export default function MailchimpSignupRow({
  className = "",
  buttonLabel = "Join Waitlist",
  compact = false,
}: MailchimpSignupRowProps) {
  const inputPad = compact ? "px-4 py-3 text-base" : "px-6 py-4 text-lg";
  const btnPad = compact ? "px-6 py-3 text-sm min-h-[44px]" : "px-10 py-4 text-base min-h-[48px]";

  return (
    <form
      action={MAILCHIMP_ACTION}
      method="post"
      target="_self"
      className={`relative ${className}`.trim()}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <input
          type="email"
          name="EMAIL"
          placeholder="Enter email for launch updates"
          required
          className={`flex-1 rounded-[12px] border-2 focus:outline-none transition-all bg-white/10 backdrop-blur-sm text-white placeholder-white/70 font-museo-medium border-white/20 focus:border-[var(--bawo-brand-cta-orange)] ${inputPad}`}
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
          className={`bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full font-bold flex items-center justify-center transition-all duration-300 font-museo-bold shrink-0 ${btnPad}`}
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
