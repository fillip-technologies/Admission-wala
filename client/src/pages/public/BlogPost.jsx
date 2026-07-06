import { Link, useParams } from "react-router-dom";
import { getBlogBySlug } from "../../data/blogs";
import { PATHS } from "../../routes/paths";

const formatDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogBySlug(slug);

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink">Post not found</h1>
        <p className="mt-2 text-sm text-muted">
          The article you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to={PATHS.BLOGS}
          className="mt-6 inline-block rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-soft"
        >
          Back to blog
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link to={PATHS.BLOGS} className="text-sm font-semibold text-saffron-600 hover:underline">
        ← Back to blog
      </Link>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {(post.tags || []).map((t) => (
          <span key={t} className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-semibold text-ink">
            {t}
          </span>
        ))}
      </div>

      <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
        <span className="font-semibold text-ink/70">{post.author}</span>
        <span>·</span>
        <span>{formatDate(post.date)}</span>
        {post.readMins && (
          <>
            <span>·</span>
            <span>{post.readMins} min read</span>
          </>
        )}
      </div>

      <div className="mt-8 space-y-5">
        {post.content.map((para, i) => (
          <p key={i} className="text-base leading-relaxed text-ink/90">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}
