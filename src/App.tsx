import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Users, Globe, Heart, CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import appMockup from './assets/images/app-mockup.png';
import bawoLogo from './assets/images/bawo-logo.png';
import globeImage from './assets/images/GLOBE.png';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showCookiePolicy, setShowCookiePolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

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
              className="relative z-10 h-56 md:h-72 lg:h-80 w-auto drop-shadow-lg"
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
                <button 
                  onClick={() => {
                    console.log('Refund policy button clicked!');
                    setShowRefundPolicy(true);
                  }}
                  className="flex items-center gap-2 hover:text-[#ff7f39] transition-colors duration-300 cursor-pointer underline decoration-dotted underline-offset-4"
                >
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>30-Day Money-Back Guarantee</span>
                </button>
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

      {/* Debug Indicator - Remove after testing */}
      {showRefundPolicy && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-50">
          Modal is OPEN! State: {showRefundPolicy.toString()}
        </div>
      )}

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
                  className="flex-1 px-6 py-4 rounded-lg border-2 text-lg focus:outline-none transition-all bg-white/10 backdrop-blur-sm text-white placeholder-white/70 font-museo-medium border-white/20 focus:border-[#ff7f39]"
                />
                
                {/* Anti-spam field (required by Mailchimp) - DO NOT REMOVE */}
                <div style={{ position: 'absolute', left: '-5000px' }}>
                  <input type="text" name="b_7c2523b0334a02fe77eebddb3_842ac1ad64" tabIndex={-1} value="" />
                </div>
                
                <button
                  type="submit"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-10 py-4 rounded-lg font-bold text-base flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 font-museo-bold"
                >
                  Get Launch Updates <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

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
                <a href="https://www.instagram.com/bawo.app/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white">Instagram</a>
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
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="block text-white/70 hover:text-white text-sm font-museo-medium text-left w-full"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => setShowTermsOfService(true)}
                  className="block text-white/70 hover:text-white text-sm font-museo-medium text-left w-full"
                >
                  Terms of Service
                </button>
                <a href="#" className="block text-white/70 hover:text-white text-sm font-museo-medium">Refund Policy</a>
                <button 
                  onClick={() => setShowCookiePolicy(true)}
                  className="block text-white/70 hover:text-white text-sm font-museo-medium text-left w-full"
                >
                  Cookie Policy
                </button>
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

      {/* Refund Policy Modal */}
      {showRefundPolicy && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowRefundPolicy(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 font-museo-bold">BAWO Refund Policy</h2>
                <button
                  onClick={() => setShowRefundPolicy(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 font-museo-medium mt-2">Last Updated: July 2025</p>
            </div>
            
            <div className="p-6 space-y-6 text-gray-800">
              <p className="font-museo-medium">
                At BAWO, we want you to be completely satisfied with your founding membership. This Refund Policy explains our commitment to your satisfaction and the terms for refunds.
              </p>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">30-Day Money-Back Guarantee</h3>
                <p className="font-museo-medium mb-4">
                  We offer a <strong>full 30-day money-back guarantee</strong> for all founding memberships and premium subscriptions.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">What's Covered</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Founding Member purchases ($49 one-time payment)</strong></li>
                    <li><strong>Premium subscription fees</strong></li>
                    <li><strong>Any additional paid features or services</strong></li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">How It Works</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Full refund available</strong> within 30 days of purchase</li>
                    <li><strong>No questions asked</strong> - we respect your decision</li>
                    <li><strong>Refunds processed within 3-5 business days</strong> via Stripe to your original payment method</li>
                    <li><strong>Email confirmation</strong> sent once refund is processed</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">How to Request a Refund</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Easy Process</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li><strong>Email us</strong>: support@bawoapp.com</li>
                    <li><strong>Include</strong>: Your registered email address and reason (optional)</li>
                    <li><strong>Response time</strong>: We'll confirm your refund within 24 hours</li>
                    <li><strong>Processing</strong>: Refund appears in your account within 3-5 business days</li>
                  </ol>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Alternative Methods</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>In-app</strong>: Go to Settings &gt; Account &gt; Request Refund</li>
                    <li><strong>Contact form</strong>: Visit bawoapp.com/contact</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">What Happens After Refund</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Founding Members</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Premium access</strong> continues until refund is processed</li>
                    <li><strong>Founding member status</strong> is removed</li>
                    <li><strong>Account remains active</strong> with basic features</li>
                    <li><strong>Re-joining</strong>: You can purchase founding membership again if available</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Subscription Refunds</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Current billing period</strong> is refunded</li>
                    <li><strong>Access continues</strong> until period ends</li>
                    <li><strong>Auto-renewal</strong> is automatically cancelled</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">Special Circumstances</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Beyond 30 Days</h4>
                  <p className="text-sm mb-2">While our standard guarantee is 30 days, we consider:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Technical issues</strong> that prevented app usage</li>
                    <li><strong>Billing errors</strong> or unauthorized charges</li>
                    <li><strong>Exceptional circumstances</strong> - contact us to discuss</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">What's Not Refundable</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>App Store/Google Play</strong> purchases (subject to their refund policies)</li>
                    <li><strong>Gift memberships</strong> after recipient has activated</li>
                    <li><strong>Partial month usage</strong> for annual subscriptions (unless within 30 days)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">Payment Processing</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Secure Refunds</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Processed by Stripe</strong> - our secure payment partner</li>
                    <li><strong>Original payment method</strong> receives the refund</li>
                    <li><strong>Bank processing time</strong> may vary (typically 3-5 business days)</li>
                    <li><strong>International payments</strong> may take 5-10 business days</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Refund Confirmation</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Email notification</strong> sent when refund is initiated</li>
                    <li><strong>Transaction ID</strong> provided for your records</li>
                    <li><strong>Customer support</strong> available for any questions</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">Contact Us</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Questions About Refunds?</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Email</strong>: support@bawoapp.com</li>
                    <li><strong>Response time</strong>: Within 24 hours</li>
                    <li><strong>Phone</strong>: Available for founding members</li>
                    <li><strong>Live chat</strong>: Coming soon</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Our Commitment</h4>
                  <p className="text-sm">
                    We're committed to your satisfaction and building a trusted community. If you're not completely happy with BAWO, we want to make it right.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-gray-600 font-museo-medium">
                  <strong>Questions?</strong> Contact our support team at support@bawoapp.com - we're here to help!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Policy Modal */}
      {showCookiePolicy && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCookiePolicy(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 font-museo-bold">BAWO Cookie Policy</h2>
                <button
                  onClick={() => setShowCookiePolicy(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 font-museo-medium mt-2">Last Updated: July 2025</p>
            </div>
            
            <div className="p-6 space-y-6 text-gray-800">
              <p className="font-museo-medium">
                This Cookie Policy explains how BAWO ("we", "our", or "us") uses cookies and similar technologies when you visit our website at bawoapp.com or use our services.
              </p>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">What Are Cookies?</h3>
                <p className="font-museo-medium">
                  Cookies are small text files that are stored on your device when you visit a website. They help us provide you with a better experience by remembering your preferences and improving our services.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">How We Use Cookies</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Essential Cookies</h4>
                  <p className="text-sm mb-2"><strong>Purpose</strong>: Make our website work properly</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Session management</strong>: Keep you logged in</li>
                    <li><strong>Security</strong>: Protect against fraud and abuse</li>
                    <li><strong>Basic functionality</strong>: Remember your language preferences</li>
                    <li><strong>Cannot be disabled</strong>: These are necessary for the website to function</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Analytics Cookies</h4>
                  <p className="text-sm mb-2"><strong>Purpose</strong>: Help us understand how you use our website</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Google Analytics</strong>: Track website usage and performance</li>
                    <li><strong>Firebase Analytics</strong>: Understand user behavior patterns</li>
                    <li><strong>Performance monitoring</strong>: Identify and fix technical issues</li>
                    <li><strong>Can be disabled</strong>: Through your browser settings</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Marketing Cookies</h4>
                  <p className="text-sm mb-2"><strong>Purpose</strong>: Show you relevant content and measure campaign effectiveness</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Social media pixels</strong>: Track engagement from social platforms</li>
                    <li><strong>Advertising partners</strong>: Measure effectiveness of our ads</li>
                    <li><strong>Retargeting</strong>: Show relevant ads on other websites</li>
                    <li><strong>Can be disabled</strong>: Through your browser settings or our cookie preferences</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">Types of Cookies We Use</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">First-Party Cookies</h4>
                  <p className="text-sm mb-2">Set directly by BAWO:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>User preferences</strong>: Language, theme settings</li>
                    <li><strong>Authentication</strong>: Login status and security</li>
                    <li><strong>Form data</strong>: Remember information you&apos;ve entered</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Third-Party Cookies</h4>
                  <p className="text-sm mb-2">Set by our partners:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Google Analytics</strong>: Website usage statistics</li>
                    <li><strong>Firebase</strong>: App performance and user analytics</li>
                    <li><strong>Stripe</strong>: Secure payment processing</li>
                    <li><strong>Social media</strong>: Sharing and engagement tracking</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">Your Cookie Choices</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Browser Controls</h4>
                  <p className="text-sm mb-2"><strong>Chrome, Firefox, Safari, Edge</strong>:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Block all cookies</strong>: In privacy/security settings</li>
                    <li><strong>Delete existing cookies</strong>: Clear browsing data</li>
                    <li><strong>Block third-party cookies</strong>: In advanced settings</li>
                    <li><strong>Incognito/Private mode</strong>: Browsing without saving cookies</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Cookie Preference Center</h4>
                  <p className="text-sm mb-2"><strong>On our website</strong>:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Manage preferences</strong>: Click the cookie banner or footer link</li>
                    <li><strong>Choose categories</strong>: Accept only essential, analytics, or marketing</li>
                    <li><strong>Update anytime</strong>: Change your preferences whenever you want</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Opt-Out Links</h4>
                  <p className="text-sm mb-2"><strong>Direct opt-out options</strong>:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Google Analytics</strong>: <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a></li>
                    <li><strong>Facebook Pixel</strong>: In your Facebook ad preferences</li>
                    <li><strong>General advertising</strong>: <a href="http://optout.aboutads.info" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a></li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">Mobile App Data</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Not Traditional Cookies</h4>
                  <p className="text-sm mb-2">Our mobile app doesn&apos;t use browser cookies, but similar technologies:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Local storage</strong>: App preferences and settings</li>
                    <li><strong>Analytics SDKs</strong>: Firebase for usage analytics</li>
                    <li><strong>Advertising IDs</strong>: For relevant ad experiences</li>
                    <li><strong>Crash reporting</strong>: To improve app stability</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Mobile Controls</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>iOS</strong>: Settings &gt; Privacy &amp; Security &gt; Tracking</li>
                    <li><strong>Android</strong>: Settings &gt; Privacy &gt; Ads</li>
                    <li><strong>App settings</strong>: Manage preferences within BAWO app</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">Data We Collect Through Cookies</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Website Visitors</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Pages visited</strong>: Which sections interest you most</li>
                    <li><strong>Time spent</strong>: How long you engage with our content</li>
                    <li><strong>Device information</strong>: Browser type, screen size, operating system</li>
                    <li><strong>Referral source</strong>: How you found our website</li>
                    <li><strong>Geographic location</strong>: General region (not precise location)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Conversion Tracking</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Sign-up process</strong>: Where visitors drop off or complete registration</li>
                    <li><strong>Purchase behavior</strong>: What leads to founding member conversions</li>
                    <li><strong>Campaign effectiveness</strong>: Which marketing efforts work best</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">How Long Cookies Last</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Session Cookies</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Duration</strong>: Deleted when you close your browser</li>
                    <li><strong>Purpose</strong>: Temporary functionality like login status</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Persistent Cookies</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Essential cookies</strong>: Up to 1 year</li>
                    <li><strong>Analytics cookies</strong>: Up to 2 years</li>
                    <li><strong>Marketing cookies</strong>: Up to 1 year</li>
                    <li><strong>Preference cookies</strong>: Until you change them</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">Cookie Security</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Protection Measures</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Secure transmission</strong>: HTTPS encryption for all cookies</li>
                    <li><strong>Limited access</strong>: Only authorized systems can read our cookies</li>
                    <li><strong>Regular audits</strong>: We review and update cookie practices</li>
                    <li><strong>No sensitive data</strong>: Personal information is not stored in cookies</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">Changes to This Policy</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Updates</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Notification</strong>: We&apos;ll update the &quot;Last Updated&quot; date</li>
                    <li><strong>Significant changes</strong>: We&apos;ll notify you via email or website banner</li>
                    <li><strong>Your consent</strong>: Continued use means acceptance of updates</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">Contact Us</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Questions About Cookies?</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Email</strong>: privacy@bawoapp.com</li>
                    <li><strong>Subject line</strong>: &quot;Cookie Policy Question&quot;</li>
                    <li><strong>Response time</strong>: Within 48 hours</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Privacy Team</h4>
                  <p className="text-sm">
                    We&apos;re committed to transparency about how we use cookies and protecting your privacy while providing the best possible experience.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-gray-600 font-museo-medium">
                  <strong>Need help managing your cookie preferences?</strong> Contact us at privacy@bawoapp.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsOfService && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowTermsOfService(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 font-museo-bold">BAWO Terms of Service</h2>
                <button
                  onClick={() => setShowTermsOfService(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 font-museo-medium mt-2">Last Updated: July 2025</p>
            </div>
            
            <div className="p-6 space-y-6 text-gray-800">
              <p className="font-museo-medium">
                Welcome to BAWO! These Terms of Service ("Terms") govern your access to and use of our website (bawoapp.com), mobile application, and any related services (collectively, the "Service"). By using BAWO, you agree to these Terms. If you don&apos;t agree, please don&apos;t use our services.
              </p>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">1. About BAWO</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Our Service</h4>
                  <p className="text-sm mb-3">
                    BAWO is a community platform designed to connect Nigerians worldwide for authentic relationships, friendships, professional networking, and cultural celebration. We provide both a website and mobile application to facilitate these connections.
                  </p>
                  
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Founding Member Program</h4>
                  <p className="text-sm">
                    We offer a limited founding member program with exclusive benefits and lifetime access to premium features. Founding membership is limited to the first 100 members.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">2. Eligibility and Account Registration</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Age Requirement</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>18+ only</strong>: You must be 18 years or older to use BAWO</li>
                    <li><strong>Age verification</strong>: By creating an account, you confirm you meet this requirement</li>
                    <li><strong>Enforcement</strong>: We may request verification and will remove accounts of users under 18</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Account Responsibility</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Accurate information</strong>: Provide truthful and up-to-date information</li>
                    <li><strong>Security</strong>: Keep your login credentials secure and confidential</li>
                    <li><strong>Single account</strong>: Maintain only one account per person</li>
                    <li><strong>Verification</strong>: We may verify your identity and Nigerian heritage</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">3. Founding Member Terms</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Founding Membership Benefits</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Lifetime premium access</strong>: No monthly fees ever (normally $9.99/month)</li>
                    <li><strong>Founding member badge</strong>: Special recognition in the community</li>
                    <li><strong>Unlimited group creation</strong>: Create and manage unlimited interest groups</li>
                    <li><strong>Premium spotlights</strong>: Enhanced profile visibility</li>
                    <li><strong>Direct input</strong>: Influence on new features and platform direction</li>
                    <li><strong>Exclusive community</strong>: Access to founding member-only events and discussions</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Payment Terms</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>One-time fee</strong>: $49 for lifetime founding membership</li>
                    <li><strong>Payment processing</strong>: Securely handled by Stripe</li>
                    <li><strong>Refund policy</strong>: 30-day money-back guarantee</li>
                    <li><strong>Limited availability</strong>: Only 100 founding member spots available</li>
                    <li><strong>No recurring charges</strong>: Founding membership is a one-time payment</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">4. User Conduct and Community Guidelines</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Acceptable Use</h4>
                  <p className="text-sm mb-2">You agree to use BAWO for:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Building authentic connections</strong> with other Nigerians</li>
                    <li><strong>Professional networking</strong> and career opportunities</li>
                    <li><strong>Cultural celebration</strong> and community building</li>
                    <li><strong>Friendship and social engagement</strong></li>
                    <li><strong>Dating and romantic relationships</strong> (app users)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Prohibited Conduct</h4>
                  <p className="text-sm mb-2">You agree NOT to:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Harass, threaten, or harm</strong> other users</li>
                    <li><strong>Post false, misleading, or impersonating</strong> content</li>
                    <li><strong>Spam or solicit</strong> for external products or services</li>
                    <li><strong>Share inappropriate content</strong> (explicit, violent, or offensive material)</li>
                    <li><strong>Violate laws</strong> or regulations in your jurisdiction</li>
                    <li><strong>Attempt to hack</strong> or compromise platform security</li>
                    <li><strong>Create fake profiles</strong> or misrepresent your identity</li>
                    <li><strong>Discriminate</strong> based on tribe, religion, gender, or other characteristics</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">5. Your Content and Intellectual Property</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Your Content Rights</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Ownership</strong>: You retain ownership of content you create (photos, messages, posts)</li>
                    <li><strong>License to BAWO</strong>: You grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content as needed for platform operation</li>
                    <li><strong>Purpose limitation</strong>: We only use your content to provide BAWO services</li>
                    <li><strong>No selling</strong>: We will never sell your content to third parties</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">6. Privacy and Data Protection</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Privacy Commitment</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Privacy-first approach</strong>: We prioritize protecting your personal information</li>
                    <li><strong>No data selling</strong>: We never sell personal data to third parties</li>
                    <li><strong>Secure processing</strong>: All data handled with industry-standard security</li>
                    <li><strong>Transparency</strong>: Clear information about data collection and use</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">7. Payment Terms and Billing</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Founding Member Payments</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Payment processor</strong>: All payments handled securely by Stripe</li>
                    <li><strong>Pricing</strong>: $49 one-time payment for founding membership</li>
                    <li><strong>Payment methods</strong>: Credit cards, debit cards, and other Stripe-supported methods</li>
                    <li><strong>Currency</strong>: USD (other currencies may be supported in the future)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">8. Refunds and Cancellations</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">30-Day Guarantee</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Full refund</strong>: Available within 30 days of founding member purchase</li>
                    <li><strong>No questions asked</strong>: We respect your decision</li>
                    <li><strong>Process</strong>: Email support@bawoapp.com for instant refund processing</li>
                    <li><strong>Timeline</strong>: Refunds processed within 3-5 business days</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">9. Platform Availability and Support</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Service Availability</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Best effort</strong>: We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                    <li><strong>Maintenance</strong>: Scheduled maintenance will be announced in advance</li>
                    <li><strong>Updates</strong>: Regular app and website updates to improve functionality</li>
                    <li><strong>Support</strong>: Customer support available via email and in-app chat</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">10. Termination and Account Suspension</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Our Right to Terminate</h4>
                  <p className="text-sm mb-2">We may suspend or terminate accounts for:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Terms violations</strong>: Breaking any part of these Terms</li>
                    <li><strong>Community harm</strong>: Behavior that harms other users or the community</li>
                    <li><strong>Illegal activity</strong>: Using BAWO for illegal purposes</li>
                    <li><strong>Abuse</strong>: Repeated violations despite warnings</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">11. Disclaimers and Limitations</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Service Disclaimers</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>&quot;As is&quot; basis</strong>: BAWO provided without warranties of any kind</li>
                    <li><strong>No guarantees</strong>: We don&apos;t guarantee specific outcomes, matches, or connections</li>
                    <li><strong>User responsibility</strong>: You&apos;re responsible for your interactions with other users</li>
                    <li><strong>Third-party content</strong>: We&apos;re not responsible for content created by users</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">12. Dispute Resolution</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Informal Resolution</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>First step</strong>: Contact support@bawoapp.com to resolve issues</li>
                    <li><strong>Good faith</strong>: We&apos;ll work in good faith to address your concerns</li>
                    <li><strong>Response time</strong>: Initial response within 48 hours</li>
                    <li><strong>Escalation</strong>: Unresolved issues may be escalated to management</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">13. International Users</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Global Community</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Worldwide service</strong>: BAWO serves Nigerian diaspora globally</li>
                    <li><strong>Local laws</strong>: You must comply with laws in your jurisdiction</li>
                    <li><strong>Data transfers</strong>: Your data may be processed in different countries</li>
                    <li><strong>Currency</strong>: Payments processed in USD but may display in local currency</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">14. Changes to Terms</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Updates</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Notification</strong>: We&apos;ll notify you of significant changes via email or app notification</li>
                    <li><strong>Effective date</strong>: Changes take effect 30 days after notification</li>
                    <li><strong>Continued use</strong>: Using BAWO after changes means you accept updated Terms</li>
                    <li><strong>Disagreement</strong>: If you disagree with changes, you may delete your account</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">15. Miscellaneous</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Entire Agreement</h4>
                  <p className="text-sm">
                    These Terms, together with our Privacy Policy and other referenced policies, constitute the entire agreement between you and BAWO.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">16. Contact Information</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">General Support</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Email</strong>: support@bawoapp.com</li>
                    <li><strong>Response time</strong>: Within 24 hours</li>
                    <li><strong>Website</strong>: bawoapp.com/contact</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Legal Inquiries</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Email</strong>: legal@bawoapp.com</li>
                    <li><strong>Subject</strong>: Include &quot;Terms of Service&quot; in subject line</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-gray-600 font-museo-medium">
                  <strong>Questions about these Terms?</strong> Contact us at support@bawoapp.com - we&apos;re here to help build an amazing community together!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <h2 className="text-2xl font-bold text-gray-900 font-museo-bold">BAWO Privacy Policy</h2>
                <button
                  onClick={() => setShowPrivacyPolicy(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 font-museo-medium mt-2">Last Updated: July 2025</p>
            </div>
            
            <div className="p-6 space-y-6 text-gray-800">
              <p className="font-museo-medium">
                Welcome to BAWO ("we", "our", or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and share your information when you visit our website at bawoapp.com and use the BAWO mobile application and services.
              </p>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">1. Information We Collect</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Website Visitors</h4>
                  <p className="text-sm mb-2">When you visit our website, we collect:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Browsing data</strong>: Pages viewed, time spent, device type, browser information</li>
                    <li><strong>Contact information</strong>: Email address when you sign up for updates or founding membership</li>
                    <li><strong>Analytics data</strong>: How you interact with our site (via Google Analytics and similar tools)</li>
                    <li><strong>Cookies</strong>: See our Cookie Policy for detailed information</li>
                    <li><strong>Payment information</strong>: Processed securely by Stripe when you become a founding member</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Mobile App Users</h4>
                  <p className="text-sm mb-2">When you use the BAWO app, we collect:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Account Information</strong>: Name, email, phone number, date of birth (to verify you are 18+)</li>
                    <li><strong>Profile Data</strong>: Photos, bios, preferences, answers to onboarding questions and daily prompts</li>
                    <li><strong>Location Information</strong>: Approximate location (if shared), to help with matches and local events</li>
                    <li><strong>Device Information</strong>: Device type, operating system, crash data, and usage analytics (via Firebase)</li>
                    <li><strong>Payment Information</strong>: If you make purchases, payment details are handled securely by Stripe. We do not store full credit card data ourselves</li>
                    <li><strong>User Content</strong>: Messages, reactions, posts, and answers you submit in-app</li>
                    <li><strong>Usage Analytics</strong>: How you use app features to improve your experience</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">2. How We Use Your Information</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Website Operations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Provide our website services</strong> and process founding member signups</li>
                    <li><strong>Send updates</strong> about BAWO launch and community news</li>
                    <li><strong>Improve website performance</strong> and user experience</li>
                    <li><strong>Process payments</strong> securely through Stripe</li>
                    <li><strong>Respond to inquiries</strong> and provide customer support</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Mobile App Operations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Create and personalize</strong> your profile and matching experience</li>
                    <li><strong>Connect you</strong> with potential matches, friends, and community members</li>
                    <li><strong>Facilitate group chats</strong> and local events</li>
                    <li><strong>Improve app performance</strong> and protect against abuse</li>
                    <li><strong>Process payments</strong> and offer subscriptions or premium features</li>
                    <li><strong>Send notifications</strong> about matches, messages, and community updates</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">3. Sharing of Information</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-3"><strong>We do not sell your personal data.</strong> We may share limited information with:</p>
                  
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Service Providers</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Stripe</strong>: For secure payment processing</li>
                    <li><strong>Firebase/Google</strong>: For authentication, database, analytics, and push notifications</li>
                    <li><strong>Email providers</strong>: For sending updates and notifications</li>
                    <li><strong>Customer support tools</strong>: To provide better support</li>
                    <li><strong>Analytics services</strong>: To understand how our website and app are used</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">4. Your Rights and Choices</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Access and Control</h4>
                  <p className="text-sm mb-2">Depending on your location (US, EU, Nigeria, etc.), you may have rights to:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Access</strong> your personal information</li>
                    <li><strong>Update or correct</strong> your data</li>
                    <li><strong>Delete</strong> your account and data</li>
                    <li><strong>Download</strong> a copy of your information</li>
                    <li><strong>Withdraw consent</strong> for data processing</li>
                    <li><strong>Object</strong> to certain uses of your data</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">5. Data Storage and Security</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Security Measures</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Encryption</strong>: All data transmitted using SSL/TLS encryption</li>
                    <li><strong>Secure servers</strong>: Data stored on protected servers with access controls</li>
                    <li><strong>Regular audits</strong>: We regularly review our security practices</li>
                    <li><strong>Employee training</strong>: Staff trained on privacy and security best practices</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">6. Age Restrictions</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-2"><strong>BAWO is only for users 18 years or older.</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Age verification</strong>: We require users to confirm they are 18+</li>
                    <li><strong>Under 18</strong>: If we learn someone under 18 has created an account, we will remove it immediately</li>
                    <li><strong>Parental concerns</strong>: Contact us at support@bawoapp.com</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">7. Cookies and Tracking</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Website Cookies</h4>
                  <p className="text-sm mb-2">We use cookies to:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Remember your preferences</strong> and login status</li>
                    <li><strong>Analyze website usage</strong> to improve our services</li>
                    <li><strong>Provide security</strong> and prevent fraud</li>
                    <li><strong>Personalize content</strong> and advertisements</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">8. Third-Party Services</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Payment Processing</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Stripe</strong>: Handles all payment processing securely</li>
                    <li><strong>PCI compliance</strong>: We follow industry standards for payment security</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">9. California Privacy Rights (CCPA)</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">California Residents</h4>
                  <p className="text-sm mb-2">If you&apos;re a California resident, you have additional rights:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Right to know</strong>: What personal information we collect and how it&apos;s used</li>
                    <li><strong>Right to delete</strong>: Request deletion of your personal information</li>
                    <li><strong>Right to opt-out</strong>: Of the sale of personal information (we don&apos;t sell data)</li>
                    <li><strong>Right to non-discrimination</strong>: We won&apos;t discriminate for exercising your rights</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">10. European Privacy Rights (GDPR)</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">EU/UK Residents</h4>
                  <p className="text-sm mb-2">If you&apos;re in the EU or UK, you have additional rights under GDPR:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Lawful basis</strong>: We process data based on consent, contract, or legitimate interests</li>
                    <li><strong>Data portability</strong>: Get a copy of your data in a portable format</li>
                    <li><strong>Right to object</strong>: Object to processing based on legitimate interests</li>
                    <li><strong>Automated decision-making</strong>: Right to human review of automated decisions</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">11. Changes to This Policy</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Updates</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Notification</strong>: We&apos;ll update the &quot;Last Updated&quot; date when changes are made</li>
                    <li><strong>Significant changes</strong>: We&apos;ll notify you via email or app notification</li>
                    <li><strong>Your options</strong>: You can always review the current policy on our website</li>
                    <li><strong>Continued use</strong>: Using BAWO after changes means you accept the updated policy</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 font-museo-bold mb-3">12. Contact Us</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">Privacy Questions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Email</strong>: privacy@bawoapp.com</li>
                    <li><strong>Subject</strong>: Include &quot;Privacy Policy&quot; in the subject line</li>
                    <li><strong>Response time</strong>: We&apos;ll respond within 48 hours</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-bold text-gray-900 font-museo-bold mb-2">General Support</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Email</strong>: support@bawoapp.com</li>
                    <li><strong>Website</strong>: bawoapp.com/contact</li>
                    <li><strong>Response time</strong>: Within 24 hours</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-gray-600 font-museo-medium">
                  <strong>Questions about your privacy?</strong> We&apos;re here to help. Contact us at privacy@bawoapp.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
