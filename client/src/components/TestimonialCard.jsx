const initials = (name) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "U";

function Stars({ rating = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="15"
          height="15"
          viewBox="0 0 24 24"
          className={i < rating ? "text-saffron" : "text-line"}
          fill="currentColor"
        >
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCard({ testimonial }) {
  const { name, context, quote, rating } = testimonial;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5">
      <Stars rating={rating} />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/90">“{quote}”</p>
      <div className="mt-5 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-saffron/20 text-sm font-bold text-ink">
          {initials(name)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{name}</p>
          <p className="truncate text-xs text-muted">{context}</p>
        </div>
      </div>
    </article>
  );
}
