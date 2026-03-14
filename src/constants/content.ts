import { IMAGES } from './images';

export const CONTENT = {
  // Hero Section
  hero: {
    title: "The Private Network for the Nigerian Diaspora.",
    subtitle: "Stop asking 'Who knows a guy?'. Find your people, access The Black Book of vetted resources, and build actual wealth.",
    ctaPrimary: "Claim 1 of 500 Founding Spots",
    ctaSecondary: "Join Waitlist",
    testflightLink: "https://testflight.apple.com/join/xAp29Euh",
    ctaTestFlight: "Download via TestFlight",
    trustIndicators: {},
  },

  // Stats Section (Scarcity metrics – Batch 1)
  stats: {
    title: "Founding Member Batch 1 is Open.",
    subtitle: "We are prioritizing quality over quantity. Secure your lifetime status.",
    metrics: {
      batch1: {
        value: "500",
        label: "BATCH 1 SPOTS",
      },
      status: {
        value: "OPEN",
        label: "STATUS",
      },
      access: {
        value: "LIFETIME",
        label: "ACCESS",
      },
    },
  },

  // Origin Story Section
  origin: {
    title: "Why BawoSocial Exists",
    mainText: "Most Nigerians in the diaspora feel isolated and disconnected from opportunity. We miss our culture, our people, and our network. BawoSocial was created to fix that. We are a utility-first platform to find your tribe, access The Black Book of resources, and build meaningful wealth and relationships—powered by smart technology that understands who we are.",
    visionText: "",
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
        description: "Never pay monthly fees again.",
      },
      {
        title: "The Black Book Unlocked",
        description: "Full access to the vetted resource directory.",
      },
      {
        title: "Founding Member Badge",
        description: "A permanent \"Day One\" badge on your profile.",
      },
      {
        title: "Priority Matching",
        description: "First access to smart introductions.",
      },
    ],
    cta: "Become a Founding Member $50",
    spotsRemaining: "",
    securityBadges: {},
    missionText: "We are building this independently. Your $50 funds a platform that respects our culture.",
  },

  // Features Section
  features: {
    title: "Your Network. Your Resources.",
    items: [
      {
        title: "Groups are Home",
        description: "No noisy feeds. Your experience is centered around high-quality micro-communities where you actually know the people.",
      },
      {
        title: "The Black Book",
        description: "Stop asking 'Who knows a guy?' Access a curated, member-vetted directory of Nigerian lawyers, realtors, and businesses in your city.",
      },
      {
        title: "Smart Introductions",
        description: "We replaced the swipe. Our system introduces you to people with shared intent—whether for business, friendship, or love.",
      },
    ],
  },

  // Testimonials Section
  testimonials: {
    title: "Voices of the BawoSocial Family",
    subtitle: "Hear from Nigerians already building connections",
    reviews: [
      {
        name: "T.",
        role: "New York",
        quote: "I didn't realize how much I needed a network until BawoSocial helped me find my people—and my new apartment.",
        avatar: IMAGES.testimonials.adaora,
      },
      {
        name: "A.",
        role: "Queens, NY",
        quote: "My borough is full of Africans, but I never found the Nigerians until BawoSocial connected me.",
        avatar: IMAGES.testimonials.emeka,
      },
      {
        name: "D.",
        role: "The Bronx, NY",
        quote: "It feels like a professional network and a family reunion in one app.",
        avatar: IMAGES.testimonials.fatima,
      },
    ],
  },

  // Global Reach Section (no member counts – honest)
  globalReach: {
    title: "Building the Network.",
    subtitle: "Connecting the diaspora, borough by borough.",
    description: "Join the First 500 Founding Members to shape the culture of your city's hub.",
    cities: [
      { name: "Brooklyn", country: "🇺🇸" },
      { name: "Manhattan", country: "🇺🇸" },
      { name: "Queens", country: "🇺🇸" },
      { name: "The Bronx", country: "🇺🇸" },
      { name: "Staten Island", country: "🇺🇸" },
    ],
  },

  // Final CTA Section
  finalCta: {
    title: "Join the First 500. Shape the Platform.",
    subtitle: "Founding Membership is limited. Once Batch 1 closes, the price increases.",
    cta: "Become a Founding Member $50",
    ctaSecondary: "Join Waitlist",
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
          { label: "Contact", href: "#contact" },
        ],
      },
      legal: {
        title: "Legal",
        links: [{ label: "Privacy Policy", action: "privacy" }],
      },
    },
    copyright: "2026 BawoSocial. Launching December 1st. Made with ❤️ for the Nigerian diaspora.",
  },

  // Email Signup
  emailSignup: {
    title: "Be First to Know",
    subtitle: "Get early access when BawoSocial lands in your city",
    placeholder: "Enter your email address",
    cta: "Join the Waitlist",
    success: "Thanks! You're on the list.",
    error: "Please enter a valid email address.",
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
      city: "City (optional)",
    },
  },
} as const;
