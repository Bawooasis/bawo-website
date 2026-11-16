import { Sparkles } from "lucide-react";
import AppScreenShot from "./AppScreenShot";
import AppScreenshotPicture from "./AppScreenshotPicture";
import { IMAGES } from "../constants/images";

const SCREENS = [
  {
    badge: "Explore Map · Verified NYC Spots",
    title: "BUKA & verified NYC spots",
    caption:
      "Filter by Food, Shop, Resources & Services across NYC with golden photo pins, ratings, and one-tap directions.",
    image: IMAGES.showcase.explore,
    imageShot: IMAGES.showcase.exploreShot,
    alt: "BawoSocial Explore Map with BUKA place card and Directions 5.5 mi",
  },
  {
    badge: "Community Spaces · Discover",
    title: "NYC Community Lounge",
    caption:
      "Find your people in Discover with spaces like NYC Community Lounge — gist, laughs, and absolutely no pressure.",
    image: IMAGES.showcase.community,
    imageShot: IMAGES.showcase.communityShot,
    alt: "BawoSocial Community screen showing NYC Community Lounge with Join",
  },
  {
    badge: "Community Circles · Careers",
    title: "NYC Jobs & Career Network",
    caption:
      "Join career and culture circles for Nigerians in NYC — jobs, hiring, and growth with your people.",
    image: IMAGES.showcase.circleFeed,
    imageShot: IMAGES.showcase.jobsShot,
    alt: "BawoSocial Community Circles screen featuring NYC Jobs & Career Network",
  },
] as const;

export default function ExplorePhonesSection() {
  return (
    <section
      id="inside-bawosocial"
      className="relative bawo-scroll-anchor bawo-scene bawo-scene--phones bg-transparent section-contain"
      aria-labelledby="explore-phones-heading"
    >
      <div className="relative z-10 container mx-auto px-5 sm:px-6 max-w-6xl h-full flex flex-col justify-center pt-14 md:pt-16 pb-10 md:pb-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-7 md:mb-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B26A]/35 bg-[#1C132B]/75 px-3.5 py-1 text-sm font-bold tracking-wide text-[#D6B26A]">
            <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <span>Inside BawoSocial</span>
          </div>
          <h2
            id="explore-phones-heading"
            className="text-2xl sm:text-3xl md:text-[2.35rem] font-bold font-display text-[#F7F3FA] leading-tight"
          >
            Explore Spots, Join Spaces & Drop Your Take Live
          </h2>
          <p className="text-sm sm:text-base text-[#F7F3FA]/75 leading-relaxed">
            From verified Nigerian kitchens like Brooklyn Suya Spot to Trending NYC Spaces and live
            Daily Vibe rooms inside Brotherhood NYC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-14 items-start">
          {SCREENS.map((screen, index) => (
            <figure
              key={screen.title}
              className="animate-on-scroll flex flex-col h-full"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="relative mx-auto w-full max-w-[14.25rem] sm:max-w-[15rem]">
                <AppScreenShot label={screen.alt}>
                  {screen.imageShot ? (
                    <AppScreenshotPicture
                      jpg={screen.imageShot.jpg}
                      webp={screen.imageShot.webp}
                      avif={screen.imageShot.avif}
                      jpgSrcSet={screen.imageShot.jpgSrcSet}
                      webpSrcSet={screen.imageShot.webpSrcSet}
                      avifSrcSet={screen.imageShot.avifSrcSet}
                      sizes={screen.imageShot.sizes}
                      alt={screen.alt}
                      width={screen.imageShot.width}
                      height={screen.imageShot.height}
                      className="bawo-app-screen__img"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={screen.image}
                      alt={screen.alt}
                      className="bawo-app-screen__img"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </AppScreenShot>
              </div>
              <figcaption className="pt-5 space-y-2 text-center sm:text-left">
                <span className="inline-block rounded-full border border-[#D6B26A]/30 bg-[#D6B26A]/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#F7E7C4] whitespace-nowrap">
                  {screen.badge}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display text-[#F7F3FA] leading-snug">
                  {screen.title}
                </h3>
                <p className="text-sm text-[#F7F3FA]/75 leading-relaxed">
                  {screen.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
