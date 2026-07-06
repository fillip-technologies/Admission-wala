import { useState } from "react";

export default function FaqAccordion({ faqs = [] }) {
  // Index of the currently open item; null = all collapsed. Opening one closes
  // the rest (classic accordion behaviour).
  const [open, setOpen] = useState(null);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-ink">{item.q}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 -mt-1 text-sm leading-relaxed text-muted">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
