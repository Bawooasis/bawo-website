import LegalPageLayout from "../components/LegalPageLayout";
import {
  AFFILIATE_DISCLOSURE_LINE,
  PRIVACY_PAGE,
  SUPPORT_EMAIL,
} from "../constants/legal";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title={PRIVACY_PAGE.title} updated={PRIVACY_PAGE.updated}>
      <p className="text-base leading-relaxed text-[#F7F3FA]/85">
        {PRIVACY_PAGE.intro}
      </p>

      {PRIVACY_PAGE.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="font-display text-2xl font-bold text-[#F7F3FA]">
            {section.heading}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-3 text-base leading-relaxed text-[#F7F3FA]/80"
            >
              {paragraph}
            </p>
          ))}
          {section.bullets ? (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-[#F7F3FA]/80">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.heading === "Ticket links and affiliate tracking" ? (
            <p className="mt-4 rounded-2xl border border-[#D6B26A]/25 bg-[#D6B26A]/10 px-5 py-4 text-base leading-relaxed text-[#F7E7C4]">
              {AFFILIATE_DISCLOSURE_LINE}{" "}
              <a
                href="/affiliate-disclosure"
                className="font-semibold text-[#D6B26A] underline-offset-2 hover:underline"
              >
                Read the Affiliate disclosure
              </a>
              .
            </p>
          ) : null}
        </section>
      ))}

      <p className="text-sm text-[#F7F3FA]/65">
        Prefer email?{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-semibold text-[#D6B26A] hover:underline"
        >
          {SUPPORT_EMAIL}
        </a>
      </p>
    </LegalPageLayout>
  );
}
