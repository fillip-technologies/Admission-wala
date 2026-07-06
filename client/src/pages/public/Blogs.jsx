import { blogs } from "../../data/blogs";
import BlogCard from "../../components/BlogCard";

export default function Blogs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-saffron-600">Blog</span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Guides, tips and updates
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Practical advice on open-board admissions, exams and choosing the right path — from the
          Shree Admission Gurukul team.
        </p>
      </div>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
