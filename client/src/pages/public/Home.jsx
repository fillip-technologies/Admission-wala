import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/auth.slice";
import { roleHome, ROLES } from "../../config/roles";
import { PATHS } from "../../routes/paths";
import CourseCard from "../../components/CourseCard";
import CounsellingPopup from "../../components/CounsellingPopup";
import AnnouncementsSection from "../../components/AnnouncementsSection";
import { useAuthModal } from "../../components/auth/AuthModalProvider";
import { boards, courses, trustStats, expertise } from "../../data/courses";
import { testimonials } from "../../data/testimonials";
import { faqs } from "../../data/faqs";
import { heroBadges, learningSteps } from "../../data/home";
import TestimonialsMarquee from "../../components/TestimonialsMarquee";
import FaqAccordion from "../../components/FaqAccordion";
import PromoCarousel from "../../components/PromoCarousel";
import HeroCoursesMarquee from "../../components/HeroCoursesMarquee";
import AiImage from "../../components/AiImage";
import heroStudent from "../../assets/hero-student.png";

// Gradient per board card (NIOS / BBOSE / BOSSE). Literal strings for Tailwind JIT.
const boardGradients = [
  "from-saffron-600 to-ink",
  "from-indigo-deep to-ink",
  "from-teal-deep to-ink",
];

// The three recognised admission paths shown as banners in the Boards section.
// Gradient classes are literal strings so Tailwind's JIT keeps them.
const pathBanners = [
  {
    title: "Engineering",
    tag: "For future engineers",
    icon: "⚙️",
    blurb: "JEE-aligned streams, diploma and B.Tech pathways with counselling on the right college.",
    gradient: "from-indigo-deep to-ink",
  },
  {
    title: "Medical",
    tag: "For future doctors",
    icon: "🩺",
    blurb: "NEET-focused science stream, allied-health and nursing options mapped to your goal.",
    gradient: "from-teal-deep to-ink",
  },
  {
    title: "Schools",
    tag: "Class 10 & 12 boarding",
    icon: "🎓",
    blurb: "Open-school admission for Class 10 and 12 with recognised boards and full documentation.",
    gradient: "from-saffron-600 to-ink",
  },
];

// Hover colour cycled across the learning-journey cards. Literal strings for JIT.
const journeyHovers = [
  "hover:border-saffron hover:bg-saffron/5 hover:shadow-saffron/10",
  "hover:border-teal-deep hover:bg-teal-deep/5 hover:shadow-teal-deep/10",
  "hover:border-indigo-deep hover:bg-indigo-deep/5 hover:shadow-indigo-deep/10",
];

