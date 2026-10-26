import { IMAGES } from "./images";

export const CONTENT = {
  partnerWithUs: {
    headline: "Own a Nigerian restaurant, lounge, salon, market, or business in NYC? Claim your listing on BawoSocial.",
    body: "Whether you run a Nigerian restaurant or buka, suya spot, lounge, salon, African food market, shipping & cargo service, or professional practice serving the Nigerian community in NYC — sign in to the BawoSocial Business Portal to claim your verified listing, update your storefront, and connect with members who show up for the culture.",
    ctaLabel: "Businesses Log In / Sign In",
    inquiryEmail:
      import.meta.env.VITE_B2B_CONTACT_EMAIL || "Axadegbenro@gmail.com",
    emailSubject: "BawoSocial Nigerian Business & Community Partner",
  },

  communityMission: {
    title: "More than an app. A home for Nigerians in the diaspora.",
    subtitle:
      "BawoSocial exists so Nigerians in the diaspora — starting across all five boroughs of New York City — can celebrate our culture, support Nigerian-owned businesses, and find community that truly feels like home.",
    pillars: [
      {
        title: "Explore Verified Nigerian Spots",
        description:
          "Discover verified Nigerian restaurants, bukas, suya spots, lounges, African grocery markets, salons, churches, mosques, and professional services across NYC — or sign in to claim your own business.",
      },
      {
        title: "Curated Nigerian Events & Owambe",
        description:
          "From Afrobeats nights, Owambe parties, and Nigerian Independence Day celebrations to supper clubs, rooftop linkups, and Nigerian founders mixers across all five boroughs.",
      },
      {
        title: "Community Circles & Safe Spaces",
        description:
          "Join active circles like New to NYC, Safe Space for the Girls, Nigerian Food & Chop NYC, Mental Wellness & Support, and Faith & Reflection with real feeds, voice notes, and daily gist.",
      },
    ],
  },

  // Hero Section
  hero: {
    title: {
      lead: "Find your people. ",
      highlight: "Feel at home.",
    },
    subtitle:
      "The Culture Hub for Nigerians in the Diaspora — starting across all 5 boroughs of NYC. Discover verified Nigerian restaurants & businesses, active Community Circles, Afrobeats & Owambe events, and the BawoSocial Concierge.",
    ctaPrimary: "Join the Waitlist",
    ctaMicrocopy: "Free iOS TestFlight beta live in NYC · Android & new cities coming soon",
    ctaSecondary: "Join Waitlist",
    testflightLink: "https://testflight.apple.com/join/RU883akC",
    ctaTestFlight: "Download via TestFlight",
    downloadIos: "Download for iOS",
    downloadIosSub: "Live TestFlight Beta",
    downloadAndroid: "Android",
    downloadAndroidSoon: "Coming soon",
    shareWhatsApp:
      "Check out BawoSocial — the Culture Hub for Nigerians in the diaspora, starting in NYC: https://www.joinbawo.com?utm_source=whatsapp",
    shareLink: "https://www.joinbawo.com?utm_source=share",
    shareTweet:
      "BawoSocial — the Culture Hub for Nigerians in the diaspora, starting in NYC. Try the iOS beta or join the waitlist.",
    shareCopy: "Copy link",
    shareCopied: "Copied!",
    knowWhenLaunch: "Know when we launch",
    knowWhenLaunchShort: "Launch updates",
    /** Interactive iPhone 17 Pro App Showcase — real mobile product screens + live NYC metadata. */
    nextPreview: [
      {
        kicker: "Live in BawoSocial · Explore Map",
        title: "Explore Verified Nigerian Spots",
        badge: "140+ Verified NYC Spots",
        liveMetric: "Brooklyn · Harlem · Queens · Bronx · Staten Island",
        highlights: [
          "BUKA, Lagos TSQ,uya spots & Nigerian kitchens",
          "African grocery plugs for ugwu, garri & Agege bread",
          "Business owners can claim & verify their listing",
        ],
        description:
          "Find verified Nigerian restaurants, bukas, suya spots, lounges, African food markets, salons, and community services across NYC — or sign in to claim your business listing.",
        image: IMAGES.showcase.explore,
        imageAlt:
          "BawoSocial Explore screen showing verified Nigerian restaurants and businesses across the New York City map",
        layout: "map-crop" as const,
      },
      {
        kicker: "Live in BawoSocial · Community Circles",
        title: "Join Naija NYC Circles",
        badge: "Voice Notes & Daily Gist",
        liveMetric: "7 Active Circles · Real-Time Feeds",
        highlights: [
          "New to NYC — Japa & newcomer survival guide",
          "Safe Space for the Girls — Nigerian women's circle",
          "Nigerian Food & Chop NYC — Jollof, swallow & plugs",
        ],
        description:
          "New to NYC, Safe Space for the Girls, Nigerian Food & Chop NYC, Mental Wellness & Support, and Faith & Reflection — active circles with feeds, voice notes, and daily prompts.",
        image: IMAGES.showcase.community,
        imageAlt:
          "BawoSocial Community screen showing Nigerian diaspora circles in New York City",
        layout: "screen-crop" as const,
      },
      {
        kicker: "Live in BawoSocial · Events & Nightlife",
        title: "Afrobeats, Owambe & Linkups",
        badge: "Curated Weekly Across NYC",
        liveMetric: "Rooftops · Supper Clubs · Founders Mixers",
        highlights: [
          "Afrobeats & Alte nights in Brooklyn and Lower Manhattan",
          "Nigerian supper clubs, suya pop-ups & Independence events",
          "See who from your circle is pulling up before you go",
        ],
        description:
          "Afrobeats nights, Owambe celebrations, Nigerian supper clubs, rooftop linkups, and professional mixers curated for Nigerians across all five boroughs.",
        image: IMAGES.showcase.events,
        imageAlt:
          "BawoSocial Events screen showing Nigerian nightlife and cultural gatherings in New York City",
        layout: "screen-crop" as const,
      },
      {
        kicker: "Live in BawoSocial · AI Concierge",
        title: "Ask BawoSocial Concierge",
        badge: "24/7 Naija NYC Insider AI",
        liveMetric: "Instant Local Recommendations",
        highlights: [
          "\"Where can I get proper smoky party Jollof & asun tonight?\"",
          "\"Best Nigerian-friendly barber or knotless braids in Crown Heights?\"",
          "\"Which Nigerian church, mosque, or networking mixer is near me?\"",
        ],
        description:
          "Craving smoky party Jollof, pounded yam, efo riro, or suya? Looking for a Nigerian caterer, braiding salon, or church? Ask the AI BawoSocial Concierge for instant NYC answers.",
        image: IMAGES.showcase.concierge,
        imageAlt:
          "BawoSocial Concierge screen offering culturally relevant recommendations for Nigerians in NYC",
        layout: "screen-crop" as const,
      },
    ],
  },

  // Trending Community Circles Showcase (with the 4 new cover artworks + new splash art)
  communityCircles: {
    eyebrow: "Live Inside BawoSocial",
    title: "Nigerian Community Circles That Feel Like Home",
    subtitle:
      "Real sub-communities for Nigerians in NYC — featuring active feeds, voice notes, daily gist prompts, and real-world linkups across all five boroughs.",
    items: [
      {
        id: "new-to-nyc",
        badge: "Japa & City Landing",
        title: "New to NYC",
        members: "All 5 Boroughs · Active Daily",
        voiceNoteLabel: "0:42 Voice Note · Best boroughs & subway commutes",
        prompt: "Today's Gist: What surprised you most your first month in NYC?",
        description:
          "Just landed, Japa, or new in town? Your unofficial Naija NYC survival guide for apartments, credit/SSN tips, transit, and weekend linkups.",
        image: IMAGES.groups.newToNyc,
      },
      {
        id: "safe-space-girls",
        badge: "Nigerian Women's Circle",
        title: "Safe Space for the Girls",
        members: "Women-Only · Sisterhood & Soft Life",
        voiceNoteLabel: "1:08 Voice Note · Silk press & knotless plugs in BK",
        prompt: "Today's Gist: Drop a career win or boundary you're proud of this week ✨",
        description:
          "A welcoming women-only circle for sisterhood, soft life, rooftop brunches, beauty & geles, career wins, and real talk for Nigerian women across NYC.",
        image: IMAGES.groups.safeSpaceSisterhood,
      },
      {
        id: "afro-food-chop",
        badge: "Naija Kitchens & Spots",
        title: "Nigerian Food & Chop NYC",
        members: "Jollof · Swallow · Suya · Groceries",
        voiceNoteLabel: "0:54 Voice Note · Where to buy fresh ugwu & Agege bread",
        prompt: "Today's Debate: Pounded yam + egusi vs. Amala + gbegiri & ewedu?",
        description:
          "From smoky Lagos owambe Jollof, suya, and pepper soup to efo riro, pounded yam, and African grocery plugs worth crossing boroughs for.",
        image: IMAGES.groups.afroFoodChop,
      },
      {
        id: "wellness-reflection",
        badge: "Wellness & Faith",
        title: "Mental Wellness, Faith & Reflection",
        members: "Daily Prompts · Grounded Support",
        voiceNoteLabel: "1:15 Voice Note · Navigating family expectations & peace",
        prompt: "Daily Check-In: How are you protecting your peace in the city this week?",
        description:
          "A warm, judgment-free space for Nigerians navigating diaspora life, first-gen pressures, faith reflections, devotionals, and genuine support.",
        image: IMAGES.groups.wellnessGoldenHour,
      },
    ],
  },

  // Live NYC Borough Pulse data for $50,000 Flagship Experience
  boroughPulse: [
    {
      name: "Brooklyn",
      tag: "Crown Heights · Bed-Stuy · Flatbush · Downtown BK",
      spotsCount: "48+ Verified Spots",
      highlight: "BUKA, suya nights, Nigerian creatives & rooftop linkups",
    },
    {
      name: "Manhattan & Harlem",
      tag: "Harlem · Midtown · Times Square · Lower East Side",
      spotsCount: "36+ Verified Spots",
      highlight: "Lagos TSQ, Afrobeats lounges, founders mixers & dining",
    },
    {
      name: "Queens",
      tag: "Jamaica · Laurelton · Astoria · Long Island City",
      spotsCount: "32+ Verified Spots",
      highlight: "Authentic Nigerian kitchens, African grocery markets & family hubs",
    },
    {
      name: "The Bronx",
      tag: "Williamsbridge · Fordham · Pelham Parkway",
      spotsCount: "28+ Verified Spots",
      highlight: "Bukas, fresh Agege bread bakeries, churches, mosques & caterers",
    },
    {
      name: "Staten Island & NJ Corridor",
      tag: "North Shore · Newark · Jersey City",
      spotsCount: "24+ Verified Spots",
      highlight: "Nigerian community associations, supermarkets & weekend owambes",
    },
  ],

  // Early access — TestFlight + waitlist + Businesses
  earlyAccess: {
    title: "Try BawoSocial.",
    titleHighlight: "Built for Naija in NYC.",
    subtitle: "iOS beta live on TestFlight · Nigerian Business Portal live · Expanding next",
    benefits: [
      {
        title: "Test on iOS via TestFlight",
        description:
          "Download the live BawoSocial beta through Apple TestFlight and explore the NYC Nigerian map, circles, events, and BawoSocial Concierge.",
      },
      {
        title: "Nigerian Businesses: Sign In & Claim Your Listing",
        description:
          "Own a Nigerian restaurant, buka, lounge, salon, African market, or service? Click 'Businesses' at the top of the page to sign in and manage your verified profile.",
      },
      {
        title: "Join the BawoSocial Waitlist",
        description:
          "On Android or outside NYC (Houston, Atlanta, DMV, London, Toronto)? Leave your email for launch updates as BawoSocial expands.",
      },
    ],
    cta: "Join the Waitlist",
    missionText:
      "Built for Nigerians in the diaspora — starting with deep roots across all five boroughs of New York City.",
  },

  // Origin Story Section
  origin: {
    title: {
      lead: "Why ",
      highlight: "BawoSocial",
      closing: " Exists",
    },
    paragraphs: [
      "Whether you just landed from Lagos, Abuja, Port Harcourt, Enugu, or Ibadan — or you were raised right here in New York — Nigerians shape the energy, hustle, and culture of NYC. Yet finding our authentic restaurants, trusted services, weekend owambes, and our people is still scattered across noisy timelines and buried group chats.",
      {
        highlight: "BawoSocial",
        text: " brings the Nigerian community in the diaspora into one elevated, intentional home. Starting across all five boroughs of New York City, we make it effortless to discover verified Nigerian-owned businesses, join real Community Circles, pull up to cultural events, and feel at home.",
      },
    ],
    visionText: "",
  },

  // Features Section
  features: {
    title: "Your Culture. Your Map. Your Circles.",
    items: [
      {
        title: "Explore Map & Nigerian Business Directory",
        description:
          "Find verified Nigerian restaurants, bukas, suya spots, lounges, African grocery markets, salons, churches, mosques, and shipping/legal services on an interactive map — and business owners can sign in to claim and update their listing.",
      },
      {
        title: "Community Circles & Voice Notes",
        description:
          "No algorithmic noise. Jump into dedicated circles like New to NYC, Safe Space for the Girls, Nigerian Food & Chop NYC, and Mental Wellness & Support with real feeds, voice notes, and daily gist.",
      },
      {
        title: "Curated Events + BawoSocial Concierge",
        description:
          "Discover Afrobeats nights, Owambe celebrations, supper clubs, and Nigerian professional mixers across NYC — or ask the AI BawoSocial Concierge for tailored local recommendations anytime.",
      },
    ],
  },

  // Testimonials Section
  testimonials: {
    title: "What We're Building For",
    subtitle: "Voices from Nigerians across New York City",
    reviews: [
      {
        name: "Adaora O.",
        role: "Crown Heights, Brooklyn",
        quote: "Finally one place where our Nigerian restaurants, weekend events, and community circles actually live together without noise.",
        avatar: IMAGES.testimonials.adaora,
      },
      {
        name: "Emeka N.",
        role: "Harlem & Queens, NYC",
        quote: "When you move to New York, finding proper Jollof, a reliable barber, and genuine Naija community shouldn't take six months.",
        avatar: IMAGES.testimonials.emeka,
      },
      {
        name: "Fatima B.",
        role: "The Bronx, NY",
        quote: "Something between a Nigerian cultural guide, a trusted business directory, and a warm family reunion in the city.",
        avatar: IMAGES.testimonials.fatima,
      },
    ],
  },

  // Global Reach Section
  globalReach: {
    title: "Deep Nigerian Roots Across All 5 Boroughs.",
    subtitle: "Connecting Nigerians across New York City — borough by borough.",
    description:
      "Starting with high-density Nigerian restaurants, bukas, grocery markets, events, and community circles across Brooklyn, Harlem, Queens, The Bronx, and Staten Island.",
    cities: [
      { name: "Brooklyn", country: "🇺🇸" },
      { name: "Harlem", country: "🇺🇸" },
      { name: "Queens", country: "🇺🇸" },
      { name: "The Bronx", country: "🇺🇸" },
      { name: "Staten Island", country: "🇺🇸" },
    ],
  },

  events: {
    title: "Curated Nigerian Events, Owambe & Nightlife",
    items: [
      {
        icon: "calendar" as const,
        title: "Afrobeats Nights, Alte & Owambe Celebrations",
        description:
          "From Brooklyn rooftop day parties and Independence Day celebrations to Manhattan late-night lounges — curated Nigerian music and culture across NYC.",
      },
      {
        icon: "headphones" as const,
        title: "Nigerian Supper Clubs, Suya Pop-Ups & Food Crawls",
        description:
          "Taste home across NYC with Lagos-style suya nights, smoky party Jollof linkups, chef tastings, and neighborhood restaurant crawls.",
      },
      {
        icon: "star" as const,
        title: "Naija Founders Mixers, Tech/Finance & Circle Meetups",
        description:
          "Turn digital circles into real-life friendships through New to NYC linkups, Safe Space sisterhood brunches, and Nigerian professional networking.",
      },
    ],
  },

  inAppFeatureCaptions: [
    "Explore Map: Verified Nigerian restaurants, bukas, suya spots, African markets, salons, and services in NYC.",
    "BawoSocial Concierge: Instant AI recommendations for Nigerian dining, nightlife, groceries, and NYC intel.",
    "Community Circles: New to NYC, Safe Space for the Girls, Nigerian Food & Chop NYC, and more.",
    "Curated Events: Afrobeats nights, Owambe parties, supper clubs, and Nigerian professional mixers.",
    "For Businesses: Claim your listing, update hours & photos, and reach the Nigerian community on BawoSocial.",
  ],

  // Final CTA Section
  finalCta: {
    title: "Download BawoSocial or Claim Your Nigerian Business.",
    subtitle:
      "Try the live iOS beta on TestFlight, sign in via Businesses to manage your listing, or join the waitlist as we grow across NYC and beyond.",
    cta: "Download via TestFlight",
    ctaSecondary: "Join Waitlist",
  },

  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "What is BawoSocial?",
        answer:
          "BawoSocial is the culture hub for Nigerians in the diaspora — starting across all five boroughs of New York City. BawoSocial brings together an interactive map of verified Nigerian restaurants and businesses, active Community Circles, curated Afrobeats and cultural events, and the AI-powered BawoSocial Concierge.",
      },
      {
        question: "Who is BawoSocial for?",
        answer:
          "BawoSocial is built for Nigerians in the diaspora (starting in NYC across Brooklyn, Manhattan/Harlem, Queens, The Bronx, and Staten Island) and anyone who loves Nigerian food, music, and culture. And if you own a Nigerian restaurant, lounge, salon, African market, or service, BawoSocial helps the community discover and support you.",
      },
      {
        question: "How do businesses sign in or claim their listing on BawoSocial?",
        answer:
          "Click 'Businesses' in the top navigation bar (or visit /businesses) to open the BawoSocial Business Portal. You can log in with your existing BawoSocial account or create a new business account, search the Explore directory for your business, submit an ownership claim, and update your profile details.",
      },
      {
        question: "How do I try the BawoSocial mobile app?",
        answer:
          "The iOS public beta is live on Apple TestFlight. Tap 'Download for iOS' or 'Download via TestFlight' anywhere on this page. On Android or outside NYC, join the email waitlist and we will notify you as we expand.",
      },
      {
        question: "What businesses are on the BawoSocial Explore Map?",
        answer:
          "Our Explore Map and Resource Directory feature verified Nigerian and West African restaurants, bukas, suya spots, lounges, African grocery stores, braiding salons, barbershops, churches, mosques, shipping/cargo companies, and legal/immigration services across New York City.",
      },
      {
        question: "How is BawoSocial different from generic social apps or WhatsApp groups?",
        answer:
          "No algorithmic clutter and no lost recommendations buried in chat history. BawoSocial combines a permanent, searchable map of verified Nigerian businesses with curated events, dedicated topic-based Community Circles (with voice notes and daily gist prompts), and the AI BawoSocial Concierge.",
      },
    ],
  },

  // Footer
  footer: {
    brand: "BawoSocial",
    tagline:
      "Connecting Nigerians in the diaspora — starting in New York City — through culture, Community Circles, curated events, and verified Nigerian-owned businesses.",
    sections: {
      quickLinks: {
        title: "Quick Links",
        links: [
          { label: "Businesses Sign In", href: "/businesses" },
          { label: "Community Circles", href: "#community-circles" },
          { label: "NYC Network", href: "#building-the-network" },
          { label: "About BawoSocial", href: "#about" },
          { label: "Features", href: "#features" },
          { label: "Events", href: "#events" },
          { label: "Try the App", href: "#early-access" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      legal: {
        title: "Legal",
        links: [{ label: "Privacy Policy", action: "privacy" }],
      },
    },
    copyright: "2026 BawoSocial. Built for Nigerians in the Diaspora · Starting in NYC.",
  },

  // Email Signup
  emailSignup: {
    title: "Be First to Know",
    subtitle: "Get early access as BawoSocial grows across NYC and expands to more Nigerian diaspora hubs",
    placeholder: "Enter your email address",
    cta: "Join the Waitlist",
    success: "Thanks! You're on the BawoSocial list.",
    error: "Please enter a valid email address.",
  },

  // Waitlist Form
  waitlist: {
    title: "Join the BawoSocial Waitlist",
    subtitle: "Be first to know as BawoSocial launches new features and expands beyond NYC",
    button: "Join the Waitlist",
    success: "Thanks! You're on the BawoSocial list.",
    error: "Please enter a valid email address.",
    helperText: "We'll never spam you. Unsubscribe anytime.",
    fields: {
      name: "Your name",
      email: "Your email",
      city: "Borough or City (optional)",
    },
  },
} as const;
