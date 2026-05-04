import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BadgeCheck,
  BookOpen,
  Calendar,
  Clock,
  Crown,
  Download,
  Flame,
  Gem,
  Headphones,
  Home,
  Lock,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BoroughNetworkGraphic from "./components/BoroughNetworkGraphic";
import BoroughSquareCarousel from "./components/BoroughSquareCarousel";
import BawoPillButton from "./components/BawoPillButton";
import FoundingMemberCheckoutCard from "./components/FoundingMemberCheckoutCard";
import MailchimpSignupRow from "./components/MailchimpSignupRow";
import Logo from "./components/Logo";
import PartnerWithUsSection from "./components/PartnerWithUsSection";
import { CONTENT } from "./constants/content";
import { TAILWIND_COLORS } from "./constants/colors";
import { IMAGES } from "./constants/images";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Live signup notifications data
const signupNotifications = [
  { name: "Adanna", location: "Brooklyn" },
  { name: "Tunde", location: "Harlem" },
  { name: "Chiamaka", location: "Queens" },
  { name: "Obinna", location: "The Bronx" },
  { name: "Ngozi", location: "Brooklyn" },
  { name: "Emeka", location: "Staten Island" },
  { name: "Amara", location: "Harlem" },
  { name: "Chukwudi", location: "Queens" },
];

