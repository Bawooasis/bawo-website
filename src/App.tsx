import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BadgeCheck,
  Calendar,
  Headphones,
  Star,
} from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import BoroughNetworkGraphic from "./components/BoroughNetworkGraphic";
import BoroughSquareCarousel from "./components/BoroughSquareCarousel";
import FoundingMemberButton from "./components/FoundingMemberButton";
import HeroActionStack from "./components/HeroActionStack";
import HeroSecondaryBar from "./components/HeroSecondaryBar";
import MobileAppDownloadRow from "./components/MobileAppDownloadRow";
import FaqSection from "./components/FaqSection";
import FoundingMemberCheckoutCard from "./components/FoundingMemberCheckoutCard";
import FoundingMemberModal from "./components/FoundingMemberModal";
import CommunityMissionSection from "./components/CommunityMissionSection";
import MailchimpSignupRow from "./components/MailchimpSignupRow";
import PartnerWithUsSection from "./components/PartnerWithUsSection";
import BatchCountdownDisplay from "./components/BatchCountdownDisplay";
import SiteHeader from "./components/SiteHeader";
import { CONTENT } from "./constants/content";
import { TAILWIND_COLORS } from "./constants/colors";
import { IMAGES } from "./constants/images";

const SiteMeshBackground = lazy(
  () => import("./components/ui/site-mesh-background"),
);

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [foundingModalOpen, setFoundingModalOpen] = useState(false);

  const openFoundingModal = () => setFoundingModalOpen(true);
  const closeFoundingModal = () => setFoundingModalOpen(false);

  // Animation refs
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadlineRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const foundingMemberRef = useRef(null);
  const featuresRef = useRef(null);
  const globalReachRef = useRef(null);
  const finalCtaRef = useRef(null);

  // Animation setup
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
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
          { y: 0, opacity: 1, duration: 0.9, clearProps: "transform" }
        )
        .fromTo(
          subheadlineRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, clearProps: "transform" },
          "-=0.55"
        )
        .fromTo(
          ctaRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, clearProps: "transform" },
          "-=0.35"
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
        ".feature-card",
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
        }
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
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleFoundingMember = openFoundingModal;

  return (
    <div className="min-h-screen relative overflow-x-clip">
      <FoundingMemberModal open={foundingModalOpen} onClose={closeFoundingModal} />
      <div
        className="fixed inset-0 z-0 bawo-page-bg-base"
        aria-hidden
      />
      <Suspense
        fallback={
          <div
            className="bawo-hero-ambient pointer-events-none fixed inset-0 z-0"
            aria-hidden
          />
        }
      >
        <SiteMeshBackground />
      </Suspense>

      <SiteHeader onJoinClick={handleFoundingMember} />

      <div className="relative z-10 bg-transparent min-h-screen pb-[var(--bawo-mobile-sticky-cta-height)] md:pb-0">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="bawo-hero-section relative flex flex-col min-h-[100dvh] overflow-x-clip bg-transparent"
        >
          <div className="relative z-10 flex flex-1 flex-col container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl w-full">
            <div className="flex flex-1 flex-col items-center justify-center w-full min-h-0 py-6 sm:py-8 md:py-10">
              <div className="text-center space-y-5 sm:space-y-6 md:space-y-8 w-full max-w-4xl mx-auto">
                <div className="space-y-4 sm:space-y-5 md:space-y-7">
                  <h1
                    ref={headlineRef}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.15] font-display text-white break-words"
                  >
                    {CONTENT.hero.title.lead}
                    <span className="text-[#ff6b00]">{CONTENT.hero.title.highlight}</span>
                  </h1>
                  <p
                    ref={subheadlineRef}
                    className="text-sm sm:text-base md:text-lg opacity-90 font-medium text-white leading-[1.6] max-w-2xl mx-auto break-words"
                  >
                    {CONTENT.hero.subtitle}
                  </p>
                </div>

                <div ref={ctaRef} className="flex justify-center w-full pt-1">
                  <HeroActionStack onJoinClick={handleFoundingMember} />
                </div>
              </div>
            </div>

            <div
              className="w-full max-w-[22rem] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto mt-auto pt-6 sm:pt-8 bawo-hero-share-strip"
              aria-label="Secondary actions"
            >
              <HeroSecondaryBar layout="strip" />
            </div>
          </div>
        </section>

      {/* Building the Network — section 2 (borough hubs) */}
      <section
        ref={globalReachRef}
        id="building-the-network"
        className="relative bawo-scroll-anchor bg-transparent py-20 md:py-[5rem] overflow-x-hidden section-contain"
      >
        <div className="relative z-10 container mx-auto px-5 sm:px-6 py-12 md:py-14">
          <div className="text-center space-y-8 md:space-y-12 max-w-[1400px] mx-auto">
            <div className="space-y-5 md:space-y-7">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white font-museo-bold leading-[1.08] tracking-tight">
                {CONTENT.globalReach.title}
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-museo-medium text-white/85 max-w-4xl mx-auto leading-snug">
                {CONTENT.globalReach.subtitle}
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-museo-regular bawo-text-cta-gradient max-w-3xl mx-auto leading-relaxed">
                {CONTENT.globalReach.description}
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[1280px] min-h-[480px] sm:min-h-[560px] md:min-h-[700px] lg:min-h-[780px] mt-10 md:mt-14">
              <BoroughNetworkGraphic className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full opacity-[0.94] md:block [mask-image:radial-gradient(ellipse_88%_78%_at_50%_48%,#000_32%,transparent_72%)]" />
              <div className="relative z-[1] flex flex-col items-stretch gap-12 sm:gap-16 md:gap-24 lg:gap-28 pt-2 pb-4 md:pt-4 md:pb-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10 lg:gap-12 xl:gap-14 justify-items-center w-full">
                  {CONTENT.globalReach.cities.slice(0, 3).map((city, index) => {
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
                        className="city-stat text-center space-y-5 md:space-y-6 w-full max-w-[16rem] mx-auto"
                      >
                        {rotatingGallery ? (
                          <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 mx-auto overflow-hidden rounded-full shadow-[0_28px_80px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.16] transition-transform duration-300 hover:scale-[1.04] hover:ring-[#D4AF37]/45 hover:shadow-[0_32px_90px_rgba(212,175,55,0.12)]">
                            <BoroughSquareCarousel
                              images={rotatingGallery}
                              alt={`${city.name} community hub, BawoSocial NYC`}
                              rotationStaggerMs={index * 700}
                            />
                          </div>
                        ) : (
                          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_28px_80px_rgba(0,0,0,0.72)] overflow-hidden hover:scale-[1.04] transition-transform duration-300">
                            <img
                              src={IMAGES.globalReach.cities[index]}
                              alt={city.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="mt-1 md:mt-2">
                          <h3 className="font-museo-bold text-white text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-[2.65rem] tracking-[0.14em] drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)]">
                            {city.name.toUpperCase()}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:mx-auto sm:max-w-2xl md:max-w-5xl md:grid-cols-2 md:gap-12 lg:gap-14 xl:gap-16 justify-items-center w-full px-2 sm:px-4">
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
                        className="city-stat text-center space-y-5 md:space-y-6 w-full max-w-[16rem] mx-auto"
                      >
                        {rotatingGallery ? (
                          <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 mx-auto overflow-hidden rounded-full shadow-[0_28px_80px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.16] transition-transform duration-300 hover:scale-[1.04] hover:ring-[#D4AF37]/45 hover:shadow-[0_32px_90px_rgba(212,175,55,0.12)]">
                            <BoroughSquareCarousel
                              images={rotatingGallery}
                              alt={`${city.name} community hub, BawoSocial NYC`}
                              rotationStaggerMs={i * 700}
                            />
                          </div>
                        ) : (
                          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_28px_80px_rgba(0,0,0,0.72)] overflow-hidden hover:scale-[1.04] transition-transform duration-300">
                            <img
                              src={IMAGES.globalReach.cities[i]}
                              alt={city.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="mt-1 md:mt-2">
                          <h3 className="font-museo-bold text-white text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-[2.65rem] tracking-[0.14em] drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)]">
                            {city.name.toUpperCase()}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        <div className="relative bg-transparent space-y-16 md:space-y-20 pt-12 md:pt-16 pb-6 md:pb-10 section-contain">
          <CommunityMissionSection />
          <div className="relative z-10 container mx-auto px-6 max-w-5xl">
            <FoundingMemberCheckoutCard onJoinClick={handleFoundingMember} />
          </div>
          <div className="relative z-10">
            <PartnerWithUsSection />
          </div>
        </div>

      {/* Stats Section – Batch 1 (simplified) */}
      <section
        ref={statsRef}
        id="pricing-stats"
        className="relative py-16 md:py-20 bg-transparent overflow-hidden"
      >
        <div className="relative z-10 container mx-auto px-6 max-w-2xl">
          <div className="text-center space-y-8">
            <div className="space-y-3">
              <p className="text-[#10b981] text-xs font-museo-bold uppercase tracking-wider">
                Batch 1 Open
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-museo-bold tracking-tight">
                {CONTENT.stats.title}
              </h2>
              <p className="text-base text-white/75 font-museo-medium max-w-lg mx-auto">
                {CONTENT.stats.subtitle}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/45 font-museo-bold mb-2">
                Closes in
              </p>
              <BatchCountdownDisplay />
              <p className="text-[10px] text-white/45 font-museo-medium mt-1">
                days · hrs · min · sec
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-museo-medium text-white/70">
              <span>
                <strong className="text-[#ff6b00]">500</strong> spots
              </span>
              <span>
                <strong className="text-white">$25</strong> once
              </span>
              <span>30-day guarantee</span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-white/55 font-museo-medium">
                <span>50 / 500 taken</span>
                <span>450 left</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full w-[10%] rounded-full bg-[#ff6b00]"
                  aria-label="50 of 500 spots taken"
                />
              </div>
            </div>

            <p className="text-sm text-white/50 font-museo-medium">
              {CONTENT.stats.tagline}
            </p>

            <p className="text-xs text-white/40 font-museo-regular">
              {CONTENT.stats.urgency.deadline} · {CONTENT.stats.urgency.guarantee}
            </p>
          </div>
        </div>
      </section>

        {/* Origin Story Section – structured block with clear hierarchy */}
        <section id="about" className="relative bawo-scroll-anchor flex items-center justify-center bg-transparent py-20 md:py-28">
          <div className="relative z-10 container mx-auto px-6 flex flex-col items-center">
            <div className="text-white space-y-14 w-full max-w-5xl mx-auto">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-extrabold font-museo-bold leading-tight text-center tracking-tight">
                {CONTENT.origin.title.lead}
                <span className="text-[#ff6b00]">{CONTENT.origin.title.highlight}</span>
                {CONTENT.origin.title.closing}
              </h2>
              <div className="mx-auto max-w-3xl space-y-8 text-left">
                {CONTENT.origin.paragraphs.map((paragraph) => (
                  <p
                    key={
                      typeof paragraph === "string"
                        ? paragraph.slice(0, 32)
                        : paragraph.highlight
                    }
                    className="text-white/90 font-museo-medium text-xl md:text-2xl leading-relaxed md:leading-[1.85]"
                  >
                    {typeof paragraph === "string" ? (
                      paragraph
                    ) : (
                      <>
                        <span className="text-[#ff6b00] font-semibold">
                          {paragraph.highlight}
                        </span>
                        {paragraph.text}
                      </>
                    )}
                  </p>
                ))}
              </div>
              {CONTENT.origin.visionText && (
                <p className="text-white/80 font-museo-regular text-xl md:text-2xl leading-loose text-left">
                  {CONTENT.origin.visionText}
                </p>
              )}
            </div>
          </div>
      </section>

      {/* Founding Member Section */}
      <section
        ref={foundingMemberRef}
        id="pricing"
        className="relative bawo-scroll-anchor bg-transparent py-20 md:py-28"
      >
        <div className="relative z-10 container mx-auto px-6 py-12 md:py-16 max-w-2xl">
          <div className="space-y-10 text-white">
            <div className="space-y-3 text-center">
              <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight">
                {CONTENT.foundingMember.title}{" "}
                <span className="text-[#ff6b00]">{CONTENT.foundingMember.titleHighlight}</span>
              </h2>
              <p className="text-sm md:text-base font-museo-medium text-white/65 uppercase tracking-wider">
                {CONTENT.foundingMember.subtitle}
              </p>
            </div>

            <ul className="space-y-5">
              {CONTENT.foundingMember.benefits.map((benefit) => (
                <li key={benefit.title} className="flex items-start gap-3">
                  <BadgeCheck
                    className="w-5 h-5 text-[#ff6b00] flex-shrink-0 mt-0.5"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                  <div>
                    <p className="font-museo-bold text-base text-white">{benefit.title}</p>
                    <p className="text-sm text-white/70 mt-0.5 font-museo-medium leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="text-sm text-white/55 font-museo-medium text-center leading-relaxed">
              {CONTENT.foundingMember.missionText}
            </p>

            <div className="flex justify-center pt-2">
              <FoundingMemberButton
                label={CONTENT.foundingMember.cta}
                variant="primary"
                size="md"
                className="min-w-[14rem]"
                onClick={handleFoundingMember}
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
        <div className="relative z-10 text-white px-6 md:px-10 max-w-7xl py-12 md:py-16 mx-auto w-full">
          <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-16 ${TAILWIND_COLORS.primary.text} font-museo-bold`}>
            {CONTENT.features.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12 max-w-5xl mx-auto">
            {CONTENT.features.items.map((item) => (
              <div key={item.title} className="feature-card space-y-3 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold font-display text-white">
                  {item.title}
                </h3>
                <p className="text-base font-museo-medium leading-relaxed text-white/75">
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
          <h2 className="text-center text-4xl md:text-5xl font-bold font-museo-bold text-white mb-12">
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
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,0,0.45)] text-white transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-5 h-5 text-white" />
                    <span className="font-museo-bold">{event.title}</span>
                  </div>
                  <p className="text-white/80 font-museo-medium">
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
          <div className="text-center space-y-10 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-museo-bold">
                {CONTENT.finalCta.title}
              </h2>
              <p className="text-lg md:text-xl font-museo-medium text-white/80">
                {CONTENT.finalCta.subtitle}
              </p>
              {/* Borough tags */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {CONTENT.globalReach.cities.map((city) => (
                  <span
                    key={city.name}
                    className="px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-white/90 text-sm font-museo-medium hover:border-[rgba(255,107,0,0.55)] hover:bg-white/[0.08] transition-all duration-300"
                  >
                    {city.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5 justify-center items-center w-full max-w-2xl mx-auto">
              <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:flex-wrap sm:justify-center">
                <FoundingMemberButton
                  label={CONTENT.foundingMemberCheckout.ctaLabel}
                  variant="primary"
                  size="md"
                  onClick={handleFoundingMember}
                />
                <MobileAppDownloadRow className="items-stretch sm:max-w-[19.5rem]" />
              </div>

              <div
                className="bawo-trust-row flex flex-wrap items-center justify-center gap-2.5 text-[10px] md:text-xs font-museo-medium text-[#E8CA6A]"
                style={{ textShadow: "0 0 12px rgba(212, 175, 55, 0.22)" }}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#635bff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                  </svg>
                  {CONTENT.hero.trustIndicators.stripe}
                </span>
                <span className="text-[#D4AF37]/45">|</span>
                <span>{CONTENT.hero.trustIndicators.oneTime}</span>
                <span className="text-[#D4AF37]/45">|</span>
                <span>{CONTENT.hero.trustIndicators.cancel}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 max-w-2xl mx-auto w-full">
              <span className="flex-1 h-px bg-white/20" aria-hidden />
              <span className="text-white/55 font-museo-medium text-xs sm:text-sm text-center uppercase tracking-wider px-2">
                Or get launch updates, no payment
              </span>
              <span className="flex-1 h-px bg-white/20" aria-hidden />
            </div>

            <MailchimpSignupRow
              className="relative w-full max-w-2xl mx-auto"
              variant="ghost"
              buttonLabel={CONTENT.finalCta.ctaSecondary}
            />
          </div>
        </div>
      </section>

      <FaqSection />

      {/* Footer */}
      <footer className="py-12 bg-transparent">
        {/* Mobile Sticky CTA */}
        <div className="md:hidden mobile-sticky-cta bg-[var(--bawo-canvas)]/92 backdrop-blur-xl border-t border-[rgba(255,107,0,0.2)]">
          <div className="px-4 pt-2 pb-1">
            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#ff6b00]"
                style={{ width: "10%" }}
              />
            </div>
          </div>
          <div className="px-4 pb-3 flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[#E8CA6A] font-museo-bold text-xs uppercase tracking-wide">
                Batch 1 Open
              </span>
              <span className="text-white/70 font-museo-medium text-[11px]">
                450 of 500 spots left
              </span>
            </div>
            <FoundingMemberButton
              label="Join — $25"
              variant="primary"
              size="sm"
              className="shrink-0 max-w-[9.5rem] sm:max-w-none"
              onClick={handleFoundingMember}
            />
          </div>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-museo-bold mb-4">BawoSocial</h3>
              <p className="text-white/80 text-sm font-museo-medium mb-4">
                {CONTENT.footer.tagline}
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <a
                  href="https://www.instagram.com/bawo.social/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white"
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@bawosocial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white"
                >
                  TikTok
                </a>
                <a
                  href="https://linkedin.com/company/bawoapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-museo-bold mb-4">
                {CONTENT.footer.sections.quickLinks.title}
              </h3>
              <div className="space-y-2">
                {CONTENT.footer.sections.quickLinks.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-white/80 hover:text-white text-sm font-museo-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-museo-bold mb-4">Legal</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="block text-white/80 hover:text-white text-sm font-museo-medium text-left w-full"
                >
                  Privacy Policy
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[rgba(255,255,255,0.08)] pt-8 text-center">
            <p className="text-white/60 text-sm font-museo-regular">
              {CONTENT.footer.copyright}
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
          onClick={() => setShowPrivacyPolicy(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 font-museo-bold">
                  BawoSocial Privacy Policy
                </h2>
                <button
                  onClick={() => setShowPrivacyPolicy(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 font-museo-medium mt-2">
                Last Updated: June 2026
              </p>
            </div>

            <div className="p-6 space-y-6 text-gray-800">
              <p className="font-museo-medium">
                Welcome to BawoSocial ("we", "our", or "us"). Your privacy is
                important to us. This Privacy Policy explains how we collect,
                use, store, and share your information when you visit our
                website at bawoapp.com and use the BawoSocial mobile application and
                services.
              </p>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  1. Information We Collect
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Website Visitors
                  </h4>
                  <p className="text-sm mb-2">
                    When you visit our website, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Browsing data</strong>: Pages viewed, time spent,
                      device type, browser information
                    </li>
                    <li>
                      <strong>Contact information</strong>: Email address when
                      you sign up for updates or founding membership
                    </li>
                    <li>
                      <strong>Analytics data</strong>: How you interact with our
                      site (via Google Analytics and similar tools)
                    </li>
                    <li>
                      <strong>Cookies</strong>: Used for basic site functionality
                      and analytics (you can control cookies in your browser
                      settings)
                    </li>
                    <li>
                      <strong>Payment information</strong>: Processed securely
                      by Stripe when you become a founding member
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Mobile App Users
                  </h4>
                  <p className="text-sm mb-2">
                    When you use the BawoSocial app, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Account Information</strong>: Name, email, phone
                      number, date of birth (to verify you are 18+)
                    </li>
                    <li>
                      <strong>Profile Data</strong>: Photos, bios, preferences,
                      answers to onboarding questions and daily prompts
                    </li>
                    <li>
                      <strong>Location Information</strong>: Approximate
                      location (if shared), to help with matches and local
                      events
                    </li>
                    <li>
                      <strong>Device Information</strong>: Device type,
                      operating system, crash data, and usage analytics (via
                      Firebase)
                    </li>
                    <li>
                      <strong>Payment Information</strong>: If you make
                      purchases, payment details are handled securely by Stripe.
                      We do not store full credit card data ourselves
                    </li>
                    <li>
                      <strong>User Content</strong>: Messages, reactions, posts,
                      and answers you submit in-app
                    </li>
                    <li>
                      <strong>Usage Analytics</strong>: How you use app features
                      to improve your experience
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  2. How We Use Your Information
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Website Operations
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Provide our website services</strong> and process
                      founding member signups
                    </li>
                    <li>
                      <strong>Send updates</strong> about BawoSocial launch and
                      community news
                    </li>
                    <li>
                      <strong>Improve website performance</strong> and user
                      experience
                    </li>
                    <li>
                      <strong>Process payments</strong> securely through Stripe
                    </li>
                    <li>
                      <strong>Respond to inquiries</strong> and provide customer
                      support
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Mobile App Operations
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Create and personalize</strong> your profile and
                      matching experience
                    </li>
                    <li>
                      <strong>Connect you</strong> with potential matches,
                      friends, and community members
                    </li>
                    <li>
                      <strong>Facilitate group chats</strong> and local events
                    </li>
                    <li>
                      <strong>Improve app performance</strong> and protect
                      against abuse
                    </li>
                    <li>
                      <strong>Process payments</strong> and offer subscriptions
                      or premium features
                    </li>
                    <li>
                      <strong>Send notifications</strong> about matches,
                      messages, and community updates
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  3. Sharing of Information
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-3">
                    <strong>We do not sell your personal data.</strong> We may
                    share limited information with:
                  </p>

                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Service Providers
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Stripe</strong>: For secure payment processing
                    </li>
                    <li>
                      <strong>Firebase/Google</strong>: For authentication,
                      database, analytics, and push notifications
                    </li>
                    <li>
                      <strong>Email providers</strong>: For sending updates and
                      notifications
                    </li>
                    <li>
                      <strong>Customer support tools</strong>: To provide better
                      support
                    </li>
                    <li>
                      <strong>Analytics services</strong>: To understand how our
                      website and app are used
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  4. Your Rights and Choices
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Access and Control
                  </h4>
                  <p className="text-sm mb-2">
                    Depending on your location (US, EU, Nigeria, etc.), you may
                    have rights to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Access</strong> your personal information
                    </li>
                    <li>
                      <strong>Update or correct</strong> your data
                    </li>
                    <li>
                      <strong>Delete</strong> your account and data
                    </li>
                    <li>
                      <strong>Download</strong> a copy of your information
                    </li>
                    <li>
                      <strong>Withdraw consent</strong> for data processing
                    </li>
                    <li>
                      <strong>Object</strong> to certain uses of your data
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  5. Data Storage and Security
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Security Measures
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Encryption</strong>: All data transmitted using
                      SSL/TLS encryption
                    </li>
                    <li>
                      <strong>Secure servers</strong>: Data stored on protected
                      servers with access controls
                    </li>
                    <li>
                      <strong>Regular audits</strong>: We regularly review our
                      security practices
                    </li>
                    <li>
                      <strong>Employee training</strong>: Staff trained on
                      privacy and security best practices
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  6. Age Restrictions
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-2">
                    <strong>BawoSocial is only for users 18 years or older.</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Age verification</strong>: We require users to
                      confirm they are 18+
                    </li>
                    <li>
                      <strong>Under 18</strong>: If we learn someone under 18
                      has created an account, we will remove it immediately
                    </li>
                    <li>
                      <strong>Parental concerns</strong>: Contact us at
                      support@bawoapp.com
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  7. Cookies and Tracking
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Website Cookies
                  </h4>
                  <p className="text-sm mb-2">We use cookies to:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Remember your preferences</strong> and login
                      status
                    </li>
                    <li>
                      <strong>Analyze website usage</strong> to improve our
                      services
                    </li>
                    <li>
                      <strong>Provide security</strong> and prevent fraud
                    </li>
                    <li>
                      <strong>Personalize content</strong> and advertisements
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  8. Third-Party Services
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Payment Processing
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Stripe</strong>: Handles all payment processing
                      securely
                    </li>
                    <li>
                      <strong>PCI compliance</strong>: We follow industry
                      standards for payment security
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  9. California Privacy Rights (CCPA)
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    California Residents
                  </h4>
                  <p className="text-sm mb-2">
                    If you&apos;re a California resident, you have additional
                    rights:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Right to know</strong>: What personal information
                      we collect and how it&apos;s used
                    </li>
                    <li>
                      <strong>Right to delete</strong>: Request deletion of your
                      personal information
                    </li>
                    <li>
                      <strong>Right to opt-out</strong>: Of the sale of personal
                      information (we don&apos;t sell data)
                    </li>
                    <li>
                      <strong>Right to non-discrimination</strong>: We
                      won&apos;t discriminate for exercising your rights
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  10. European Privacy Rights (GDPR)
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    EU/UK Residents
                  </h4>
                  <p className="text-sm mb-2">
                    If you&apos;re in the EU or UK, you have additional rights
                    under GDPR:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Lawful basis</strong>: We process data based on
                      consent, contract, or legitimate interests
                    </li>
                    <li>
                      <strong>Data portability</strong>: Get a copy of your data
                      in a portable format
                    </li>
                    <li>
                      <strong>Right to object</strong>: Object to processing
                      based on legitimate interests
                    </li>
                    <li>
                      <strong>Automated decision-making</strong>: Right to human
                      review of automated decisions
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  11. Changes to This Policy
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Updates
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Notification</strong>: We&apos;ll update the
                      &quot;Last Updated&quot; date when changes are made
                    </li>
                    <li>
                      <strong>Significant changes</strong>: We&apos;ll notify
                      you via email or app notification
                    </li>
                    <li>
                      <strong>Your options</strong>: You can always review the
                      current policy on our website
                    </li>
                    <li>
                      <strong>Continued use</strong>: Using BawoSocial after changes
                      means you accept the updated policy
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">
                  12. Contact Us
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    Privacy Questions
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Email</strong>: privacy@bawoapp.com
                    </li>
                    <li>
                      <strong>Subject</strong>: Include &quot;Privacy
                      Policy&quot; in the subject line
                    </li>
                    <li>
                      <strong>Response time</strong>: We&apos;ll respond within
                      48 hours
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">
                    General Support
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Email</strong>: support@bawoapp.com
                    </li>
                    <li>
                      <strong>Website</strong>: bawoapp.com/contact
                    </li>
                    <li>
                      <strong>Response time</strong>: Within 24 hours
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-gray-600 font-museo-medium">
                  <strong>Questions about your privacy?</strong> We&apos;re here
                  to help. Contact us at privacy@bawoapp.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      </div>
    </div>
  );
}

export default App;
