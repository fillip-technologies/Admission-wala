import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { announcementApi } from "../features/announcement/announcement.api";

const SEEN_KEY = "announcementsSeen";

const readSeen = () => {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY)) || [];
  } catch {
    return [];
  }
};

const fmt = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function NotificationDrawer() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(readSeen);

  useEffect(() => {
    let alive = true;
    announcementApi
      .listPublic()
      .then((res) => {
        if (alive) setItems(res?.data?.data ?? []);
      })
      .catch(() => {
        /* silent — bell just shows nothing */
      });
    return () => {
      alive = false;
    };
  }, []);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const unseen = items.filter((i) => !seen.includes(i._id)).length;

  const openDrawer = () => {
    setOpen(true);
    const ids = items.map((i) => i._id);
    setSeen(ids);
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
    } catch {
      /* ignore storage errors */
    }
  };

  return (
    <>
      <button
        onClick={openDrawer}
        aria-label="Notifications"
        className="relative grid h-9 w-9 place-items-center rounded-lg text-ink transition hover:bg-white"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unseen > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-saffron px-1 text-[10px] font-bold text-ink">
            {unseen > 9 ? "9+" : unseen}
          </span>
        )}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-line bg-canvas shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-bold text-ink">Notifications</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-white hover:text-ink"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="mt-10 text-center text-sm text-muted">No notifications right now.</p>
              ) : (
                <ul className="space-y-2.5">
                  {items.map((a) => {
                    const Inner = (
                      <>
                        <div className="flex items-center gap-2">
                          {a.tag && (
                            <span className="flex-none rounded-full bg-saffron px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                              {a.tag}
                            </span>
                          )}
                          <span className="text-[11px] text-muted">{fmt(a.createdAt)}</span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink">{a.text}</p>
                      </>
                    );
                    return (
                      <li
                        key={a._id}
                        className="rounded-xl border border-line bg-white p-3.5"
                      >
                        {a.href ? (
                          <a
                            href={a.href}
                            onClick={() => setOpen(false)}
                            className="block transition hover:opacity-80"
                          >
                            {Inner}
                          </a>
                        ) : (
                          Inner
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>
        </div>,
        document.body,
      )}
    </>
  );
}
