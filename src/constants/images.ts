// Website Images Constants - Organized by Usage

// Local asset imports
import appMockup from "../assets/images/app-mockup.png";
import globeImage from "../assets/images/GLOBE.png";

export const IMAGES = {
  // Local Assets
  assets: {
    appMockup,
    globe: globeImage,
    // Add more local images here as needed
  },

  // App Preview/Demo Images
  previews: {
    main: appMockup,
    gallery: [
      appMockup,
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=768&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=768&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=768&q=80&auto=format&fit=crop"
    ]
  },

  // Testimonial Avatar Images
  testimonials: {
    adaora: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&q=80&auto=format&fit=crop",
    emeka: "https://images.unsplash.com/photo-1544005311-94ddf0286df2?w=96&q=80&auto=format&fit=crop",
    fatima: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=96&q=80&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=112&h=112&fit=crop&crop=center", // London
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=112&h=112&fit=crop&crop=center", // Toronto
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=112&h=112&fit=crop&crop=center", // New York
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=112&h=112&fit=crop&crop=center", // Houston
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=112&h=112&fit=crop&crop=center", // Atlanta
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=112&h=112&fit=crop&crop=center"  // Dubai
    ],
    cityMeta: [
      { name: "London", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=112&h=112&fit=crop&crop=center" },
      { name: "Toronto", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=112&h=112&fit=crop&crop=center" },
      { name: "New York", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=112&h=112&fit=crop&crop=center" },
      { name: "Houston", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=112&h=112&fit=crop&crop=center" },
      { name: "Atlanta", image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=112&h=112&fit=crop&crop=center" },
      { name: "Dubai", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=112&h=112&fit=crop&crop=center" }
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
