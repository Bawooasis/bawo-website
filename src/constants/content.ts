// Open Beta Mode Toggle
export const IS_OPEN_BETA = false;

export const CONTENT = {
  // Hero Section
  hero: {
    title: "The home for Nigerians, wherever we are.",
    subtitle: "Curated group chats, events, and real connections — built around Nigerian culture.",
    ctaPrimary: "Join the waitlist",
    ctaSecondary: "Become a Founding Member ($50)",
    supportingLine: "Launching city-by-city. Founding Members get first access."
  },

  // Problem Section
  problem: {
    title: "Diaspora community is scattered and exhausting.",
    description: "Finding your people in a new city shouldn't be this hard. Generic apps don't get the culture, the jokes, or what it means to be Nigerian abroad."
  },

  // Solution Section
  solution: {
    title: "Built for us, by us",
    items: [
      {
        title: "Curated group chats",
        description: "Join spaces that actually make sense for you."
      },
      {
        title: "Nigerians in your city",
        description: "Connect with people nearby, not just online."
      },
      {
        title: "Events & linkups",
        description: "Coming in beta — real meetups, not just virtual."
      },
      {
        title: "Smarter discovery",
        description: "Find your crowd based on what matters, not algorithms."
      }
    ]
  },

  // Waitlist Form
  waitlist: {
    title: "Get early access",
    fields: {
      name: "Name",
      email: "Email",
      city: "City (optional)"
    },
    button: "Get early access",
    helperText: "No spam. Early access + updates only.",
    success: "Thanks! You're on the list.",
    error: "Something went wrong. Please try again."
  },

  // Founding Member Section
  foundingMember: {
    title: "Founding Member",
    intro: "Limited spots. One-time $50. Lifetime premium.",
    spotsRemaining: 73, // Update this dynamically if you have real data
    benefits: [
      "One-time $50 payment",
      "Lifetime premium access",
      "Founding badge forever",
      "Priority access to new cities",
      "Invite-only moments"
    ],
    cta: "Secure my Founding Spot — $50",
    showSpotsRemaining: false // Set to true if you have real dynamic data
  },

  // Trust Row
  trust: {
    items: [
      { text: "Stripe payments" },
      { text: "Privacy-first" },
      { text: "Verified community" }
    ]
  },

  // FAQ Section
  faq: {
    title: "FAQ",
    items: [
      {
        question: "What is BawoSocial?",
        answer: "A community app for Nigerians at home and abroad. Curated group chats, city-based connections, and events built around Nigerian culture."
      },
      {
        question: "When do I get access?",
        answer: "We're launching city-by-city. Founding Members get first access. Waitlist members get early access as we roll out."
      },
      {
        question: "What do Founding Members get?",
        answer: "Lifetime premium access, a permanent Founding badge, priority access to new cities and features, and exclusive invite-only moments. One-time $50 payment."
      },
      {
        question: "Is it a subscription?",
        answer: "No. Founding Member is a one-time $50 payment for lifetime premium. Regular membership will be free with optional premium features."
      },
      {
        question: "Refund policy?",
        answer: "Founding Member payments are final. If you have concerns, contact us at support@bawoapp.com and we'll work with you."
      }
    ]
  },

  // Footer
  footer: {
    brand: "BawoSocial",
    tagline: "Where Nigerians Connect",
    copyright: "2025 BawoSocial. Made with ❤️ for the Nigerian diaspora.",
    links: [
      { label: "How it works", href: "#solution" },
      { label: "Founding", href: "#founding" },
      { label: "FAQ", href: "#faq" }
    ]
  }
} as const;
