import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { programApi } from "../features/program/program.api";

// A single course/admission pill. If it has a link, it's clickable — a section
// anchor ("/#courses") uses a plain <a>, a route ("/signup") uses the router.
// Show the program without a trailing "Admission" — the strip reads cleaner as
// "JEE", "NEET", "MBA" etc. The stored name (admin panel) is left untouched.
const displayName = (name = "") => name.replace(/\s*admission\s*$/i, "").trim() || name;

function Pill({ program }) {
  const base =
    "inline-flex flex-none items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm";
  const dot = <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-saffron" />;
  const href = program.href;
  const name = displayName(program.name);

  if (!href) {
    return (
      <span className={base}>
        {dot}
        {name}
      </span>
    );
  }
  const cls = `${base} transition hover:border-saffron hover:bg-saffron/10`;
  return href.startsWith("/#") ? (
    <a href={href} className={cls}>{dot}{name}</a>
  ) : (
    <Link to={href} className={cls}>{dot}{name}</Link>
  );
}

// A single-line strip of course tags that scrolls continuously left → right.
// The list is duplicated so the loop is seamless; hovering pauses it. Content
// is fully driven by the backend (admin adds/removes programs), so the strip
// simply hides itself when there's nothing active.
export default function HeroCoursesMarquee() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    let alive = true;
    programApi
      .listPublic()
      .then((res) => {
        if (alive) setPrograms(res?.data?.data ?? []);
      })
      .catch(() => {
        /* silent — strip just hides if this fails */
      });
    return () => {
      alive = false;
    };
  }, []);

  if (programs.length === 0) return null;
  const loop = [...programs, ...programs];

  return (
    <div>
      <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6">
        Your Trusted admission partner
      </p>
      <div className="group relative overflow-hidden py-1">
        {/* soft edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-canvas to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-canvas to-transparent sm:w-16" />

        <div className="flex w-max gap-3 animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((p, i) => (
            <Pill key={`${p._id}-${i}`} program={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
