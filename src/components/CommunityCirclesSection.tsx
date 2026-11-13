import { Building2, Compass, MessageCircle, Mic, Sparkles, Users } from "lucide-react";
import AppScreenShot from "./AppScreenShot";
import AppScreenshotPicture from "./AppScreenshotPicture";
import { CONTENT } from "../constants/content";
import { IMAGES } from "../constants/images";

export default function CommunityCirclesSection() {
  const { eyebrow, title, subtitle, items } = CONTENT.communityCircles;

  return (
    <section
      id="community-circles"
      className="relative bawo-scroll-anchor py-16 md:py-24 bg-transparent section-contain"
      aria-labelledby="community-circles-heading"
    >
      <div className="relative z-10 container mx-auto px-5 sm:px-6 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B26A]/35 bg-[#1C132B]/75 px-4 py-1.5 text-sm font-bold tracking-wide text-[#D6B26A] backdrop-blur-xl">
            <Users className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <span>{eyebrow}</span>
          </div>
          <h2
            id="community-circles-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#F7F3FA] font-display leading-tight tracking-tight"
          >
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#F7F3FA]/80 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 4 Community Circles Grid with Voice Note Waveforms & Daily Gist Prompts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
          {items.map((circle) => (
            <article
              key={circle.id}
              className="glass-card group overflow-hidden rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0E0A14]">
                <img
                  src={circle.image}
                  alt={`${circle.title}, BawoSocial Nigerian Community Circle`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A14] via-[#0E0A14]/25 to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#0E0A14]/80 backdrop-blur-md border border-[#D6B26A]/35 px-3 py-1 text-sm font-bold text-[#D6B26A]">
                  <Sparkles className="w-3 h-3 shrink-0" aria-hidden />
                  {circle.badge}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-2xl font-bold font-display text-[#F7F3FA] leading-snug">
                    {circle.title}
                  </h3>
                  <p className="text-sm font-bold uppercase tracking-wider text-[#F7E7C4] flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 shrink-0 text-[#D6B26A]" aria-hidden />
                    {circle.members}
                  </p>
                  <p className="text-sm text-[#F7F3FA]/80 leading-relaxed">
                    {circle.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {/* Live Voice Note Preview Pill */}
                  <div className="rounded-xl border border-[#D6B26A]/25 bg-[#0E0A14]/65 px-3 py-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D6B26A] text-[#0E0A14]">
                      <Mic className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-0.5 mb-1" aria-hidden>
                        {[45, 85, 60, 100, 70, 40, 90, 65, 50, 80, 55, 75].map((h, i) => (
                          <span
                            key={i}
                            className="inline-block w-1 rounded-full bg-[#D6B26A]/80"
                            style={{ height: `${Math.max(4, Math.round(h * 0.11))}px` }}
                          />
                        ))}
                      </div>
                      <p className="truncate text-sm font-semibold text-[#F7E7C4]">
                        {circle.voiceNoteLabel}
                      </p>
                    </div>
                  </div>

                  {/* Daily Gist Prompt */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <p className="text-sm font-medium text-[#F7F3FA]/75 leading-snug">
                      {circle.prompt}
                    </p>
                  </div>

                  <div className="pt-1">
                    <a
                      href={CONTENT.hero.testflightLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D6B26A] hover:text-[#F7E7C4] transition-colors"
                    >
                      <span>Join circle in BawoSocial app →</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Live Build 182 iOS App Screens Showcase (Explore Map, Community Spaces & Circle Daily Vibe) */}
        <div className="mb-12 md:mb-16">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B26A]/35 bg-[#1C132B]/75 px-3.5 py-1 text-sm font-bold tracking-wide text-[#D6B26A]">
              <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden />
              <span>Live on iOS TestFlight · Inside BawoSocial</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-[#F7F3FA]">
              Explore Spots, Join Spaces & Drop Your Take Live
            </h3>
            <p className="text-sm sm:text-base text-[#F7F3FA]/75">
              From verified Nigerian kitchens like Brooklyn Suya Spot to Trending NYC Spaces and live Daily Vibe rooms inside Men&apos;s Accountability Circle NYC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                badge: "Explore Map · Verified NYC Spots",
                title: "BUKA & verified NYC spots",
                caption:
                  "Filter by Food, Shop, Resources & Services across NYC with golden photo pins, ratings, and one-tap directions.",
                image: IMAGES.showcase.explore,
                imageShot: IMAGES.showcase.exploreShot,
                alt: "BawoSocial Explore Map with BUKA place card and Directions 2.6 mi",
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
            ].map((screen) => (
              <figure
                key={screen.title}
                className="glass-card rounded-3xl p-4 sm:p-5 flex flex-col justify-between border border-[#D6B26A]/25 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative mx-auto w-full max-w-[17.5rem]">
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
                <figcaption className="pt-4 space-y-1.5 text-center sm:text-left">
                  <span className="inline-block rounded-full border border-[#D6B26A]/30 bg-[#D6B26A]/10 px-2.5 py-0.5 text-sm font-bold uppercase tracking-wider text-[#F7E7C4]">
                    {screen.badge}
                  </span>
                  <h4 className="text-xl font-bold font-display text-[#F7F3FA]">
                    {screen.title}
                  </h4>
                  <p className="text-sm text-[#F7F3FA]/75 leading-relaxed">
                    {screen.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Nigerian Diaspora × NYC Brand Showcase Card with New Splash Artwork */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B26A]/40 bg-[#D6B26A]/12 px-3.5 py-1.5 text-sm font-bold uppercase tracking-wider text-[#F7E7C4]">
                <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden />
                <span>Nigerians in the Diaspora · Starting in NYC</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <img
                  src={IMAGES.assets.mark}
                  alt="BawoSocial gold glass kola nut"
                  className="w-14 h-14 object-contain shrink-0"
                  width={256}
                  height={256}
                  decoding="async"
                />
                <h3 className="text-3xl sm:text-4xl md:text-[2.65rem] font-bold font-display text-[#F7F3FA] leading-tight">
                  From Lagos to All Five Boroughs of NYC
                </h3>
              </div>

              <p className="text-[#F7F3FA]/85 text-base sm:text-lg leading-relaxed">
                Whether you just landed in New York or grew up between Naija and the five boroughs,{" "}
                <strong className="text-[#F7E7C4]">BawoSocial</strong> connects our heritage with the
                verified Nigerian restaurants, bukas, suya spots, grocery markets, events, and circles
                right outside your door.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
                {[
                  "Brooklyn",
                  "Harlem & Manhattan",
                  "Queens",
                  "The Bronx",
                  "Staten Island",
                  "New York × Lagos",
                  "Faith & Reflection NYC",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="glass-pill px-3.5 py-1.5 text-sm font-semibold text-[#F7E7C4]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="/businesses"
                  className="bawo-cta-premium inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full min-h-12 px-7 text-sm font-bold no-underline transition-transform hover:-translate-y-0.5"
                >
                  <Building2 className="w-4 h-4 shrink-0 text-[#0E0A14]" aria-hidden />
                  <span>Businesses: Log In / Claim Listing</span>
                </a>
                <a
                  href={CONTENT.hero.testflightLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bawo-cta-outline inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full min-h-12 px-7 text-sm font-bold text-[#F7F3FA] no-underline transition-transform hover:-translate-y-0.5"
                >
                  <span>Download BawoSocial on iOS</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[19rem] rounded-3xl overflow-hidden border border-[#D6B26A]/35 shadow-[0_28px_68px_rgba(5,2,10,0.75)]">
                <img
                  src={IMAGES.newSplashScreen}
                  alt="BawoSocial Nigerian Diaspora and New York City artwork"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
