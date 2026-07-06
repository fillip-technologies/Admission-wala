import { Link } from "react-router-dom";

const formatDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function BlogCard({ post }) {
  const { slug, title, excerpt, author, date, readMins, tags = [] } = post;
  return (
    <Link
      to={`/blogs/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lg hover:shadow-ink/5"
    >
      {/* Cover placeholder — a branded gradient with the first tag. */}
      <div className="relative flex h-36 items-end bg-gradient-to-br from-ink to-ink-soft p-4">
        {tags[0] && (
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {tags[0]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-ink transition group-hover:text-saffron-600">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{excerpt}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <span className="font-semibold text-ink/70">{author}</span>
          <span>·</span>
          <span>{formatDate(date)}</span>
          {readMins && (
            <>
              <span>·</span>
              <span>{readMins} min read</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
