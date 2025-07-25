import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, Globe, Heart, CheckCircle, Mail, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-900">
      {/* Sticky Banner */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 py-3 px-4 text-center font-bold z-50 shadow-lg">
        🚨 ONLY 73 FOUNDING MEMBER SPOTS REMAINING - SECURE YOURS NOW! 🇳🇬
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" style={{
        background: 'linear-gradient(135deg, #2D5A27 0%, #1a3d1a 50%, #0f2f0f 100%)',
      }}>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Phone Mockup */}
        <div className="absolute right-8 md:right-16 lg:right-24 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
          <div className="relative">
            <img
              src="/phone-mockup.png"
              alt="BAWO App Preview"
              className="w-64 lg:w-80 xl:w-96 h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-[2.5rem] pointer-events-none"></div>
          </div>
        </div>

        <div className="relative z-10 text-center md:text-left text-white px-6 max-w-4xl md:max-w-2xl lg:max-w-3xl md:ml-8 lg:ml-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            🇳🇬 BAWO
            <br />
            <span className="text-yellow-400">Find Your Tribe</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            The exclusive community connecting Nigerian diaspora worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleFoundingMember}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-full font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Founding Member - $49 🚀
            </button>
            <button
              onClick={handleEarlyAccess}
              className="bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 px-8 py-4 rounded-full font-bold text-lg transform hover:scale-105 transition-all duration-300"
            >
              Get Early Access 📧
            </button>
          </div>
          <div className="mt-12 text-sm opacity-75">
            <p>2,847+ members • Lagos: 1,203 • London: 894 • NYC: 750</p>
          </div>

          {/* Mobile Phone Preview */}
          <div className="md:hidden mt-12 flex justify-center">
            <img
              src="/phone-mockup.png"
              alt="BAWO App Preview"
              className="w-48 h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-yellow-400" />
        </div>
      </section>

      {/* Founding Member Section */}
      <section className="relative h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
      }}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center text-gray-900 px-6 max-w-4xl">
          <div className="bg-white/95 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              FOUNDING MEMBER
            </h2>
            <div className="text-6xl md:text-8xl font-bold text-orange-600 mb-6">
              $49
            </div>
            <div className="text-lg md:text-xl mb-8 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Lifetime access to exclusive community</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Priority networking with diaspora leaders</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Founding Member badge & perks</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Early access to all new features</span>
              </div>
            </div>
            <button
              onClick={handleFoundingMember}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-12 py-6 rounded-full font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              SECURE YOUR SPOT - $49 🔥
            </button>
            <p className="mt-4 text-sm opacity-75">One-time payment • No monthly fees</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #1a3d1a 0%, #2D5A27 50%, #3d7a37 100%)',
      }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-white px-6 max-w-6xl">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-yellow-400">
            Your Tribe Awaits
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all">
              <Users className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Find Your People</h3>
              <p className="text-lg opacity-90">Connect with Nigerians in your city and worldwide</p>
            </div>
            <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all">
              <Globe className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Global Network</h3>
              <p className="text-lg opacity-90">Access exclusive opportunities across continents</p>
            </div>
            <div className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all">
              <Heart className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">Cultural Pride</h3>
              <p className="text-lg opacity-90">Celebrate and preserve our heritage together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Diaspora Section */}
      <section className="relative h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(45deg, #2D5A27 0%, #FFD700 50%, #2D5A27 100%)',
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Nigerian Diaspora
            <br />
            <span className="text-yellow-400">Unite & Thrive</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            From Lagos to London, NYC to Dubai - we're building bridges across borders
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">2,847+</div>
              <div className="text-sm">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">50+</div>
              <div className="text-sm">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">15+</div>
              <div className="text-sm">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">73</div>
              <div className="text-sm">Spots Left</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        id="email-section"
        className="relative h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #2D5A27 100%)',
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="bg-white/95 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Don't Miss Out! 🇳🇬
            </h2>
            <p className="text-xl mb-8 text-gray-700">
              Join the exclusive waitlist or secure your founding member spot now
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`flex-1 px-6 py-4 rounded-full border-2 text-lg focus:outline-none transition-all ${
                      isEmailFocused
                        ? 'border-green-500 ring-4 ring-green-200'
                        : 'border-gray-300 focus:border-green-500'
                    }`}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Join Waitlist <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-6 bg-green-100 rounded-2xl">
                <div className="flex items-center justify-center gap-3 text-green-800">
                  <CheckCircle className="w-8 h-8" />
                  <span className="text-xl font-bold">You're on the list! 🎉</span>
                </div>
                <p className="text-green-700 mt-2">We'll notify you when BAWO launches</p>
              </div>
            )}

            <div className="border-t pt-8">
              <p className="text-lg mb-4 text-gray-700">
                Or skip the wait and become a founding member:
              </p>
              <button
                onClick={handleFoundingMember}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 px-12 py-6 rounded-full font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                FOUNDING MEMBER - $49 🚀
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
