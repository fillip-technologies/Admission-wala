import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { promoApi } from "../features/promo/promo.api";

// A route ("/signup") uses the router; a section anchor ("/#courses") uses a
// plain <a> so the hash scroll works.
function Cta({ href, label }) {
  if (!href || !label) return null;
  const cls =
    "inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white/90";
  const arrow = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
  return href.startsWith("/#") ? (
    <a href={href} className={cls}>{label}{arrow}</a>
  ) : (
    <Link to={href} className={cls}>{label}{arrow}</Link>
  );
}

function Slide({ slide }) {
  return (
    <div className="w-full flex-none">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ink to-ink-soft px-6 py-10 sm:px-12 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-saffron/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{slide.title}</h2>
          {slide.text && (
            <p className="mt-3 text-sm leading-relaxed text-indigo-100/80 sm:text-base">{slide.text}</p>
          )}
          <div className="mt-6">
            <Cta href={slide.ctaHref} label={slide.ctaLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PromoCarousel() {
  const [promoSlides, setPromoSlides] = useState([]);
  const [i, setI] = useState(0);
  // Disables the slide transition for the instant, invisible jump back to the
  // start after the cloned first slide, so the loop is seamless.
  const [animate, setAnimate] = useState(true);
  const count = promoSlides.length;

  useEffect(() => {
    let alive = true;
    promoApi
      .listPublic()
      .then((res) => {
        if (alive) setPromoSlides(res?.data?.data ?? []);
      })
      .catch(() => {
        /* silent — carousel just hides if this fails */
      });
    return () => {
      alive = false;
    };
  }, []);

  // Auto-advance forever. `i` runs 0..count; `count` lands on the cloned first
  // slide. Pauses on hover.
  const paused = useRef(false);
  useEffect(() => {
    if (count < 2) return;
    setI(0);
    setAnimate(true);
    const id = setInterval(() => {
      if (!paused.current) setI((n) => n + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [count]);

  // Seamless wrap: once we've slid onto the cloned first slide (i === count),
  // wait for the slide to finish, then jump back to the real first slide with
  // the transition disabled so there's no visible rewind or blank frame. A
  // timer (not onTransitionEnd) avoids child transitions bubbling up here.
  const SLIDE_MS = 700;
  useEffect(() => {
    if (i !== count || count < 2) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setI(0);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, count]);

  // Re-enable the transition a frame after the snap-back (double rAF so the
  // browser paints the jumped position before animation is turned back on).
  useEffect(() => {
    if (animate) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true)),
    );
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  if (count === 0) return null;

  // With >1 slide, clone the first at the end so sliding past the last wraps
  // smoothly. A single slide just renders static.
  const loop = count > 1 ? [...promoSlides, promoSlides[0]] : promoSlides;
  const active = i % count; // which real slide the dots highlight

  return (
    <section
      className="mx-auto max-w-6xl px-4 pb-4 sm:px-6"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex"
          style={{
            transform: `translateX(-${i * 100}%)`,
            transition: animate ? `transform ${SLIDE_MS}ms ease-in-out` : "none",
          }}
        >
          {loop.map((s, idx) => (
            <Slide key={idx} slide={s} />
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {promoSlides.map((s, idx) => (
            <button
              key={s._id}
              onClick={() => {
                setAnimate(true);
                setI(idx);
              }}
              aria-label={`Show slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === active ? "w-6 bg-saffron" : "w-2 bg-ink/20 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
