// Open Beta Mode Toggle
// Set to true when Open Beta is live, false for "Coming Soon" mode
export const IS_OPEN_BETA = false;

export const CONTENT = {
    // Hero Section
    hero: {
      title: "Find your real people. Everywhere.",
      // Mode A (Coming Soon): "BawoSocial is launching soon."
      // Mode B (Open Beta): "Open Beta is live for our early community."
      subtitle: IS_OPEN_BETA 
        ? "Open Beta is live for our early community."
        : "BawoSocial is launching soon.",
      description: "BawoSocial is the premium social club for the Nigerian diaspora – curated group chats, events, and connections with people who actually get your culture.",
      // Mode A: "Become a Founding Member" / "Get early access updates"
      // Mode B: "Join the Open Beta" / "Become a Founding Member (Lifetime Premium)"
      ctaPrimary: IS_OPEN_BETA ? "Join the Open Beta" : "Become a Founding Member",
      ctaSecondary: IS_OPEN_BETA ? "Become a Founding Member (Lifetime Premium)" : "Get early access updates",
      trustText: IS_OPEN_BETA 
        ? "Founding Members and waitlisters are getting early access while we refine the experience."
        : "BawoSocial is launching soon. Founding Members get first access.",
      supportingLine: "Limited Founding Member spots. One-time payment, lifetime access."
    },
  
    // What BawoSocial Is Section
    whatIs: {
      title: "The home for Nigerians, wherever we are.",
      description: "No more explaining your jokes, your music, or your slang. BawoSocial is a members-only space built around Nigerian culture — from Lagos to London to Toronto to New York. Join group chats, link up at curated events, and find people who actually feel like home."
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
          description: "Join \"Always Outside\", \"Afrobeats Army\", \"Lit & Literate\" and more — real people, shared culture, zero nonsense."
        },
        {
          title: "City-Based Communities",
          description: "Connect with Nigerians in your city and abroad — NYC, Toronto, London, Lagos and more."
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
      title: "Founding Members: One-Time Payment. Lifetime Access.",
      intro: "Founding Membership has been extended while we prepare for launch. Limited founding spots available. Once they're gone, they're gone.",
      price: "₦ / $ Founding Member – One-time payment",
      priceSubtext: "Pay once. Keep your benefits for life.",
      spotsRemaining: 73, // Easy to update
      urgencyText: "Only 73 Founding Member spots left.",
      benefits: [
        {
          title: "Lifetime Premium Access",
          description: "Unlock all current and future premium features — no monthly subscription."
        },
        {
          title: "Founding Member Badge",
          description: "Special in-app badge that permanently marks you as an early supporter."
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
          title: "Invites & Priority for Events",
          description: "Early access and priority spots for select BawoSocial events and linkups."
        },
        {
          title: "Founders-Only Channel",
          description: "Access to a private Founding Members group chat for networking and early info."
        }
      ],
      cta: "Secure My Founding Member Spot",
      ctaSubtext: "Founding Membership will close at launch. Limited availability."
    },
  
    // Social Proof / Trust Section (Origin Story with Founder Voice)
    socialProof: {
      title: "Why BawoSocial exists",
      description: "I built BawoSocial after feeling that isolation myself in New York. I wanted a place where Nigerians could land in a new city and instantly feel at home. BawoSocial starts from Nigerian culture — the slang, the music, the jokes, the chaos — and builds from there. This is for people who want real connection, not just more followers.",
      tagline: "Built by Nigerians, for Nigerians",
      cities: ["New York", "Lagos", "London", "Toronto", "Atlanta", "Houston", "Los Angeles"],
      stats: {
        waitlistMembers: "7,200+",
        cities: "50+",
        description: "Nigerians on the waitlist across cities worldwide"
      }
    },
  
    // Trust Indicators (Consolidated)
    trust: {
      indicators: [
        { icon: "🔒", text: "Secure Stripe Payments" },
        { icon: "✓", text: "Verified Members" },
        { icon: "🛡️", text: "Privacy-first" },
        { icon: "💳", text: "256-bit SSL Encryption" },
        { icon: "✓", text: "30-Day Guarantee" }
      ]
    },
  
    // FAQ Section
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What is BawoSocial exactly?",
          answer: "A members-only social app for Nigerians at home and abroad — built around curated group chats, events, and real connections."
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
      title: "If you've ever wanted a real Nigerian community online, this is it.",
      subtitle: "Join as a Founding Member and help build the kind of space we've all been looking for.",
      cta: "Become a Founding Member"
    },
  
    // Urgency Section (replaces countdown)
    urgency: {
      title: "Founding Membership is limited — secure your spot before launch.",
      subtitle: "Founding Members get first access when we launch.",
      cta: "Become a Founding Member",
      ctaSecondary: "Get early access updates"
    },
  
    // Footer
    footer: {
      brand: "BawoSocial",
      tagline: "The home for Nigerians, wherever we are.",
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
      copyright: "2025 BawoSocial. Launching 2025. Made with ❤️ for the Nigerian diaspora."
    },
  
    // Email Signup
    emailSignup: {
      title: "Be First to Know",
      subtitle: "Get early access when BawoSocial launches in your city",
      placeholder: "Enter your email address",
      cta: "Join the Waitlist",
      success: "Thanks! You’re on the list.",
      error: "Please enter a valid email address."
    }
  } as const;
  
