import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BadgeCheck,
  Calendar,
  Headphones,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Logo from "./components/Logo";
import SparkleBackground from "./components/SparkleBackground";
import { CONTENT } from "./constants/content";
import { TAILWIND_COLORS } from "./constants/colors";
import { IMAGES } from "./constants/images";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const previewImages = IMAGES.previews.gallery;
  const previewImgRef = useRef<HTMLImageElement | null>(null);

  // Animation refs
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadlineRef = useRef(null);
  const phoneRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const foundingMemberRef = useRef(null);
  const featuresRef = useRef(null);
  const globalReachRef = useRef(null);
  const finalCtaRef = useRef(null);

  // Animation setup
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Hero section entrance animation (smoother ease/durations)
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Logo animation
    heroTimeline.fromTo(
      logoRef.current,
      { scale: 0.98, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.0 }
    );

    // Headline animation
    heroTimeline.fromTo(
      headlineRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      "-=0.6"
    );

    // Subheadline animation
    heroTimeline.fromTo(
      subheadlineRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 1.0 },
      "-=0.6"
    );

    // Phone mockup animation
    heroTimeline.fromTo(
      phoneRef.current,
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.3 },
      "-=0.4"
    );

    // CTA buttons animation
    heroTimeline.fromTo(
      ctaRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0 },
      "-=0.3"
    );

    // Stats animation
    heroTimeline.fromTo(
      statsRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.0 },
      "-=0.2"
    );

    // Scroll-triggered animations
    gsap.utils.toArray(".animate-on-scroll").forEach((element) => {
      const target = element as HTMLElement;
      gsap.fromTo(
        target as HTMLElement,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target as HTMLElement,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Staggered card animations
    gsap.fromTo(
      ".feature-card",
      { y: 20, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Testimonial animations
    gsap.fromTo(
      ".testimonial-card",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // City statistics animations
    gsap.fromTo(
      ".city-stat",
      { scale: 0.92, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: globalReachRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Simple auto-rotating preview in hero
  useEffect(() => {
    const intervalId = setInterval(() => {
      // crossfade
      if (previewImgRef.current) {
        gsap.to(previewImgRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: "power1.out",
        });
      }
      setActivePreviewIndex((prev) => (prev + 1) % previewImages.length);
      requestAnimationFrame(() => {
        if (previewImgRef.current) {
          gsap.to(previewImgRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    }, 3500);
    return () => clearInterval(intervalId);
  }, [previewImages.length]);

  const handleEarlyAccess = () => {
    const emailSection = document.getElementById("email-section");
    emailSection?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      const emailInput = document.getElementById("email-input");
      (emailInput as HTMLInputElement | null)?.focus();
    }, 1000);
  };

  const handleFoundingMember = () => {
    window.open("https://buy.stripe.com/fZu7sMgBBfgmeK2caf3Nm00", "_blank");
    // Track click for analytics
    const win = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof win.gtag !== "undefined") {
      win.gtag("event", "founding_member_click", {
        event_category: "conversion",
        event_label: "stripe_payment",
      });
    }
  };

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      <SparkleBackground />
      {/* Sticky Banner - Hidden on first page */}
      {/* <div className="fixed top-0 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 py-3 px-4 text-center font-bold z-50 shadow-lg font-museo-bold">
        <div className="flex items-center justify-center gap-3">
          <img
            src={IMAGES.assets.logo}
              alt="BawoSocial"
            className="h-10 w-auto"
          />
          <span>🚨 ONLY 73 FOUNDING MEMBER SPOTS REMAINING - SECURE YOURS NOW! 🇳🇬</span>
      </div>
      </div> */}

      <div
        className="relative z-10 bg-transparent"
      >
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-transparent"
        >
          {/* Background Pattern */}



          {/* BawoSocial Logo - Higher Position with Social Icons */}
          <div
            ref={logoRef}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 lg:top-10 lg:left-10 xl:top-12 xl:left-12 2xl:top-16 2xl:left-16 z-20"
            
          >
            <div className="relative z-10">
          <Logo />
            </div>
      </div>

          {/* Social Media Icons - Bottom Right */}
          <div className="absolute bottom-20 right-6 z-20">
            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/bawo.social/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="text-white/80 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              <a 
                href="https://twitter.com/bawoapp" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                title="X (Twitter)"
                className="text-white/80 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              <a 
                href="https://linkedin.com/company/bawoapp" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="text-white/80 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.tiktok.com/@bawosocial" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="text-white/80 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
            </a>
          </div>
        </div>

          {/* Main Content Container */}
          <div className="relative z-10 container mx-auto px-6 py-24 md:py-36 lg:py-40">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content - Text */}
              <div className="text-left space-y-10 order-2 lg:order-1">
                {/* Main Heading */}
                <div className="space-y-6">
                  <h1
                    ref={headlineRef}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.2] font-museo-bold text-white"
                  >
            {CONTENT.hero.title}
          </h1>
                  <p
                    ref={subheadlineRef}
                    className="text-base md:text-lg opacity-90 font-museo-regular text-white leading-[1.8]"
                  >
            {CONTENT.hero.subtitle}
          </p>
                </div>

                {/* Call to Action Buttons */}
                <div
                  ref={ctaRef}
                  className="flex flex-col sm:flex-row gap-4 justify-start"
                >
                  <div className="relative">
            <button
              onClick={handleFoundingMember}
              className={`bg-white/10 border ${TAILWIND_COLORS.primary.border} text-white hover:bg-white/15 px-8 sm:px-10 py-4 rounded-full min-h-[44px] font-bold text-base md:text-lg leading-tight transform hover:translate-y-[-1px] transition-all duration-300 font-museo-bold w-full sm:w-auto max-w-[350px] animate-lift backdrop-blur-sm`}
            >
                      {CONTENT.hero.ctaPrimary}
            </button>
                    {/* Urgency Indicator */}
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
            <button
              onClick={handleEarlyAccess}
                    className={`bg-white/10 border ${TAILWIND_COLORS.primary.border} text-white ${TAILWIND_COLORS.primary.hover.bg} hover:text-white px-8 sm:px-10 py-4 rounded-full min-h-[44px] font-bold text-base md:text-lg leading-tight transform hover:translate-y-[-1px] transition-all duration-300 font-museo-bold w-full sm:w-auto max-w-[350px] animate-lift backdrop-blur-[2px]`}
            >
              {CONTENT.hero.ctaSecondary}
            </button>
          </div>
          </div>
          
              {/* Right Content - iPhone Mockup */}
              <div
                ref={phoneRef}
                className="flex justify-center lg:justify-end lg:pr-10 xl:pr-16 order-1 lg:order-2 -mt-10 md:-mt-14"
              >
                <div className="relative">
                  <div className="relative">
                    <img
                      ref={previewImgRef}
                      src={previewImages[activePreviewIndex]}
                      alt="BawoSocial App Preview - BawoSocial group chat"
                      className="w-64 md:w-80 lg:w-96 h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-[2rem] animate-breathing object-cover will-change-transform will-change-opacity"
                      style={{ opacity: 1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#ff7f39]/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/5 to-transparent rounded-t-[2rem] pointer-events-none"></div>
                  </div>
                  {/* Dots */}
                  <div className="flex items-center justify-center gap-2 absolute -bottom-6 left-1/2 -translate-x-1/2">
                    {previewImages.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full ${
                          idx === activePreviewIndex
                            ? "bg-[#ff7f39]"
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>


        {/* Origin Story Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-transparent">
          <div className="relative z-10 container mx-auto px-6 py-20 max-w-4xl">
            <div className="text-white space-y-8 text-center">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-museo-bold leading-tight">
                {CONTENT.origin.title}
              </h2>
              <p className="text-white/90 font-museo-medium text-xl md:text-2xl leading-relaxed">
                {CONTENT.origin.mainText}
              </p>
              {CONTENT.origin.visionText && (
                <p className="text-white/80 font-museo-regular text-lg md:text-xl leading-relaxed">
                  {CONTENT.origin.visionText}
                </p>
              )}
            </div>
          </div>
      </section>

      {/* Founding Member Section */}
      <section
        ref={foundingMemberRef}
        className="relative min-h-screen bg-transparent"

      >

        <div className="relative z-10 container mx-auto px-6 py-20 min-h-[calc(100vh-10rem)]">
          <div className="grid lg:grid-cols-2 gap-12 h-full items-stretch">
            {/* Left Content - Benefits */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-museo-bold">
              {CONTENT.foundingMember.title}
                  <br />
                  <span className={TAILWIND_COLORS.primary.text}>{CONTENT.foundingMember.titleHighlight}</span>
          </h2>
                <p className="text-base md:text-lg font-museo-regular text-white/80">
                  {CONTENT.foundingMember.subtitle}
            </p>
          </div>

              <div className="space-y-6">
                <div className="space-y-4">
              {CONTENT.foundingMember.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <BadgeCheck className={`w-5 h-5 ${TAILWIND_COLORS.primary.text} flex-shrink-0 mt-0.5`} />
                      <div>
                        <span className="font-museo-bold text-base text-white">
                          {benefit.title}
                  </span>
                        <div className="text-sm text-white/80 mt-1 font-museo-regular">
                          {benefit.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Trust Note */}
              <div className="pt-6">
                <p className="text-sm md:text-base text-white/90 font-museo-regular leading-relaxed">
                  {CONTENT.foundingMember.missionText}
                </p>
              </div>
            </div>

            {/* Right Content - Nigerian Map & CTA */}
            <div className="flex flex-col h-full w-full items-center lg:items-end justify-end space-y-8 mt-10 lg:mt-0">
              <div className="text-center lg:text-right space-y-4">
            <button
              onClick={handleFoundingMember}
              className="bg-white/10 border border-[#F37021] text-white hover:bg-white/15 px-12 py-6 rounded-[50px] min-h-[48px] font-bold text-xl transform hover:scale-105 transition-all duration-300 font-museo-bold backdrop-blur-sm"
            >
              {CONTENT.foundingMember.cta}
            </button>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative min-h-screen flex items-center justify-center bg-transparent"

      >
        
        <div className="relative z-10 text-white px-6 max-w-4xl py-20 mx-auto">
          <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-16 ${TAILWIND_COLORS.primary.text} font-museo-bold`}>
            {CONTENT.features.title}
          </h2>
          <div className="space-y-12">
            {CONTENT.features.items.map((item, index) => {
              return (
                <div key={index} className="feature-card text-center space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold font-museo-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-lg md:text-xl opacity-90 font-museo-regular leading-relaxed text-white/90 max-w-2xl mx-auto">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        className="relative py-20 bg-transparent"

      >

        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-museo-bold mb-4">
              What Our Community Says
          </h2>
            <p className="text-lg text-white/80 font-museo-medium">
              Hear from Nigerians excited to connect on BawoSocial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="testimonial-card bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={IMAGES.testimonials.adaora}
                    alt={CONTENT.testimonials.reviews[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h4 className="font-museo-bold text-white">{CONTENT.testimonials.reviews[0].name}</h4>
                  <p className="text-sm text-white/80 font-museo-medium">
                    {CONTENT.testimonials.reviews[0].role}
                  </p>
                </div>
              </div>
              <p className="text-white/80 font-museo-medium leading-relaxed">
                "{CONTENT.testimonials.reviews[0].quote}"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={IMAGES.testimonials.emeka}
                    alt={CONTENT.testimonials.reviews[1].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h4 className="font-museo-bold text-white">{CONTENT.testimonials.reviews[1].name}</h4>
                  <p className="text-sm text-white/80 font-museo-medium">
                    {CONTENT.testimonials.reviews[1].role}
                  </p>
                </div>
              </div>
              <p className="text-white/80 font-museo-medium leading-relaxed">
                "{CONTENT.testimonials.reviews[1].quote}"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={IMAGES.testimonials.fatima}
                    alt={CONTENT.testimonials.reviews[2].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h4 className="font-museo-bold text-white">{CONTENT.testimonials.reviews[2].name}</h4>
                  <p className="text-sm text-white/80 font-museo-medium">
                    {CONTENT.testimonials.reviews[2].role}
                  </p>
                </div>
              </div>
              <p className="text-white/80 font-museo-medium leading-relaxed">
                "{CONTENT.testimonials.reviews[2].quote}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* In-App Preview Section */}
      <section
        className="relative py-24 bg-transparent"

      >

        <div className="relative z-10 container mx-auto px-6">
          <h2 className="text-center text-4xl md:text-5xl font-museo-bold text-white mb-12">
            This Is What Belonging Looks Like
            </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center">
              <img
                src={IMAGES.inApp.features[0]}
                alt="Profiles"
                className="rounded-xl h-80 w-full object-contain mx-auto"
              />
              <p className="text-white mt-3 font-museo-medium">
                Find Your Tribe - discover people who share your vibe &
                interests.
              </p>
            </div>
            <div className="text-center">
              <img
                src={IMAGES.inApp.features[1]}
                alt="Groups"
                className="rounded-xl h-80 w-full object-contain mx-auto"
              />
              <p className="text-white mt-3 font-museo-medium">
                Join Exclusive Groups - connect with like-minded Nigerians.
              </p>
          </div>
            <div className="text-center">
              <img
                src={IMAGES.inApp.features[2]}
                alt="Events"
                className="rounded-xl h-80 w-full object-contain mx-auto"
              />
              <p className="text-white mt-3 font-museo-medium">
                Attend Events - virtual and in-person meetups worldwide.
              </p>
            </div>
            <div className="text-center">
              <img
                src={IMAGES.inApp.features[3]}
                alt="Culture"
                className="rounded-xl h-80 w-full object-contain mx-auto"
              />
              <p className="text-white mt-3 font-museo-medium">
                Celebrate Culture - language, food, music, and heritage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Highlights Section */}
      <section
        className="relative py-24 bg-transparent"

      >

        <div className="relative z-10 container mx-auto px-6">
          <h2 className="text-center text-4xl md:text-5xl font-museo-bold text-white mb-12">
            Featured Events
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-amber-300" />
                <span className="font-museo-bold">
                  Diaspora Networking Night – London
                </span>
              </div>
              <p className="text-white/80 font-museo-medium">
                Connect with professionals across industries and build lasting
                relationships.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Headphones className="w-5 h-5 text-amber-300" />
                <span className="font-museo-bold">
                  Virtual Language Exchange – Igbo, Yoruba, Hausa
                </span>
              </div>
              <p className="text-white/80 font-museo-medium">
                Practice, learn, and preserve our languages together - no
                pressure, just fun.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-5 h-5 text-amber-300" />
                <span className="font-museo-bold">
                  Nigerian Independence Celebration – NYC
                </span>
              </div>
              <p className="text-white/80 font-museo-medium">
                A night of culture, music, and pride with the NYC Nigerian
                community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diaspora Statistics Section */}
      <section
        ref={globalReachRef}
        className="relative min-h-screen flex items-center justify-center bg-transparent"

      >



        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center space-y-12">
          <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-museo-bold">
                {CONTENT.globalReach.title}
              </h2>
              <p className="text-lg md:text-xl font-museo-medium text-white/80">
                {CONTENT.globalReach.subtitle}
              </p>
              <p className="text-base font-museo-regular text-[#ff7f39]">
                {CONTENT.globalReach.description}
              </p>
              </div>

            {/* City Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-16">
              {/* New York */}
              <div className="city-stat text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img
                    src={IMAGES.globalReach.cities[0]}
                    alt="New York"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">
                    NEW YORK
                  </h3>
                  <p className="font-museo-medium text-white/80 text-sm">
                    1,247 MEMBERS
                  </p>
                </div>
              </div>

              {/* London */}
              <div className="city-stat text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img
                    src={IMAGES.globalReach.cities[1]}
                    alt="London"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">
                    LONDON
                  </h3>
                  <p className="font-museo-medium text-white/80 text-sm">
                    1,092 MEMBERS
                  </p>
                </div>
              </div>

              {/* Atlanta */}
              <div className="city-stat text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img
                    src={IMAGES.globalReach.cities[2]}
                    alt="Atlanta"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">
                    ATLANTA
                  </h3>
                  <p className="font-museo-medium text-white/80 text-sm">
                    1,684 MEMBERS
                  </p>
                </div>
              </div>

              {/* LA */}
              <div className="city-stat text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img
                    src={IMAGES.globalReach.cities[3]}
                    alt="Los Angeles"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">
                    LA
                  </h3>
                  <p className="font-museo-medium text-white/80 text-sm">
                    1,503 MEMBERS
                  </p>
                </div>
              </div>

              {/* Canada */}
              <div className="city-stat text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img
                    src={IMAGES.globalReach.cities[4]}
                    alt="Canada"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">
                    CANADA
                  </h3>
                  <p className="font-museo-medium text-white/80 text-sm">
                    1,174 MEMBERS
                  </p>
                </div>
              </div>

              {/* Houston */}
              <div className="city-stat text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img
                    src={IMAGES.globalReach.cities[5]}
                    alt="Houston"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">
                    HOUSTON
                  </h3>
                  <p className="font-museo-medium text-white/80 text-sm">
                    892 MEMBERS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        ref={finalCtaRef}
        id="email-section"
        className="relative min-h-screen flex items-center justify-center bg-transparent"

      >
        
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center space-y-8">
          <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-museo-bold">
                {CONTENT.finalCta.title}
            </h2>
              <p className="text-lg md:text-xl font-museo-medium text-white/80">
                {CONTENT.finalCta.subtitle}
              </p>
            </div>

            {/* Email Form */}
            <form
              action="https://joinbawo.us10.list-manage.com/subscribe/post?u=7c2523b0334a02fe77eebddb3&id=842ac1ad64&f_id=00bb32e3f0"
              method="post"
              target="_self"
              className="max-w-2xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                  name="EMAIL"
                  placeholder="Enter email for launch updates"
                    required
                  className="flex-1 px-6 py-4 rounded-[12px] border-2 text-lg focus:outline-none transition-all bg-white/10 backdrop-blur-sm text-white placeholder-white/70 font-museo-medium border-white/20 focus:border-[#ff7f39]"
                />

                {/* Anti-spam field (required by Mailchimp) - DO NOT REMOVE */}
                <div
                  style={{ position: "absolute", left: "-5000px" }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="b_7c2523b0334a02fe77eebddb3_842ac1ad64"
                    tabIndex={-1}
                    defaultValue=""
                    aria-label="Do not fill this field"
                    title="Do not fill this field"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-transparent border border-white/25 hover:bg-white/10 text-white px-10 py-4 rounded-[50px] min-h-[48px] font-bold text-base flex items-center justify-center transform hover:scale-105 transition-all duration-300 font-museo-bold backdrop-blur-sm"
                >
                  Join Waitlist
                </button>
                </div>
              </form>

            {/* Main CTA */}
            <div className="space-y-4">
              <button
                onClick={handleFoundingMember}
                className="bg-gradient-to-r from-[#ff7f39] to-[#ff6b35] hover:from-[#ff6b35] hover:to-[#ff5a2e] text-white px-10 sm:px-12 py-4 rounded-full min-h-[46px] font-bold text-lg md:text-xl leading-tight transform hover:translate-y-[-1px] transition-all duration-300 shadow-[0_12px_30px_rgba(255,111,62,0.32)] hover:shadow-[0_16px_36px_rgba(255,111,62,0.38)] font-museo-bold"
              >
                {CONTENT.finalCta.cta}
                </button>
              <button
                onClick={handleEarlyAccess}
                className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-10 py-4 rounded-full min-h-[46px] font-bold text-base md:text-lg leading-tight transform hover:translate-y-[-1px] transition-all duration-300 font-museo-bold backdrop-blur-[2px]"
              >
                {CONTENT.finalCta.ctaSecondary}
              </button>
                  </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-transparent">
        {/* Mobile Sticky CTA */}
        <div className="md:hidden mobile-sticky-cta bg-black/60 border-t border-white/10">
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-white font-museo-medium text-sm">
              Founding Member $50
            </span>
            <button
              onClick={handleFoundingMember}
              className="bg-gradient-to-r from-[#ff7f39] to-[#ff6b35] text-white px-5 py-2.5 rounded-[50px] min-h-[44px] font-museo-bold text-sm"
            >
              Secure Spot
            </button>
              </div>
        </div>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-museo-bold mb-4">BawoSocial</h3>
              <p className="text-white/80 text-sm font-museo-medium mb-4">
                Connecting the Nigerian diaspora worldwide through authentic
                relationships and cultural pride.
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
                <a href="#" className="text-white/60 hover:text-white">
                  TikTok
                </a>
                <a href="#" className="text-white/60 hover:text-white">
                  LinkedIn
                </a>
            </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-museo-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-white/80 hover:text-white text-sm font-museo-medium"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="block text-white/80 hover:text-white text-sm font-museo-medium"
                >
                  How It Works
                </a>
                <a
                  href="#"
                  className="block text-white/80 hover:text-white text-sm font-museo-medium"
                >
                  Founding Members
                </a>
                <a
                  href="#"
                  className="block text-white/80 hover:text-white text-sm font-museo-medium"
                >
                  Contact
                </a>
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
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60 text-sm font-museo-regular">
              {CONTENT.footer.copyright}
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
                Last Updated: July 2025
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
