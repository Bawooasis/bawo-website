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
        <div className="animate-on-scroll glass-card rounded-2xl p-6 sm:p-8 border border-bawo-eggplant-light/40">
          <div className="space-y-5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-bawo-pumpkin/30 bg-bawo-eggplant/40 px-3 py-1.5 text-xs font-museo-bold uppercase tracking-wider bawo-accent-soft">
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
                  className="inline-flex items-center gap-2 rounded-full border border-bawo-eggplant-light/35 bg-bawo-eggplant/25 px-3 py-1.5 text-xs text-white/85 font-museo-medium"
                >
                  <Icon className="w-3.5 h-3.5 bawo-accent-soft shrink-0" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/business"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-[var(--bawo-radius-pill)] min-h-11 px-6 text-sm font-museo-bold text-bawo-eggplant border border-bawo-peach/45 bg-bawo-pumpkin transition-colors hover:bg-bawo-peach"
              >
                {ctaLabel}
              </a>
              <a
                href={mailHref}
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-[var(--bawo-radius-pill)] min-h-11 px-6 text-sm font-museo-bold text-white border border-bawo-pumpkin/30 bg-bawo-eggplant/25 transition-colors hover:bg-bawo-eggplant-light/45"
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
