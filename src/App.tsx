import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Users, Globe, Heart, CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import appMockup from './assets/images/app-mockup.png';
import bawoLogo from './assets/images/bawo-logo.png';
import globeImage from './assets/images/globe.png';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  const trustRef = useRef(null);
  const finalCtaRef = useRef(null);

  // Animation setup
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;

    // Hero section entrance animation
    const heroTimeline = gsap.timeline();
    
    // Logo animation
    heroTimeline.fromTo(logoRef.current, 
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
    
    // Headline animation
    heroTimeline.fromTo(headlineRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.6"
    );
    
    // Subheadline animation
    heroTimeline.fromTo(subheadlineRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );
    
    // Phone mockup animation
    heroTimeline.fromTo(phoneRef.current,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
      "-=0.4"
    );
    
    // CTA buttons animation
    heroTimeline.fromTo(ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );
    
    // Stats animation
    heroTimeline.fromTo(statsRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.2"
    );

    // Scroll-triggered animations
    gsap.utils.toArray('.animate-on-scroll').forEach((element) => {
      gsap.fromTo(element,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Staggered card animations
    gsap.fromTo('.feature-card',
      { y: 30, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Testimonial animations
    gsap.fromTo('.testimonial-card',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // City statistics animations
    gsap.fromTo('.city-stat',
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: globalReachRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Trust indicators animation
    gsap.fromTo('.trust-indicator',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: trustRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleEarlyAccess = () => {
    const emailSection = document.getElementById('email-section');
    emailSection?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const emailInput = document.getElementById('email-input');
      emailInput?.focus();
      setIsEmailFocused(true);
    }, 1000);
  };

  const handleFoundingMember = () => {
    window.open('https://buy.stripe.com/fZu7sMgBBfgmeK2caf3Nm00', '_blank');
    // Track click for analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'founding_member_click', {
        event_category: 'conversion',
        event_label: 'stripe_payment'
      });
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate email submission
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      // Track email signup
      if (typeof gtag !== 'undefined') {
        gtag('event', 'email_signup', {
          event_category: 'lead',
          event_label: 'early_access'
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#073925' }}>
      {/* Sticky Banner - Hidden on first page */}
      {/* <div className="fixed top-0 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 py-3 px-4 text-center font-bold z-50 shadow-lg font-museo-bold">
        <div className="flex items-center justify-center gap-3">
          <img
            src={bawoLogo}
            alt="BAWO"
            className="h-10 w-auto"
          />
          <span>🚨 ONLY 73 FOUNDING MEMBER SPOTS REMAINING - SECURE YOURS NOW! 🇳🇬</span>
        </div>
      </div> */}

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
        background: 'linear-gradient(135deg, #073925 0%, #052a1c 50%, #031a12 100%)',
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff7f39]/5 to-transparent"></div>

        {/* BAWO Logo - Floating Top Left with Rotating Globe */}
        <div ref={logoRef} className="absolute -top-12 left-16 z-20">
          {/* Rotating Globe Background */}
          <div className="relative">
            <div className="absolute inset-0 animate-spin-slow flex items-center justify-center">
              <img
                src={globeImage}
                alt="Rotating Globe"
                className="w-12 h-12 md:w-20 md:h-20 lg:w-28 lg:h-28 object-cover"
              />
            </div>
            {/* Logo on top */}
            <img
              src={bawoLogo}
              alt="BAWO Logo"
              className="relative z-10 h-40 md:h-56 lg:h-64 w-auto drop-shadow-lg"
            />
          </div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content - App Mockup */}
            <div ref={phoneRef} className="flex justify-center lg:justify-center order-2 md:order-1">
              <div className="relative">
                {/* Phone Frame Effect */}
                <div className="relative">
                  <img
                    src={appMockup}
                    alt="BAWO Nigerian Community App Preview"
                    className="w-64 md:w-80 lg:w-96 h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] transform hover:scale-105 transition-transform duration-500 rounded-[2rem] border-4 border-gray-800 animate-breathing"
                  />
                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#ff7f39]/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>
                  {/* Screen Reflection */}
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/5 to-transparent rounded-t-[2rem] pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="text-center lg:text-left space-y-10 order-1 lg:order-2">
              {/* Main Heading */}
              <div className="space-y-6">
                <h1 ref={headlineRef} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.4] font-museo-bold">
                  <span className="text-[#ff7f39]">Secure Your Legacy as a Founding Member</span>
                </h1>
                <p ref={subheadlineRef} className="text-base md:text-lg opacity-90 font-museo-regular text-white/90 leading-[1.6]">
                Limited to first 100 members - 73 spots remaining. Join the fastest-growing Nigerian network with lifetime benefits worth $1,188.
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="relative">
                  <button
                    onClick={handleFoundingMember}
                    className="bg-gradient-to-r from-[#FF4500] to-[#ff7f39] hover:from-[#ff7f39] hover:to-[#FF4500] text-white px-10 py-5 rounded-lg font-bold text-base md:text-lg transform hover:scale-105 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-xl font-museo-bold w-full sm:w-auto max-w-[300px] animate-lift"
                  >
                    Claim Your Spot Now - $49 🚀
                  </button>
                  {/* Urgency Indicator */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                                  <button
                    onClick={handleEarlyAccess}
                    className="bg-transparent border-2 border-[#ff7f39] text-white hover:bg-[#ff7f39] hover:text-white px-10 py-5 rounded-lg font-bold text-base md:text-lg transform hover:scale-105 transition-all duration-300 font-museo-bold w-full sm:w-auto max-w-[300px] animate-lift"
                  >
                    Learn More 📧
                  </button>
              </div>

              {/* Trust Elements */}
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-white/70 font-museo-medium">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>30-Day Money-Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🔒</span>
                  </div>
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🛡️</span>
                  </div>
                  <span>PCI Compliant</span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span>🔒</span>
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span>💳</span>
                  <span>Powered by Stripe</span>
                </div>
              </div>

              {/* Stats */}
              <div ref={statsRef} className="pt-8">
                <div className="text-center lg:text-left mb-8">
                  <h3 className="text-lg md:text-xl font-bold text-white font-museo-bold mb-2">
                    Last chance to become a BAWO Founding Member
                  </h3>
                  <p className="text-sm text-white/70 font-museo-medium">
                    New members join daily in 50+ cities worldwide
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                  {/* Active Members */}
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white font-museo-black mb-2">
                      7.2K+
                    </div>
                    <div className="text-sm text-white/80 font-museo-medium">
                      NIGERIANS CONNECTED
                    </div>
                  </div>
                  
                  {/* Cities */}
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white font-museo-black mb-2">
                      50+
                    </div>
                    <div className="text-sm text-white/80 font-museo-medium">
                      CITIES WORLDWIDE
                    </div>
                  </div>
                  
                  {/* Match Success */}
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white font-museo-black mb-2">
                      98%
                    </div>
                    <div className="text-sm text-white/80 font-museo-medium">
                      SATISFACTION RATE
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-[#ff7f39]" />
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="relative py-20 bg-gradient-to-b from-[#073925] to-[#052a1c]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-museo-bold mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-white/80 font-museo-medium">
              Join thousands of Nigerians who've found their tribe
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="testimonial-card bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff7f39] to-[#ff6b35] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  AK
                </div>
                <div className="ml-3">
                  <h4 className="font-museo-bold text-white">Adaora K.</h4>
                  <p className="text-sm text-white/70 font-museo-medium">Software Engineer, Toronto</p>
                </div>
              </div>
              <p className="text-white/90 font-museo-medium leading-relaxed">
                "BAWO helped me connect with Nigerian professionals in Toronto. Found my tribe in weeks!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff7f39] to-[#ff6b35] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  EO
                </div>
                <div className="ml-3">
                  <h4 className="font-museo-bold text-white">Emeka O.</h4>
                  <p className="text-sm text-white/70 font-museo-medium">Entrepreneur, London</p>
                </div>
              </div>
              <p className="text-white/90 font-museo-medium leading-relaxed">
                "Finally, a platform that understands our culture. The networking opportunities are incredible."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff7f39] to-[#ff6b35] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  FK
                </div>
                <div className="ml-3">
                  <h4 className="font-museo-bold text-white">Fatima K.</h4>
                  <p className="text-sm text-white/70 font-museo-medium">Doctor, New York</p>
                </div>
              </div>
              <p className="text-white/90 font-museo-medium leading-relaxed">
                "The verification process gives me confidence that these are real, quality connections."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Member Section */}
      <section ref={foundingMemberRef} className="relative min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #073925 0%, #052a1c 50%, #031a12 100%)',
      }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content - Benefits */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-museo-bold">
                  Join the First 100 Nigerians
                  <br />
                  <span className="text-[#ff7f39]">Building Our Community</span>
                  <span className="ml-3 text-6xl">🇳🇬</span>
                </h2>
                <p className="text-base md:text-lg font-museo-regular text-white/90">
                  Limited to first 100 members - 73 spots remaining
                </p>
                <p className="text-sm font-museo-regular text-white/80">
                  Be part of BAWO's founding story. Get lifetime premium access worth $1,188.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-museo-bold text-white">FOUNDING MEMBERS GET:</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-[#ff7f39] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-museo-medium text-base">Lifetime Premium Access (Worth $1,188)</span>
                      <div className="text-sm text-white/70 mt-1">($99/year value)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-[#ff7f39] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-museo-medium text-base">Priority Customer Support</span>
                      <div className="text-sm text-white/70 mt-1">($199/year value)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-[#ff7f39] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-museo-medium text-base">Exclusive Founding Member Events</span>
                      <div className="text-sm text-white/70 mt-1">($299/year value)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-[#ff7f39] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-museo-medium text-base">Founding Member Badge & Recognition</span>
                      <div className="text-sm text-white/70 mt-1">($199/year value)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-[#ff7f39] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-museo-medium text-base">Unlimited Group Creation & Spotlights</span>
                      <div className="text-sm text-white/70 mt-1">($199/year value)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-[#ff7f39] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-museo-medium text-base">Direct Input on New Features</span>
                      <div className="text-sm text-white/70 mt-1">($193/year value)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-museo-medium text-white/80 text-sm">REGULAR PRICE: $9.99/month ($120/year)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl md:text-3xl font-museo-bold text-[#ff7f39]">FOUNDING MEMBER: $49 one-time</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ff7f39]">💰</span>
                  <span className="font-museo-medium text-white/90">Save $1,139 in lifetime value</span>
                </div>
              </div>
            </div>

            {/* Right Content - Nigerian Map & CTA */}
            <div className="flex flex-col items-center space-y-8">
              <div className="relative">
                {/* Globe Graphic */}
                <div className="flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-transform duration-500">
                  <div className="text-white text-center">
                    <div className="animate-spin-slow mb-3">
                      <img
                        src={globeImage}
                        alt="Global Network"
                        className="w-48 h-48 md:w-56 md:h-56 object-cover"
                      />
                    </div>
                    <div className="font-museo-bold text-xl">Global Network</div>
                    <div className="text-base opacity-80 font-museo-medium">Worldwide Connections</div>
                  </div>
                </div>
                {/* Network Pattern Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full"></div>
              </div>

              <div className="text-center space-y-4">
                <button
                  onClick={handleFoundingMember}
                  className="bg-gradient-to-r from-[#ff7f39] to-[#ff6b35] hover:from-[#ff6b35] hover:to-[#ff5a2e] text-white px-12 py-6 rounded-lg font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-xl font-museo-bold"
                >
                  SECURE YOUR SPOT - $49
                </button>
                <p className="text-white font-museo-medium">Only 73 founding member spots remaining</p>
                
                {/* Security Badges */}
                <div className="flex items-center justify-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <span>🔒</span>
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <span>💳</span>
                    <span>Stripe Powered</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <span>🛡️</span>
                    <span>PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #052a1c 0%, #073925 50%, #0a4a2e 100%)',
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-white px-6 max-w-6xl py-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 text-[#ff7f39] font-museo-bold">
            Your Tribe Awaits
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="feature-card text-center p-8 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
              <Users className="w-12 h-12 text-[#ff7f39] mx-auto mb-6" />
              <h3 className="text-xl md:text-2xl font-bold mb-4 font-museo-bold">Connect Locally & Globally</h3>
              <p className="text-base md:text-lg opacity-90 font-museo-medium leading-[1.5]">Business partnerships, career opportunities, and authentic connections with Nigerians worldwide</p>
            </div>
            <div className="feature-card text-center p-8 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
              <Globe className="w-12 h-12 text-[#ff7f39] mx-auto mb-6" />
              <h3 className="text-xl md:text-2xl font-bold mb-4 font-museo-bold">Access Exclusive Opportunities</h3>
              <p className="text-base md:text-lg opacity-90 font-museo-medium leading-[1.5]">Job referrals, investment opportunities, and exclusive events across continents</p>
            </div>
            <div className="feature-card text-center p-8 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
              <Heart className="w-12 h-12 text-[#ff7f39] mx-auto mb-6" />
              <h3 className="text-xl md:text-2xl font-bold mb-4 font-museo-bold">Celebrate Nigerian Heritage</h3>
              <p className="text-base md:text-lg opacity-90 font-museo-medium leading-[1.5]">Cultural events, language exchange, and preserving our rich traditions together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Diaspora Statistics Section */}
      <section ref={globalReachRef} className="relative min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #073925 0%, #052a1c 50%, #031a12 100%)',
      }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff7f39]/5 to-transparent"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-museo-bold">
                7,200+ Nigerians Connected Worldwide
              </h2>
              <p className="text-lg md:text-xl font-museo-medium text-white/90">
                Join the fastest-growing Nigerian network
              </p>
              <p className="text-base font-museo-regular text-[#ff7f39]">
                New members join daily in 50+ cities
              </p>
            </div>

            {/* City Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mt-16">
              {/* New York */}
              <div className="city-stat text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=112&h=112&fit=crop&crop=center" 
                    alt="New York"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">NEW YORK</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,247 MEMBERS</p>
                </div>
              </div>

              {/* London */}
              <div className="city-stat text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=112&h=112&fit=crop&crop=center" 
                    alt="London"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">LONDON</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,092 MEMBERS</p>
                </div>
              </div>

              {/* Atlanta */}
              <div className="city-stat text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=112&h=112&fit=crop&crop=center" 
                    alt="Atlanta"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">ATLANTA</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,684 MEMBERS</p>
                </div>
              </div>

              {/* LA */}
              <div className="city-stat text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=112&h=112&fit=crop&crop=center" 
                    alt="Los Angeles"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">LA</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,503 MEMBERS</p>
                </div>
              </div>

              {/* Canada */}
              <div className="city-stat text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1464983953574-0892a716854b?w=112&h=112&fit=crop&crop=center" 
                    alt="Canada"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">CANADA</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,174 MEMBERS</p>
                </div>
              </div>

              {/* Houston */}
              <div className="city-stat text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=112&h=112&fit=crop&crop=center" 
                    alt="Houston"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg md:text-xl">HOUSTON</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,223 MEMBERS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section ref={trustRef} className="relative py-16 bg-gradient-to-b from-[#052a1c] to-[#073925]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-museo-bold mb-4">
              Why Trust BAWO?
            </h2>
            <p className="text-lg text-white/80 font-museo-medium">
              Built with security and trust at the core
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="trust-indicator text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff7f39] to-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-white font-museo-bold mb-2">Secure Payments</h3>
              <p className="text-white/70 text-sm font-museo-medium">256-bit SSL encryption with Stripe processing</p>
            </div>
            
            <div className="trust-indicator text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff7f39] to-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="text-white font-museo-bold mb-2">Money-Back Guarantee</h3>
              <p className="text-white/70 text-sm font-museo-medium">30-day full refund, no questions asked</p>
            </div>
            
            <div className="trust-indicator text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff7f39] to-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🛡️</span>
              </div>
              <h3 className="text-white font-museo-bold mb-2">Verified Profiles</h3>
              <p className="text-white/70 text-sm font-museo-medium">All members verified for authentic connections</p>
            </div>
            
            <div className="trust-indicator text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff7f39] to-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔐</span>
              </div>
              <h3 className="text-white font-museo-bold mb-2">Privacy Protected</h3>
              <p className="text-white/70 text-sm font-museo-medium">Your data is secure and never shared</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        ref={finalCtaRef}
        id="email-section"
        className="relative min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #073925 0%, #052a1c 100%)',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-museo-bold">
                Secure Your Founding Member Status 🇳🇬
              </h2>
              <p className="text-lg md:text-xl font-museo-medium text-white/90">
                Last chance to become a BAWO Founding Member
              </p>
            </div>

            {/* Email Form */}
            {!isSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for launch notification"
                    className={`flex-1 px-6 py-4 rounded-lg border-2 text-lg focus:outline-none transition-all bg-white/10 backdrop-blur-sm text-white placeholder-white/70 font-museo-medium ${
                      isEmailFocused
                        ? 'border-[#ff7f39] ring-4 ring-[#ff7f39]/20'
                        : 'border-white/20 focus:border-[#ff7f39]'
                    }`}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-10 py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 font-museo-bold"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Get Launch Update <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="max-w-lg mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="flex items-center justify-center gap-3 text-white">
                  <CheckCircle className="w-8 h-8 text-[#ff7f39]" />
                  <span className="text-xl font-bold font-museo-bold">You're on the list! 🎉</span>
                </div>
                <p className="text-white/80 mt-2 font-museo-medium">We'll notify you when BAWO launches</p>
              </div>
            )}

            {/* Main CTA */}
            <div className="space-y-4">
              <button
                onClick={handleFoundingMember}
                className="bg-gradient-to-r from-[#ff7f39] to-[#ff6b35] hover:from-[#ff6b35] hover:to-[#ff5a2e] text-white px-12 py-6 rounded-lg font-bold text-lg md:text-xl transform hover:scale-105 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-xl font-museo-bold"
              >
                Claim Your Spot Now - $49
              </button>
              <p className="text-white font-museo-medium">30-day money-back guarantee • Save $1,139+ • Only 73 left</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-museo-bold mb-4">BAWO</h3>
              <p className="text-white/70 text-sm font-museo-medium mb-4">
                Connecting the Nigerian diaspora worldwide through authentic relationships and cultural pride.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <a href="#" className="text-white/60 hover:text-white">Instagram</a>
                <a href="#" className="text-white/60 hover:text-white">TikTok</a>
                <a href="#" className="text-white/60 hover:text-white">LinkedIn</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-museo-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="block text-white/70 hover:text-white text-sm font-museo-medium">About Us</a>
                <a href="#" className="block text-white/70 hover:text-white text-sm font-museo-medium">How It Works</a>
                <a href="#" className="block text-white/70 hover:text-white text-sm font-museo-medium">Founding Members</a>
                <a href="#" className="block text-white/70 hover:text-white text-sm font-museo-medium">Contact</a>
              </div>
            </div>

            {/* Legal */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-museo-bold mb-4">Legal</h3>
              <div className="space-y-2">
                <a href="#" className="block text-white/70 hover:text-white text-sm font-museo-medium">Privacy Policy</a>
                <a href="#" className="block text-white/70 hover:text-white text-sm font-museo-medium">Terms of Service</a>
                <a href="#" className="block text-white/70 hover:text-white text-sm font-museo-medium">Refund Policy</a>
                <a href="#" className="block text-white/70 hover:text-white text-sm font-museo-medium">Cookie Policy</a>
              </div>
            </div>

            {/* Security & Trust */}
            <div className="text-center md:text-left">
              <h3 className="text-white font-museo-bold mb-4">Security & Trust</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span>🔒</span>
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span>💳</span>
                  <span>Powered by Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span>🛡️</span>
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span>✓</span>
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60 text-sm font-museo-regular">
              2025 BAWO. Made with ❤️ for the Nigerian diaspora. Payments secured by Stripe • SSL encrypted • PCI compliant
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
