import { Building2, Compass, MessageCircle, Mic, Sparkles, Users } from "lucide-react";
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
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8B959]/35 bg-[#1C132B]/75 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E8B959] backdrop-blur-xl">
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
                  alt={`${circle.title} — BawoSocial Nigerian Community Circle`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0A14] via-[#0E0A14]/25 to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#0E0A14]/80 backdrop-blur-md border border-[#E8B959]/35 px-3 py-1 text-[11px] font-bold text-[#E8B959]">
                  <Sparkles className="w-3 h-3 shrink-0" aria-hidden />
                  {circle.badge}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="text-2xl font-bold font-display text-[#F7F3FA] leading-snug">
                    {circle.title}
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#FFCF6B] flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 shrink-0 text-[#E8B959]" aria-hidden />
                    {circle.members}
                  </p>
                  <p className="text-sm text-[#F7F3FA]/80 leading-relaxed">
                    {circle.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {/* Live Voice Note Preview Pill */}
                  <div className="rounded-xl border border-[#E8B959]/25 bg-[#0E0A14]/65 px-3 py-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8B959] text-[#0E0A14]">
                      <Mic className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-0.5 mb-1" aria-hidden>
                        {[45, 85, 60, 100, 70, 40, 90, 65, 50, 80, 55, 75].map((h, i) => (
                          <span
                            key={i}
                            className="inline-block w-1 rounded-full bg-[#E8B959]/80"
                            style={{ height: `${Math.max(4, Math.round(h * 0.11))}px` }}
                          />
                        ))}
                      </div>
                      <p className="truncate text-[11px] font-semibold text-[#FFE8B3]">
                        {circle.voiceNoteLabel}
                      </p>
                    </div>
                  </div>

                  {/* Daily Gist Prompt */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <p className="text-[11px] font-medium text-[#F7F3FA]/75 leading-snug">
                      {circle.prompt}
                    </p>
                  </div>

                  <div className="pt-1">
                    <a
                      href={CONTENT.hero.testflightLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8B959] hover:text-[#FFCF6B] transition-colors"
                    >
                      <span>Join circle in BawoSocial app →</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Nigerian Diaspora × NYC Brand Showcase Card with New Splash Artwork */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E8B959]/40 bg-[#E8B959]/12 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFCF6B]">
                <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden />
                <span>Nigerians in the Diaspora · Starting in NYC</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <img
                  src={IMAGES.assets.mark}
                  alt="BawoSocial cowrie-flame icon"
                  className="w-14 h-14 rounded-2xl border border-[#E8B959]/40 shadow-lg object-cover shrink-0"
                />
                <h3 className="text-3xl sm:text-4xl md:text-[2.65rem] font-bold font-display text-[#F7F3FA] leading-tight">
                  From Lagos, Abuja & Enugu to All Five Boroughs of NYC
                </h3>
              </div>

              <p className="text-[#F7F3FA]/85 text-base sm:text-lg leading-relaxed">
                Whether you just landed in New York or grew up between Naija and the five boroughs,{" "}
                <strong className="text-[#FFE8B3]">BawoSocial</strong> connects our heritage with the
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
                    className="glass-pill px-3.5 py-1.5 text-xs font-semibold text-[#FFE8B3]"
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
              <div className="relative w-full max-w-[19rem] rounded-3xl overflow-hidden border border-[#E8B959]/35 shadow-[0_28px_68px_rgba(5,2,10,0.75)]">
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
