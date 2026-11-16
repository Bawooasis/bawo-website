import { CONTENT } from "../constants/content";

export default function CommunityMissionSection() {
  const { title, subtitle, pillars } = CONTENT.communityMission;

  return (
    <section
      id="community-mission"
      className="relative z-10 bawo-scroll-anchor bawo-scene bawo-scene--mission px-5 sm:px-6"
      aria-labelledby="community-mission-heading"
    >
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-3 md:gap-4 py-6 md:py-7">
        {/* Live NYC Borough Pulse — same viewport scene as Why we built */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-left">
          {CONTENT.boroughPulse.map((b) => (
            <div
              key={b.name}
              className="glass-card rounded-xl p-3.5 flex flex-col justify-between gap-2 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#D6B26A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" aria-hidden />
                  {b.spotsCount}
                </span>
                <h3 className="text-base font-bold font-display text-[#F7F3FA] leading-snug">
                  {b.name}
                </h3>
                <p className="text-[0.7rem] font-semibold text-[#F7E7C4]/90 leading-snug line-clamp-2">
                  {b.tag}
                </p>
              </div>
              <p className="text-[0.7rem] sm:text-xs text-[#F7F3FA]/75 leading-snug line-clamp-3">
                {b.highlight}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-3xl text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] bawo-eyebrow text-[#D6B26A]">
            Why we built this
          </p>
          <h2
            id="community-mission-heading"
            className="font-display text-2xl sm:text-3xl md:text-[2.1rem] font-bold text-white leading-tight"
          >
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-white/72 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <ul className="mx-auto grid max-w-5xl gap-3 sm:gap-4 sm:grid-cols-3">
          {pillars.map(({ title: pillarTitle, description }) => (
            <li key={pillarTitle} className="glass-card space-y-1.5 p-4 text-center sm:text-left">
              <h3 className="font-display text-sm md:text-base font-bold text-white leading-snug">
                {pillarTitle}
              </h3>
              <p className="text-xs text-white/65 leading-relaxed line-clamp-4">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