export default function Home() {
  const navigate = useNavigate();
  const { openAuth } = useAuthModal();
  const { isAuthenticated, user } = useAppSelector(selectAuth);
  const [counsellingSignal, setCounsellingSignal] = useState(0);
  const openCounselling = () => setCounsellingSignal((n) => n + 1);

  // The admission / learning-journey flow is for prospective students only.
  //  - Not logged in      -> open the register popup.
  //  - Logged-in student  -> straight into the admission flow.
  //  - Logged-in staff    -> do nothing (don't drag admins/counsellers into
  //    the student route, which RoleRoute would bounce back to their panel).
  const startAdmission = (course) => {
    if (!isAuthenticated) return openAuth("register");
    if (user?.role !== ROLES.STUDENT) return;
    const q = course?.id ? `?course=${course.id}` : "";
    navigate(`${PATHS.STUDENT.ADMISSION}${q}`);
  };

  return (
    <>
      {/* First-visit + on-demand counselling registration popup */}
      <CounsellingPopup openSignal={counsellingSignal} />

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-saffron/15 blur-3xl" />

        {/* full-width moving strip of admission programs — dynamic from the admin panel */}
        <div className="relative pt-2 pb-3">
          <HeroCoursesMarquee />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-10 lg:pb-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            <div className="max-w-xl">
              <h1 className="mt-1 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl xl:text-6xl">
                The open door to{" "}
                <span className="relative whitespace-nowrap text-saffron-600">
                  finishing school
                  <svg aria-hidden viewBox="0 0 300 12" className="absolute -bottom-1 left-0 w-full text-saffron" preserveAspectRatio="none">
                    <path d="M2 9 C 80 2, 220 2, 298 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>.
              </h1>

              <p className="mt-5 text-base leading-relaxed text-muted">
                Admissions, expert counselling and classes guiding every student
                to the right course, college and career.
              </p>

              {/* trust badges */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {heroBadges.map((b) => (
                  <li key={b} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-saffron-600">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => (isAuthenticated ? navigate(roleHome(user?.role)) : openAuth("register"))}
                  className="rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
                >
                  {isAuthenticated ? "Go to dashboard" : "Start free — Register"}
                </button>
                <button onClick={openCounselling} className="rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-ink/30">
                  Book free counselling
                </button>
              </div>

              <dl className="mt-12 flex max-w-md gap-8">
                {trustStats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-display text-3xl font-bold text-ink">{s.value}</dt>
                    <dd className="mt-1 text-sm text-muted">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <img src={heroStudent} alt="A student smiling while studying online on a laptop" draggable="false" className="w-full select-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PROMO CAROUSEL ---------- */}
      <PromoCarousel />

      {/* ---------- ANNOUNCEMENTS ---------- */}
      <AnnouncementsSection />

      {/* ---------- BOARDS ---------- */}
      <section id="boards" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead eyebrow="Choose your board" title="Three recognised paths, one simple admission"
          sub="Not sure which board fits you? Our counsellors recommend the right one based on your goal and timeline." />

        {/* Recognised boards — NIOS / BBOSE / BOSSE */}
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {boards.map((b, i) => (
            <div
              key={b.code}
              className={`relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${boardGradients[i % boardGradients.length]} p-6 text-white shadow-lg ring-1 ring-white/10`}
            >
              <span aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <span className="font-display text-2xl font-extrabold">{b.code}</span>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white">{b.tag}</span>
              </div>
              <p className="relative mt-1 text-sm font-semibold text-white/80">{b.name}</p>
              <p className="relative mt-3 flex-1 text-sm leading-relaxed text-white/85">{b.blurb}</p>
            </div>
          ))}
        </div>

        {/* Three recognised paths — Engineering / Medical / Schools banners */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {pathBanners.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={openCounselling}
              className={`group relative flex min-h-[168px] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${p.gradient} p-6 text-left text-white shadow-lg ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-xl`}
            >
              <span aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <span aria-hidden className="absolute right-5 top-5 text-4xl">{p.icon}</span>
              <span className="relative text-[11px] font-bold uppercase tracking-wide text-white/80">{p.tag}</span>
              <span className="relative mt-1 font-display text-2xl font-extrabold">{p.title}</span>
              <span className="relative mt-1.5 text-sm leading-relaxed text-white/85">{p.blurb}</span>
              <span className="relative mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                Explore
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- EXPERTISE / GUIDANCE ---------- */}
      <section id="programs" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-ink-soft p-6 shadow-2xl shadow-ink/20 ring-1 ring-saffron/30 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-saffron/25 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-indigo-deep/40 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-saffron px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              Our Expertise
            </span>
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Personalized Career Advice &amp; <span className="text-saffron">Admission Guidance</span>
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-indigo-100/85">
              Every student's journey is unique. Our experienced counsellors provide personalized career
              advice and end-to-end admission guidance so you can make informed decisions with confidence.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-indigo-100/70">
              Whether you plan to study in India or abroad, we assist you at every step, from career
              counselling and course selection to college shortlisting, application support,
              documentation, and admission assistance.
            </p>

            {/* What we help with */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {expertise.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-white/10">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-saffron text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <p className="text-sm font-semibold text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ---------- COURSES ---------- */}
      <section id="courses" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead eyebrow="Courses" title="Pick a course and start your admission"
          sub="Every course below is available through open schooling. Click apply and a counsellor confirms your eligibility." />
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <CourseCard key={c.id} course={c} onApply={startAdmission} index={i} />
          ))}
        </div>
      </section>

      {/* ---------- LIVE CLASSES / COACHING ---------- */}
      <section id="classes" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-1">
            <AiImage
              src="/img/live-classes.jpg"
              alt="Smiling student with a backpack and books"
              label="Add: /public/img/live-classes.jpg"
              className="aspect-[4/3] w-full rounded-3xl object-top shadow-xl shadow-ink/10"
            />
          </div>
          <div className="order-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-saffron-600">Live classes</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Coaching for Class 10, 11 &amp; 12
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Science", "Commerce", "Arts", "Live + recorded", "Doubt-solving", "Mock tests"].map((t) => (
                <span key={t} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-semibold text-ink">
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={() => startAdmission(null)}
              className="mt-7 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
            >
              Join a live class
            </button>
          </div>
        </div>
      </section>

      {/* ---------- LEARNING JOURNEY ---------- */}
      <section id="journey" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead eyebrow="How it works" title="Your learning journey with us"
          sub="A complete online learning ecosystem — from admission to certificate, with live classes, study materials and full LMS support." />
        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {learningSteps.map((s, i) => (
            <div key={s.step} className={`relative flex flex-col rounded-2xl border border-line bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${journeyHovers[i % journeyHovers.length]}`}>
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl font-extrabold text-line">{s.step}</span>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink">{s.tag}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              <ul className="mt-4 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-ink/90">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none text-teal-deep">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- LMS FEATURES ---------- */}
      <section id="lms" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead eyebrow="Learning platform" title="What you get inside our LMS"
          sub="Everything you need to study, revise and stay on track — all in one place, included with your admission." />
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lmsFeatures.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-ink/5 text-ink transition group-hover:bg-saffron group-hover:text-white">
                {f.icon}
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-9 flex justify-center">
          <button onClick={() => startAdmission(null)}
            className="rounded-xl bg-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-soft">
            Start your learning journey today
          </button>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section id="testimonials" className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead eyebrow="Testimonials" title="Students who found their way forward"
            sub="Real stories from learners we've guided through open-board admissions and counselling." />
        </div>
        <div className="mt-9">
          <TestimonialsMarquee testimonials={testimonials} />
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faqs" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead eyebrow="FAQ" title="Frequently asked questions"
          sub="The things students ask us most. Still unsure? Book a free counselling session." />
        <div className="mt-9 max-w-3xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* ---------- COUNSELLING ---------- */}
      <section id="counselling" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-ink px-6 py-12 sm:px-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="text-sm font-semibold text-saffron">Free career counselling</span>
              <h3 className="mt-2 font-display text-3xl font-bold text-white">Talk to a counsellor before you decide</h3>
              <p className="mt-3 text-indigo-100/80">
                Get a personalised plan — the right board, the right stream, and a realistic
                timeline to your certificate. No charge, no pressure.
              </p>
            </div>
            <button onClick={() => startAdmission(null)}
              className="shrink-0 rounded-xl bg-saffron px-6 py-3.5 text-sm font-bold text-ink transition hover:bg-saffron-600 hover:text-white">
              Book my session
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="max-w-2xl">
      <span className="text-sm font-semibold uppercase tracking-wide text-saffron-600">{eyebrow}</span>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted">{sub}</p>
    </div>
  );
}

const iconProps = {
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round",
};

const lmsFeatures = [
  {
    title: "Study Notes",
    desc: "Chapter-wise notes, important questions, quick revision guides.",
    icon: (
      <svg {...iconProps}><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
    ),
  },
  {
    title: "Digital Library",
    desc: "Access to e-books, previous year papers, sample papers.",
    icon: (
      <svg {...iconProps}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>
    ),
  },
  {
    title: "Progress Tracking",
    desc: "Track your learning progress, test scores, performance analytics.",
    icon: (
      <svg {...iconProps}><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></svg>
    ),
  },
  {
    title: "Doubt Clearing",
    desc: "24/7 doubt support, discussion forums, expert sessions.",
    icon: (
      <svg {...iconProps}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
    ),
  },
  {
    title: "Mock Tests",
    desc: "Chapter-wise tests, full-length mock exams, performance analysis.",
    icon: (
      <svg {...iconProps}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
    ),
  },
];
