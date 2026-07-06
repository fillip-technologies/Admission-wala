const levelStyles = {
  Foundation: "bg-teal-deep/10 text-teal-deep",
  "Senior Secondary": "bg-indigo-deep/10 text-indigo-deep",
  Flexible: "bg-saffron/15 text-saffron-600",
  Certificate: "bg-ink/10 text-ink",
};

// Hover colour cycled across course cards. Full literal strings for Tailwind JIT.
const hoverStyles = [
  "hover:border-saffron hover:bg-saffron/5 hover:shadow-saffron/10",
  "hover:border-teal-deep hover:bg-teal-deep/5 hover:shadow-teal-deep/10",
  "hover:border-indigo-deep hover:bg-indigo-deep/5 hover:shadow-indigo-deep/10",
];

export default function CourseCard({ course, onApply, index = 0 }) {
  return (
    <article className={`group flex flex-col rounded-2xl border border-line bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${hoverStyles[index % hoverStyles.length]}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${levelStyles[course.level] || "bg-ink/10 text-ink"}`}>
          {course.level}
        </span>
        <span className="text-xs font-medium text-muted">{course.duration}</span>
      </div>

      <h3 className="font-display text-lg font-bold leading-snug text-ink">{course.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{course.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {course.boards.map((b) => (
          <span key={b} className="rounded-md border border-line px-2 py-0.5 text-[11px] font-semibold tracking-wide text-ink/70">
            {b}
          </span>
        ))}
      </div>

      <button
        onClick={() => onApply(course)}
        className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink/5 px-4 py-2.5 text-sm font-semibold text-ink transition group-hover:bg-saffron group-hover:text-ink"
      >
        Apply for admission
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </article>
  );
}
