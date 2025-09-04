// Website Images Constants - Organized by Usage

// Local asset imports
import appMockup from "../assets/images/app-mockup.png";
import globeImage from "../assets/images/GLOBE.png";
import bawoLogo from "../assets/images/bawo-logo.png";
import adoraImage from "../assets/images/ADORA.jpg";
import emekaImage from "../assets/images/Emeka.jpg";
import fatimaImage from "../assets/images/Fatima.jpg";
import nyImage from "../assets/images/NY.jpg";
import londonImage from "../assets/images/LONDON.jpg";
import texasImage from "../assets/images/TEXAS.jpg";
import laImage from "../assets/images/LA.jpg";
import canadaImage from "../assets/images/canada.jpg";
import houstonImage from "../assets/images/hOUSTON.jpg";

// Inside the App Images
import exploreScreen from "../assets/images/InsideTheAppImages/ExploreScreen.png";
import matchesScreenshot from "../assets/images/InsideTheAppImages/matchesscreenshot.png";
import notificationsShot from "../assets/images/InsideTheAppImages/Notificationsshot.png";
import pledgeSection from "../assets/images/InsideTheAppImages/PledgeSection.png";

export const IMAGES = {
  // Local Assets
  assets: {
    appMockup,
    globe: globeImage,
    logo: bawoLogo,
    // Add more local images here as needed
  },

  // App Preview/Demo Images
  previews: {
    main: appMockup,
    gallery: [
      exploreScreen,
      matchesScreenshot,
      notificationsShot,
      pledgeSection
    ]
  },

  // Testimonial Avatar Images
  testimonials: {
    adaora: adoraImage,
    emeka: emekaImage,
    fatima: fatimaImage
  },

  // In-App Feature Screenshots
  inApp: {
    features: [
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975938310-59e6f1a53f50?w=800&q=80&auto=format&fit=crop"
    ]
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

  // Global Reach/City Images
  globalReach: {
    cities: [
      nyImage, // New York
      londonImage, // London
      texasImage, // Atlanta (using Texas image)
      laImage, // Los Angeles
      canadaImage, // Canada
      houstonImage // Houston
    ],
    cityMeta: [
      { name: "New York", image: nyImage },
      { name: "London", image: londonImage },
      { name: "Atlanta", image: texasImage },
      { name: "Los Angeles", image: laImage },
      { name: "Canada", image: canadaImage },
      { name: "Houston", image: houstonImage }
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
  return IMAGES.previews.gallery[index] || IMAGES.assets.appMockup;
};

export const getEventImage = (index: number) => {
  return IMAGES.events.highlights[index] || IMAGES.placeholders.event;
};
