import LegalPageLayout from "../components/LegalPageLayout";
import {
  AFFILIATE_DISCLOSURE_LINE,
  SUPPORT_EMAIL,
  TERMS_PAGE,
} from "../constants/legal";

export default function TermsPage() {
  return (
    <LegalPageLayout title={TERMS_PAGE.title} updated={TERMS_PAGE.updated}>
      <p className="text-base leading-relaxed text-[#F7F3FA]/85">
        {TERMS_PAGE.intro}
      </p>

      {TERMS_PAGE.sections.map((section) => (
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
          {section.heading === "Ticket purchases and third party sites" ? (
            <p className="mt-4 rounded-2xl border border-[#D6B26A]/25 bg-[#D6B26A]/10 px-5 py-4 text-base leading-relaxed text-[#F7E7C4]">
              {AFFILIATE_DISCLOSURE_LINE}{" "}
              <a
                href="/affiliate-disclosure"
                className="font-semibold text-[#D6B26A] underline-offset-2 hover:underline"
              >
                Affiliate disclosure
              </a>
            </p>
          ) : null}
        </section>
      ))}

      <p className="text-sm text-[#F7F3FA]/65">
        Questions?{" "}
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
