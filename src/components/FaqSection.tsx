import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { CONTENT } from "../constants/content";

export default function FaqSection() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { title, items } = CONTENT.faq;

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="relative bawo-scroll-anchor py-16 md:py-24 bg-transparent"
      aria-labelledby="faq-heading"
    >
      <div className="relative z-10 container mx-auto px-6 md:px-10 max-w-3xl">
        <h2
          id="faq-heading"
          className="text-3xl md:text-[2.125rem] font-bold text-white font-display tracking-tight mb-8 md:mb-10 text-left"
        >
          {title}
        </h2>

        <div className="border-t border-white/[0.12]">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div
                key={item.question}
                className="border-b border-white/[0.12]"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-5 md:py-6 text-left group"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                  >
                    <span className="font-museo-medium text-base md:text-[1.0625rem] text-white/92 group-hover:text-white transition-colors pr-2">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-white/40 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 md:pb-6 pr-10 text-sm md:text-[0.9375rem] text-white/65 font-museo-medium leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
