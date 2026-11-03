import SiteLogo from "../components/SiteLogo";
import {
  AFFILIATE_DISCLOSURE_LINE,
  AFFILIATE_DISCLOSURE_PAGE,
} from "../constants/legal";

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-[#0E0A14] text-[#F7F3FA]">
      <header className="border-b border-[#D6B26A]/20">
        <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-5">
          <SiteLogo
            onClick={(event) => {
              event.preventDefault();
              window.location.assign("/");
            }}
          />
          <a
            href="/"
            className="text-sm font-semibold text-[#F7E7C4]/80 transition-colors hover:text-[#D6B26A]"
          >
            Back to BawoSocial
          </a>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D6B26A]">
          Legal
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-[#F7F3FA] sm:text-5xl">
          {AFFILIATE_DISCLOSURE_PAGE.title}
        </h1>
        <p className="mt-3 text-sm text-[#F7F3FA]/65">
          Last updated: {AFFILIATE_DISCLOSURE_PAGE.updated}
        </p>

        <p className="mt-8 rounded-2xl border border-[#D6B26A]/25 bg-[#D6B26A]/10 px-5 py-4 text-base leading-relaxed text-[#F7E7C4]">
          {AFFILIATE_DISCLOSURE_LINE}
        </p>

        <p className="mt-8 text-base leading-relaxed text-[#F7F3FA]/85">
          {AFFILIATE_DISCLOSURE_PAGE.intro}
        </p>

        <div className="mt-10 space-y-8">
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
        </div>
      </main>

      <footer className="border-t border-[#D6B26A]/15 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-[#F7F3FA]/65">
          <p>{AFFILIATE_DISCLOSURE_LINE}</p>
          <p className="mt-3">
            <a href="/" className="text-[#D6B26A] hover:underline">
              joinbawo.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
