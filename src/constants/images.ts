// Website Images Constants - Organized by Usage

// Local asset imports
// import globeImage from "../assets/images/GLOBE.png"; // File removed
import bawoLogo from "../assets/images/bawo-logo.png";
import bawoLogoMain from "../assets/images/Logo.png";
import adoraImage from "../assets/images/ADORA.jpg";
import emekaImage from "../assets/images/Emeka.jpg";
import fatimaImage from "../assets/images/Fatima.jpg";

// Borough images - NYC specific
import bkBrooklyn01 from "../assets/images/brooklyn/bk-01.png";
import bkBrooklyn02 from "../assets/images/brooklyn/bk-02.png";
import bkBrooklyn03 from "../assets/images/brooklyn/bk-03.png";
import bkBrooklyn04 from "../assets/images/brooklyn/bk-04.png";
import bkBrooklyn05 from "../assets/images/brooklyn/bk-05.png";
import hm01 from "../assets/images/harlem/hm-01.png";
import hm02 from "../assets/images/harlem/hm-02.png";
import hm03 from "../assets/images/harlem/hm-03.png";
import hm04 from "../assets/images/harlem/hm-04.png";
import hm05 from "../assets/images/harlem/hm-05.png";
import hm06 from "../assets/images/harlem/hm-06.png";
import hm07 from "../assets/images/harlem/hm-07.png";
import hm08 from "../assets/images/harlem/hm-08.png";
import hm09 from "../assets/images/harlem/hm-09.png";
import hm10 from "../assets/images/harlem/hm-10.png";
import hm11 from "../assets/images/harlem/hm-11.png";
import hm12 from "../assets/images/harlem/hm-12.png";
import hm13 from "../assets/images/harlem/hm-13.png";
import qn01 from "../assets/images/queens/qn-01.png";
import qn02 from "../assets/images/queens/qn-02.png";
import qn03 from "../assets/images/queens/qn-03.png";
import qn04 from "../assets/images/queens/qn-04.png";
import qn05 from "../assets/images/queens/qn-05.png";
import qn06 from "../assets/images/queens/qn-06.png";
import qn07 from "../assets/images/queens/qn-07.png";
import bx01 from "../assets/images/bronx/bx-01.png";
import bx02 from "../assets/images/bronx/bx-02.png";
import bx03 from "../assets/images/bronx/bx-03.png";
import bx04 from "../assets/images/bronx/bx-04.png";
import bx05 from "../assets/images/bronx/bx-05.png";
import bx06 from "../assets/images/bronx/bx-06.png";
import bx07 from "../assets/images/bronx/bx-07.png";
import bx08 from "../assets/images/bronx/bx-08.png";
import bx09 from "../assets/images/bronx/bx-09.png";
import si01 from "../assets/images/staten/si-01.png";
import si02 from "../assets/images/staten/si-02.png";
import si03 from "../assets/images/staten/si-03.png";
import si04 from "../assets/images/staten/si-04.png";
import si05 from "../assets/images/staten/si-05.png";

// Inside the App Images - screenshots
import appResourcesScreen from "../assets/images/app-resources-full.png";
import appConciergeScreen from "../assets/images/app-concierge.png";
import appCommunityScreen from "../assets/images/app-community-screen.png";
import appEventsScreen from "../assets/images/app-events-screen.png";
import appCommunityAltScreen from "../assets/images/app-community-alt.png";
import heroTripleMockup from "../assets/images/hero-app-triple-mockup.png";

/** Hero: single wide composite (Resources, Concierge, Events). Add more slides here when ready. */
const heroPreviewGallery = [heroTripleMockup] as const;

/** Lower “In-App Preview” grid — individual screens. */
const appFeatureScreens = [
  appResourcesScreen,
  appConciergeScreen,
  appCommunityScreen,
  appEventsScreen,
  appCommunityAltScreen,
] as const;

export const IMAGES = {
  // Local Assets
  assets: {
    globe: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&q=80&auto=format&fit=crop", // Placeholder globe image
    logo: bawoLogoMain,
    logoOld: bawoLogo,
    // Add more local images here as needed
  },

  // App Preview/Demo Images
  previews: {
    main: heroTripleMockup,
    gallery: [...heroPreviewGallery],
  },

  // Testimonial Avatar Images
  testimonials: {
    adaora: adoraImage,
    emeka: emekaImage,
    fatima: fatimaImage
  },

  // In-App Feature Screenshots
  inApp: {
    features: [...appFeatureScreens],
  },

  // Event/Community Images
  events: {
    highlights: [
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975938310-59e6f1a53f50?w=800&q=80&auto=format&fit=crop"
    ]
  },

  // Global Reach/City Images - NYC Boroughs
  globalReach: {
    /** Brooklyn: multi-image square carousel (hero set). First slide fills index 0 for fallbacks. */
    brooklynGallery: [
      bkBrooklyn01,
      bkBrooklyn02,
      bkBrooklyn03,
      bkBrooklyn04,
      bkBrooklyn05,
    ] as const,
    /** Queens: multi-image square carousel */
    queensGallery: [qn01, qn02, qn03, qn04, qn05, qn06, qn07] as const,
    /** The Bronx: multi-image square carousel */
    bronxGallery: [bx01, bx02, bx03, bx04, bx05, bx06, bx07, bx08, bx09] as const,
    /** Harlem (Manhattan hub): multi-image square carousel */
    harlemGallery: [
      hm01,
      hm02,
      hm03,
      hm04,
      hm05,
      hm06,
      hm07,
      hm08,
      hm09,
      hm10,
      hm11,
      hm12,
      hm13,
    ] as const,
    /** Staten Island: multi-image square carousel */
    statenIslandGallery: [si01, si02, si03, si04, si05] as const,
    cities: [
      bkBrooklyn01,
      hm01,
      qn01,
      bx01,
      si01
    ],
    cityMeta: [
      { name: "Brooklyn", image: bkBrooklyn01 },
      { name: "Harlem", image: hm01 },
      { name: "Queens", image: qn01 },
      { name: "The Bronx", image: bx01 },
      { name: "Staten Island", image: si01 }
    ]
  },

  // Placeholder/Fallback Images
  placeholders: {
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&q=80&auto=format&fit=crop",
    feature: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=768&q=80&auto=format&fit=crop",
    event: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80&q=80&auto=format&fit=crop"
  },

  // Public assets (from public folder)
  public: {
    favicon: "/favicon.png",
    foundingMemberBg: "/founding-member-background.png",
    heroSection: "/hero-section.png", 
    phoneMockup: "/phone-mockup.png"
  }
} as const;

// Helper functions for image management
export const getTestimonialAvatar = (name: 'adaora' | 'emeka' | 'fatima') => {
  return IMAGES.testimonials[name];
};

export const getCityImage = (index: number) => {
  return IMAGES.globalReach.cities[index] || IMAGES.placeholders.feature;
};

export const getPreviewImage = (index: number) => {
  return IMAGES.previews.gallery[index] || IMAGES.previews.main;
};

export const getEventImage = (index: number) => {
  return IMAGES.events.highlights[index] || IMAGES.placeholders.event;
};
