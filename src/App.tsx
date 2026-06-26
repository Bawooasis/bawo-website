import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BadgeCheck,
  BookOpen,
  Calendar,
  Clock,
  Crown,
  Flame,
  Gem,
  Headphones,
  Home,
  Menu,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BoroughNetworkGraphic from "./components/BoroughNetworkGraphic";
import BoroughSquareCarousel from "./components/BoroughSquareCarousel";
import BawoPillButton from "./components/BawoPillButton";
import MobileAppDownloadRow from "./components/MobileAppDownloadRow";
import FoundingMemberCheckoutCard from "./components/FoundingMemberCheckoutCard";
import MailchimpSignupRow from "./components/MailchimpSignupRow";
import PartnerWithUsSection from "./components/PartnerWithUsSection";
import { CONTENT } from "./constants/content";
import { TAILWIND_COLORS } from "./constants/colors";
import { IMAGES } from "./constants/images";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const previewImages = IMAGES.previews.gallery;
  const previewImgRef = useRef<HTMLImageElement | null>(null);

  // Countdown timer to August 1, 2026
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('2026-08-01T23:59:59').getTime();
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
          phoneRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, clearProps: "transform" },
          "-=0.45"
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

      // Feature cards
      gsap.fromTo(
        ".feature-card",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          force3D: true,
          clearProps: "transform",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
            fastScrollEnd: true,
          },
        }
      );

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
      // Borough tiles — scale up from 0.96 (subtle, GPU-friendly)
      gsap.fromTo(
        ".city-stat",
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          force3D: true,
          clearProps: "transform",
          scrollTrigger: {
            trigger: globalReachRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
            fastScrollEnd: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Hero preview crossfade — fade out first, swap image in onComplete, then fade in
  useEffect(() => {
    if (!previewImages || previewImages.length < 2) return;
    const intervalId = setInterval(() => {
      const el = previewImgRef.current;
      if (!el) return;
      gsap.to(el, {
        opacity: 0,
        duration: 0.3,
        ease: "power1.inOut",
        onComplete: () => {
          setActivePreviewIndex((prev) => (prev + 1) % previewImages.length);
          gsap.to(el, { opacity: 1, duration: 0.5, ease: "power2.out" });
        },
      });
    }, 4000);
    return () => clearInterval(intervalId);
  }, [previewImages]);


  const handleFoundingMember = () => {
    const baseUrl = CONTENT.revenue.foundingStripeCheckoutUrl;
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source") || "direct";
    const utmMedium = params.get("utm_medium") || "";
    const utmCampaign = params.get("utm_campaign") || "";
    const ref = [utmSource, utmMedium, utmCampaign].filter(Boolean).join("_");
    const separator = baseUrl.includes("?") ? "&" : "?";
    const checkoutUrl = `${baseUrl}${separator}client_reference_id=${encodeURIComponent(ref)}`;
    window.open(checkoutUrl, "_blank");
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
    <div className="min-h-screen relative overflow-x-hidden">
      <div
        className="fixed inset-0 z-0 bawo-page-bg"
        aria-hidden
      />
      
      {/* Promo strip — full-bleed glass, yellow copy + white icons, ribbon animation (see `index.css`) */}
      <div className="bawo-promo-strip fixed top-0 left-0 right-0 z-40 py-2 overflow-hidden">
        <div
          className="bawo-promo-ribbon flex w-full items-center justify-center gap-x-3 px-4 text-[10px] md:text-xs text-yellow-300 animate-slide-in-left"
          style={{
            textShadow:
              "0 0 12px rgba(250, 204, 21, 0.4), 0 0 24px rgba(234, 179, 8, 0.18)",
          }}
        >
          <span className="flex items-center gap-1.5 font-museo-medium whitespace-nowrap">
            <Gem className="h-3 w-3 shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] md:h-3.5 md:w-3.5" strokeWidth={2} aria-hidden />
            <span>Lifetime access, one payment</span>
          </span>
          <span className="text-white/30 hidden sm:inline" aria-hidden>
            |
          </span>
          <span className="hidden sm:flex items-center gap-1.5 font-museo-bold whitespace-nowrap">
            <Crown className="h-3 w-3 shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] md:h-3.5 md:w-3.5" strokeWidth={2} aria-hidden />
            <span>Founding Member Badge</span>
          </span>
          <span className="text-white/30 hidden md:inline" aria-hidden>
            |
          </span>
          <span className="hidden md:flex items-center gap-1.5 font-museo-medium whitespace-nowrap">
            <Clock className="h-3 w-3 shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] md:h-3.5 md:w-3.5" strokeWidth={2} aria-hidden />
            <span className="text-yellow-300/90">Batch 1 Closes:</span>
            <span className="font-museo-bold tabular-nums">
              {timeLeft.days}d {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m
            </span>
          </span>
          <span className="text-white/30 hidden lg:inline" aria-hidden>
            |
          </span>
          <span className="hidden lg:flex items-center gap-1.5 font-museo-bold whitespace-nowrap">
            <Flame className="h-3 w-3 shrink-0 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] md:h-3.5 md:w-3.5" strokeWidth={2} aria-hidden />
            <span>450 Spots Left</span>
          </span>
        </div>
      </div>
      
      {/* Navigation Header */}
      <nav className="fixed top-[2.5rem] left-0 right-0 z-30">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 xl:px-12">
          {/* Scroll-aware pill container */}
          <div
            className="flex items-center justify-between transition-all duration-500 ease-out"
            style={
              scrolled
                ? {
                    background: "rgba(6, 3, 12, 0.72)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "9999px",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
                    padding: "0.35rem 0.75rem 0.35rem 0.5rem",
                    marginTop: "0.5rem",
                  }
                : {
                    background: "transparent",
                    border: "1px solid transparent",
                    borderRadius: "9999px",
                    boxShadow: "none",
                    padding: "0 0.25rem",
                    marginTop: "0",
                  }
            }
          >
            <a
              href="#"
              className="shrink-0 flex items-center self-center -translate-y-0.5"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src={IMAGES.assets.logo}
                alt="BawoSocial"
                className={`block h-auto transition-all duration-500 ${
                  scrolled
                    ? "w-[7.5rem]"
                    : "w-[8.5rem] sm:w-[9.5rem] md:w-[10.5rem]"
                }`}
              />
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
              {[
                { label: "Network", href: "#building-the-network" },
                { label: "About", href: "#about" },
                { label: "Features", href: "#features" },
                { label: "Events", href: "#events" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 lg:px-4 py-2 text-sm font-museo-medium text-white/75 hover:text-white rounded-full hover:bg-white/[0.08] transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#pricing"
                className="ml-2 px-5 py-2 text-sm font-museo-bold text-[#ff8a33] rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgba(255,107,0,0.12)]"
                style={{
                  border: "1.5px solid #ff6b00",
                  boxShadow:
                    "0 0 12px rgba(255,107,0,0.45), 0 0 32px rgba(255,107,0,0.15)",
                  textShadow:
                    "0 0 10px rgba(255,107,0,0.55), 0 0 24px rgba(255,107,0,0.2)",
                }}
              >
                Join Now
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/[0.08]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 pb-4 bg-black/85 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
              <div className="flex flex-col px-4 py-3 gap-1">
                {[
                  { label: "Network", href: "#building-the-network" },
                  { label: "About", href: "#about" },
                  { label: "Features", href: "#features" },
                  { label: "Events", href: "#events" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-sm font-museo-medium text-white/80 hover:text-white rounded-xl hover:bg-white/[0.08] transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#pricing"
                  className="mt-2 mx-2 px-5 py-3 text-sm font-museo-bold text-[#ff8a33] text-center rounded-full transition-all duration-300"
                  style={{
                    border: "1.5px solid #ff6b00",
                    boxShadow:
                      "0 0 12px rgba(255,107,0,0.45), 0 0 32px rgba(255,107,0,0.15)",
                    textShadow:
                      "0 0 10px rgba(255,107,0,0.55), 0 0 24px rgba(255,107,0,0.2)",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Now
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="relative z-10 bg-transparent min-h-screen scroll-content-gpu">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative flex justify-center items-start overflow-x-hidden overflow-y-visible pt-[max(5rem,calc(env(safe-area-inset-top,0px)+3.75rem))] sm:pt-[max(5.5rem,calc(env(safe-area-inset-top,0px)+4rem))] md:pt-[max(7rem,calc(env(safe-area-inset-top,0px)+5.25rem))] lg:pt-[max(7rem,calc(env(safe-area-inset-top,0px)+5.25rem))] xl:pt-[max(8rem,calc(env(safe-area-inset-top,0px)+6rem))] pb-10 sm:pb-12 md:pb-14 min-h-0 lg:min-h-[100dvh] bg-transparent"
        >
          <div className="bawo-hero-ambient pointer-events-none absolute inset-0 z-0" aria-hidden />
          {/* Main Content Container */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-2 sm:pt-3 pb-2 max-w-screen-2xl w-full">
            <div className="flex flex-col items-center gap-10 md:gap-14">
              {/* Hero Text - Centered */}
              <div className="text-center space-y-6 md:space-y-8 w-full max-w-4xl mx-auto pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36">
                <div className="space-y-5 md:space-y-7">
                  <h1
                    ref={headlineRef}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.15] font-display text-white break-words"
                  >
                    {CONTENT.hero.title}
                  </h1>
                  <p
                    ref={subheadlineRef}
                    className="text-sm sm:text-base md:text-lg opacity-90 font-medium text-white leading-[1.6] max-w-2xl mx-auto break-words"
                  >
                    {CONTENT.hero.subtitle}
                  </p>
                </div>

                <div
                  ref={ctaRef}
                  className="flex flex-col gap-4 justify-center items-center w-full"
                >
                  <div className="w-fit max-w-full">
                    <BawoPillButton
                      label={CONTENT.hero.ctaPrimary}
                      variant="primary"
                      size="md"
                      className="bawo-pill-cta-surface min-w-[14rem]"
                      onClick={handleFoundingMember}
                    />
                  </div>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent("I just found BawoSocial — the private network for NYC Nigerians. $25 lifetime access, only 450 spots left. Join here: https://joinbawo.com?utm_source=whatsapp")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-transparent text-white/70 text-xs font-museo-medium hover:border-[#25D366]/50 hover:text-[#25D366] transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Share on WhatsApp
                  </a>

                  <div className="mt-5 md:mt-7 flex flex-col gap-3 items-center w-full max-w-2xl">
                    <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                      {CONTENT.hero.ctaMicrocopy}
                    </p>

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
                </div>
              </div>

              {/* App Preview Mockup - Below centered text */}
              {previewImages.length > 0 && (
                <div
                  ref={phoneRef}
                  className="flex flex-col items-center w-full max-w-5xl mx-auto gap-2 sm:gap-3"
                >
                  <div
                    className={`relative w-full flex flex-col items-center ${previewImages.length > 1 ? "pb-9 sm:pb-10" : "pb-0"}`}
                  >
                    <div className="relative w-full max-w-none sm:max-w-[min(100%,42rem)] md:max-w-[min(100%,52rem)] overflow-hidden rounded-2xl">
                      <img
                        ref={previewImgRef}
                        src={previewImages[activePreviewIndex]}
                        alt="BawoSocial app: Explore, Community, and Concierge"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        className="w-full h-auto max-h-[min(62vh,34rem)] sm:max-h-[min(68vh,40rem)] md:max-h-[min(72vh,46rem)] lg:max-h-[min(82vh,52rem)] xl:max-h-[min(84vh,58rem)] 2xl:max-h-[min(86vh,62rem)] object-contain object-center animate-subtle-float"
                        style={{ opacity: 1 }}
                      />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: `
                            linear-gradient(to top, var(--bawo-canvas) 0%, transparent 18%),
                            linear-gradient(to bottom, var(--bawo-canvas) 0%, transparent 14%),
                            linear-gradient(to left, var(--bawo-canvas) 0%, transparent 12%),
                            linear-gradient(to right, var(--bawo-canvas) 0%, transparent 12%)
                          `,
                        }}
                      />
                    </div>
                    {previewImages.length > 1 && (
                      <div className="flex items-center justify-center gap-2 absolute bottom-1 inset-x-0">
                        {previewImages.map((_, idx) => (
                          <span
                            key={idx}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              idx === activePreviewIndex
                                ? "bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                                : "bg-white/30"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <MobileAppDownloadRow className="self-center" />
                </div>
              )}
            </div>

          </div>
        </section>

      {/* Building the Network — section 2 (borough hubs) */}
      <section
        ref={globalReachRef}
        id="building-the-network"
        className="relative bg-transparent py-20 md:py-[5rem] overflow-x-hidden section-contain"
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
                          <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] mx-auto overflow-hidden rounded-full shadow-[0_28px_80px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.16] transition-transform duration-300 hover:scale-[1.04] hover:ring-[#D4AF37]/45 hover:shadow-[0_32px_90px_rgba(212,175,55,0.12)]">
                            <BoroughSquareCarousel
                              images={rotatingGallery}
                              alt={`${city.name}, Nigerian diaspora community in NYC`}
                              rotationStaggerMs={index * 700}
                            />
                          </div>
                        ) : (
                          <div className="w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_28px_80px_rgba(0,0,0,0.72)] overflow-hidden hover:scale-[1.04] transition-transform duration-300">
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
                          <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] mx-auto overflow-hidden rounded-full shadow-[0_28px_80px_rgba(0,0,0,0.72)] ring-1 ring-white/[0.16] transition-transform duration-300 hover:scale-[1.04] hover:ring-[#D4AF37]/45 hover:shadow-[0_32px_90px_rgba(212,175,55,0.12)]">
                            <BoroughSquareCarousel
                              images={rotatingGallery}
                              alt={`${city.name}, Nigerian diaspora community in NYC`}
                              rotationStaggerMs={i * 700}
                            />
                          </div>
                        ) : (
                          <div className="w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[22rem] xl:h-[22rem] mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_28px_80px_rgba(0,0,0,0.72)] overflow-hidden hover:scale-[1.04] transition-transform duration-300">
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

        <div className="relative bg-transparent space-y-16 md:space-y-20 pt-[5rem] pb-6 md:pb-10">
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

            {/* Prominent Countdown Timer */}
            <div className="pt-6">
              <p className="text-xs uppercase tracking-widest text-white/50 font-museo-bold mb-3">Batch 1 Closes In</p>
              <div className="flex items-center justify-center gap-3 md:gap-5">
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-museo-bold tabular-nums text-[var(--bawo-brand-cta-orange)]">{timeLeft.days}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/60 font-museo-medium mt-1">Days</span>
                </div>
                <span className="text-2xl md:text-3xl text-white/30 font-museo-bold -mt-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-museo-bold tabular-nums text-[var(--bawo-brand-cta-orange)]">{String(timeLeft.hours).padStart(2, "0")}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/60 font-museo-medium mt-1">Hours</span>
                </div>
                <span className="text-2xl md:text-3xl text-white/30 font-museo-bold -mt-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-museo-bold tabular-nums text-[var(--bawo-brand-cta-orange)]">{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/60 font-museo-medium mt-1">Minutes</span>
                </div>
                <span className="text-2xl md:text-3xl text-white/30 font-museo-bold -mt-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-museo-bold tabular-nums text-white">{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/60 font-museo-medium mt-1">Seconds</span>
                </div>
              </div>
            </div>
            
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
                <span>Batch 1 open — spots filling</span>
              </div>

              <p className="text-base md:text-lg font-bold font-museo-bold text-white/95 text-center">
                <span className="bawo-text-cta-gradient text-2xl md:text-3xl">50</span>{" "}
                / <span className="bawo-text-cta-gradient">500</span> Founding Spots Taken
              </p>
              
              <div className="h-3 w-full rounded-full bg-white/[0.08] overflow-hidden backdrop-blur-sm border border-[rgba(255,255,255,0.08)] shadow-inner relative">
                <div
                  className="h-full w-[10%] rounded-full bg-[#ff6b00] shadow-[0_0_14px_rgba(255,107,0,0.45)] transition-[width] duration-500"
                  aria-label="50 of 500 spots taken"
                />
              </div>
              
              <p className="text-xs md:text-sm text-white/60 font-museo-medium italic text-center">
                Only 450 spots remaining in Batch 1
              </p>

              {/* Live Activity Feed */}
              {/* Price Comparison Calculator */}
              <div className="mt-8 bg-white/[0.06] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.08)] p-6 max-w-3xl mx-auto">
                <h4 className="text-white font-museo-bold text-lg mb-4 text-center">The Math: Founding Member vs. Monthly Subscription</h4>

                <div className="mb-6 rounded-2xl border border-[rgba(212,175,55,0.35)] bg-gradient-to-br from-[rgba(212,175,55,0.12)] via-[rgba(6,3,12,0.72)] to-[rgba(255,107,0,0.08)] px-4 py-5 sm:px-8 sm:py-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                  <p className="text-[10px] sm:text-xs font-museo-bold uppercase tracking-[0.2em] text-[#D4AF37]/90 mb-2">
                    Lifetime pass vs. paying monthly (5 yrs)
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-8">
                    <div>
                      <p className="text-xs text-white/55 font-museo-medium mb-1">Pay once</p>
                      <p className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tabular-nums text-[#D4AF37] drop-shadow-[0_2px_24px_rgba(212,175,55,0.35)]">
                        $25
                      </p>
                    </div>
                    <span className="hidden sm:block text-3xl font-museo-bold text-white/25" aria-hidden>
                      vs
                    </span>
                    <div>
                      <p className="text-xs text-white/55 font-museo-medium mb-1">Monthly path</p>
                      <p className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tabular-nums text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.12)]">
                        $1,200
                      </p>
                      <p className="text-[11px] text-white/45 font-museo-regular mt-1">
                        stacked over five years, no founder perks
                      </p>
                    </div>
                  </div>
                </div>
                
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
                        <span>5-year total:</span>
                        <span>$1,200+</span>
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
                      <p className="text-sm text-[#E8CA6A] font-museo-bold mt-2 tabular-nums">
                        {timeLeft.days}d {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s remaining
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
                Try BawoSocial for 30 days. If you're not connecting, networking, and winning, we'll refund your $25. No questions asked.
              </p>
              <p className="text-[#10b981] font-museo-bold text-sm">
                {CONTENT.stats.urgency.guarantee}
              </p>
            </div>
          </div>
        </div>
      </section>

        {/* Origin Story Section – structured block with clear hierarchy */}
        <section id="about" className="relative min-h-screen flex items-center justify-center bg-transparent py-24">
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
                  We are a <strong className="font-museo-bold text-white">utility-first platform</strong> to find your tribe, access the Resource Directory, and build meaningful wealth and relationships, powered by smart technology that understands who we are.
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
        id="pricing"
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
                variant="primary"
                size="lg"
                onClick={handleFoundingMember}
              />
            </div>

            {/* Mobile / tablet CTA centered below card */}
            <div className="flex lg:hidden justify-center mt-10 w-full px-2">
              <BawoPillButton
                label={CONTENT.foundingMember.cta}
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
        id="features"
        className="relative min-h-screen flex items-center justify-center bg-transparent py-24 section-contain"
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



      {/* In-App Preview Section */}
      <section
        className="relative py-24 bg-transparent"
      >
        <div className="relative z-10 container mx-auto px-6">
          <h2 className="text-center text-4xl md:text-5xl font-bold font-museo-bold text-white mb-12">
            This Is What Belonging Looks Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[90rem] mx-auto">
            {IMAGES.inApp.features.map((image, index) => (
              <div
                key={index}
                className="text-center bg-black/40 backdrop-blur-md rounded-2xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,107,0,0.55)] shadow-[0_8px_32px_rgba(0,0,0,0.37)] p-4 transition-all duration-300"
              >
                <div className="rounded-xl overflow-hidden mb-3">
                  <img
                    src={image}
                    alt={`BawoSocial Feature ${index + 1}`}
                    className="h-80 w-full object-contain mx-auto"
                  />
                </div>
                <p className="text-white mt-1 font-museo-medium">
                  {index === 0 &&
                    "Access Resources: Nigerian restaurants, churches, mental health, and more."}
                  {index === 1 &&
                    "Meet Concierge: NIN renewals, passports, shipping, and local intel."}
                  {index === 2 &&
                    "Join Communities: Soft Life NYC, Outside & Owambe, Heart & Vibes, The Safe Space."}
                  {index === 3 &&
                    "Discover Events: rooftop nights, film screenings, and diaspora meetups."}
                  {index === 4 &&
                    "Community, your way: My Groups, Discover, and For You in one hub."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Highlights Section */}
      <section
        id="events"
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
                  Diaspora Networking Night, Downtown Brooklyn
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
                  The Resource Directory: Live Q&A
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
                  Nigerian Independence Celebration, Manhattan, NYC
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

            <div className="flex flex-col gap-5 justify-center items-center w-full max-w-2xl mx-auto">
              <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:flex-wrap sm:justify-center">
                <BawoPillButton
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

      {/* FAQ Section — SEO keywords */}
      <section className="relative py-20 bg-transparent">
        <div className="relative z-10 container mx-auto px-6 md:px-10 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-museo-bold mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.08)]">
              <h3 className="text-lg font-museo-bold text-white mb-2">What is BawoSocial?</h3>
              <p className="text-white/75 font-museo-medium text-sm leading-relaxed">
                BawoSocial is the private community platform for the Nigerian diaspora in New York City. We connect Nigerians across Brooklyn, Harlem, Queens, The Bronx, and Staten Island with curated resources, culturally-relevant events, and community groups. It's the Nigerian community app NYC has been missing.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.08)]">
              <h3 className="text-lg font-museo-bold text-white mb-2">Who is BawoSocial for?</h3>
              <p className="text-white/75 font-museo-medium text-sm leading-relaxed">
                BawoSocial is for Nigerians and the broader African community living in NYC who want to find their people, discover Nigerian restaurants and businesses, attend Afrobeats and cultural events, and connect with professionals who share their background. Whether you're new to New York or been here for years — this is your Naija network New York.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.08)]">
              <h3 className="text-lg font-museo-bold text-white mb-2">How much does BawoSocial cost?</h3>
              <p className="text-white/75 font-museo-medium text-sm leading-relaxed">
                Founding members get lifetime access for a one-time $25 payment. After Batch 1 closes, membership will be $19.99/month ($240/year). The founding member pass gives you permanent access to the Nigerian diaspora community, the Resource Directory of Nigerian restaurants NYC, and all premium features — forever.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.08)]">
              <h3 className="text-lg font-museo-bold text-white mb-2">What resources does BawoSocial offer?</h3>
              <p className="text-white/75 font-museo-medium text-sm leading-relaxed">
                Our Resource Directory includes Nigerian restaurants NYC, consulates with live fee schedules, NIN enrollment centers with maps, shipping services with vessel tracking, churches, African stores, and mental health support. All listings are verified with real photos and business details. It's the most complete Nigerian events NYC and resources guide available.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.08)]">
              <h3 className="text-lg font-museo-bold text-white mb-2">How is BawoSocial different from Facebook groups?</h3>
              <p className="text-white/75 font-museo-medium text-sm leading-relaxed">
                Unlike algorithmic platforms, BawoSocial is built specifically for the African community app experience. No ads, no algorithm deciding what you see. Your experience is organized around vetted micro-communities, a curated directory, and a concierge that understands Nigerian diaspora needs — from passport renewals to finding the best jollof in your borough.
              </p>
            </div>
          </div>
        </div>
      </section>

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
            <BawoPillButton
              label="Secure My Spot"
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
                Connecting the Nigerian diaspora in New York City through authentic
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
              <h3 className="text-white font-museo-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a
                  href="#about"
                  className="block text-white/80 hover:text-white text-sm font-museo-medium"
                >
                  About Us
                </a>
                <a
                  href="#features"
                  className="block text-white/80 hover:text-white text-sm font-museo-medium"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="block text-white/80 hover:text-white text-sm font-museo-medium"
                >
                  Founding Members
                </a>
                <a
                  href="#testimonials"
                  className="block text-white/80 hover:text-white text-sm font-museo-medium"
                >
                  Community
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