function App() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({ name: "", location: "" });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const previewImages = IMAGES.previews.gallery;
  const previewImgRef = useRef<HTMLImageElement | null>(null);

  // Countdown timer to May 15, 2026
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('2026-05-15T23:59:59').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

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

    // Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 150, // Reduce update frequency for better performance
    });

    // Hero section entrance animation (smoother ease/durations)
    const heroTimeline = gsap.timeline({ 
      defaults: { 
        ease: "power3.out",
        force3D: true, // Force GPU acceleration
      } 
    });

    // Logo animation
    heroTimeline.fromTo(
      logoRef.current,
      { scale: 0.98, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.0, clearProps: "transform" }
    );

    // Headline animation
    heroTimeline.fromTo(
      headlineRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, clearProps: "transform" },
      "-=0.6"
    );

    // Subheadline animation
    heroTimeline.fromTo(
      subheadlineRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 1.0, clearProps: "transform" },
      "-=0.6"
    );


    // Phone mockup animation
    heroTimeline.fromTo(
      phoneRef.current,
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.3, clearProps: "transform" },
      "-=0.4"
    );

    // CTA buttons animation
    heroTimeline.fromTo(
      ctaRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, clearProps: "transform" },
      "-=0.3"
    );

    // Stats animation
    heroTimeline.fromTo(
      statsRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.0 },
      "-=0.2"
    );

    // Scroll-triggered animations with performance optimizations
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
          force3D: true,
          scrollTrigger: {
            trigger: target as HTMLElement,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        }
      );
    });

    // Staggered card animations with batching
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
        force3D: true,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
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
        force3D: true,
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
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
        force3D: true,
        scrollTrigger: {
          trigger: globalReachRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
        },
      }
    );

    // Cleanup function - properly kill all ScrollTriggers
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      heroTimeline.kill();
    };
  }, []);

  // Simple auto-rotating preview in hero
  useEffect(() => {
    if (!previewImages || previewImages.length < 2) {
      return;
    }
    
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
  }, [previewImages]);


  // Live signup notification system
  useEffect(() => {
    const showRandomNotification = () => {
      const randomSignup = signupNotifications[Math.floor(Math.random() * signupNotifications.length)];
      setNotificationData(randomSignup);
      setShowNotification(true);
      
      // Hide notification after 4 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 4000);
    };

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showRandomNotification, 3000);
    
    // Show subsequent notifications every 12-18 seconds
    const notificationInterval = setInterval(() => {
      showRandomNotification();
    }, Math.random() * 6000 + 12000); // Random between 12-18 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(notificationInterval);
    };
  }, []);


  const handleFoundingMember = () => {
    window.open(CONTENT.revenue.foundingStripeCheckoutUrl, "_blank");
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
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 z-0 bg-gradient-to-b from-[var(--bawo-canvas)] via-[var(--bawo-elevated)] to-[var(--bawo-canvas)]"
        aria-hidden
      />
      
      {/* Live Signup Notification Toast */}
      {showNotification && (
        <div className="fixed top-14 md:top-16 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-white/[0.1] backdrop-blur-md border border-[rgba(255,255,255,0.12)] rounded-full px-4 md:px-6 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </div>
            <p className="text-white text-xs md:text-sm font-museo-medium">
              <span className="font-museo-bold text-[var(--bawo-brand-cta-orange)]">{notificationData.name}</span> from {notificationData.location} just joined
            </p>
          </div>
        </div>
      )}
      
      {/* Promo strip — full-bleed glass, yellow copy + white icons, ribbon animation (see `index.css`) */}
      <div className="bawo-promo-strip fixed top-0 left-0 right-0 z-40 py-2.5 md:py-3">
        <div
          className="bawo-promo-ribbon flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 text-xs md:gap-x-5 md:text-sm text-yellow-300"
          style={{
            textShadow:
              "0 0 16px rgba(250, 204, 21, 0.5), 0 0 34px rgba(234, 179, 8, 0.22)",
          }}
        >
          <span className="flex items-center justify-center gap-2 font-museo-medium">
            <Gem className="h-[18px] w-[18px] shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] md:h-5 md:w-5" strokeWidth={2} aria-hidden />
            <span>
              <span aria-hidden className="mr-1 inline-block">
                ✨
              </span>
              Lifetime Access — One Payment
            </span>
          </span>
          <span className="text-white/40" aria-hidden>
            ·
          </span>
          <span className="flex items-center justify-center gap-2">
            <Crown className="h-[18px] w-[18px] shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] md:h-5 md:w-5" strokeWidth={2} aria-hidden />
            <span className="font-museo-bold font-display tracking-wide">
              <span aria-hidden className="mr-1 inline-block">
                🎖️
              </span>
              Founding Member Badge
            </span>
          </span>
          <span className="text-white/40" aria-hidden>
            ·
          </span>
          <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <Clock className="h-[18px] w-[18px] shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] md:h-5 md:w-5" strokeWidth={2} aria-hidden />
            <span className="font-museo-medium text-yellow-300/90">
              <span aria-hidden className="mr-1 inline-block">
                ⏰
              </span>
              Closes:
            </span>
            <span className="font-museo-bold tabular-nums">
              {timeLeft.days}
              <span className="ml-0.5 text-[10px] font-museo-medium opacity-75 md:text-xs">
                D
              </span>
            </span>
            <span className="font-museo-bold tabular-nums">
              {String(timeLeft.hours).padStart(2, "0")}
              <span className="ml-0.5 text-[10px] font-museo-medium opacity-75 md:text-xs">
                H
              </span>
            </span>
            <span className="font-museo-bold tabular-nums">
              {String(timeLeft.minutes).padStart(2, "0")}
              <span className="ml-0.5 text-[10px] font-museo-medium opacity-75 md:text-xs">
                M
              </span>
            </span>
            <span className="font-museo-bold tabular-nums">
              {String(timeLeft.seconds).padStart(2, "0")}
              <span className="ml-0.5 text-[10px] font-museo-medium opacity-75 md:text-xs">
                S
              </span>
            </span>
          </span>
          <span className="text-white/40" aria-hidden>
            ·
          </span>
          <span className="flex items-center justify-center gap-2 font-museo-bold">
            <Flame className="h-[18px] w-[18px] shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] md:h-5 md:w-5" strokeWidth={2} aria-hidden />
            <span>
              <span aria-hidden className="mr-1 inline-block">
                🔥
              </span>
              Only 450 Spots Left
            </span>
          </span>
        </div>
      </div>
      
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

      <div className="relative z-10 bg-transparent min-h-screen scroll-content-gpu">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-0 md:min-h-screen flex items-start md:items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-8 md:pb-0 bg-transparent"
        >
          {/* (Removed) extra background glow behind hero mockup */}
          {/* BawoSocial Logo - Top Left */}
          <div
            ref={logoRef}
            className="absolute top-14 sm:top-16 md:top-18 left-4 sm:left-6 md:left-8 lg:left-10 xl:left-12 2xl:left-16 z-20"
          >
            <div className="relative z-10">
              <Logo />
            </div>
          </div>


          {/* Main Content Container */}
          <div className="relative z-10 container mx-auto px-6 py-10 sm:py-14 md:py-24 lg:py-36 xl:py-40">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-center">
              {/* Left Content - Text */}
              <div className="text-left space-y-10 order-2 lg:order-1">
                {/* Main Heading */}
                <div className="space-y-6">
                  <h1
                    ref={headlineRef}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.2] font-display text-white"
                  >
            {CONTENT.hero.title}
          </h1>
                  <p
                    ref={subheadlineRef}
                    className="text-base md:text-lg opacity-90 font-medium text-white leading-[1.8]"
                  >
            {CONTENT.hero.subtitle}
          </p>
                </div>

                {/* Call to Action Buttons – founding pass */}
                <div
                  ref={ctaRef}
                  className="flex flex-col gap-4 justify-start items-start w-full"
                >
                  <div className="relative w-fit max-w-full">
                    <BawoPillButton
                      label={CONTENT.hero.ctaPrimary}
                      icon={Lock}
                      variant="primary"
                      size="md"
                      onClick={handleFoundingMember}
                    />
                    <span
                      className="pointer-events-none absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.75)] ring-2 ring-[var(--bawo-canvas,#06030C)]"
                      aria-hidden
                    />
                  </div>

                  <div className="mt-8 md:mt-11 flex flex-col gap-3 w-full max-w-2xl">
                    <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                      {CONTENT.hero.ctaMicrocopy}
                    </p>

                    <div className="bawo-trust-row flex flex-wrap items-center gap-3 text-xs md:text-sm font-normal">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#635bff]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                        </svg>
                        {CONTENT.hero.trustIndicators.stripe}
                      </span>
                      <span className="bawo-trust-row__sep">|</span>
                      <span>{CONTENT.hero.trustIndicators.oneTime}</span>
                      <span className="bawo-trust-row__sep">|</span>
                      <span>{CONTENT.hero.trustIndicators.cancel}</span>
                    </div>
                  </div>
                </div>
              </div>
          
              {/* Right Content - iPhone Mockup */}
              {previewImages.length > 0 && (
                <div
                  ref={phoneRef}
                  className="flex flex-col items-center lg:items-end lg:pr-10 xl:pr-16 order-1 lg:order-2 -mt-2 sm:-mt-4 md:-mt-10 lg:-mt-14 gap-3 sm:gap-4 md:gap-6 w-full max-w-[19rem] sm:max-w-none mx-auto lg:mx-0"
                >
                  <div className="relative pb-4 md:pb-6 w-full flex flex-col items-center">
                    <div className="relative w-full max-w-[15.5rem] sm:max-w-none sm:w-auto mx-auto">
                      <img
                        ref={previewImgRef}
                        src={previewImages[activePreviewIndex]}
                        alt="BawoSocial App Preview"
                        loading="eager"
                        decoding="async"
                        className="w-full sm:w-64 md:w-80 lg:w-96 h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-[2rem] animate-breathing object-cover will-change-transform"
                        style={{ opacity: 1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(255,107,0,0.14)] via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>
                      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/5 to-transparent rounded-t-[2rem] pointer-events-none"></div>
                    </div>
                    {/* Dots */}
                    <div className="flex items-center justify-center gap-2 absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2">
                      {previewImages.map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-2.5 h-2.5 rounded-full ${
                            idx === activePreviewIndex
                              ? "bg-[var(--bawo-brand-cta-orange)]"
                              : "bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <a
                    href={CONTENT.hero.testflightLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-warm-auth bawo-cta-glass-secondary w-full max-w-[15.5rem] sm:w-64 sm:max-w-none md:w-80 lg:w-96 shrink-0 min-h-[3.5rem] py-3 sm:py-2"
                  >
                    <span className="pill-warm-auth__icon" aria-hidden>
                      <Download className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <span className="pill-warm-auth__label">
                      <span className="block">Or download via TestFlight</span>
                      <span className="pill-warm-auth__label-sub block">
                        (free beta)
                      </span>
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Social Media Icons - Bottom of Hero */}
            <div className="flex justify-center gap-6 mt-16 pt-10 border-t border-white/10">
              <a
                href="https://www.instagram.com/bawo.social/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="transform hover:scale-110 transition-transform duration-300"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="url(#instagram-gradient-row)">
                  <defs>
                    <linearGradient id="instagram-gradient-row" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: "#FD5949", stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: "#D6249F", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#285AEB", stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/bawoapp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                title="X (Twitter)"
                className="transform hover:scale-110 transition-transform duration-300"
              >
                <svg className="w-8 h-8" fill="#1DA1F2" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/bawoapp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="transform hover:scale-110 transition-transform duration-300"
              >
                <svg className="w-8 h-8" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@bawosocial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="transform hover:scale-110 transition-transform duration-300"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="tiktok-gradient-row" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#00F2EA", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#FF0050", stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#tiktok-gradient-row)"
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>

      {/* Building the Network — section 2 (borough hubs) */}
      <section
        ref={globalReachRef}
        id="building-the-network"
        className="relative bg-transparent py-20 md:py-24 lg:py-28 overflow-hidden"
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
                        className="city-stat text-center space-y-6 md:space-y-8 w-full max-w-[20rem] mx-auto"
                      >
                        {rotatingGallery ? (
                          <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] mx-auto overflow-hidden rounded-3xl shadow-[0_28px_80px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.16] transition-transform duration-300 hover:scale-[1.04] hover:ring-[#D4AF37]/45 hover:shadow-[0_32px_90px_rgba(212,175,55,0.12)]">
                            <BoroughSquareCarousel
                              images={rotatingGallery}
                              alt={`${city.name} — Nigerian diaspora community in NYC`}
                              rotationStaggerMs={index * 700}
                            />
                          </div>
                        ) : (
                          <div className="w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center shadow-[0_28px_80px_rgba(0,0,0,0.72)] overflow-hidden hover:scale-[1.04] transition-transform duration-300">
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
                        className="city-stat text-center space-y-6 md:space-y-8 w-full max-w-[20rem] mx-auto"
                      >
                        {rotatingGallery ? (
                          <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] mx-auto overflow-hidden rounded-3xl shadow-[0_28px_80px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.16] transition-transform duration-300 hover:scale-[1.04] hover:ring-[#D4AF37]/45 hover:shadow-[0_32px_90px_rgba(212,175,55,0.12)]">
                            <BoroughSquareCarousel
                              images={rotatingGallery}
                              alt={`${city.name} — Nigerian diaspora community in NYC`}
                              rotationStaggerMs={i * 700}
                            />
                          </div>
                        ) : (
                          <div className="w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center shadow-[0_28px_80px_rgba(0,0,0,0.72)] overflow-hidden hover:scale-[1.04] transition-transform duration-300">
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

        <div className="relative bg-transparent space-y-14 md:space-y-20 pb-4 md:pb-8">
          <div className="container mx-auto px-6 max-w-5xl">
            <FoundingMemberCheckoutCard />
          </div>
          <PartnerWithUsSection />
        </div>

      {/* Stats Section – Batch 1 scarcity + progress bar */}
      <section
        ref={statsRef}
        className="relative py-20 md:py-24 bg-transparent"
      >
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
                </span>
                <span className="text-[#10b981] text-sm font-museo-bold uppercase tracking-wider">Now Open</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-museo-bold tracking-tight">
                {CONTENT.stats.title}
              </h2>
              <p className="text-sm text-white/50 font-museo-medium">
                Batch opened April 23, 2026 at 4:15 PM ET
              </p>
            </div>
            <p className="text-lg text-white/80 font-museo-medium max-w-2xl mx-auto">
              {CONTENT.stats.subtitle}
            </p>
            <p className="text-xl md:text-2xl font-bold bawo-text-cta-gradient font-museo-bold">
              {CONTENT.stats.tagline}
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8">
              {/* Batch 1 Spots */}
              <div className="text-center">
                <p className={`text-4xl md:text-5xl font-bold ${TAILWIND_COLORS.primary.text} font-museo-bold`}>
                  {CONTENT.stats.metrics.batch1.value}
                </p>
                <p className="text-sm md:text-base text-white/80 font-museo-medium uppercase tracking-wide mt-1">
                  {CONTENT.stats.metrics.batch1.label}
                </p>
                <p className="text-xs text-white/60 font-museo-regular mt-1">
                  {CONTENT.stats.metrics.batch1.subtext}
                </p>
              </div>
              
              {/* Lifetime Savings */}
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold bawo-text-cta-gradient font-museo-bold">
                  {CONTENT.stats.metrics.savings.value}
                </p>
                <p className="text-sm md:text-base text-white/80 font-museo-medium uppercase tracking-wide mt-1">
                  {CONTENT.stats.metrics.savings.label}
                </p>
                <p className="text-xs text-white/60 font-museo-regular mt-1">
                  {CONTENT.stats.metrics.savings.subtext}
                </p>
              </div>
              
              {/* No Monthly Fees */}
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white font-museo-bold">
                  {CONTENT.stats.metrics.access.value}
                </p>
                <p className="text-sm md:text-base text-white/80 font-museo-medium uppercase tracking-wide mt-1">
                  {CONTENT.stats.metrics.access.label}
                </p>
                <p className="text-xs text-white/60 font-museo-regular mt-1">
                  {CONTENT.stats.metrics.access.subtext}
                </p>
              </div>
            </div>

            {/* Value Prop Cards */}
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8">
              {/* Card 1 - Price Lock */}
              <div className="bg-white/[0.06] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.08)] p-5 text-center hover:border-[rgba(255,107,0,0.45)] transition-all duration-300">
                <div className="text-3xl mb-2">🔒</div>
                <p className="text-white/90 font-museo-bold text-lg mb-1">Price Locked Forever</p>
                <p className="text-white/60 text-sm font-museo-regular">Never pay $19.99/month</p>
              </div>
              
              {/* Card 2 - Money Back */}
              <div className="bg-white/[0.06] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.08)] p-5 text-center hover:border-[#10b981]/40 transition-all duration-300">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-white/90 font-museo-bold text-lg mb-1">30-Day Guarantee</p>
                <p className="text-white/60 text-sm font-museo-regular">Full refund, no questions asked</p>
              </div>
              
              {/* Card 3 - Exclusive Access */}
              <div className="bg-white/[0.06] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.08)] p-5 text-center hover:border-[var(--bawo-section-title-accent)]/40 transition-all duration-300">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-white/90 font-museo-bold text-lg mb-1">Founding Member Badge</p>
                <p className="text-white/60 text-sm font-museo-regular">Permanent "Day One" status</p>
              </div>
            </div>
            {/* Progress bar – Premium FOMO visual with live activity */}
            <div className="max-w-2xl mx-auto pt-8 space-y-5">
              {/* Live indicator */}
              <div className="flex items-center justify-center gap-2 text-sm text-white/70 font-museo-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                </span>
                <span className="text-[#10b981]">Live</span>
                <span>•</span>
                <span>23 people viewing now</span>
              </div>

              <p className="text-base md:text-lg font-bold font-museo-bold text-white/95 text-center">
                <span className="bawo-text-cta-gradient text-2xl md:text-3xl">050</span>{" "}
                / <span className="bawo-text-cta-gradient">500</span> Founding Spots Taken
              </p>
              
              <div className="h-3 w-full rounded-full bg-white/[0.08] overflow-hidden backdrop-blur-sm border border-[rgba(255,255,255,0.08)] shadow-inner relative">
                <div
                  className="h-full w-[10%] rounded-full bg-[#ff6b00] transition-all duration-500 shadow-[0_0_14px_rgba(255,107,0,0.55)] animate-pulse"
                  aria-label="50 of 500 spots taken"
                />
              </div>
              
              <p className="text-xs md:text-sm text-white/60 font-museo-medium italic text-center">
                Only 450 spots remaining in Batch 1
              </p>

              {/* Live Activity Feed */}
              <div className="mt-8 bg-white/[0.04] backdrop-blur-sm rounded-xl border border-[rgba(255,255,255,0.06)] p-4 space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-white/50 font-museo-bold mb-3">Recent Activity</h4>
                
                {/* Activity Item 1 */}
                <div className="flex items-center justify-between text-sm animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b00] to-[#5a260c] flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                    <div>
                      <p className="text-white/90 font-museo-medium">Adanna from <span className="text-[var(--bawo-brand-cta-orange)]">Brooklyn</span></p>
                      <p className="text-white/50 text-xs font-museo-regular">joined as Founding Member</p>
                    </div>
                  </div>
                  <span className="text-white/40 text-xs font-museo-regular whitespace-nowrap">2m ago</span>
                </div>

                {/* Activity Item 2 */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white text-xs font-bold">
                      T
                    </div>
                    <div>
                      <p className="text-white/90 font-museo-medium">Tunde from <span className="text-[var(--bawo-brand-cta-orange)]">Harlem</span></p>
                      <p className="text-white/50 text-xs font-museo-regular">joined as Founding Member</p>
                    </div>
                  </div>
                  <span className="text-white/40 text-xs font-museo-regular whitespace-nowrap">8m ago</span>
                </div>

                {/* Activity Item 3 */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center text-white text-xs font-bold">
                      C
                    </div>
                    <div>
                      <p className="text-white/90 font-museo-medium">Chiamaka from <span className="text-[var(--bawo-brand-cta-orange)]">Queens</span></p>
                      <p className="text-white/50 text-xs font-museo-regular">joined as Founding Member</p>
                    </div>
                  </div>
                  <span className="text-white/40 text-xs font-museo-regular whitespace-nowrap">15m ago</span>
                </div>

                {/* Activity Item 4 */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a855f7] to-[#7e22ce] flex items-center justify-center text-white text-xs font-bold">
                      O
                    </div>
                    <div>
                      <p className="text-white/90 font-museo-medium">Obinna from <span className="text-[var(--bawo-brand-cta-orange)]">The Bronx</span></p>
                      <p className="text-white/50 text-xs font-museo-regular">joined as Founding Member</p>
                    </div>
                  </div>
                  <span className="text-white/40 text-xs font-museo-regular whitespace-nowrap">23m ago</span>
                </div>

                {/* Activity Item 5 */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ec4899] to-[#be185d] flex items-center justify-center text-white text-xs font-bold">
                      N
                    </div>
                    <div>
                      <p className="text-white/90 font-museo-medium">Ngozi from <span className="text-[var(--bawo-brand-cta-orange)]">Brooklyn</span></p>
                      <p className="text-white/50 text-xs font-museo-regular">joined as Founding Member</p>
                    </div>
                  </div>
                  <span className="text-white/40 text-xs font-museo-regular whitespace-nowrap">41m ago</span>
                </div>
              </div>

              {/* Price Comparison Calculator */}
              <div className="mt-8 bg-white/[0.06] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.08)] p-6 max-w-3xl mx-auto">
                <h4 className="text-white font-museo-bold text-lg mb-4 text-center">The Math: Founding Member vs. Monthly Subscription</h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Founding Member */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">👑</span>
                      <h5 className="text-[var(--bawo-brand-cta-orange)] font-museo-bold text-lg">Founding Member</h5>
                    </div>
                    <div className="space-y-2 text-white/80 text-sm font-museo-medium">
                      <div className="flex justify-between">
                        <span>Today:</span>
                        <span className="font-museo-bold text-white">$25</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 1:</span>
                        <span className="font-museo-bold text-white">$25</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 2:</span>
                        <span className="font-museo-bold text-white">$25</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 3:</span>
                        <span className="font-museo-bold text-white">$25</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 5:</span>
                        <span className="font-museo-bold text-white">$25</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between text-[#10b981] font-museo-bold">
                        <span>Forever:</span>
                        <span>$25 total</span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Subscription */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📅</span>
                      <h5 className="text-white/60 font-museo-bold text-lg">Monthly Member</h5>
                    </div>
                    <div className="space-y-2 text-white/60 text-sm font-museo-medium">
                      <div className="flex justify-between">
                        <span>Today:</span>
                        <span className="font-museo-bold">$0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 1:</span>
                        <span className="font-museo-bold">$240</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 2:</span>
                        <span className="font-museo-bold">$480</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 3:</span>
                        <span className="font-museo-bold">$720</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year 5:</span>
                        <span className="font-museo-bold">$1,200</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between text-red-400 font-museo-bold">
                        <span>Forever:</span>
                        <span>$$$</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <p className="bawo-text-cta-gradient font-museo-bold text-xl">
                    Save $215 in Year 1 alone. $1,175+ over 5 years.
                  </p>
                  <p className="text-white/60 text-sm font-museo-regular mt-2">
                    Your $25 pays for itself in under 2 months.
                  </p>
                </div>
              </div>

              {/* Urgency Warning Box */}
              <div className="mt-8 bg-gradient-to-r from-[rgba(255,107,0,0.14)] to-[rgba(255,107,0,0.06)] backdrop-blur-sm rounded-xl border border-[rgba(255,107,0,0.35)] p-6 max-w-2xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">⚠️</div>
                  <div className="flex-1 space-y-3">
                    <h4 className="text-white font-museo-bold text-lg">After Batch 1 Closes...</h4>
                    <ul className="space-y-2 text-white/80 text-sm font-museo-medium">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--bawo-brand-cta-orange)] mt-0.5">→</span>
                        <span>Price increases to <strong className="text-white">$19.99/month</strong> ($240/year)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--bawo-brand-cta-orange)] mt-0.5">→</span>
                        <span>No more lifetime access option</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--bawo-brand-cta-orange)] mt-0.5">→</span>
                        <span>Founding Member badge becomes exclusive</span>
                      </li>
                    </ul>
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-xs text-white/60 font-museo-regular italic">
                        {CONTENT.stats.urgency.deadline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Reversal - Money Back Guarantee */}
            <div className="max-w-2xl mx-auto mt-8 bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 backdrop-blur-sm rounded-xl border border-[#10b981]/30 p-6 text-center">
              <div className="text-4xl mb-3">💯</div>
              <h4 className="text-white font-museo-bold text-xl mb-2">Zero-Risk 30-Day Guarantee</h4>
              <p className="text-white/80 font-museo-medium text-base mb-4">
                Try BawoSocial for 30 days. If you're not connecting, networking, and winning — we'll refund your $25. No questions asked.
              </p>
              <p className="text-[#10b981] font-museo-bold text-sm">
                {CONTENT.stats.urgency.guarantee}
              </p>
            </div>
          </div>
        </div>
      </section>

        {/* Origin Story Section – structured block with clear hierarchy */}
        <section className="relative min-h-screen flex items-center justify-center bg-transparent py-24">
          <div className="relative z-10 container mx-auto px-6 flex flex-col items-center">
            <div className="text-white space-y-14 w-full max-w-5xl mx-auto">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-extrabold font-museo-bold leading-tight text-center tracking-tight">
                {CONTENT.origin.title}
              </h2>
              <div className="glass-card rounded-2xl px-6 md:px-10 py-12 space-y-8">
                <p className="text-white/95 font-museo-medium text-xl md:text-2xl leading-relaxed md:leading-[2] text-left">
                  Most Nigerians in the diaspora feel isolated and{" "}
                  <strong className="font-museo-bold text-white">disconnected from opportunity</strong>. We miss our culture, our people, and our network. BawoSocial was created to fix that.
                </p>
                <p className="text-white/95 font-museo-medium text-xl md:text-2xl leading-relaxed md:leading-[2] text-left">
                  We are a <strong className="font-museo-bold text-white">utility-first platform</strong> to find your tribe, access The Black Book of resources, and build meaningful wealth and relationships—powered by smart technology that understands who we are.
                </p>
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
        className="relative min-h-screen bg-transparent py-24"
      >
        <div className="relative z-10 container mx-auto px-6 py-20 min-h-[calc(100vh-10rem)]">
          <div className="grid lg:grid-cols-2 gap-12 h-full items-stretch">
            {/* Left Content - Benefits */}
            <div className="glass-card rounded-2xl p-8 md:p-10 text-white space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-museo-bold">
              {CONTENT.foundingMember.title}
                  <br />
                  <span className="bawo-text-cta-gradient">{CONTENT.foundingMember.titleHighlight}</span>
          </h2>
                <p className="text-base md:text-lg font-museo-regular text-white/80">
                  {CONTENT.foundingMember.subtitle}
            </p>
          </div>

              <div className="space-y-6">
                <div className="space-y-4">
              {CONTENT.foundingMember.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <BadgeCheck className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
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

            {/* Right Content - CTA on right, vertically centered */}
            <div className="hidden lg:flex h-full w-full items-center justify-end mt-10 lg:mt-0">
              <BawoPillButton
                label={CONTENT.foundingMember.cta}
                icon={Lock}
                variant="primary"
                size="lg"
                onClick={handleFoundingMember}
              />
            </div>

            {/* Mobile / tablet CTA centered below card */}
            <div className="flex lg:hidden justify-center mt-10 w-full px-2">
              <BawoPillButton
                label={CONTENT.foundingMember.cta}
                icon={Lock}
                variant="primary"
                size="md"
                onClick={handleFoundingMember}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section – 3-column cards with icons */}
      <section
        ref={featuresRef}
        className="relative min-h-screen flex items-center justify-center bg-transparent py-24"
      >
        <div className="relative z-10 text-white px-6 md:px-10 max-w-7xl py-20 mx-auto w-full">
          <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-16 ${TAILWIND_COLORS.primary.text} font-museo-bold`}>
            {CONTENT.features.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {CONTENT.features.items.map((item, index) => {
              const Icon = index === 0 ? Home : index === 1 ? BookOpen : Sparkles;
              return (
                <div
                  key={index}
                  className="feature-card glass-card rounded-2xl p-8 text-center flex flex-col items-center border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,0,0.55)] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
                >
                  <Icon
                    className="w-8 h-8 md:w-9 md:h-9 text-white shrink-0 mb-6"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <h3 className="text-xl md:text-2xl font-bold font-museo-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-base md:text-lg font-museo-regular leading-relaxed text-white/85 max-w-prose">
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
        className="relative py-24 bg-transparent"
      >

        <div className="relative z-10 container mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-museo-bold mb-4">
              What Our Community Says
          </h2>
            <p className="text-lg md:text-xl text-white/80 font-museo-medium">
              Hear from Nigerians excited to connect on BawoSocial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="testimonial-card bg-white/[0.06] backdrop-blur-md rounded-2xl p-7 md:p-8 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,0,0.45)] shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-white/40">
                  <img
                    src={IMAGES.testimonials.adaora}
                    alt={CONTENT.testimonials.reviews[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h4 className="font-museo-bold text-white text-sm md:text-base">
                    {CONTENT.testimonials.reviews[0].name}
                  </h4>
                  <p className="text-xs md:text-sm text-white/80 font-museo-medium">
                    {CONTENT.testimonials.reviews[0].role}
                  </p>
                </div>
              </div>
              <p className="text-white/85 font-museo-medium leading-relaxed text-sm md:text-base">
                "{CONTENT.testimonials.reviews[0].quote}"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card bg-white/[0.06] backdrop-blur-md rounded-2xl p-7 md:p-8 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,0,0.45)] shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-white/40">
                  <img
                    src={IMAGES.testimonials.emeka}
                    alt={CONTENT.testimonials.reviews[1].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h4 className="font-museo-bold text-white text-sm md:text-base">
                    {CONTENT.testimonials.reviews[1].name}
                  </h4>
                  <p className="text-xs md:text-sm text-white/80 font-museo-medium">
                    {CONTENT.testimonials.reviews[1].role}
                  </p>
                </div>
              </div>
              <p className="text-white/85 font-museo-medium leading-relaxed text-sm md:text-base">
                "{CONTENT.testimonials.reviews[1].quote}"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card bg-white/[0.06] backdrop-blur-md rounded-2xl p-7 md:p-8 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,0,0.45)] shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-white/40">
                  <img
                    src={IMAGES.testimonials.fatima}
                    alt={CONTENT.testimonials.reviews[2].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h4 className="font-museo-bold text-white text-sm md:text-base">
                    {CONTENT.testimonials.reviews[2].name}
                  </h4>
                  <p className="text-xs md:text-sm text-white/80 font-museo-medium">
                    {CONTENT.testimonials.reviews[2].role}
                  </p>
                </div>
              </div>
              <p className="text-white/85 font-museo-medium leading-relaxed text-sm md:text-base">
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
          <h2 className="text-center text-4xl md:text-5xl font-bold font-museo-bold text-white mb-12">
            This Is What Belonging Looks Like
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {IMAGES.inApp.features.map((image, index) => (
              <div
                key={index}
                className="text-center bg-black/40 backdrop-blur-md rounded-2xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,0,0.55)] shadow-[0_8px_32px_rgba(0,0,0,0.37)] p-4 transition-all duration-300"
              >
                <div className="rounded-xl overflow-hidden mb-3">
                  <img
                    src={image}
                    alt={`BawoSocial Feature ${index + 1}`}
                    className="h-80 w-full object-contain mx-auto bg-black/40"
                  />
                </div>
                <p className="text-white mt-1 font-museo-medium">
                  {index === 0 && "Join Your Groups - local communities, no noise."}
                  {index === 1 && "Access The Black Book - vetted resources & contacts."}
                  {index === 2 && "Smart Matching - connect based on intent."}
                  {index === 3 && "Attend Events - real-world meetups."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Highlights Section */}
      <section
        className="relative py-24 bg-transparent"
      >

        <div className="relative z-10 container mx-auto px-6">
          <h2 className="text-center text-4xl md:text-5xl font-bold font-museo-bold text-white mb-12">
            Featured Events
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,0,0.45)] text-white transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-white" />
                <span className="font-museo-bold">
                  Diaspora Networking Night – Downtown Brooklyn
                </span>
              </div>
              <p className="text-white/80 font-museo-medium">
                Connect with professionals across industries and build lasting
                relationships.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,0,0.45)] text-white transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
              <div className="flex items-center gap-3 mb-3">
                <Headphones className="w-5 h-5 text-white" />
                <span className="font-museo-bold">
                  The Black Book: Live Q&A
                </span>
              </div>
              <p className="text-white/80 font-museo-medium">
                Immigration & Housing experts answering member questions live.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,0,0.45)] text-white transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-5 h-5 text-white" />
                <span className="font-museo-bold">
                  Nigerian Independence Celebration – Manhattan, NYC
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

      {/* Final CTA Section */}
      <section
        ref={finalCtaRef}
        id="email-section"
        className="relative min-h-screen flex items-center justify-center bg-transparent"
      >
        
        <div className="relative z-10 container mx-auto px-6 py-24">
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

            <MailchimpSignupRow
              className="relative w-full max-w-2xl mx-auto"
              buttonLabel="Get updates"
            />

            {/* Divider: OR — waitlist first, then founding / TestFlight */}
            <div className="flex items-center gap-4 max-w-2xl mx-auto w-full">
              <span className="flex-1 h-px bg-white/20" aria-hidden />
              <span className="text-white/60 font-museo-medium text-sm uppercase tracking-wider">Or</span>
              <span className="flex-1 h-px bg-white/20" aria-hidden />
            </div>

            <div className="flex flex-col gap-5 justify-center items-center w-full max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-center sm:items-stretch">
                <div className="flex w-full sm:w-auto justify-center shrink-0">
                  <BawoPillButton
                    label={CONTENT.finalCta.cta}
                    icon={Lock}
                    variant="primary"
                    size="md"
                    onClick={handleFoundingMember}
                  />
                </div>
                <div className="w-full sm:flex-1 sm:min-w-0 flex">
                  <a
                    href={CONTENT.hero.testflightLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-warm-auth bawo-cta-glass-secondary min-h-[3.5rem]"
                  >
                    <span className="pill-warm-auth__icon" aria-hidden>
                      <Download className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <span className="pill-warm-auth__label">
                      <span className="block">Or download via TestFlight</span>
                      <span className="pill-warm-auth__label-sub block">
                        (free beta)
                      </span>
                    </span>
                  </a>
                </div>
              </div>

              <div className="bawo-trust-row flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-normal">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#635bff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                  </svg>
                  {CONTENT.hero.trustIndicators.stripe}
                </span>
                <span className="bawo-trust-row__sep">|</span>
                <span>{CONTENT.hero.trustIndicators.oneTime}</span>
                <span className="bawo-trust-row__sep">|</span>
                <span>{CONTENT.hero.trustIndicators.cancel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-transparent">
        {/* Mobile Sticky CTA */}
        <div className="md:hidden mobile-sticky-cta bg-black/70 backdrop-blur-md border-t border-[rgba(255,255,255,0.08)]">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <span className="text-white font-museo-medium text-sm shrink-0">
              Only 450 Spots Left
            </span>
            <BawoPillButton
              label="Join for $25"
              variant="primary"
              size="sm"
              className="shrink-0"
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
                Connecting the Nigerian diaspora worldwide through authentic
                relationships, resources, and cultural pride.
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

      <div
        className="fixed z-50 bottom-6 right-6 flex flex-col gap-4 items-end pointer-events-auto"
        aria-label="BawoSocial on social media"
      >
        <a
          href="https://www.instagram.com/bawo.social/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
          className="transform hover:scale-110 transition-transform duration-300"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="url(#instagram-gradient-float)">
            <defs>
              <linearGradient id="instagram-gradient-float" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#FD5949", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "#D6249F", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#285AEB", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        <a
          href="https://twitter.com/bawoapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          title="X (Twitter)"
          className="transform hover:scale-110 transition-transform duration-300"
        >
          <svg className="w-8 h-8" fill="#1DA1F2" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </a>
        <a
          href="https://linkedin.com/company/bawoapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
          className="transform hover:scale-110 transition-transform duration-300"
        >
          <svg className="w-8 h-8" fill="#0A66C2" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@bawosocial"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          title="TikTok"
          className="transform hover:scale-110 transition-transform duration-300"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="tiktok-gradient-float" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#00F2EA", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#FF0050", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="url(#tiktok-gradient-float)"
              d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
            />
          </svg>
        </a>
      </div>

      </div>
    </div>
  );
}

export default App;
