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
      "Day-1 iOS beta access before public rollout",
    ],
    ctaLabel: "Become a Founding Member",
  },

  foundingMemberModal: {
    kicker: "Batch 1 · 500 spots",
    title: "Become a Founding Member",
    subtitle:
      "Lock in lifetime access for our African, African American, Caribbean, and Latin NYC community — before Batch 1 closes.",
    price: "$25",
    priceNote: "one-time payment",
    benefits: [
      "Lifetime access to the premium membership tier",
      "Verified founding profile badge on launch",
      "Day-1 iOS beta access before public rollout",
      "Full Resource Directory — businesses, services, and community intel",
    ],
    checkoutCta: "Continue to checkout — $25",
    waitlistCta: "Join waitlist instead",
    waitlistHint: "Not ready to pay? Get launch updates by email — no payment required.",
    footerNote:
      "Community-built and independent. Your membership helps grow a platform made for our culture.",
  },

  partnerWithUs: {
    headline: "Help our community find trusted local partners.",
    body: "If you serve African, African American, Caribbean, or Latin New York — restaurants, professionals, or community businesses — list in our Resource Directory and connect with members who show up for culture.",
    ctaLabel: "Partner With BawoSocial",
    inquiryEmail:
      import.meta.env.VITE_B2B_CONTACT_EMAIL || "Axadegbenro@gmail.com",
    emailSubject: "BawoSocial Community Partner",
  },

  communityMission: {
    title: "More than an app. A home for our culture.",
    subtitle:
      "BawoSocial exists so our people can preserve what makes us us, connect with intention, and find community that feels like belonging — not another feed.",
    pillars: [
      {
        title: "Preserve culture",
        description:
          "Events, resources, and groups rooted in heritage — from Independence celebrations to borough cookouts.",
      },
      {
        title: "Connect with purpose",
        description:
          "Find your people by borough, background, and goals — friendship, mentorship, business, or more.",
      },
      {
        title: "Find your community",
        description:
          "Join groups like The Cookout, Carnival Crew, and Sabor NYC where members actually know each other.",
      },
    ],
  },

  // Hero Section
  hero: {
    title: {
      lead: "Culture, connection, ",
      highlight: "community",
    },
    subtitle:
      "The Culture Hub for African, African American, Caribbean, and Latin NYC. Curated resources, culture-led events. We are stronger together.",
    ctaPrimary: "Become a Founding Member",
    ctaMicrocopy: "Founding pass · limited spots",
    ctaSecondary: "Join Waitlist",
    testflightLink: "https://testflight.apple.com/join/xAp29Euh",
    ctaTestFlight: "Download via TestFlight",
    downloadIos: "Download for iOS",
    downloadIosSub: "TestFlight",
    downloadAndroid: "Android",
    downloadAndroidSoon: "Coming soon",
    shareWhatsApp:
      "I just found BawoSocial — the private network for African, Caribbean, Latin & African American NYC. $25 lifetime access, only 450 spots left. Join here: https://joinbawo.com?utm_source=whatsapp",
    shareLink: "https://joinbawo.com?utm_source=share",
    shareTweet:
      "BawoSocial — the Culture Hub for African, Caribbean, Latin & African American NYC. $25 lifetime founding access.",
    shareCopy: "Copy link",
    shareCopied: "Copied!",
    knowWhenLaunch: "Know when we launch",
    knowWhenLaunchShort: "Launch updates",
    trustIndicators: {
      stripe: "Secured by Stripe",
      oneTime: "One-time payment",
      cancel: "30-day money-back guarantee",
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
    title: {
      lead: "Why ",
      highlight: "BawoSocial",
      closing: " Exists",
    },
    paragraphs: [
      "New York has our people everywhere, yet too many of us still feel out of place. We miss our culture, our circle, and the belonging that big platforms never offered.",
      {
        highlight: "BawoSocial",
        text: " is the Culture Hub to find your tribe, explore local tools and the Resource Directory, and build real relationships. Built for our culture and our community.",
      },
    ],
    visionText: "",
  },

  // Founding Member Section
  foundingMember: {
    title: "Founding Member",
    titleHighlight: "$25 once",
    subtitle: "500 spots · Batch 1 open",
    description: "",
    benefitsTitle: "",
    benefits: [
      {
        title: "Lifetime access",
        description: "Premium features unlocked. No monthly fees, ever.",
      },
      {
        title: "Resource Directory",
        description: "Local businesses, services, and community resources you can trust.",
      },
      {
        title: "Day One badge",
        description: "Permanent founding status on your profile.",
      },
    ],
    cta: "Become a Founding Member",
    spotsRemaining: "",
    securityBadges: {},
    missionText:
      "Community-built and independent. Your $25 helps grow a platform made for our culture.",
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
        description: "Stop asking 'Who knows a guy?' Verified restaurants, consulates, community businesses, churches, mental health support, and local intel — all in one directory.",
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
    subtitle: "Voices from across NYC",
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
    subtitle: "Connecting our communities, borough by borough.",
    description: "Join the First 500 Founding Members to shape the culture of your city's hub.",
    cities: [
      { name: "Brooklyn", country: "🇺🇸" },
      { name: "Harlem", country: "🇺🇸" },
      { name: "Queens", country: "🇺🇸" },
      { name: "The Bronx", country: "🇺🇸" },
      { name: "Staten Island", country: "🇺🇸" },
    ],
  },

  events: {
    title: "Featured Events",
    items: [
      {
        icon: "calendar" as const,
        title: "Caribbean Carnival Block Party, Brooklyn",
        description:
          "Dancehall, soca, and Caribbean food — a block party celebrating Brooklyn's island culture.",
      },
      {
        icon: "headphones" as const,
        title: "The Resource Directory: Live Q&A",
        description:
          "Immigration & housing experts answering member questions live.",
      },
      {
        icon: "star" as const,
        title: "Afro-Latin Heritage Night, Manhattan",
        description:
          "A night of culture, music, and pride with African, Caribbean, and Latin New York.",
      },
    ],
  },

  inAppFeatureCaptions: [
    "Access Resources: African and African American-owned restaurants, churches, mental health, and more.",
    "Meet Concierge: immigration, housing, shipping, and local intel.",
    "Join Communities: Soft Life NYC, The Cookout, Carnival Crew, Sabor NYC, Outside & Owambe.",
    "Discover Events: rooftop nights, film screenings, and culture-first meetups.",
    "Community, your way: My Groups, Discover, and For You in one hub.",
  ],

  // Final CTA Section
  finalCta: {
    title: "Join the First 500. Shape the Platform.",
    subtitle: "Founding Membership is limited. Once Batch 1 closes, the price increases.",
    cta: "Become a Founding Member, $25",
    ctaSecondary: "Join Waitlist",
  },

  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "What is BawoSocial?",
        answer:
          "BawoSocial is a private community platform for African, African American, Caribbean, and Latin New Yorkers across all five boroughs — built for culture-first connection, not another algorithmic feed.",
      },
      {
        question: "Who is BawoSocial for?",
        answer:
          "African, African American, Caribbean, and Latino New Yorkers — plus friends of the culture who want intentional community, local resources, and real-world events in NYC.",
      },
      {
        question: "How much does BawoSocial cost?",
        answer:
          "Founding members get lifetime access for a one-time $25 payment during Batch 1. After that window closes, membership moves to $19.99/month. The founding pass includes permanent access to premium features and the Resource Directory.",
      },
      {
        question: "What resources does BawoSocial offer?",
        answer:
          "Our Resource Directory includes restaurants, consulates, community businesses, churches, mental health support, and more — verified listings with real photos and details, organized for how our communities actually live in NYC.",
      },
      {
        question: "How is BawoSocial different from Facebook groups?",
        answer:
          "No ads, no algorithm deciding what you see. BawoSocial is organized around vetted micro-communities, a curated directory, and culture-first events — built for belonging, not engagement bait.",
      },
    ],
  },

  // Footer
  footer: {
    brand: "BawoSocial",
    tagline: "Connecting African, African American, Caribbean, and Latin New York through authentic relationships, resources, and cultural pride.",
    sections: {
      quickLinks: {
        title: "Quick Links",
        links: [
          { label: "About", href: "#about" },
          { label: "Features", href: "#features" },
          { label: "Founding Members", href: "#pricing" },
          { label: "Network", href: "#building-the-network" },
          { label: "FAQ", href: "#faq" },
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
