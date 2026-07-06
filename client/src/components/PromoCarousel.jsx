import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { promoApi } from "../features/promo/promo.api";

// A route ("/signup") uses the router; a section anchor ("/#courses") uses a
// plain <a> so the hash scroll works.
function Cta({ href, label }) {
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

export default function PromoCarousel() {
  const [promoSlides, setPromoSlides] = useState([]);
  const [i, setI] = useState(0);
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

  useEffect(() => {
    if (count < 2) return;
    setI(0);
    const id = setInterval(() => setI((n) => (n + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;
  const slide = promoSlides[i] ?? promoSlides[0];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ink to-ink-soft px-6 py-10 sm:px-12 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-saffron/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{slide.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-indigo-100/80 sm:text-base">{slide.text}</p>
          <div className="mt-6">
            <Cta href={slide.ctaHref} label={slide.ctaLabel} />
          </div>
        </div>

        {count > 1 && (
          <div className="relative mt-8 flex gap-1.5">
            {promoSlides.map((s, idx) => (
              <button
                key={s._id}
                onClick={() => setI(idx)}
                aria-label={`Show slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-6 bg-saffron" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
