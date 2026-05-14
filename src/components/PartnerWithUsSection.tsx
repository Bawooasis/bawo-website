import { Building2, Home, Package, Scale } from "lucide-react";
import { CONTENT } from "../constants/content";

const audiences = [
  { label: "Immigration attorneys", Icon: Scale },
  { label: "Real estate partners", Icon: Home },
  { label: "Shipping & logistics (e.g. Naija Cargo)", Icon: Package },
] as const;

export default function PartnerWithUsSection() {
  const { headline, body, ctaLabel, inquiryEmail, emailSubject } =
    CONTENT.partnerWithUs;
  const mailHref = `mailto:${inquiryEmail}?subject=${encodeURIComponent(emailSubject)}`;

  return (
    <section
      id="partner-with-us"
      className="relative py-16 md:py-24 bg-transparent"
      aria-labelledby="partner-with-us-heading"
    >
      <div className="relative z-10 container mx-auto px-6 max-w-4xl">
        <div className="animate-on-scroll glass-card rounded-3xl p-6 sm:p-10 md:p-12 border border-white/[0.1]">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
            <div className="space-y-5 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-museo-bold uppercase tracking-wider text-white/65">
                <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden />
                B2B, NYC
              </div>
              <h2
                id="partner-with-us-heading"
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15]"
              >
                {headline}
              </h2>
              <p className="text-base sm:text-lg text-white/78 font-museo-medium leading-relaxed">
                {body}
              </p>

              <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 pt-1">
                {audiences.map(({ label, Icon }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/20 px-3.5 py-2 text-xs sm:text-sm text-white/85 font-museo-medium"
                  >
                    <Icon className="w-4 h-4 text-[#D4AF37]/90 shrink-0" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 flex flex-col items-stretch gap-3 w-full md:w-auto md:min-w-[240px]">
              <a
                href={mailHref}
                className="inline-flex items-center justify-center text-center rounded-[var(--bawo-radius-pill)] min-h-12 px-6 text-sm font-museo-bold text-white bg-white/[0.06] backdrop-blur-md transition-[background-color,transform,box-shadow] duration-200 hover:bg-white/[0.1] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C47B44] border-2 border-[#C47B44] shadow-[0_0_0_1px_rgba(196,123,68,0.35),inset_0_1px_0_rgba(255,242,235,0.12)] hover:border-[#d4915e] hover:shadow-[0_0_0_1px_rgba(212,145,94,0.45),0_8px_24px_rgba(196,123,68,0.2),inset_0_1px_0_rgba(255,248,242,0.18)]"
              >
                {ctaLabel}
              </a>
              <p className="text-[11px] sm:text-xs text-white/45 font-museo-medium text-center md:text-left leading-snug">
                Prefer a deck or media kit? Mention your category in the email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
