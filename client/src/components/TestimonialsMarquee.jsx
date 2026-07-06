import TestimonialCard from "./TestimonialCard";

// A single-line, continuously scrolling row of testimonials (left → right).
// The list is duplicated so the loop is seamless; hovering pauses it.
export default function TestimonialsMarquee({ testimonials = [] }) {
  if (testimonials.length === 0) return null;
  const loop = [...testimonials, ...testimonials];

  return (
    <div className="group relative overflow-hidden py-1">
      {/* soft edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-canvas to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-canvas to-transparent sm:w-20" />

      <div className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused]">
        {loop.map((t, i) => (
          <div key={i} className="w-[19rem] flex-none sm:w-[22rem]" aria-hidden={i >= testimonials.length}>
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>
    </div>
  );
}
