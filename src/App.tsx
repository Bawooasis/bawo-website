import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, Globe, Heart, CheckCircle, Mail, ArrowRight } from 'lucide-react';
import appMockup from './assets/images/app-mockup.png';
import bawoLogo from './assets/images/bawo-logo.png';

function App() {
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      {/* Sticky Banner */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 py-3 px-4 text-center font-bold z-50 shadow-lg font-museo-bold">
        <div className="flex items-center justify-center gap-3">
          <img
            src={bawoLogo}
            alt="BAWO"
            className="h-6 w-auto"
          />
          <span>🚨 ONLY 73 FOUNDING MEMBER SPOTS REMAINING - SECURE YOURS NOW! 🇳🇬</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
        background: 'linear-gradient(135deg, #073925 0%, #052a1c 50%, #031a12 100%)',
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>

        {/* BAWO Logo - Floating Top Left */}
        <div className="absolute top-8 left-8 z-20">
          <img
            src={bawoLogo}
            alt="BAWO Logo"
            className="h-16 md:h-24 lg:h-32 w-auto drop-shadow-lg"
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight font-museo-black">
                  <span className="text-white">🇳🇬 BAWO</span>
                  <br />
                  <span className="text-yellow-400">Find Your Tribe</span>
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl opacity-90 font-museo-medium text-white/90">
                  The exclusive community connecting Nigerian diaspora worldwide
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleFoundingMember}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-museo-bold"
                >
                  Founding Member - $49 🚀
                </button>
                <button
                  onClick={handleEarlyAccess}
                  className="bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 px-8 py-4 rounded-full font-bold text-lg transform hover:scale-105 transition-all duration-300 font-museo-bold"
                >
                  Get Early Access 📧
                </button>
              </div>

              {/* Stats */}
              <div className="pt-4">
                <p className="text-sm opacity-75 font-museo-regular text-white/80">
                  2,847+ members • Lagos: 1,203 • London: 894 • NYC: 750
                </p>
              </div>
            </div>

            {/* Right Content - App Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone Frame Effect */}
                <div className="relative">
                  <img
                    src={appMockup}
                    alt="BAWO Find Your Tribe App Preview"
                    className="w-64 md:w-80 lg:w-96 h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500 rounded-[2rem] border-4 border-gray-800"
                  />
                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 via-transparent to-transparent rounded-[2rem] pointer-events-none"></div>
                  {/* Screen Reflection */}
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/5 to-transparent rounded-t-[2rem] pointer-events-none"></div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-museo-bold shadow-lg border border-yellow-300">
                  🔥 Live
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-yellow-400" />
        </div>
      </section>

      {/* Founding Member Section */}
      <section className="relative min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #073925 0%, #052a1c 50%, #031a12 100%)',
      }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content - Benefits */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold font-museo-black">
                  Become a BAWO
                  <br />
                  <span className="text-yellow-400">Founding Member</span>
                  <span className="ml-3">🇳🇬</span>
                </h2>
                <p className="text-lg md:text-xl font-museo-medium text-white/90">
                  Join the first 100 Nigerians building our community
                </p>
                <p className="text-md font-museo-regular text-white/80">
                  Be part of BAWO's founding story. Get lifetime premium access.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-museo-bold text-white">FOUNDING MEMBERS GET:</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="font-museo-medium">Lifetime Premium Access (No monthly fees ever)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="font-museo-medium">Founding Member Badge & Recognition</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="font-museo-medium">Unlimited Group Creation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="font-museo-medium">Unlimited Premium Spotlights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="font-museo-medium">Direct Input on New Features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <span className="font-museo-medium">Exclusive Founding Member Community</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-museo-medium text-white/80">REGULAR PRICE: $9.99/month ($120/year)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-museo-bold text-yellow-400">FOUNDING MEMBER: $49 one-time</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">💰</span>
                  <span className="font-museo-medium text-white/90">Save $71 in first year alone</span>
                </div>
              </div>
            </div>

            {/* Right Content - Nigerian Map & CTA */}
            <div className="flex flex-col items-center space-y-8">
              <div className="relative">
                {/* Nigerian Map Graphic Placeholder */}
                <div className="w-64 h-64 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🇳🇬</div>
                    <div className="font-museo-bold text-lg">Nigeria</div>
                    <div className="text-sm opacity-80">Global Network</div>
                  </div>
                </div>
                {/* Network Pattern Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full"></div>
              </div>

              <div className="text-center space-y-4">
                <button
                  onClick={handleFoundingMember}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-900 px-12 py-6 rounded-full font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-museo-bold"
                >
                  SECURE YOUR SPOT - $49
                </button>
                <p className="text-white font-museo-medium">Only 73 founding member spots remaining</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #052a1c 0%, #073925 50%, #0a4a2e 100%)',
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-white px-6 max-w-6xl">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-yellow-400 font-museo-black">
            Your Tribe Awaits
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all">
              <Users className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 font-museo-bold">Find Your People</h3>
              <p className="text-lg opacity-90 font-museo-medium">Connect with Nigerians in your city and worldwide</p>
            </div>
            <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all">
              <Globe className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 font-museo-bold">Global Network</h3>
              <p className="text-lg opacity-90 font-museo-medium">Access exclusive opportunities across continents</p>
            </div>
            <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all">
              <Heart className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 font-museo-bold">Cultural Pride</h3>
              <p className="text-lg opacity-90 font-museo-medium">Celebrate and preserve our heritage together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Diaspora Statistics Section */}
      <section className="relative min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #073925 0%, #052a1c 50%, #031a12 100%)',
      }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold text-white font-museo-black">
                Growing Across the Diaspora
              </h2>
              <p className="text-lg md:text-xl font-museo-medium text-white/90">
                Join thousands of Nigerians building authentic connections worldwide
              </p>
              <p className="text-md font-museo-regular text-yellow-400">
                7,223+ verified Nigerian members worldwide
              </p>
            </div>

            {/* City Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-16">
              {/* New York */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🗽</span>
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg">NEW YORK</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,247 MEMBERS</p>
                </div>
              </div>

              {/* London */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🕰️</span>
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg">LONDON</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,092 MEMBERS</p>
                </div>
              </div>

              {/* Atlanta */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏙️</span>
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg">ATLANTA</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,684 MEMBERS</p>
                </div>
              </div>

              {/* LA */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌴</span>
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg">LA</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,503 MEMBERS</p>
                </div>
              </div>

              {/* Canada */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍁</span>
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg">CANADA</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,174 MEMBERS</p>
                </div>
              </div>

              {/* Houston */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤠</span>
                </div>
                <div>
                  <h3 className="font-museo-bold text-white text-lg">HOUSTON</h3>
                  <p className="font-museo-medium text-white/80 text-sm">1,223 MEMBERS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
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
              <h2 className="text-4xl md:text-6xl font-bold text-white font-museo-black">
                Don't Miss Out - Join the Founding 100 🇳🇬
              </h2>
              <p className="text-lg md:text-xl font-museo-medium text-white/90">
                Last chance to become a BAWO Founding Member. Only 73 spots left for lifetime premium access.
              </p>
            </div>

            {/* Email Form */}
            {!isSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for launch notification"
                    className={`flex-1 px-6 py-4 rounded-full border-2 text-lg focus:outline-none transition-all bg-white/10 backdrop-blur-sm text-white placeholder-white/70 ${
                      isEmailFocused
                        ? 'border-yellow-400 ring-4 ring-yellow-400/20'
                        : 'border-white/20 focus:border-yellow-400'
                    }`}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 font-museo-bold"
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
                  <CheckCircle className="w-8 h-8 text-yellow-400" />
                  <span className="text-xl font-bold font-museo-bold">You're on the list! 🎉</span>
                </div>
                <p className="text-white/80 mt-2 font-museo-medium">We'll notify you when BAWO launches</p>
              </div>
            )}

            {/* Main CTA */}
            <div className="space-y-4">
              <button
                onClick={handleFoundingMember}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-900 px-12 py-6 rounded-full font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-museo-bold"
              >
                BECOME FOUNDING MEMBER - $49
              </button>
              <p className="text-white font-museo-medium">Lifetime premium • Save $71+ • Only 73 left</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <a href="#" className="text-white/80 hover:text-white font-museo-medium">PRIVACY POLICY</a>
            <a href="#" className="text-white/80 hover:text-white font-museo-medium">TERMS OF SERVICE</a>
            <a href="#" className="text-white/80 hover:text-white font-museo-medium">CONTACT</a>
            <a href="#" className="text-white/80 hover:text-white font-museo-medium">INSTAGRAM</a>
            <a href="#" className="text-white/80 hover:text-white font-museo-medium">TIKTOK</a>
          </div>
          <p className="text-white/60 text-sm font-museo-regular">2025 BAWO. Made with ❤️ for the Nigerian diaspora</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
