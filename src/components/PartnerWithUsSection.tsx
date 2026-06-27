import { Handshake, Home, Package, Scale } from "lucide-react";
import { CONTENT } from "../constants/content";

const audiences = [
  { label: "Community restaurants & shops", Icon: Home },
  { label: "Immigration & legal support", Icon: Scale },
  { label: "Shipping & logistics partners", Icon: Package },
] as const;

export default function PartnerWithUsSection() {
  const { headline, body, ctaLabel, inquiryEmail, emailSubject } =
    CONTENT.partnerWithUs;
  const mailHref = `mailto:${inquiryEmail}?subject=${encodeURIComponent(emailSubject)}`;

  return (
    <section
      id="partner-with-us"
      className="relative py-10 md:py-14 bg-transparent"
      aria-labelledby="partner-with-us-heading"
    >
      <div className="relative z-10 container mx-auto px-6 max-w-3xl">
        <div className="animate-on-scroll glass-card rounded-2xl p-6 sm:p-8 border border-[#ff6b00]/20">
          <div className="space-y-5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6b00]/25 bg-[#ff6b00]/10 px-3 py-1.5 text-xs font-museo-bold uppercase tracking-wider text-[#ff8a33]">
              <Handshake className="w-3.5 h-3.5" aria-hidden />
              For local businesses
            </div>
            <h2
              id="partner-with-us-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug"
            >
              {headline}
            </h2>
            <p className="text-sm sm:text-base text-white/75 font-museo-medium leading-relaxed">
              {body}
            </p>

            <ul className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              {audiences.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-xs text-white/80 font-museo-medium"
                >
                  <Icon className="w-3.5 h-3.5 text-[#ff8a33] shrink-0" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <a
              href={mailHref}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-[var(--bawo-radius-pill)] min-h-11 px-6 text-sm font-museo-bold text-white border border-[#ff6b00]/50 bg-[#ff6b00]/10 transition-colors hover:bg-[#ff6b00]/20"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
