import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BadgeCheck, Building2, Calendar, Headphones, MapPin, Sparkles, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import BoroughNetworkGraphic from "./components/BoroughNetworkGraphic";
import BoroughSquareCarousel from "./components/BoroughSquareCarousel";
import CommunityCirclesSection from "./components/CommunityCirclesSection";
import CommunityMissionSection from "./components/CommunityMissionSection";
import FaqSection from "./components/FaqSection";
import FoundingMemberButton from "./components/FoundingMemberButton";
import HeroActionStack from "./components/HeroActionStack";
import HeroAppPreview from "./components/HeroAppPreview";
import HeroNextPreview from "./components/HeroNextPreview";
import HeroSecondaryBar from "./components/HeroSecondaryBar";
import MailchimpSignupRow from "./components/MailchimpSignupRow";
import MobileAppDownloadRow from "./components/MobileAppDownloadRow";
import PartnerWithUsSection from "./components/PartnerWithUsSection";
import SectionPillNav from "./components/SectionPillNav";
import HeroParticleField from "./components/ui/HeroParticleField";
import SiteHeader from "./components/SiteHeader";
import { TAILWIND_COLORS } from "./constants/colors";
import { CONTENT } from "./constants/content";
import { IMAGES } from "./constants/images";
import { scrollToWaitlist } from "./utils/scrollToWaitlist";

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

      heroTimeline
        .fromTo(
          headlineRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, clearProps: "transform" },
        )
        .fromTo(
          subheadlineRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, clearProps: "transform" },
          "-=0.55",
        )
        .fromTo(
          mockupRef.current,
          { x: 28, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.95, clearProps: "transform" },
          "-=0.65",
        )
        .fromTo(
          ctaRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, clearProps: "transform" },
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
              <Building2 className="h-3.5 w-3.5 text-[#E8B959] shrink-0" aria-hidden />
              <span>Businesses</span>
            </a>
            <a
              href={CONTENT.hero.testflightLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bawo-hero-cinematic__textlink"
            >
              Get the app
            </a>
            <button
              type="button"
              className="bawo-hero-cinematic__pill"
              onClick={scrollToWaitlist}
            >
              Join the waitlist
            </button>
            <button
              type="button"
              className="bawo-hero-cinematic__pill bawo-hero-cinematic__pill--solid"
              onClick={scrollToWaitlist}
            >
              Get started
            </button>
          </div>

          <div className="bawo-hero-cinematic__stage relative z-10 flex flex-col">
            <div className="bawo-hero-cinematic__main">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E8B959]/40 bg-[#1C132B]/75 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FFE8B3] backdrop-blur-xl mb-1">
                <Sparkles className="h-3.5 w-3.5 text-[#E8B959]" aria-hidden />
                <span>BawoSocial · The Culture Hub for Nigerians in NYC</span>
              </div>
              <h1 ref={headlineRef} className="bawo-hero-cinematic__title font-display">
                {CONTENT.hero.title.lead}
                <span className="bawo-hero-neon">{CONTENT.hero.title.highlight}</span>
              </h1>
              <div ref={mockupRef} className="bawo-hero-cinematic__phone">
                <HeroAppPreview className="bawo-hero-mockup--compact" />
              </div>
            </div>

            <div className="bawo-hero-cinematic__footer">
              <p ref={subheadlineRef} className="bawo-hero-cinematic__copy">
                {CONTENT.hero.subtitle}
              </p>
              <div ref={ctaRef} className="bawo-hero-cinematic__footer-actions">
                <a href="#community-circles" className="bawo-hero-cinematic__pill">
                  Nigerian Circles
                </a>
                <a href="#events" className="bawo-hero-cinematic__pill">
                  Afrobeats & Events
                </a>
                <a href="/businesses" className="bawo-hero-cinematic__pill bawo-hero-cinematic__pill--business">
                  <Building2 className="h-3.5 w-3.5 text-[#E8B959]" aria-hidden />
                  <span>For Businesses</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-transparent py-16 md:py-24 overflow-x-clip">
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl w-full">
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <MobileAppDownloadRow className="self-center" />
            </div>

            <div className="mt-10 w-full space-y-5 sm:space-y-6">
              <div className="bawo-hero-cta-block">
                <HeroActionStack onJoinClick={scrollToWaitlist} />
              </div>

              <SectionPillNav />

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

        {/* Building the Network — section 2 (borough hubs + Live NYC Borough Pulse) */}
        <section
          ref={globalReachRef}
          id="building-the-network"
          className="relative bawo-scroll-anchor bg-transparent py-20 md:py-[5rem] overflow-x-hidden section-contain"
        >
          <div className="relative z-10 container mx-auto px-5 sm:px-6 py-12 md:py-14">
            <div className="text-center space-y-8 md:space-y-12 max-w-[1400px] mx-auto">
              <div className="space-y-5 md:space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E8B959]/35 bg-[#1C132B]/75 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E8B959] backdrop-blur-xl">
                  <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
                  <span>Live NYC Borough Pulse · 5 Boroughs + NJ Corridor</span>
                </div>
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#F7F3FA] font-display leading-[1.04] tracking-tight">
                  {CONTENT.globalReach.title}
                </h2>
                <p className="text-xl sm:text-2xl md:text-3xl font-medium text-[#F7F3FA]/85 max-w-4xl mx-auto leading-snug">
                  {CONTENT.globalReach.subtitle}
                </p>
                <p className="text-base sm:text-lg md:text-xl font-medium text-[#FFE8B3] max-w-3xl mx-auto leading-relaxed">
                  {CONTENT.globalReach.description}
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[1100px] min-h-[360px] sm:min-h-[420px] md:min-h-[520px] lg:min-h-[580px] mt-8 md:mt-12">
                <BoroughNetworkGraphic className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full opacity-[0.94] md:block [mask-image:radial-gradient(ellipse_88%_78%_at_50%_48%,#000_32%,transparent_72%)]" />
                <div className="relative z-[1] flex flex-col items-stretch gap-10 sm:gap-12 md:gap-16 lg:gap-20 pt-2 pb-4 md:pt-4 md:pb-8">
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-10 justify-items-center w-full">
                    {CONTENT.globalReach.cities
                      .slice(0, 3)
                      .map((city, index) => {
                        const rotatingGallery =
                          city.name === "Brooklyn"
                            ? IMAGES.globalReach.brooklynGallery
                            : city.name === "Harlem"
                              ? IMAGES.globalReach.harlemGallery
                              : city.name === "Queens"
                                ? IMAGES.globalReach.queensGallery
                                : null;
                        return (
                          <div
                            key={city.name}
                            className="city-stat text-center space-y-3 md:space-y-4 w-full max-w-[12rem] mx-auto"
                          >
                            {rotatingGallery ? (
                              <div className="bawo-hub-ring relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 mx-auto overflow-hidden rounded-full shadow-[0_20px_48px_rgba(0,0,0,0.65)] ring-1 ring-[#E8B959]/35 transition-transform duration-300 hover:scale-[1.04] hover:ring-[#E8B959]/75">
                                <BoroughSquareCarousel
                                  images={rotatingGallery}
                                  alt={`${city.name} Nigerian community hub, BawoSocial NYC`}
                                  rotationStaggerMs={index * 700}
                                />
                              </div>
                            ) : (
                              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 mx-auto bg-gradient-to-br from-[#FFCF6B] to-[#C9922C] rounded-full flex items-center justify-center shadow-[0_20px_48px_rgba(0,0,0,0.65)] overflow-hidden hover:scale-[1.04] transition-transform duration-300">
                                <img
                                  src={IMAGES.globalReach.cities[index]}
                                  alt={city.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="mt-1">
                              <h3 className="font-bold text-[#F7F3FA] text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.12em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.65)]">
                                {city.name.toUpperCase()}
                              </h3>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:mx-auto sm:max-w-xl md:max-w-3xl md:grid-cols-2 md:gap-10 lg:gap-12 justify-items-center w-full px-2 sm:px-4">
                    {CONTENT.globalReach.cities.slice(3).map((city, index) => {
                      const i = index + 3;
                      const rotatingGallery =
                        city.name === "The Bronx"
                          ? IMAGES.globalReach.bronxGallery
                          : city.name === "Staten Island"
                            ? IMAGES.globalReach.statenIslandGallery
                            : null;
                      return (
                        <div
                          key={city.name}
                          className="city-stat text-center space-y-3 md:space-y-4 w-full max-w-[12rem] mx-auto"
                        >
                          {rotatingGallery ? (
                            <div className="bawo-hub-ring relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 mx-auto overflow-hidden rounded-full shadow-[0_20px_48px_rgba(0,0,0,0.65)] ring-1 ring-[#E8B959]/35 transition-transform duration-300 hover:scale-[1.04] hover:ring-[#E8B959]/75">
                              <BoroughSquareCarousel
                                images={rotatingGallery}
                                alt={`${city.name} Nigerian community hub, BawoSocial NYC`}
                                rotationStaggerMs={i * 700}
                              />
                            </div>
                          ) : (
                            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 mx-auto bg-gradient-to-br from-[#FFCF6B] to-[#C9922C] rounded-full flex items-center justify-center shadow-[0_20px_48px_rgba(0,0,0,0.65)] overflow-hidden hover:scale-[1.04] transition-transform duration-300">
                              <img
                                src={IMAGES.globalReach.cities[i]}
                                alt={city.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="mt-1">
                            <h3 className="font-bold text-[#F7F3FA] text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.12em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.65)]">
                              {city.name.toUpperCase()}
                            </h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Live NYC Borough Pulse Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-6 text-left max-w-6xl mx-auto">
                {CONTENT.boroughPulse.map((b) => (
                  <div
                    key={b.name}
                    className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-3 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#E8B959]">
                          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" aria-hidden />
                          {b.spotsCount}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-display text-[#F7F3FA]">
                        {b.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#FFCF6B]/90">
                        {b.tag}
                      </p>
                    </div>
                    <p className="text-xs text-[#F7F3FA]/75 leading-relaxed">
                      {b.highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="relative bg-transparent space-y-16 md:space-y-20 pt-12 md:pt-16 pb-6 md:pb-10 section-contain">
          <CommunityMissionSection />
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
                        <span className="text-[#E8B959] font-bold">
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

        {/* Early Access — TestFlight + waitlist */}
        <section
          ref={earlyAccessRef}
          id="early-access"
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
                <p className="text-xs sm:text-sm md:text-base font-bold text-[#FFE8B3] uppercase tracking-wider">
                  {CONTENT.earlyAccess.subtitle}
                </p>
              </div>

              <ul className="space-y-4">
                {CONTENT.earlyAccess.benefits.map((benefit) => (
                  <li key={benefit.title} className="glass-card flex items-start gap-3.5 p-5 sm:p-6">
                    <BadgeCheck
                      className="w-5 h-5 text-[#E8B959] flex-shrink-0 mt-0.5"
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

              <p className="text-sm text-[#FFE8B3]/80 font-medium text-center leading-relaxed">
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

        {/* Event Highlights Section */}
        <section
          id="events"
          className="relative bawo-scroll-anchor py-24 bg-transparent"
        >
          <div className="relative z-10 container mx-auto px-6">
            <h2 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold font-display text-[#F7F3FA] mb-12">
              {CONTENT.events.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {CONTENT.events.items.map((event) => {
                const Icon =
                  event.icon === "calendar"
                    ? Calendar
                    : event.icon === "headphones"
                      ? Headphones
                      : Star;
                return (
                  <div
                    key={event.title}
                    className="glass-card p-7 text-[#F7F3FA] space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8B959]/35 bg-[#E8B959]/15 text-[#E8B959]">
                        <Icon className="w-5 h-5" />
                      </span>
                      <h3 className="font-display text-2xl font-bold text-[#F7F3FA] leading-snug">
                        {event.title}
                      </h3>
                    </div>
                    <p className="text-[#F7F3FA]/80 text-sm sm:text-base leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                );
              })}
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
                      className="glass-pill px-4 py-1.5 text-[#FFE8B3] text-xs sm:text-sm font-semibold"
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
                  <span>Businesses Sign In</span>
                </a>
              </div>

              <div className="flex items-center gap-4 max-w-2xl mx-auto w-full">
                <span className="flex-1 h-px bg-[#E8B959]/25" aria-hidden />
                <span className="text-[#FFE8B3]/75 font-bold text-xs uppercase tracking-wider px-2">
                  Or join the waitlist
                </span>
                <span className="flex-1 h-px bg-[#E8B959]/25" aria-hidden />
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
          <div className="md:hidden mobile-sticky-cta bg-[#0E0A14]/92 backdrop-blur-xl border-t border-[#E8B959]/25">
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex flex-col min-w-0 gap-0.5">
                <span className="text-[#F7F3FA] font-bold text-sm">BawoSocial NYC</span>
                <span className="text-[#FFE8B3]/75 font-medium text-[10px] uppercase tracking-wider">
                  TestFlight · Businesses
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <FoundingMemberButton
                  label="TestFlight"
                  variant="primary"
                  size="sm"
                  className="max-w-[7.5rem]"
                  onClick={() => {
                    window.open(
                      CONTENT.hero.testflightLink,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                />
                <FoundingMemberButton
                  label="Businesses"
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
                <h3 className="text-[#F7F3FA] font-display text-2xl font-bold mb-3">BawoSocial</h3>
                <p className="text-[#F7F3FA]/75 text-sm mb-4 leading-relaxed">
                  {CONTENT.footer.tagline}
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  <a
                    href="https://www.instagram.com/bawo.social/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-[#FFE8B3]/75 hover:text-[#E8B959] text-sm font-semibold"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.tiktok.com/@bawosocial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-[#FFE8B3]/75 hover:text-[#E8B959] text-sm font-semibold"
                  >
                    TikTok
                  </a>
                  <a
                    href="https://linkedin.com/company/bawoapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-[#FFE8B3]/75 hover:text-[#E8B959] text-sm font-semibold"
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
                      className="flex min-h-10 items-center justify-center text-[#F7F3FA]/80 hover:text-[#E8B959] text-sm font-medium md:justify-start"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Legal */}
              <div className="text-center md:text-left">
                <h3 className="text-[#F7F3FA] font-display text-xl font-bold mb-3">
                  {CONTENT.footer.sections.legal.title}
                </h3>
                <div className="space-y-1.5">
                  {CONTENT.footer.sections.legal.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex min-h-10 items-center justify-center text-[#F7F3FA]/80 hover:text-[#E8B959] text-sm font-medium md:justify-start"
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="/admin"
                    className="flex min-h-10 items-center justify-center text-[#F7F3FA]/50 hover:text-[#E8B959] text-xs font-medium md:justify-start"
                  >
                    Platform access
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#E8B959]/15 pt-8 text-center">
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
