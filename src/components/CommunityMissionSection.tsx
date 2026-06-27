import { Heart, Sparkles, Users } from "lucide-react";
import { CONTENT } from "../constants/content";

const pillarIcons = [Heart, Users, Sparkles] as const;

export default function CommunityMissionSection() {
  const { title, subtitle, pillars } = CONTENT.communityMission;

  return (
    <section
      className="relative z-10 px-6"
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
        <p className="text-base sm:text-lg text-white/78 font-museo-medium leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
        {pillars.map(({ title: pillarTitle, description }, index) => {
          const Icon = pillarIcons[index] ?? Heart;
          return (
            <li
              key={pillarTitle}
              className="glass-card rounded-2xl border border-white/[0.1] p-5 text-center sm:text-left"
            >
              <div className="mx-auto sm:mx-0 mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ff6b00]/15 text-[#ff8a33]">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </div>
              <h3 className="font-museo-bold text-white text-base mb-1.5">
                {pillarTitle}
              </h3>
              <p className="text-sm text-white/65 font-museo-medium leading-relaxed">
                {description}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
