import { IMAGES } from './images';

export const CONTENT = {
  // Hero Section
  hero: {
      title: "The Home for Nigerians Wherever We Are.",
      subtitle: "Stop swiping. Start belonging. The exclusive community for the Nigerian diaspora to connect, network, and thrive.",
      ctaPrimary: "Become a Founding Member $50",
      ctaSecondary: "Join Waitlist",
      trustIndicators: {
      }
    },
  
    // Stats Section
    stats: {
      title: "Founding Membership Closes December 1st. Don't Miss Your Spot.",
      subtitle: "7,200 Nigerians already on the waitlist, across 50 cities.",
      metrics: {
        members: {
          value: "7.2K+",
          label: "ON WAITLIST"
        },
        cities: {
          value: "50+",
          label: "CITIES WORLDWIDE"
        },
        satisfaction: {
          value: "500",
          label: "FOUNDING SPOTS"
        }
      }
    },
  
    // Origin Story Section
    origin: {
      title: "Why BawoSocial Exists",
      mainText: "Most Nigerians in the diaspora feel isolated. We miss our culture and our people. BawoSocial was created to fix that. A place to connect with Nigerians nearby, attend cultural events, build friendships, and keep our heritage alive no matter where we live.",
      visionText: ""
    },
  
    // Founding Member Section
    foundingMember: {
      title: "Founding Member Benefits",
      titleHighlight: "(One-Time $50)",
      titleEmoji: "",
      subtitle: "Batch 1: Limited to 500 Spots.",
      description: "",
      benefitsTitle: "",
      benefits: [
        {
          title: "Lifetime Premium Access",
          description: "Never pay monthly fees again."
        },
        {
          title: "Founding Member Badge (Permanent)",
          description: "A permanent badge shown on your profile forever."
        },
        {
          title: "Priority Access to New Cities",
          description: "You skip the line for new features, events, and support."
        },
        {
          title: "Invite-Only Events",
          description: "Private dinners, mixers, and linkups only for founding members."
        }
      ],
      cta: "Become a Founding Member $50",
      spotsRemaining: "",
      securityBadges: {
      },
      missionText: "We are building this independently. Your $50 funds a platform that respects our culture."
    },
  
    // Features Section
    features: {
      title: "What People Get From BawoSocial",
      items: [
        {
          title: "Micro-Communities",
          description: "Find your tribe in your city, connect with real people nearby."
        },
        {
          title: "Local Discovery",
          description: "Cultural celebrations, mixers, and gatherings that keep our heritage alive."
        },
        {
          title: "Vibe-Check Matching",
          description: "Build lasting connections with people who understand your culture."
        }
      ]
    },
  
    // Testimonials Section
    testimonials: {
      title: "Voices of the BawoSocial Family",
      subtitle: "Hear from Nigerians already building connections",
      reviews: [
        {
          name: "T.",
          role: "New York",
          quote: "I didn't realize how much I needed Nigerian friends until BawoSocial helped me find them.",
          avatar: IMAGES.testimonials.adaora
        },
        {
          name: "A.",
          role: "Atlanta",
          quote: "My city is full of Africans, but I never found the Nigerians until BawoSocial showed me.",
          avatar: IMAGES.testimonials.emeka
        },
        {
          name: "D.",
          role: "London",
          quote: "It feels like home without being home.",
          avatar: IMAGES.testimonials.fatima
        }
      ]
    },
  
    // Global Reach Section
    globalReach: {
      title: "7,200 Nigerians already on the waitlist, across 50 cities.",
      subtitle: "Growing daily in 50+ cities.",
      description: "Join the waitlist before December 1st launch",
      cities: [
        { name: "New York", count: "1,247", country: "🇺🇸" },
        { name: "London", count: "1,092", country: "🇬🇧" },
        { name: "Atlanta", count: "1,684", country: "🇺🇸" },
        { name: "Los Angeles", count: "1,503", country: "🇺🇸" },
        { name: "Canada", count: "1,174", country: "🇨🇦" },
        { name: "Houston", count: "892", country: "🇺🇸" }
      ]
    },
  
    // Final CTA Section
    finalCta: {
      title: "Join the First 500. Shape the Platform.",
      subtitle: "Founding Membership is limited. Once it closes, it's closed forever.",
      cta: "Become a Founding Member $50",
      ctaSecondary: "Join Waitlist"
    },

  // Footer
  footer: {
      brand: "BawoSocial",
    tagline: "Where Nigerians Connect",
      sections: {
        quickLinks: {
          title: "Quick Links",
          links: [
            { label: "About Us", href: "#about" },
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Contact", href: "#contact" }
          ]
        },
        legal: {
          title: "Legal",
    links: [
            { label: "Privacy Policy", action: "privacy" }
          ]
        }
      },
      copyright: "2025 BawoSocial. Launching December 1st. Made with ❤️ for the Nigerian diaspora."
    },
  
    // Email Signup
    emailSignup: {
      title: "Be First to Know",
      subtitle: "Get early access when BawoSocial lands in your city",
      placeholder: "Enter your email address",
      cta: "Join the Waitlist",
      success: "Thanks! You’re on the list.",
      error: "Please enter a valid email address."
  },

  // Waitlist Form
  waitlist: {
    title: "Join the Waitlist",
    subtitle: "Be first to know when we launch",
    button: "Join the Waitlist",
    success: "Thanks! You're on the list.",
    error: "Please enter a valid email address.",
    helperText: "We'll never spam you. Unsubscribe anytime.",
    fields: {
      name: "Your name",
      email: "Your email",
      city: "City (optional)"
    }
  }
} as const;
  
