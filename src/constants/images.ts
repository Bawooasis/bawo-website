// Website Images Constants - Organized by Usage

// Local asset imports
// import globeImage from "../assets/images/GLOBE.png"; // File removed
import bawoLogo from "../assets/images/bawo-logo.png";
import adoraImage from "../assets/images/ADORA.jpg";
import emekaImage from "../assets/images/Emeka.jpg";
import fatimaImage from "../assets/images/Fatima.jpg";
import nyImage from "../assets/images/NY.jpg";
// (unused city images removed)

// Inside the App Images - screenshots
import appScreenshot1 from "../assets/images/InsideTheAppImages/1.png";
import appScreenshot2 from "../assets/images/HomeMock2.png";

export const IMAGES = {
  // Local Assets
  assets: {
    globe: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&q=80&auto=format&fit=crop", // Placeholder globe image
    logo: bawoLogo,
    // Add more local images here as needed
  },

  // App Preview/Demo Images
  previews: {
    main: appScreenshot1,
    gallery: [
      appScreenshot1,
      appScreenshot2
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
      appScreenshot1,
      appScreenshot2
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
      nyImage,
      nyImage,
      nyImage,
      nyImage,
      nyImage
    ],
    cityMeta: [
      { name: "Brooklyn", image: nyImage },
      { name: "Manhattan", image: nyImage },
      { name: "Queens", image: nyImage },
      { name: "The Bronx", image: nyImage },
      { name: "Staten Island", image: nyImage }
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
