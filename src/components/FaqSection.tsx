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
      className="relative bawo-scroll-anchor bawo-section--loose bg-transparent"
      aria-labelledby="faq-heading"
    >
      <div className="relative z-10 container mx-auto px-5 sm:px-6 md:px-10 max-w-3xl">
        <h2
          id="faq-heading"
          className="bawo-section-title text-3xl sm:text-4xl md:text-[2.5rem] mb-8 md:mb-10 text-left"
        >
          {title}
        </h2>

        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div
                key={item.question}
                className={`bawo-faq-panel${isOpen ? " is-open" : ""}`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="bawo-faq-panel__trigger group"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                  >
                    <span className="bawo-faq-panel__question">{item.question}</span>
                    <ChevronDown
                      className={`bawo-faq-panel__chevron${isOpen ? " is-open" : ""}`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`bawo-faq-panel__collapse${isOpen ? " is-open" : ""}`}
                >
                  <div className="bawo-faq-panel__collapse-inner">
                    <div className="bawo-faq-panel__divider" aria-hidden />
                    <p className="bawo-faq-panel__answer">{item.answer}</p>
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
