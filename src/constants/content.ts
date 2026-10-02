import { IMAGES } from "./images";

export const CONTENT = {
  partnerWithUs: {
    headline: "Help our community find trusted local partners.",
    body: "If you serve Nigerians in New York — restaurants, professionals, shipping, or community businesses — list in our Resource Directory and connect with members who show up for culture.",
    ctaLabel: "Open Business Portal",
    inquiryEmail:
      import.meta.env.VITE_B2B_CONTACT_EMAIL || "Axadegbenro@gmail.com",
    emailSubject: "BawoSocial Community Partner",
  },

  communityMission: {
    title: "More than an app. A home for our culture.",
    subtitle:
      "BawoSocial exists so Nigerians in the diaspora can preserve what makes us us, connect with intention, and find community that feels like home — not another feed.",
    pillars: [
      {
        title: "Preserve culture",
        description:
          "Events, resources, and groups rooted in Nigerian heritage — from Independence Day to owambe season.",
      },
      {
        title: "Connect with purpose",
        description:
          "Find your people by borough, background, and goals — friendship, mentorship, business, or more.",
      },
      {
        title: "Find your community",
        description:
          "Join groups like Owambe, Naija NYC, Soft Life, and Outside where members actually know each other.",
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
      "The Culture Hub for Nigerians in the diaspora. Curated resources, culture-led events, starting in NYC. We are stronger together.",
    ctaPrimary: "Join the Waitlist",
    ctaMicrocopy: "Get launch updates by email",
    ctaSecondary: "Join Waitlist",
    testflightLink: "https://testflight.apple.com/join/RU883akC",
    ctaTestFlight: "Download via TestFlight",
    downloadIos: "Download for iOS",
    downloadIosSub: "TestFlight",
    downloadAndroid: "Android",
    downloadAndroidSoon: "Coming soon",
    shareWhatsApp:
      "I just found BawoSocial — the private network for Nigerians in the diaspora. Try the iOS beta or join the waitlist: https://www.joinbawo.com?utm_source=whatsapp",
    shareLink: "https://www.joinbawo.com?utm_source=share",
    shareTweet:
      "BawoSocial — the Culture Hub for Nigerians in the diaspora. Try the iOS beta or join the waitlist.",
    shareCopy: "Copy link",
    shareCopied: "Copied!",
    knowWhenLaunch: "Know when we launch",
    knowWhenLaunchShort: "Launch updates",
    /** First-screen preview footer — real mobile product screens. */
    nextPreview: [
      {
        kicker: "Live in the app",
        title: "Explore the map",
        description:
          "Find Nigerian restaurants, stores, and services across NYC — verified spots your community actually uses.",
        image: IMAGES.showcase.explore,
        imageAlt:
          "BawoSocial Explore screen showing community businesses across the New York City map",
        layout: "map-crop" as const,
      },
      {
        kicker: "Live in the app",
        title: "Join your groups",
        description:
          "Owambe, Soft Life, Naija NYC, Outside — micro-communities where you actually know the people.",
        image: IMAGES.showcase.community,
        imageAlt:
          "BawoSocial Community screen showing Nigerian diaspora groups in New York City",
        layout: "screen-crop" as const,
      },
      {
        kicker: "Live in the app",
        title: "Culture-led events",
        description:
          "Independence Day, owambe nights, and gatherings filtered for diaspora culture — not generic city feeds.",
        image: IMAGES.showcase.events,
        imageAlt:
          "BawoSocial Events screen showing culture-led gatherings in New York City",
        layout: "screen-crop" as const,
      },
      {
        kicker: "Live in the app",
        title: "Ask the Concierge",
        description:
          "Need Agege bread, a salon, or a lawyer? Ask the AI Concierge and get culturally relevant answers fast.",
        image: IMAGES.showcase.concierge,
        imageAlt:
          "BawoSocial Concierge screen offering culturally relevant recommendations",
        layout: "screen-crop" as const,
      },
    ],
  },

  // Early access — TestFlight + waitlist
  earlyAccess: {
    title: "Try the app.",
    titleHighlight: "Join the list.",
    subtitle: "iOS beta on TestFlight · waitlist for launch updates",
    benefits: [
      {
        title: "Test on iOS",
        description:
          "Download the BawoSocial beta through TestFlight and explore the Culture Hub.",
      },
      {
        title: "Join the waitlist",
        description:
          "Get email updates when we launch and expand — no payment required.",
      },
      {
        title: "Resource Directory",
        description:
          "Local businesses, services, and community resources you can trust.",
      },
    ],
    cta: "Join the Waitlist",
    missionText:
      "Community-built and independent. Help us shape a platform made for our culture.",
  },

  // Origin Story Section
  origin: {
    title: {
      lead: "Why ",
      highlight: "BawoSocial",
      closing: " Exists",
    },
    paragraphs: [
      "Across the diaspora, Nigerians are everywhere — yet too many of us still feel out of place. We miss home, our circle, and the belonging that big platforms never offered.",
      {
        highlight: "BawoSocial",
        text: " is the Culture Hub for Nigerians abroad to find your tribe, explore local tools and the Resource Directory, and build real relationships. Built for our culture and our community.",
      },
    ],
    visionText: "",
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
        description: "Connect with Nigerians who share your heritage, borough, and intentions. Whether you're here for friendship, business, or something more.",
      },
    ],
  },

  // Testimonials Section
  testimonials: {
    title: "What We're Building For",
    subtitle: "Voices from the Nigerian diaspora",
    reviews: [
      {
        name: "The Nigerian Diaspora",
        role: "New York",
        quote: "I need a network that understands where I'm from and where I'm going.",
        avatar: IMAGES.testimonials.adaora,
      },
      {
        name: "Queens, NY",
        role: "Queens, NY",
        quote: "My borough is full of Nigerians, but finding your specific people shouldn't be this hard.",
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
    subtitle: "Connecting Nigerians in the diaspora, borough by borough.",
    description: "Try the iOS beta or join the waitlist to help shape the hub for Nigerian New York and the diaspora beyond.",
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
        title: "Naija Independence Day, Brooklyn",
        description:
          "Green-and-white pride, live Afrobeats, and Nigerian food — a block party for the diaspora.",
      },
      {
        icon: "headphones" as const,
        title: "The Resource Directory: Live Q&A",
        description:
          "Immigration, housing, and shipping experts answering member questions live.",
      },
      {
        icon: "star" as const,
        title: "Owambe Night, Manhattan",
        description:
          "A night of culture, music, and aso ebi energy with Nigerian New York.",
      },
    ],
  },

  inAppFeatureCaptions: [
    "Access Resources: Nigerian-owned restaurants, consulates, churches, mental health support, and more.",
    "Meet Concierge: immigration, housing, shipping, and local intel for the diaspora.",
    "Join Communities: Owambe, Naija NYC, Soft Life, Outside, and more.",
    "Discover Events: rooftop nights, film screenings, and culture-first meetups.",
    "Community, your way: My Groups, Discover, and For You in one hub.",
  ],

  // Final CTA Section
  finalCta: {
    title: "Test the app. Join the waitlist.",
    subtitle:
      "Download the iOS beta on TestFlight, or leave your email for launch updates.",
    cta: "Download via TestFlight",
    ctaSecondary: "Join Waitlist",
  },

  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "What is BawoSocial?",
        answer:
          "BawoSocial is a private community platform for Nigerians in the diaspora — starting in NYC across all five boroughs — built for culture-first connection, not another algorithmic feed.",
      },
      {
        question: "Who is BawoSocial for?",
        answer:
          "Nigerians in the diaspora who want intentional community, trusted local resources, and real-world events — beginning in New York, with more cities to come.",
      },
      {
        question: "How do I try the app?",
        answer:
          "The iOS beta is available on TestFlight. Tap Download for iOS on this site, or open the TestFlight link to install. Android is coming soon — join the waitlist for updates.",
      },
      {
        question: "What is the waitlist for?",
        answer:
          "The waitlist is for launch updates by email. No payment is required. Leave your email and we will keep you posted as BawoSocial grows.",
      },
      {
        question: "What resources does BawoSocial offer?",
        answer:
          "Our Resource Directory includes Nigerian restaurants, consulates, community businesses, churches, mental health support, and more — verified listings organized for how we actually live abroad.",
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
    tagline: "Connecting Nigerians in the diaspora through authentic relationships, resources, and cultural pride.",
    sections: {
      quickLinks: {
        title: "Quick Links",
        links: [
          { label: "About", href: "#about" },
          { label: "Features", href: "#features" },
          { label: "Try the App", href: "#early-access" },
          { label: "Waitlist", href: "#waitlist-form" },
          { label: "Network", href: "#building-the-network" },
          { label: "Business Portal", href: "/business" },
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
    subtitle: "Get early access when BawoSocial expands to your city in the diaspora",
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
