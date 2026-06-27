import { IMAGES } from "./images";

const STRIPE_FOUNDING_DEFAULT =
  "https://buy.stripe.com/eVq3cwaddb06bxQ1vB3Nm02";

export const CONTENT = {
  revenue: {
    /** Replace with your $25 Stripe Payment Link; override via `VITE_STRIPE_FOUNDING_CHECKOUT_URL`. */
    foundingStripeCheckoutUrl:
      import.meta.env.VITE_STRIPE_FOUNDING_CHECKOUT_URL || STRIPE_FOUNDING_DEFAULT,
  },

  foundingMemberCheckout: {
    kicker: "Day-1 revenue, BawoSocial",
    title: "Founding Member Lifetime Pass",
    description:
      "Lock in early. One payment, permanent status in our African, African American, Caribbean, and Latin NYC community.",
    price: "$25",
    benefits: [
      "Lifetime access to the premium membership tier",
      "Verified profile badge on launch",
      "Day-1 beta access before public rollout",
    ],
    ctaLabel: "Secure My Spot",
  },

  partnerWithUs: {
    headline: "Own the NYC Diaspora Market.",
    body: "We are onboarding thousands of highly-educated NYC professionals. Secure an exclusive Founding Sponsor placement in our Resource Directory.",
    ctaLabel: "Inquire About Sponsorships",
    inquiryEmail:
      import.meta.env.VITE_B2B_CONTACT_EMAIL || "Axadegbenro@gmail.com",
    emailSubject: "BawoSocial B2B Sponsorship",
  },

  // Hero Section
  hero: {
    title: "Culture, connection, community",
    subtitle:
      "The big platforms weren't built for our communities. BawoSocial is a private network for African, African American, Caribbean, and Latin NYC — curated resources, culture-first events, and real community without the noise.",
    ctaPrimary: "Secure My Spot, $25",
    ctaMicrocopy: "Founding lifetime pass, limited spots.",
    ctaSecondary: "Join Waitlist",
    testflightLink: "https://testflight.apple.com/join/xAp29Euh",
    ctaTestFlight: "Download via TestFlight",
    downloadIos: "Download for iOS",
    downloadIosSub: "TestFlight",
    downloadAndroid: "Android",
    downloadAndroidSoon: "Coming soon",
    trustIndicators: {
      stripe: "Secured by Stripe",
      oneTime: "One-time payment",
      cancel: "30-day money-back guarantee"
    },
  },

  // Stats Section (Scarcity metrics – Batch 1)
  stats: {
    title: "Founding Member Batch 1 is Open.",
    subtitle:
      "Lock in lifetime access for $25. After Batch 1 closes, membership costs $19.99/month.",
    tagline: "Do the math: $25 once vs. $1,200+ over five years on the monthly plan.",
    metrics: {
      batch1: {
        value: "500",
        label: "BATCH 1 SPOTS",
        subtext: "Only 450 remaining"
      },
      savings: {
        value: "$240/yr",
        label: "LIFETIME SAVINGS",
        subtext: "vs. monthly members"
      },
      access: {
        value: "FOREVER",
        label: "NO MONTHLY FEES",
        subtext: "One $25 payment",
      },
    },
    urgency: {
      price: "After 500 members: $19.99/month ($240/year)",
      deadline: "Batch 1 closes when full or August 1, 2026",
      guarantee: "30-day money-back guarantee. No questions asked."
    }
  },

  // Origin Story Section
  origin: {
    title: "Why BawoSocial Exists",
    mainText: "Most of us in the diaspora feel isolated and disconnected from opportunity. We miss our culture, our people, and our network. BawoSocial was created to fix that. We are a utility-first platform to find your tribe, access curated diaspora resources, and build meaningful relationships — powered by technology that understands our culture, our boroughs, and our community.",
    visionText: "",
  },

  // Founding Member Section
  foundingMember: {
    title: "Founding Member Benefits",
    titleHighlight: "(One-Time $25)",
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
        title: "Resource Directory Unlocked",
        description: "Full access to African and African American-owned businesses, Latin-owned businesses, consulates, community resources, churches, and more.",
      },
      {
        title: "Founding Member Badge",
        description: "A permanent \"Day One\" badge on your profile.",
      },
      {
        title: "Priority Access",
        description: "First access to new features and community introductions.",
      },
    ],
    cta: "Become a Founding Member, $25",
    spotsRemaining: "",
    securityBadges: {},
    missionText:
      "We are building this independently. Your $25 funds a platform that respects our culture.",
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
        title: "The Resource Directory",
        description: "Stop asking 'Who knows a guy?' Nigerian restaurants, consulates with live fee schedules, NIN enrollment maps, shipping with vessel tracking, churches, and mental health support. All verified.",
      },
      {
        title: "Community Matching",
        description: "Connect with people who share your heritage, borough, and intentions. Whether you're here for friendship, business, or something more.",
      },
    ],
  },

  // Testimonials Section
  testimonials: {
    title: "What We're Building For",
    subtitle: "Voices from the diaspora",
    reviews: [
      {
        name: "The NYC Diaspora",
        role: "New York",
        quote: "I need a network that understands where I'm from and where I'm going.",
        avatar: IMAGES.testimonials.adaora,
      },
      {
        name: "Queens, NY",
        role: "Queens, NY",
        quote: "My borough is full of Africans, but finding your specific community shouldn't be this hard.",
        avatar: IMAGES.testimonials.emeka,
      },
      {
        name: "The Bronx, NY",
        role: "The Bronx, NY",
        quote: "Something between a professional network and a family reunion.",
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
      { name: "Harlem", country: "🇺🇸" },
      { name: "Queens", country: "🇺🇸" },
      { name: "The Bronx", country: "🇺🇸" },
      { name: "Staten Island", country: "🇺🇸" },
    ],
  },

  // Final CTA Section
  finalCta: {
    title: "Join the First 500. Shape the Platform.",
    subtitle: "Founding Membership is limited. Once Batch 1 closes, the price increases.",
    cta: "Become a Founding Member, $25",
    ctaSecondary: "Join Waitlist",
  },

  // Footer
  footer: {
    brand: "BawoSocial",
    tagline: "Connecting African, African American, Caribbean, and Latin New York through authentic relationships, resources, and cultural pride.",
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
    copyright: "2026 BawoSocial. Public Launch: Summer 2026.",
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
