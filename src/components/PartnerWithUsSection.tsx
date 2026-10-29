import { Building2, Handshake, Home, Package, Scale, Store } from "lucide-react";
import { CONTENT } from "../constants/content";

const audiences = [
  { label: "Nigerian restaurants, bukas & suya lounges", Icon: Home },
  { label: "Braiding salons, barbers, gele & fashion", Icon: Store },
  { label: "Immigration, legal, tax & healthcare pros", Icon: Scale },
  { label: "African food markets & Lagos/Abuja cargo", Icon: Package },
] as const;

export default function PartnerWithUsSection() {
  const { headline, body, ctaLabel, inquiryEmail, emailSubject } =
    CONTENT.partnerWithUs;
  const mailHref = `mailto:${inquiryEmail}?subject=${encodeURIComponent(emailSubject)}`;

  return (
    <section
      id="partner-with-us"
      className="relative bawo-section--tight bg-transparent"
      aria-labelledby="partner-with-us-heading"
    >
      <div className="relative z-10 container mx-auto px-5 sm:px-6 max-w-5xl">
        <div className="animate-on-scroll glass-card rounded-3xl p-7 sm:p-10">
          <div className="space-y-5 text-center sm:text-left">
            <div className="bawo-section-eyebrow mx-auto sm:mx-0 bg-[#E8B959]/12">
              <Handshake className="w-3.5 h-3.5" aria-hidden />
              BawoSocial for Nigerian Businesses in NYC
            </div>
            <h2
              id="partner-with-us-heading"
              className="bawo-section-title text-3xl sm:text-4xl md:text-[2.6rem]"
            >
              {headline}
            </h2>
            <p className="bawo-section-lead mx-auto sm:mx-0">
              {body}
            </p>

            <ul className="flex flex-wrap justify-center sm:justify-start gap-2.5 pt-1">
              {audiences.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="glass-pill inline-flex items-center gap-2 px-3.5 py-1.5 text-xs text-[#FFE8B3] font-semibold"
                >
                  <Icon className="w-3.5 h-3.5 text-[#E8B959] shrink-0" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
              <a
                href="/businesses"
                className="bawo-cta-premium inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full min-h-12 px-7 text-sm font-bold no-underline transition-transform hover:-translate-y-0.5"
              >
                <Building2 className="w-4 h-4 shrink-0 text-[#0E0A14]" aria-hidden />
                <span>{ctaLabel}</span>
              </a>
              <a
                href={mailHref}
                className="bawo-cta-outline inline-flex w-full sm:w-auto items-center justify-center rounded-full min-h-12 px-7 text-sm font-bold text-[#F7F3FA] no-underline transition-transform hover:-translate-y-0.5"
              >
                Contact partnerships
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
