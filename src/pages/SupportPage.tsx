import LegalPageLayout from "../components/LegalPageLayout";
import { SUPPORT_EMAIL, SUPPORT_PAGE } from "../constants/legal";

export default function SupportPage() {
  return (
    <LegalPageLayout
      kicker="Help"
      title={SUPPORT_PAGE.title}
      updated={SUPPORT_PAGE.updated}
    >
      <p className="text-base leading-relaxed text-[#F7F3FA]/85">
        {SUPPORT_PAGE.intro}
      </p>

      <div className="rounded-2xl border border-[#D6B26A]/25 bg-[#D6B26A]/10 px-5 py-5">
        <p className="text-base leading-relaxed text-[#F7E7C4]">
          {SUPPORT_PAGE.emailPrompt}
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#D6B26A] px-5 text-sm font-bold text-[#0E0A14] transition-transform hover:-translate-y-0.5"
        >
          Email {SUPPORT_EMAIL}
        </a>
      </div>

      <section>
        <h2 className="font-display text-2xl font-bold text-[#F7F3FA]">FAQ</h2>
        <div className="mt-6 space-y-6">
          {SUPPORT_PAGE.faqs.map((faq) => (
            <article key={faq.question}>
              <h3 className="text-lg font-bold text-[#F7F3FA]">{faq.question}</h3>
              <p className="mt-2 text-base leading-relaxed text-[#F7F3FA]/80">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-2 text-sm text-[#F7F3FA]/70">
        <p>
          Related:{" "}
          <a href="/privacy" className="text-[#D6B26A] hover:underline">
            Privacy Policy
          </a>
          ,{" "}
          <a href="/terms" className="text-[#D6B26A] hover:underline">
            Terms of Service
          </a>
          ,{" "}
          <a href="/affiliate-disclosure" className="text-[#D6B26A] hover:underline">
            Affiliate disclosure
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
