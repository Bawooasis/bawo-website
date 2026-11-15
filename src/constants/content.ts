import { IMAGES } from "./images";

export const CONTENT = {
  partnerWithUs: {
    headline: "Own a Nigerian restaurant, lounge, salon, market, or business in NYC? Partner with BawoSocial.",
    body: "Whether you run a Nigerian restaurant or buka, suya spot, lounge, salon, African food market, shipping & cargo service, or professional practice serving the Nigerian community in NYC, sign in to Partner with BawoSocial to claim your verified listing, update your storefront, and connect with members who show up for the culture.",
    ctaLabel: "Partner with us",
    inquiryEmail:
      import.meta.env.VITE_B2B_CONTACT_EMAIL || "Axadegbenro@gmail.com",
    emailSubject: "BawoSocial Nigerian Business & Community Partner",
  },

  communityMission: {
    title: "More than an app. A home for Nigerians in the diaspora.",
    subtitle:
      "BawoSocial exists so Nigerians in the diaspora, starting across all five boroughs of New York City, can celebrate our culture, support Nigerian-owned businesses, and find community that truly feels like home.",
    pillars: [
      {
        title: "Explore Verified Nigerian Spots",
        description:
          "Discover verified Nigerian restaurants, bukas, suya spots, lounges, African grocery markets, salons, churches, mosques, and professional services across NYC, or sign in to claim your own business.",
      },
      {
        title: "Curated Nigerian Events & Owambe",
        description:
          "From Afrobeats nights, Owambe parties, and Nigerian Independence Day celebrations to supper clubs, rooftop linkups, and Nigerian founders mixers across all five boroughs.",
      },
      {
        title: "Community Circles & Safe Spaces",
        description:
          "Join active circles like New to NYC, Safe Space for the Girls, Brotherhood NYC, Nigerian Food & Chop NYC, Mental Wellness & Support, and Faith & Reflection with real feeds, voice notes, and daily gist.",
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
      "The culture hub for Nigerians in the diaspora, starting across all 5 boroughs of NYC. Find verified restaurants and businesses, Community Circles, Afrobeats and Owambe events, and Ask AI.",
    ctaPrimary: "Join BawoSocial",
    ctaMicrocopy: "Stay connected with Nigerian culture, circles, and verified spots across NYC.",
    ctaSecondary: "Join BawoSocial",
    joinHref: "#join",
    partnerHref: "/businesses",
    partnerCta: "Partner with us",
    shareWhatsApp:
      "Check out BawoSocial, the Culture Hub for Nigerians in the diaspora, starting in NYC: https://www.joinbawo.com?utm_source=whatsapp",
    shareLink: "https://www.joinbawo.com?utm_source=share",
    shareTweet:
      "BawoSocial, the Culture Hub for Nigerians in the diaspora, starting in NYC. Find your people at joinbawo.com.",
    shareCopy: "Copy link",
    shareCopied: "Copied!",
    knowWhenLaunch: "Join BawoSocial",
    knowWhenLaunchShort: "Join",
    /** Interactive iPhone 17 Pro App Showcase  -  real mobile product screens + live NYC metadata. */
    nextPreview: [
      {
        kicker: "Live in BawoSocial · Explore Map",
        title: "Explore Verified Nigerian Spots",
        badge: "140+ Verified NYC Spots",
        liveMetric: "Brooklyn · Harlem · Queens · Bronx · Staten Island",
        highlights: [
          "Brooklyn Suya Spot (Nigerian · 4.3 · Directions · 3.3 mi), BUKA",
          "Filter by Food, Shop, Resources & Services with golden NYC map pins",
          "Business owners can sign in to claim & verify their listing",
        ],
        description:
          "Search food, events, faith, and culture across an interactive NYC map of verified Nigerian restaurants, bukas, suya spots, African food markets, salons, and community services, or sign in to claim your business listing.",
        image: IMAGES.showcase.explore,
        imageShot: IMAGES.showcase.exploreShot,
        imageAlt:
          "BawoSocial Explore Map screen with NYC map pins and BUKA place card showing Directions 5.5 mi",
        layout: "full-screen" as const,
      },
      {
        kicker: "Live in BawoSocial · Community Spaces",
        title: "Discover Naija NYC Spaces",
        badge: "My Spaces · Discover · Trending",
        liveMetric: "Active Spaces Across All 5 Boroughs",
        highlights: [
          "Safe Space for the Girls, sisterhood, soft life and real talk",
          "Gen Z NYC, Queer & Proud NYC, and New to NYC newcomer hub",
          "Browse My Spaces, Discover & Trending circles in one tap",
        ],
        description:
          "Find your people in curated Nigerian diaspora spaces, from Safe Space for the Girls and New to NYC to Brotherhood NYC, Gen Z NYC, Nigerian Food & Chop NYC, and Faith & Reflection.",
        image: IMAGES.showcase.startCircle,
        imageShot: IMAGES.showcase.startCircleShot,
        imageAlt:
          "BawoSocial Start a Circle screen with Open a room and bring your people in and Start a circle button",
        layout: "full-screen" as const,
      },
      {
        kicker: "Live in BawoSocial · Circle Hub & Daily Vibe",
        title: "Daily Vibe, Live Rooms & Feeds",
        badge: "Live Audio · Feed · Chats · Events",
        liveMetric: "12 in the Room Right Now · Drop Your Take",
        highlights: [
          "Brotherhood NYC. Feed, Chats, Events and Media",
          "Daily Vibe Live Prompt: 'Year 1 of Japa financial mistakes' (Drop Your Take)",
          "Friday Wins & Check-In posts with Discuss, Share, Endorse & Go Live",
        ],
        description:
          "Step inside active circles like Brotherhood NYC to jump into Live Daily Vibe rooms, drop your take on Japa & diaspora finance, celebrate Friday Wins, or Go Live.",
        image: IMAGES.showcase.circleFeed,
        imageShot: IMAGES.showcase.jobsShot,
        imageAlt:
          "BawoSocial Community Circles screen featuring NYC Jobs & Career Network with Join",
        layout: "full-screen" as const,
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
        imageShot: IMAGES.showcase.eventsShot,
        imageAlt:
          "BawoSocial Events screen featuring Afrobeats & Amapiano Fridays with Share, Get Tickets, and Save",
        layout: "full-screen" as const,
      },
      {
        kicker: "Live in BawoSocial · Ask AI",
        title: "Ask AI",
        badge: "Ask AI",
        liveMetric: "Instant Local Recommendations",
        highlights: [
          "\"Where can I get proper smoky party Jollof & asun tonight?\"",
          "\"Best Nigerian-friendly barber or knotless braids in Crown Heights?\"",
          "\"Which Nigerian church, mosque, or networking mixer is near me?\"",
        ],
        description:
          "Craving smoky party Jollof, pounded yam, efo riro, or suya? Looking for a Nigerian caterer, braiding salon, or church? Ask AI for instant NYC answers.",
        image: IMAGES.showcase.concierge,
        imageShot: IMAGES.showcase.askAiShot,
        imageAlt:
          "BawoSocial Ask AI screen with suggestion cards for jollof, suya, groceries, and Nigerian churches in NYC",
        layout: "full-screen" as const,
      },
    ],
  },

  // Trending Community Circles Showcase (with the 4 new cover artworks + new splash art)
  communityCircles: {
    eyebrow: "Live Inside BawoSocial",
    title: "Nigerian Community Circles That Feel Like Home",
    subtitle:
      "Real sub-communities for Nigerians in NYC, featuring active feeds, voice notes, daily gist prompts, and real-world linkups across all five boroughs.",
    items: [
      {
        id: "new-to-nyc",
        badge: "Japa & City Landing",
        title: "New to NYC",
        members: "All 5 Boroughs · Active Daily",
        voiceNoteDuration: "0:42",
        voiceNoteTopic: "Best boroughs & subway commutes",
        prompt: "Today's Gist: What surprised you most your first month in NYC?",
        description:
          "Just landed, Japa, or new in town? Your unofficial Naija NYC survival guide for apartments, credit/SSN tips, transit, and weekend linkups.",
        image: IMAGES.groups.newToNyc,
        imagePosition: "object-center",
      },
      {
        id: "safe-space-girls",
        badge: "Nigerian Women's Circle",
        title: "Safe Space for the Girls",
        members: "Women-Only · Sisterhood & Soft Life",
        voiceNoteDuration: "1:08",
        voiceNoteTopic: "Silk press & knotless plugs in BK",
        prompt: "Today's Gist: Drop a career win or boundary you're proud of this week.",
        description:
          "A welcoming women-only circle for sisterhood, soft life, rooftop brunches, beauty tips, career wins, and real talk for Nigerian women across NYC.",
        image: IMAGES.groups.safeSpaceSisterhood,
        imagePosition: "object-[center_22%]",
      },
      {
        id: "afro-food-chop",
        badge: "Naija Kitchens & Spots",
        title: "Nigerian Food & Chop NYC",
        members: "Jollof · Swallow · Suya · Groceries",
        voiceNoteDuration: "0:54",
        voiceNoteTopic: "Where to buy fresh ugwu & Agege bread",
        prompt: "Today's Debate: Pounded yam + egusi vs. Amala + gbegiri & ewedu?",
        description:
          "From smoky Lagos owambe Jollof, suya, and pepper soup to efo riro, pounded yam, and African grocery plugs worth crossing boroughs for.",
        image: IMAGES.groups.afroFoodChop,
        imagePosition: "object-[center_65%]",
      },
      {
        id: "wellness-reflection",
        badge: "Wellness & Faith",
        title: "Mental Wellness, Faith & Reflection",
        members: "Daily Prompts · Grounded Support",
        voiceNoteDuration: "1:15",
        voiceNoteTopic: "Navigating family expectations & peace",
        prompt: "Daily Check-In: How are you protecting your peace in the city this week?",
        description:
          "A warm, judgment-free space for Nigerians navigating diaspora life, first-gen pressures, faith reflections, devotionals, and genuine support.",
        image: IMAGES.groups.wellnessGoldenHour,
        imagePosition: "object-[center_20%]",
      },
      {
        id: "brotherhood-nyc",
        badge: "Nigerian Men's Circle",
        title: "Brotherhood NYC",
        members: "Brothers · Goals · Real Talk",
        voiceNoteDuration: "1:02",
        voiceNoteTopic: "Keeping each other accountable in the city",
        prompt: "Today's Check-In: What's one goal you're locking in with the brothers this week?",
        description: "Real talk, goals, and brothers who show up — career, faith, and friendship across NYC.",
        image: IMAGES.groups.brotherhoodNyc,
        imagePosition: "object-[center_30%]",
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
      highlight: "Afrobeats lounges, founders mixers & dining",
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

  // Join BawoSocial — stay on joinbawo.com
  earlyAccess: {
    title: "Join BawoSocial.",
    titleHighlight: "Built for Naija in NYC.",
    subtitle: "Culture hub · Community Circles · Partner with us",
    benefits: [
      {
        title: "Explore Nigerian culture across NYC",
        description:
          "Discover verified Nigerian spots, Community Circles, Afrobeats and Owambe events, and Ask AI — all in one home on BawoSocial.",
      },
      {
        title: "Partner with BawoSocial",
        description:
          "Own a Nigerian restaurant, buka, lounge, salon, African market, or service? Use Partner with us to sign in and manage your verified profile.",
      },
      {
        title: "Stay close to your people",
        description:
          "Leave your email to join BawoSocial updates as we grow with Nigerians across NYC and the diaspora.",
      },
    ],
    cta: "Join BawoSocial",
    missionText:
      "Built for Nigerians in the diaspora, starting with deep roots across all five boroughs of New York City.",
  },

  // Origin Story Section
  origin: {
    title: {
      lead: "Why ",
      highlight: "BawoSocial",
      closing: " Exists",
    },
    paragraphs: [
      "Whether you just landed from Lagos, or you were raised right here in New York, Nigerians shape the energy, hustle, and culture of NYC. Yet finding our authentic restaurants, trusted services, weekend owambes, and our people is still scattered across noisy timelines and buried group chats.",
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
          "Find verified Nigerian restaurants, bukas, suya spots, lounges, African grocery markets, salons, churches, mosques, and shipping/legal services on an interactive map, and business owners can sign in to claim and update their listing.",
      },
      {
        title: "Community Circles & Voice Notes",
        description:
          "No algorithmic noise. Jump into dedicated circles like New to NYC, Safe Space for the Girls, Brotherhood NYC, Nigerian Food & Chop NYC, and Mental Wellness & Support with real feeds, voice notes, and daily gist.",
      },
      {
        title: "Curated Events + Ask AI",
        description:
          "Discover Afrobeats nights, Owambe celebrations, supper clubs, and Nigerian professional mixers across NYC, or Ask AI for tailored local recommendations anytime.",
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
    subtitle: "Connecting Nigerians across New York City, borough by borough.",
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
          "From Brooklyn rooftop day parties and Independence Day celebrations to Manhattan late-night lounges, curated Nigerian music and culture across NYC.",
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
    "Ask AI: Instant recommendations for Nigerian dining, nightlife, groceries, and NYC intel.",
    "Community Circles: New to NYC, Safe Space for the Girls, Brotherhood NYC, Nigerian Food & Chop NYC, and more.",
    "Curated Events: Afrobeats nights, Owambe parties, supper clubs, and Nigerian professional mixers.",
    "Partner with us: Claim your listing, update hours & photos, and reach the Nigerian community on BawoSocial.",
  ],

  // Final CTA Section
  finalCta: {
    title: "Join BawoSocial or Partner with us.",
    subtitle:
      "Stay with the culture hub for Nigerians in NYC, or Partner with BawoSocial to manage your verified listing.",
    cta: "Join BawoSocial",
    ctaSecondary: "Join BawoSocial",
  },

  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "What is BawoSocial?",
        answer:
          "The culture hub for Nigerians in the diaspora, starting across all 5 boroughs of NYC. Find verified restaurants and businesses, Community Circles, Afrobeats and Owambe events, and Ask AI.",
      },
      {
        question: "Who is BawoSocial for?",
        answer:
          "BawoSocial is built for Nigerians in the diaspora (starting in NYC across Brooklyn, Manhattan/Harlem, Queens, The Bronx, and Staten Island) and anyone who loves Nigerian food, music, and culture. And if you own a Nigerian restaurant, lounge, salon, African market, or service, BawoSocial helps the community discover and support you.",
      },
      {
        question: "How do businesses partner with BawoSocial or claim their listing?",
        answer:
          "Click 'Partner with us' in the top navigation bar (or visit /businesses) to open Partner with BawoSocial. You can log in with your existing BawoSocial account or create a new business account, search the Explore directory for your business, submit an ownership claim, and update your profile details.",
      },
      {
        question: "How do I join BawoSocial?",
        answer:
          "Use Join BawoSocial anywhere on this page to stay on joinbawo.com and leave your email. You will hear from us as BawoSocial grows with Nigerians across NYC and the diaspora.",
      },
      {
        question: "What businesses are on the BawoSocial Explore Map?",
        answer:
          "Our Explore Map and Resource Directory feature verified Nigerian and West African restaurants, bukas, suya spots, lounges, African grocery stores, braiding salons, barbershops, churches, mosques, shipping/cargo companies, and legal/immigration services across New York City.",
      },
      {
        question: "How is BawoSocial different from generic social apps or WhatsApp groups?",
        answer:
          "No algorithmic clutter and no lost recommendations buried in chat history. BawoSocial combines a permanent, searchable map of verified Nigerian businesses with curated events, dedicated topic-based Community Circles (with voice notes and daily gist prompts), and Ask AI.",
      },
    ],
  },

  // Footer
  footer: {
    brand: "BawoSocial",
    tagline:
      "Connecting Nigerians in the diaspora, starting in New York City, through culture, Community Circles, curated events, and verified Nigerian-owned businesses.",
    sections: {
      quickLinks: {
        title: "Quick Links",
        links: [
          { label: "Partner with us", href: "/businesses" },
          { label: "Community Circles", href: "#community-circles" },
          { label: "NYC Network", href: "#building-the-network" },
          { label: "About BawoSocial", href: "#about" },
          { label: "Features", href: "#features" },
          { label: "Events", href: "#events" },
          { label: "Join BawoSocial", href: "#join" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      legal: {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Support", href: "/support" },
          { label: "Affiliate disclosure", href: "/affiliate-disclosure" },
        ],
      },
    },
    copyright: "2026 BawoSocial. Built for Nigerians in the Diaspora · Starting in NYC.",
  },

  // Email Signup
  emailSignup: {
    title: "Join BawoSocial",
    subtitle: "Stay connected as BawoSocial grows with Nigerians across NYC and the diaspora",
    placeholder: "Enter your email address",
    cta: "Join BawoSocial",
    success: "Thanks! You're on the BawoSocial list.",
    error: "Please enter a valid email address.",
  },

  // Join form (email signup on joinbawo.com)
  waitlist: {
    title: "Join BawoSocial",
    subtitle: "Stay connected as BawoSocial grows with Nigerians across NYC and the diaspora",
    button: "Join BawoSocial",
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
