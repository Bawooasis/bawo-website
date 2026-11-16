import { Building2, Compass, MessageCircle, Mic, Sparkles, Users } from "lucide-react";
import { CONTENT } from "../constants/content";
import { IMAGES } from "../constants/images";

export default function CommunityCirclesSection() {
  const { eyebrow, title, subtitle, items } = CONTENT.communityCircles;

  return (
    <section
      id="community-circles"
      className="relative bawo-scroll-anchor bawo-scene bawo-scene--circles py-10 md:py-14 bg-transparent section-contain"
      aria-labelledby="community-circles-heading"
    >
      <div className="relative z-10 container mx-auto px-5 sm:px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B26A]/35 bg-[#1C132B]/75 px-4 py-1.5 text-sm font-bold tracking-wide text-[#D6B26A] backdrop-blur-xl">
            <Users className="w-3.5 h-3.5 shrink-0" aria-hidden />
            <span>{eyebrow}</span>
          </div>
          <h2
            id="community-circles-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#F7F3FA] font-display leading-[1.1] tracking-tight"
          >
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#F7F3FA]/80 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Wider circle cards: rail on desktop, stacked/2-up on smaller screens */}
        <div className="bawo-circles-rail mb-12 md:mb-16" role="list">
          {items.map((circle) => (
            <article
              key={circle.id}
              role="listitem"
              className="bawo-circle-card glass-card group overflow-hidden rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="relative bawo-circle-card__media w-full overflow-hidden bg-[#0E0A14]">
                <img
                  src={circle.image}
                  alt={`${circle.title}, BawoSocial Nigerian Community Circle`}
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${circle.imagePosition}`}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A14] via-[#0E0A14]/25 to-transparent" />
                <span className="bawo-circle-card__badge absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#0E0A14]/85 backdrop-blur-md border border-[#D6B26A]/35 px-3 py-1.5 text-xs sm:text-sm font-bold text-[#D6B26A] whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden />
                  <span>{circle.badge}</span>
                </span>
              </div>

              <div className="bawo-circle-card__body p-6 sm:p-7 flex-1 flex flex-col">
                <div className="bawo-circle-card__copy space-y-3">
                  <h3 className="bawo-circle-card__title text-[1.4rem] sm:text-[1.55rem] font-bold font-display text-[#F7F3FA] leading-[1.2]">
                    {circle.title}
                  </h3>
                  <p className="bawo-circle-card__tag text-xs font-bold uppercase tracking-wider text-[#F7E7C4] flex items-center gap-1.5 h-5">
                    <MessageCircle className="w-3.5 h-3.5 shrink-0 text-[#D6B26A]" aria-hidden />
                    <span className="truncate">{circle.members}</span>
                  </p>
                  <p className="bawo-circle-card__desc text-sm text-[#F7F3FA]/80 leading-[1.55]">
                    {circle.description}
                  </p>
                </div>

                <div className="bawo-circle-card__footer mt-auto space-y-3 pt-5">
                  <div className="bawo-circle-card__voice rounded-xl border border-[#D6B26A]/25 bg-[#0E0A14]/65 px-3.5 py-2.5 flex items-start gap-2.5 min-h-[4.75rem]">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D6B26A] text-[#0E0A14]">
                      <Mic className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-0.5 mb-1.5" aria-hidden>
                        {[45, 85, 60, 100, 70, 40, 90, 65, 50, 80, 55, 75].map((h, i) => (
                          <span
                            key={i}
                            className="inline-block w-1 rounded-full bg-[#D6B26A]/80"
                            style={{ height: `${Math.max(4, Math.round(h * 0.11))}px` }}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-[#F7E7C4] leading-snug whitespace-nowrap">
                        {circle.voiceNoteDuration} Voice Note
                      </p>
                      <p className="text-xs text-[#F7F3FA]/70 leading-snug mt-0.5 line-clamp-2">
                        {circle.voiceNoteTopic}
                      </p>
                    </div>
                  </div>

                  <div className="bawo-circle-card__gist rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
                    <p className="text-sm font-medium text-[#F7F3FA]/75 leading-snug">
                      {circle.prompt}
                    </p>
                  </div>

                  <a
                    href={CONTENT.hero.joinHref}
                    className="inline-flex items-center gap-1.5 h-5 text-sm font-bold text-[#D6B26A] hover:text-[#F7E7C4] transition-colors"
                  >
                    <span>Join BawoSocial →</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
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
                  <span>Partner with us</span>
                </a>
                <a
                  href={CONTENT.hero.joinHref}
                  className="bawo-cta-outline inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full min-h-12 px-7 text-sm font-bold text-[#F7F3FA] no-underline transition-transform hover:-translate-y-0.5"
                >
                  <span>Join BawoSocial</span>
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
