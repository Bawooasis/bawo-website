import { useState } from "react";
import Logo from "./components/Logo";
import WaitlistForm from "./components/WaitlistForm";
import { CONTENT } from "./constants/content";

function App() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleFoundingMember = () => {
    window.open("https://buy.stripe.com/fZu7sMgBBfgmeK2caf3Nm00", "_blank");
    const win = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof win.gtag !== "undefined") {
      win.gtag("event", "founding_member_click", {
        event_category: "conversion",
        event_label: "stripe_payment",
      });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#FAF9F6]">
      {/* Minimal Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-sm border-b border-[rgba(255,255,255,0.14)]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#solution"
              className="text-[rgba(250,249,246,0.82)] hover:text-[#FAF9F6] font-museo-regular text-sm transition-colors"
            >
              How it works
            </a>
            <a
              href="#founding"
              className="text-[rgba(250,249,246,0.82)] hover:text-[#FAF9F6] font-museo-regular text-sm transition-colors"
            >
              Founding
            </a>
            <a
              href="#faq"
              className="text-[rgba(250,249,246,0.82)] hover:text-[#FAF9F6] font-museo-regular text-sm transition-colors"
            >
              FAQ
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D] via-[#101114] to-[#14151A]"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-museo-bold leading-tight">
            {CONTENT.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-[rgba(250,249,246,0.82)] font-museo-regular max-w-2xl mx-auto leading-relaxed">
            {CONTENT.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="#waitlist"
              className="bg-[#F37021] hover:bg-[#FF8A42] text-[#FAF9F6] px-8 py-4 rounded-[100px] font-museo-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:ring-offset-2 focus:ring-offset-[#101114]"
            >
              {CONTENT.hero.ctaPrimary}
            </a>
            <button
              onClick={handleFoundingMember}
              className="border border-[rgba(255,255,255,0.14)] hover:border-[rgba(255,255,255,0.3)] text-[#FAF9F6] px-8 py-4 rounded-[100px] font-museo-regular text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(255,255,255,0.2)] focus:ring-offset-2 focus:ring-offset-[#101114]"
            >
              {CONTENT.hero.ctaSecondary}
            </button>
          </div>
          
          <p className="text-sm text-[rgba(250,249,246,0.6)] font-museo-regular pt-2">
            {CONTENT.hero.supportingLine}
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-24 md:py-32 px-6 bg-[#101114]">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-2xl md:text-3xl text-[rgba(250,249,246,0.82)] font-museo-regular leading-relaxed">
            {CONTENT.problem.description}
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="relative py-24 md:py-32 px-6 bg-[#14151A]">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-museo-bold text-center">
            {CONTENT.solution.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {CONTENT.solution.items.map((item, index) => (
              <div
                key={index}
                className="bg-[#161820] border border-[rgba(255,255,255,0.14)] rounded-lg p-6 space-y-2"
              >
                <h3 className="text-xl font-museo-semibold text-[#FAF9F6]">
                  {item.title}
                </h3>
                <p className="text-[rgba(250,249,246,0.82)] font-museo-regular">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section id="waitlist" className="relative py-24 md:py-32 px-6 bg-[#101114]">
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-museo-bold text-center">
            {CONTENT.waitlist.title}
          </h2>
          <WaitlistForm />
        </div>
      </section>

      {/* Founding Member Section */}
      <section id="founding" className="relative py-24 md:py-32 px-6 bg-[#14151A]">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-museo-bold">
              {CONTENT.foundingMember.title}
            </h2>
            <p className="text-lg text-[rgba(250,249,246,0.82)] font-museo-regular">
              {CONTENT.foundingMember.intro}
            </p>
            {CONTENT.foundingMember.showSpotsRemaining && (
              <p className="text-sm text-[rgba(250,249,246,0.6)] font-museo-regular">
                Only {CONTENT.foundingMember.spotsRemaining} spots left.
              </p>
            )}
          </div>

          <div className="bg-[#161820] border border-[rgba(255,255,255,0.14)] rounded-lg p-8 space-y-4">
            <ul className="space-y-3">
              {CONTENT.foundingMember.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#F37021] mt-1">•</span>
                  <span className="text-[rgba(250,249,246,0.82)] font-museo-regular">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleFoundingMember}
              className="w-full bg-[#F37021] hover:bg-[#FF8A42] text-[#FAF9F6] px-6 py-4 rounded-[100px] font-museo-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:ring-offset-2 focus:ring-offset-[#161820] mt-6"
            >
              {CONTENT.foundingMember.cta}
            </button>
          </div>
        </div>
      </section>

      {/* Trust Row */}
      <section className="relative py-16 px-6 bg-[#101114] border-t border-b border-[rgba(255,255,255,0.14)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-[rgba(250,249,246,0.82)] font-museo-regular text-sm md:text-base">
            {CONTENT.trust.items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[#F37021]">✓</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-24 md:py-32 px-6 bg-[#14151A]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-museo-bold text-center">
            {CONTENT.faq.title}
          </h2>
          <div className="space-y-4">
            {CONTENT.faq.items.map((item, index) => (
              <div
                key={index}
                className="bg-[#161820] border border-[rgba(255,255,255,0.14)] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:ring-inset"
                >
                  <span className="font-museo-semibold text-[#FAF9F6] pr-4">
                    {item.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[rgba(250,249,246,0.82)] transition-transform flex-shrink-0 ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-[rgba(250,249,246,0.82)] font-museo-regular leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 bg-[#0B0B0D] border-t border-[rgba(255,255,255,0.14)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="font-museo-bold text-lg text-[#FAF9F6] mb-1">
                {CONTENT.footer.brand}
              </div>
              <p className="text-sm text-[rgba(250,249,246,0.6)] font-museo-regular">
                {CONTENT.footer.tagline}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {CONTENT.footer.links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-[rgba(250,249,246,0.82)] hover:text-[#FAF9F6] font-museo-regular transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[rgba(255,255,255,0.14)] text-center">
            <p className="text-sm text-[rgba(250,249,246,0.6)] font-museo-regular">
              {CONTENT.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
