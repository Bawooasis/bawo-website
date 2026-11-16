import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BadgeCheck, Building2, MapPin, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import BoroughNetworkGraphic from "./components/BoroughNetworkGraphic";
import CommunityCirclesSection from "./components/CommunityCirclesSection";
import CommunityMissionSection from "./components/CommunityMissionSection";
import ExplorePhonesSection from "./components/ExplorePhonesSection";
import FaqSection from "./components/FaqSection";
import FoundingMemberButton from "./components/FoundingMemberButton";
import HeroAppPreview from "./components/HeroAppPreview";
import HeroNextPreview from "./components/HeroNextPreview";
import HeroSecondaryBar from "./components/HeroSecondaryBar";
import MailchimpSignupRow from "./components/MailchimpSignupRow";
import MobileAppDownloadRow from "./components/MobileAppDownloadRow";
import PartnerWithUsSection from "./components/PartnerWithUsSection";
import HeroParticleField from "./components/ui/HeroParticleField";
import SiteHeader from "./components/SiteHeader";
import SiteLogo from "./components/SiteLogo";
import { TAILWIND_COLORS } from "./constants/colors";
import { CONTENT } from "./constants/content";
import { IMAGES } from "./constants/images";
import { AFFILIATE_DISCLOSURE_LINE } from "./constants/legal";
import { scrollToWaitlist } from "./utils/scrollToWaitlist";

