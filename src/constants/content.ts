// Open Beta Mode Toggle
// Set to true when Open Beta is live, false for "Coming Soon" mode
export const IS_OPEN_BETA = false;

export const CONTENT = {
    // Hero Section
    hero: {
      title: "The Home for Nigerians Wherever We Are.",
      // Option A (Beta rolling out now): "Connect with your tribe. BawoSocial Open Beta is rolling out now."
      // Option B (Beta launching soon): "Connect with your tribe. BawoSocial Open Beta is launching soon."
      subtitle: IS_OPEN_BETA 
        ? "Connect with your tribe. BawoSocial Open Beta is rolling out now."
        : "Connect with your tribe. BawoSocial Open Beta is launching soon.",
      description: "BawoSocial is the premium social club for the Nigerian diaspora – curated group chats, events, and connections with people who actually get your culture.",
      launchBanner: IS_OPEN_BETA
        ? "BawoSocial Open Beta is rolling out. Founding Membership is open for a limited time."
        : "BawoSocial Open Beta is rolling out. Founding Membership is open for a limited time.",
      // Primary CTA: "Become a Founding Member $50"
      ctaPrimary: "Become a Founding Member $50",
      // Secondary CTA: Option A (invite-only): "Join the Free Waitlist" | Option B (lean into Beta): "Join the Beta Waitlist"
      ctaSecondary: IS_OPEN_BETA ? "Join the Beta Waitlist" : "Join the Free Waitlist",
      trustText: IS_OPEN_BETA 
        ? "Founding Members and waitlisters are getting early access while we refine the experience."
        : "BawoSocial is launching soon. Founding Members get first access.",
      supportingLine: "Limited Founding Member spots. One-time payment, lifetime access."
    },
  
    // Stats Section
    stats: {
      title: "Founding Membership is Limited. Don't Miss Your Spot.",
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
          value: "100",
          label: "FOUNDING SPOTS"
        }
      }
    },
  
    // What BawoSocial Is Section
    whatIs: {
      title: "The home for Nigerians, wherever we are.",
      description: "No more explaining your jokes, your music, or your slang. BawoSocial is a members-only space built around Nigerian culture, from Lagos to London to Toronto to New York. Join group chats, link up at curated events, and find people who actually feel like home."
    },
  
    // Why BawoSocial Differentiators
    whyBawoSocial: {
      title: "Why BawoSocial?",
      differentiators: [
        {
          title: "Built for Nigerians, by Nigerians",
          description: "No explaining your jokes or \"African time.\" Here, your culture is the default, not a checkbox."
        },
        {
          title: "All-in-one community",
          description: "One app for friends, dating, group chats, events and city-based communities."
        },
        {
          title: "Community over algorithm",
          description: "Curated spaces, real conversations, not just endless swiping and random timelines."
        },
        {
          title: "Feels like home, wherever you are",
          description: "From Lagos to London to New York, BawoSocial makes the world feel smaller and closer."
        }
      ]
    },
  
    // Core Features Section
    features: {
      title: "What you get inside the app",
      items: [
        {
          title: "Curated Group Chats",
          description: "Join \"Always Outside\", \"Afrobeats Army\", \"Lit & Literate\" and more. Real people, shared culture, zero nonsense."
        },
        {
          title: "City-Based Communities",
          description: "Connect with Nigerians in your city and abroad: NYC, Toronto, London, Lagos and more."
        },
        {
          title: "Events & Linkups",
          description: "Brunches, game nights, nights out, and cultural events surfaced for people like you."
        },
        {
          title: "Premium Matching & Discovery",
          description: "Intelligent recommendations to help you find your crowd, not just random followers."
        },
        {
          title: "Safe, Vetted Community",
          description: "Community guidelines and reporting tools to keep the vibes safe and respectful."
        }
      ]
    },
  
    // Founding Member Section
    foundingMember: {
      title: "Founding Member Benefits (One-Time $50)",
      intro: "Limited to 100 people worldwide. Permanent badge included.",
      price: "$ Founding Member – One-time payment",
      priceSubtext: "Pay once. Keep your benefits for life.",
      spotsRemaining: 73, // Easy to update
      urgencyText: "Only 73 Founding Member spots left.",
      benefits: [
        {
          title: "Lifetime Premium Access",
          description: "Unlock all current and future premium features. No monthly subscription."
        },
        {
          title: "Priority Access",
          description: "You skip the line for Open Beta access, new features, events, and support."
        },
        {
          title: "Founding Member Badge",
          description: "A permanent badge shown on your profile forever."
        },
        {
          title: "Early Feature Access",
          description: "Test new features before everyone else and help shape the product."
        },
        {
          title: "Priority Support",
          description: "Faster support and direct feedback channel to the team."
        },
        {
          title: "Exclusive Events & VIP Invites",
          description: "Private dinners, mixers, and linkups only for founding members."
        },
        {
          title: "Create & Lead Communities",
          description: "Founders can start groups and build their own tribe."
        },
        {
          title: "Influence BawoSocial's Future",
          description: "Direct input on features, direction, and partnerships."
        },
        {
          title: "Founders Wall Recognition",
          description: "Your name is permanently listed as one of the first 100."
        }
      ],
      cta: "Secure My Founding Spot $50",
      ctaSubtext: "Limited availability. Once it's closed, it's closed."
    },
  
    // In-App Preview Section
    inAppPreview: {
      title: IS_OPEN_BETA 
        ? "Get a first look at the BawoSocial app. Now in Open Beta."
        : "Get a first look at the BawoSocial app. Launching soon.",
      items: [
        {
          title: "Find Your Tribe",
          description: "Discover people who share your vibe & interests."
        },
        {
          title: "Join Exclusive Groups",
          description: "Connect with like-minded Nigerians."
        },
        {
          title: "Attend Events",
          description: "Virtual and in-person meetups worldwide."
        },
        {
          title: "Celebrate Culture",
          description: "Language, food, music, and heritage."
        }
      ]
    },
  
    // Global Reach Section
    globalReach: {
      title: "7,200 Nigerians already on the waitlist, across 50 cities.",
      subtitle: "Growing daily in 50+ cities.",
      description: "Join the waitlist to get early access during Open Beta.",
      cities: [
        { name: "New York", count: "1,247", country: "🇺🇸" },
        { name: "London", count: "1,092", country: "🇬🇧" },
        { name: "Atlanta", count: "1,684", country: "🇺🇸" },
        { name: "Los Angeles", count: "1,503", country: "🇺🇸" },
        { name: "Canada", count: "1,174", country: "🇨🇦" },
        { name: "Houston", count: "892", country: "🇺🇸" }
      ]
    },
  
    // Social Proof / Trust Section (Origin Story with Founder Voice)
    socialProof: {
      title: "Why BawoSocial exists",
      description: "I built BawoSocial after feeling that isolation myself in New York. I wanted a place where Nigerians could land in a new city and instantly feel at home. BawoSocial starts from Nigerian culture: the slang, the music, the jokes, the chaos, and builds from there. This is for people who want real connection, not just more followers. BawoSocial is currently in Open Beta, starting with Nigerians across major diaspora cities.",
      tagline: "Built by Nigerians, for Nigerians",
      cities: ["New York", "Lagos", "London", "Toronto", "Atlanta", "Houston", "Los Angeles"],
      stats: {
        waitlistMembers: "7,200+",
        cities: "50+",
        description: "Nigerians on the waitlist across cities worldwide"
      }
    },
  
    // Trust Indicators (Consolidated - Single Set)
    trust: {
      indicators: [
        { 
          icon: "🔒", 
          title: "Secure Payments",
          description: "256-bit SSL with Stripe. Your transactions stay protected."
        },
        { 
          icon: "✓", 
          title: "Verified Profiles",
          description: "We verify members to ensure real, quality connections."
        },
        { 
          icon: "🛡️", 
          title: "Privacy Protected",
          description: "Your data stays private. We never sell personal info."
        },
        { 
          icon: "✓", 
          title: "Money-Back Guarantee",
          description: "30-day full refund. No questions asked."
        }
      ]
    },
  
    // FAQ Section
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What is BawoSocial exactly?",
          answer: "A members-only social app for Nigerians at home and abroad, built around curated group chats, events, and real connections."
        },
        {
          question: "What do I get as a Founding Member?",
          answer: "Lifetime premium access, a Founding Member badge, early feature access, priority for events, and a private founders-only channel."
        },
        {
          question: "Is the Founding Member payment a subscription?",
          answer: "No. It's a one-time payment for lifetime access to premium."
        },
        {
          question: "When does the app launch?",
          answer: "We're launching soon, rolling out city by city. Founding Members get first access."
        },
        {
          question: "Can I get a refund?",
          answer: "Founding Member payments are final. However, if you have concerns, please contact us at support@bawoapp.com and we'll work with you."
        },
        {
          question: "Do I have to be Nigerian to join?",
          answer: "BawoSocial is built primarily for Nigerians at home and in the diaspora – but anyone who genuinely loves and respects our culture is welcome in the community."
        }
      ]
    },
  
    // Testimonials
    testimonials: {
      title: "Hear from Nigerians already finding their people",
      items: [
        {
          name: "Tola",
          location: "New York",
          quote: "I didn't realize how much I needed Nigerian friends until BawoSocial helped me find them."
        },
        {
          name: "Ayo",
          location: "Atlanta",
          quote: "My city is full of Africans, but I never found the Nigerians until BawoSocial showed me."
        },
        {
          name: "Dami",
          location: "London",
          quote: "It feels like home without being home."
        }
      ]
    },
  
    // Final CTA Section
    finalCta: {
      title: IS_OPEN_BETA 
        ? "Open Beta Rolling Out. Last Chance to Become a Founding Member."
        : "Launching Soon. Last Chance to Become a Founding Member.",
      subtitle: "Founding Membership closes soon. Only 73 spots left.",
      cta: "Become a Founding Member",
      additionalText: "30-day money-back guarantee • Save $1,139+ • Only 73 left"
    },
  
    // Urgency Section (replaces countdown)
    urgency: {
      title: IS_OPEN_BETA ? "Open Beta Rolling Out" : "Open Beta Launching Soon",
      subtitle: "Founding Membership will close soon. Only 73 spots left.",
      cta: "Become a Founding Member",
      ctaSecondary: "Get early access updates"
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
            { label: "Privacy Policy", action: "privacy" },
            { label: "Terms of Service", action: "terms" },
            { label: "Cookie Policy", action: "cookies" },
            { label: "Refund Policy", action: "refund" }
          ]
        }
      },
      copyright: IS_OPEN_BETA 
        ? "2025 BawoSocial. Now in Open Beta. Made with ❤️ for the Nigerian diaspora."
        : "2025 BawoSocial. Made with ❤️ for the Nigerian diaspora."
    },
  
    // Email Signup
    emailSignup: {
      title: "Be First to Know",
      subtitle: "Get early access when BawoSocial Open Beta lands in your city",
      placeholder: "Enter your email address",
      cta: "Join the Waitlist",
      success: "Thanks! You’re on the list.",
      error: "Please enter a valid email address."
    }
  } as const;
  
