import { CONTENT } from "../constants/content";

export default function CommunityMissionSection() {
  const { title, subtitle, pillars } = CONTENT.communityMission;

  return (
    <section
      id="community-mission"
      className="relative z-10 bawo-scroll-anchor px-6"
      aria-labelledby="community-mission-heading"
    >
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <p className="text-xs font-museo-bold uppercase tracking-[0.18em] text-[#ff8a33]">
          Why we built this
        </p>
        <h2
          id="community-mission-heading"
          className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-white leading-tight"
        >
          {title}
        </h2>
        <p className="text-base sm:text-lg text-white/72 font-museo-medium leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <ul className="mx-auto mt-10 md:mt-12 grid max-w-5xl gap-10 md:gap-12 sm:grid-cols-3">
        {pillars.map(({ title: pillarTitle, description }) => (
          <li key={pillarTitle} className="feature-card space-y-2 text-center sm:text-left">
            <h3 className="font-display text-lg md:text-xl font-bold text-white">
              {pillarTitle}
            </h3>
            <p className="text-sm text-white/65 font-museo-medium leading-relaxed">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