const BOROUGH_NODE_IMAGES = [
  IMAGES.globalReach.brooklyn,
  IMAGES.globalReach.harlem,
  IMAGES.globalReach.queens,
  IMAGES.globalReach.bronx,
  IMAGES.globalReach.statenIsland,
  IMAGES.globalReach.newJersey,
] as const;

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {

  // Animation refs
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadlineRef = useRef(null);
  const ctaRef = useRef(null);
  const mockupRef = useRef(null);
  const earlyAccessRef = useRef(null);
  const featuresRef = useRef(null);
  const globalReachRef = useRef(null);
  const finalCtaRef = useRef(null);

  // Animation setup
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    ScrollTrigger.config({ limitCallbacks: true });

    const ctx = gsap.context(() => {
      // Hero entrance — staggered, transform-only where possible for 60fps
      const heroTimeline = gsap.timeline({
        defaults: { ease: "power2.out", force3D: true },
      });

      // Transform-only entrance — keep opacity at 1 so first paint / hydration
      // never blanks the hero behind a solid canvas flash.
      heroTimeline
        .from(headlineRef.current, {
          y: 16,
          duration: 0.9,
          clearProps: "transform",
          immediateRender: false,
        })
        .from(
          subheadlineRef.current,
          {
            y: 10,
            duration: 0.75,
            clearProps: "transform",
            immediateRender: false,
          },
          "-=0.55",
        )
        .from(
          mockupRef.current,
          {
            x: 20,
            duration: 0.95,
            clearProps: "transform",
            immediateRender: false,
          },
          "-=0.65",
        )
        .from(
          ctaRef.current,
          {
            y: 10,
            duration: 0.7,
            clearProps: "transform",
            immediateRender: false,
          },
          "-=0.35",
        );

      // Scroll-triggered batch — opacity + translateY only (GPU composited)
      gsap.set(".animate-on-scroll", { opacity: 0, y: 20 });
      ScrollTrigger.batch(".animate-on-scroll", {
        interval: 0.15,
        batchMax: 4,
        start: "top 92%",
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: "power2.out",
            force3D: true,
            overwrite: true,
            clearProps: "transform",
          }),
      });

      // Feature cards — single trigger, play once (no reverse jank on scroll-up)
      gsap.fromTo(
        "#features .feature-card",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
          force3D: true,
          clearProps: "transform",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 85%",
            once: true,
            fastScrollEnd: true,
          },
        },
      );

      // Borough tiles — single trigger, play once
      gsap.fromTo(
        ".city-stat",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          force3D: true,
          clearProps: "transform",
          scrollTrigger: {
            trigger: globalReachRef.current,
            start: "top 85%",
            once: true,
            fastScrollEnd: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 bawo-page-bg-base" aria-hidden />
      <HeroParticleField className="bawo-particle-field--site" />

      <SiteHeader onJoinClick={scrollToWaitlist} />

      <div className="bawo-page-shell relative z-10 bg-transparent min-h-screen overflow-x-clip pb-[var(--bawo-mobile-sticky-cta-height)] md:pb-0">
        {/* Hero — cinematic particle field */}
        <section
          ref={heroRef}
          className="bawo-hero-section bawo-hero-cinematic relative flex min-h-[100dvh] flex-col overflow-hidden"
        >
          <div className="bawo-hero-cinematic__shade" aria-hidden />

          <div className="bawo-hero-cinematic__top">
            <a
              href="/businesses"
              className="bawo-hero-cinematic__pill bawo-hero-cinematic__pill--business"
            >
              <Building2 className="h-3.5 w-3.5 text-[#D6B26A] shrink-0" aria-hidden />
              <span>Partner with us</span>
            </a>
            <button
              type="button"
              className="bawo-hero-cinematic__pill bawo-hero-cinematic__pill--solid"
              onClick={scrollToWaitlist}
            >
              Join BawoSocial
            </button>
          </div>

          <div className="bawo-hero-cinematic__stage relative z-10 flex flex-col">
            <div className="bawo-hero-cinematic__main">
              <div className="bawo-hero-cinematic__copy-col">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B26A]/40 bg-[#1C132B]/75 px-3.5 py-1.5 text-sm font-bold tracking-wide text-[#F7E7C4] backdrop-blur-xl mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#D6B26A]" aria-hidden />
                  <span>BawoSocial · The Culture Hub for Nigerians in NYC</span>
                </div>
                <h1 ref={headlineRef} className="bawo-hero-cinematic__title font-display">
                  {CONTENT.hero.title.lead}
                  <span className="bawo-hero-neon">{CONTENT.hero.title.highlight}</span>
                </h1>
                <p ref={subheadlineRef} className="bawo-hero-cinematic__copy">
                  {CONTENT.hero.subtitle}
                </p>
                <div ref={ctaRef} className="bawo-hero-cinematic__footer-actions">
                  <a href="#community-circles" className="bawo-hero-cinematic__pill">
                    Nigerian Circles
                  </a>
                  <a href="#community-circles" className="bawo-hero-cinematic__pill">
                    Afrobeats & Events
                  </a>
                  <a href="/businesses" className="bawo-hero-cinematic__pill bawo-hero-cinematic__pill--business">
                    <Building2 className="h-3.5 w-3.5 text-[#D6B26A]" aria-hidden />
                    <span>Partner with us</span>
                  </a>
                </div>
              </div>
              <div ref={mockupRef} className="bawo-hero-cinematic__phone">
                <HeroAppPreview className="bawo-hero-mockup--compact" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-transparent py-16 md:py-24 overflow-x-clip">
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl w-full">
            <div className="w-full space-y-5 sm:space-y-6">
              <HeroNextPreview />

              <div
                className="w-full max-w-[22rem] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto bawo-hero-share-strip"
                aria-label="Secondary actions"
              >
                <HeroSecondaryBar layout="strip" />
              </div>
            </div>
          </div>
        </section>

        <CommunityCirclesSection />

        <ExplorePhonesSection />

        {/* Building the Network — compact full-viewport borough map (6 hubs) */}
        <section
          ref={globalReachRef}
          id="building-the-network"
          className="relative bawo-scroll-anchor bawo-scene bawo-scene--network bg-transparent overflow-x-hidden section-contain"
        >
          <div className="relative z-10 container mx-auto px-5 sm:px-6 h-full flex flex-col justify-center py-6 md:py-8">
            <div className="text-center space-y-4 md:space-y-5 max-w-[1400px] mx-auto w-full">
              <div className="space-y-3 md:space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B26A]/35 bg-[#1C132B]/75 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-[#D6B26A] backdrop-blur-xl">
                  <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
                  <span>Live NYC Borough Pulse · 5 Boroughs + NJ Corridor</span>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F7F3FA] font-display leading-[1.05] tracking-tight">
                  {CONTENT.globalReach.title}
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#F7F3FA]/85 max-w-3xl mx-auto leading-snug">
                  {CONTENT.globalReach.subtitle}
                </p>
                <p className="text-sm sm:text-base md:text-lg font-medium text-[#F7E7C4] max-w-3xl mx-auto leading-relaxed">
                  {CONTENT.globalReach.description}
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[980px] mt-3 md:mt-4">
                <BoroughNetworkGraphic className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full opacity-[0.94] md:block [mask-image:radial-gradient(ellipse_88%_78%_at_50%_48%,#000_32%,transparent_72%)]" />
                <div className="relative z-[1] flex flex-col items-stretch gap-5 sm:gap-6 md:gap-8 pt-1 pb-2">
                  {[0, 3].map((start) => (
                    <div
                      key={start}
                      className="grid grid-cols-3 gap-3 sm:gap-5 md:gap-8 justify-items-center w-full"
                    >
                      {CONTENT.globalReach.cities.slice(start, start + 3).map((city, offset) => {
                        const index = start + offset;
                        return (
                          <div
                            key={city.name}
                            className="city-stat animate-on-scroll text-center space-y-2 w-full max-w-[10.5rem] sm:max-w-[11.5rem] mx-auto"
                          >
                            <div className="bawo-hub-ring relative w-[4.75rem] h-[4.75rem] sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto overflow-hidden rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.65)] ring-1 ring-[#D6B26A]/35 transition-transform duration-300 hover:scale-[1.04] hover:ring-[#D6B26A]/75">
                              <img
                                src={BOROUGH_NODE_IMAGES[index]}
                                alt={`${city.name} hub, BawoSocial NYC`}
                                className="h-full w-full object-cover"
                                loading={index < 3 ? "eager" : "lazy"}
                                decoding="async"
                              />
                            </div>
                            <h3 className="font-bold text-[#F7F3FA] text-[0.7rem] sm:text-sm md:text-base tracking-[0.1em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.65)]">
                              {city.name.toUpperCase()}
                            </h3>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <CommunityMissionSection />

        <div className="relative bg-transparent pt-6 md:pt-8 pb-6 md:pb-10 section-contain">
          <div className="relative z-10">
            <PartnerWithUsSection />
          </div>
        </div>

        {/* Origin Story Section – structured block with clear hierarchy */}
        <section
          id="about"
          className="relative bawo-scroll-anchor flex items-center justify-center bg-transparent py-20 md:py-28"
        >
          <div className="relative z-10 container mx-auto px-6 flex flex-col items-center">
            <div className="text-[#F7F3FA] space-y-12 w-full max-w-4xl mx-auto glass-card rounded-3xl p-8 sm:p-12 md:p-16">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold font-display leading-tight text-center tracking-tight">
                {CONTENT.origin.title.lead}
                <span className="bawo-text-cta-gradient">
                  {CONTENT.origin.title.highlight}
                </span>
                {CONTENT.origin.title.closing}
              </h2>
              <div className="mx-auto max-w-3xl space-y-7 text-left">
                {CONTENT.origin.paragraphs.map((paragraph) => (
                  <p
                    key={
                      typeof paragraph === "string"
                        ? paragraph.slice(0, 32)
                        : paragraph.highlight
                    }
                    className="text-[#F7F3FA]/90 text-lg sm:text-xl md:text-2xl leading-relaxed md:leading-[1.8]"
                  >
                    {typeof paragraph === "string" ? (
                      paragraph
                    ) : (
                      <>
                        <span className="text-[#D6B26A] font-bold">
                          {paragraph.highlight}
                        </span>
                        {paragraph.text}
                      </>
                    )}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Join BawoSocial — on-site signup */}
        <section
          ref={earlyAccessRef}
          id="join"
          className="relative bawo-scroll-anchor bg-transparent py-20 md:py-28"
        >
          <div className="relative z-10 container mx-auto px-6 py-12 md:py-16 max-w-2xl">
            <div className="space-y-10 text-[#F7F3FA]">
              <div className="space-y-3 text-center">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display leading-tight">
                  {CONTENT.earlyAccess.title}{" "}
                  <span className="bawo-text-cta-gradient">
                    {CONTENT.earlyAccess.titleHighlight}
                  </span>
                </h2>
                <p className="text-sm md:text-base font-bold text-[#F7E7C4] uppercase tracking-wider">
                  {CONTENT.earlyAccess.subtitle}
                </p>
              </div>

              <ul className="space-y-4">
                {CONTENT.earlyAccess.benefits.map((benefit) => (
                  <li key={benefit.title} className="glass-card flex items-start gap-3.5 p-5 sm:p-6">
                    <BadgeCheck
                      className="w-5 h-5 text-[#D6B26A] flex-shrink-0 mt-0.5"
                      strokeWidth={2.25}
                      aria-hidden
                    />
                    <div>
                      <p className="font-display font-bold text-xl text-[#F7F3FA]">
                        {benefit.title}
                      </p>
                      <p className="text-sm text-[#F7F3FA]/75 mt-1 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-[#F7E7C4]/80 font-medium text-center leading-relaxed">
                {CONTENT.earlyAccess.missionText}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <MobileAppDownloadRow className="items-stretch sm:max-w-[19.5rem]" />
                <FoundingMemberButton
                  label={CONTENT.earlyAccess.cta}
                  variant="primary"
                  appearance="outline"
                  size="md"
                  className="min-w-[14rem]"
                  onClick={scrollToWaitlist}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section – 3-column cards with icons */}
        <section
          ref={featuresRef}
          id="features"
          className="relative bawo-scroll-anchor flex items-center justify-center bg-transparent py-20 md:py-28 section-contain"
        >
          <div className="relative z-10 text-[#F7F3FA] px-6 md:px-10 max-w-7xl py-12 md:py-16 mx-auto w-full">
            <h2
              className={`text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-16 ${TAILWIND_COLORS.primary.text} font-display`}
            >
              {CONTENT.features.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
              {CONTENT.features.items.map((item) => (
                <div
                  key={item.title}
                  className="feature-card glass-card space-y-3 p-7 text-center md:text-left"
                >
                  <h3 className="text-2xl md:text-3xl font-bold font-display text-[#F7F3FA]">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-[#F7F3FA]/80">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          ref={finalCtaRef}
          id="email-section"
          className="relative bawo-scroll-anchor flex items-center justify-center bg-transparent py-20 md:py-28 section-contain"
        >
          <div className="relative z-10 container mx-auto px-6 py-12 md:py-16">
            <div className="text-center space-y-10 max-w-3xl mx-auto glass-card rounded-3xl p-8 sm:p-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F7F3FA] font-display leading-tight">
                  {CONTENT.finalCta.title}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-[#F7F3FA]/80">
                  {CONTENT.finalCta.subtitle}
                </p>
                {/* Borough tags */}
                <div className="flex flex-wrap justify-center gap-2.5 pt-3">
                  {CONTENT.globalReach.cities.map((city) => (
                    <span
                      key={city.name}
                      className="glass-pill px-4 py-1.5 text-[#F7E7C4] text-sm font-semibold"
                    >
                      {city.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-2xl mx-auto">
                <MobileAppDownloadRow className="items-stretch sm:max-w-[19.5rem]" />
                <a
                  href="/businesses"
                  className="bawo-cta-premium inline-flex min-h-[48px] w-full max-w-[19.5rem] sm:w-auto items-center justify-center gap-2 rounded-full px-7 text-sm font-bold no-underline transition-transform hover:-translate-y-0.5"
                >
                  <Building2 className="h-4 w-4 shrink-0 text-[#0E0A14]" aria-hidden />
                  <span>Partner with us</span>
                </a>
              </div>

              <div className="flex items-center gap-4 max-w-2xl mx-auto w-full">
                <span className="flex-1 h-px bg-[#D6B26A]/25" aria-hidden />
                <span className="text-[#F7E7C4]/75 font-bold text-sm uppercase tracking-wider px-2">
                  Or leave your email
                </span>
                <span className="flex-1 h-px bg-[#D6B26A]/25" aria-hidden />
              </div>

              <MailchimpSignupRow
                className="relative w-full max-w-2xl mx-auto"
                buttonLabel={CONTENT.finalCta.ctaSecondary}
              />
            </div>
          </div>
        </section>

        <FaqSection />

        {/* Footer */}
        <footer className="py-12 bg-transparent">
          {/* Mobile Sticky CTA */}
          <div className="md:hidden mobile-sticky-cta bg-[#0E0A14]/92 backdrop-blur-xl border-t border-[#D6B26A]/25">
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex flex-col min-w-0 gap-0.5">
                <span className="text-[#F7F3FA] font-bold text-sm">BawoSocial NYC</span>
                <span className="text-[#F7E7C4]/75 font-medium text-sm uppercase tracking-wider">
                  Join · Partner with us
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <FoundingMemberButton
                  label="Join"
                  variant="primary"
                  size="sm"
                  className="max-w-[7.5rem]"
                  onClick={scrollToWaitlist}
                />
                <FoundingMemberButton
                  label="Partner"
                  variant="primary"
                  appearance="outline"
                  size="sm"
                  className="max-w-[7.5rem]"
                  onClick={() => {
                    window.location.assign("/businesses");
                  }}
                />
              </div>
            </div>
          </div>
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Company Info */}
              <div className="text-center md:text-left">
                <div className="mb-3 flex justify-center md:justify-start">
                  <SiteLogo
                    className="bawo-site-footer__logo"
                    onClick={(event) => {
                      event.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </div>
                <p className="text-[#F7F3FA]/75 text-sm mb-4 leading-relaxed">
                  {CONTENT.footer.tagline}
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  <a
                    href="https://www.instagram.com/bawo.social/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-[#F7E7C4]/75 hover:text-[#D6B26A] text-sm font-semibold"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.tiktok.com/@bawosocial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-[#F7E7C4]/75 hover:text-[#D6B26A] text-sm font-semibold"
                  >
                    TikTok
                  </a>
                  <a
                    href="https://linkedin.com/company/bawoapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-[#F7E7C4]/75 hover:text-[#D6B26A] text-sm font-semibold"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="text-center md:text-left">
                <h3 className="text-[#F7F3FA] font-display text-xl font-bold mb-3">
                  {CONTENT.footer.sections.quickLinks.title}
                </h3>
                <div className="space-y-1.5">
                  {CONTENT.footer.sections.quickLinks.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex min-h-10 items-center justify-center text-[#F7F3FA]/80 hover:text-[#D6B26A] text-sm font-medium md:justify-start"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Legal */}
              <div className="text-center md:text-left">
                <h3 className="text-[#F7F3FA] font-display text-xl font-bold mb-3">Legal</h3>
                <div className="space-y-1.5">
                  {[
                    { label: "Privacy Policy", href: "/privacy" },
                    { label: "Terms of Service", href: "/terms" },
                    { label: "Support", href: "/support" },
                    { label: "Affiliate disclosure", href: "/affiliate-disclosure" },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex min-h-10 items-center justify-center text-[#F7F3FA]/80 hover:text-[#D6B26A] text-sm font-medium md:justify-start"
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="/admin"
                    className="flex min-h-10 items-center justify-center text-[#F7F3FA]/50 hover:text-[#D6B26A] text-sm font-medium md:justify-start"
                  >
                    Platform access
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#D6B26A]/15 pt-8 text-center space-y-3">
              <p className="text-[#F7E7C4]/70 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto">
                {AFFILIATE_DISCLOSURE_LINE}{" "}
                <a
                  href="/affiliate-disclosure"
                  className="font-semibold text-[#D6B26A] underline-offset-2 hover:underline"
                >
                  Affiliate disclosure
                </a>
              </p>
              <p className="text-[#F7F3FA]/65 text-sm">
                {CONTENT.footer.copyright}
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;
