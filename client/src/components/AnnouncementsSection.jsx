import { useEffect, useState } from "react";
import { announcementApi } from "../features/announcement/announcement.api";

const fmt = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// Full-view notifications shown below the hero, two per row. Content is managed
// from the admin panel (only active announcements are returned).
const PAGE_SIZE = 6;

export default function AnnouncementsSection() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let alive = true;
    announcementApi
      .listPublic()
      .then((res) => {
        if (alive) setItems(res?.data?.data ?? []);
      })
      .catch(() => {
        /* silent — section just hides if this fails */
      });
    return () => {
      alive = false;
    };
  }, []);

  if (items.length === 0) return null;

  // Show 6 at a time; "Next" reveals the following 6 and wraps back to the
  // start once the end is reached.
  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const visible = items.slice(start, start + PAGE_SIZE);

  return (
    <section id="announcements" className="mx-auto max-w-6xl px-4 pt-0 pb-8 sm:px-6">
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 text-saffron-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z" />
          <path d="M14 8a4 4 0 0 1 0 8M18 5a8 8 0 0 1 0 14" />
        </svg>
        <h2 className="font-display text-base font-bold text-ink">Latest announcements</h2>
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {visible.map((a) => {
          const Inner = (
            <div className="flex items-start gap-2">
              {a.tag && (
                <span className="mt-0.5 flex-none rounded-full bg-saffron px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink">
                  {a.tag}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-[13px] leading-snug text-ink">{a.text}</p>
                <span className="mt-0.5 block text-[10px] text-muted">{fmt(a.createdAt)}</span>
              </div>
            </div>
          );
          return (
            <div
              key={a._id}
              className="rounded-xl border border-line bg-white p-3 transition hover:border-ink/20 hover:shadow-md hover:shadow-ink/5"
            >
              {a.href ? (
                <a href={a.href} className="block transition hover:opacity-80">
                  {Inner}
                </a>
              ) : (
                Inner
              )}
            </div>
          );
        })}
      </div>

      {items.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => (p - 1 + pageCount) % pageCount)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:border-ink/30"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Prev
          </button>
          <span className="text-[11px] text-muted">
            {page + 1} / {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => (p + 1) % pageCount)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:border-ink/30"
          >
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
