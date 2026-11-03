import LegalPageLayout from "../components/LegalPageLayout";
import {
  AFFILIATE_DISCLOSURE_LINE,
  AFFILIATE_DISCLOSURE_PAGE,
} from "../constants/legal";

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageLayout
      title={AFFILIATE_DISCLOSURE_PAGE.title}
      updated={AFFILIATE_DISCLOSURE_PAGE.updated}
    >
      <p className="rounded-2xl border border-[#D6B26A]/25 bg-[#D6B26A]/10 px-5 py-4 text-base leading-relaxed text-[#F7E7C4]">
        {AFFILIATE_DISCLOSURE_LINE}
      </p>

      <p className="text-base leading-relaxed text-[#F7F3FA]/85">
        {AFFILIATE_DISCLOSURE_PAGE.intro}
      </p>

      {AFFILIATE_DISCLOSURE_PAGE.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="font-display text-2xl font-bold text-[#F7F3FA]">
            {section.heading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#F7F3FA]/80">
            {section.body}
          </p>
        </section>
      ))}
    </LegalPageLayout>
  );
}
