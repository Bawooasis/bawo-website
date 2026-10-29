import { CONTENT } from "../constants/content";

export default function CommunityMissionSection() {
  const { title, subtitle, pillars } = CONTENT.communityMission;

  return (
    <section
      id="community-mission"
      className="relative z-10 bawo-scroll-anchor bawo-section--tight px-5 sm:px-6"
      aria-labelledby="community-mission-heading"
    >
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <p className="bawo-section-eyebrow mx-auto">Why we built this</p>
        <h2
          id="community-mission-heading"
          className="bawo-section-title text-3xl sm:text-4xl md:text-[2.75rem]"
        >
          {title}
        </h2>
        <p className="bawo-section-lead mx-auto">
          {subtitle}
        </p>
      </div>

      <ul className="mx-auto mt-10 md:mt-12 grid max-w-5xl gap-5 md:gap-6 sm:grid-cols-3">
        {pillars.map(({ title: pillarTitle, description }) => (
          <li key={pillarTitle} className="glass-card space-y-2.5 p-6 text-center sm:text-left">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#F7F3FA]">
              {pillarTitle}
            </h3>
            <p className="bawo-body-copy text-sm">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
