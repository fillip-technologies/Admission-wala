import { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";
import CourseCard from "../components/CourseCard";
import { selectAuth } from "../features/auth/authSlice";
import { boards, courses, trustStats } from "../data/courses";
import heroStudent from "../assets/hero-student.png";

export default function Home() {
  const { isAuthenticated, user } = useSelector(selectAuth);
  const [auth, setAuth] = useState({ open: false, mode: "register" });

  const openAuth = (mode) => setAuth({ open: true, mode });
  const closeAuth = () => setAuth((a) => ({ ...a, open: false }));
  const setMode = (mode) => setAuth((a) => ({ ...a, mode }));

  
  const handleApply = (course) => {
    if (!isAuthenticated) return openAuth("register");
    console.log("Start admission for:", course?.title || "general");
    // e.g. navigate(`/admission?course=${course.id}`)
  };

  return (
    <div className="min-h-screen">
      <Navbar
        onLogin={() => openAuth("login")}
        onRegister={() => openAuth("register")}
      />

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        {/* soft glow behind hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-saffron/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-4 ">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            {/* left: copy */}
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
                NIOS · BBOSE · BOSSE admissions open
              </span>

              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl xl:text-6xl">
                The open door to{" "}
                <span className="relative whitespace-nowrap text-saffron-600">
                  finishing school
                  <svg
                    aria-hidden
                    viewBox="0 0 300 12"
                    className="absolute -bottom-1 left-0 w-full text-saffron"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9 C 80 2, 220 2, 298 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                .
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-muted">
                Admission Walla helps you complete Class 10th and 12th through
                recognised open boards — with a counsellor guiding every step,
                from course choice to your certificate.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => (isAuthenticated ? handleApply(null) : openAuth("register"))}
                  className="rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
                >
                  {isAuthenticated ? "Start your admission" : "Start free — Register"}
                </button>
                <a
                  href="#counselling"
                  className="rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-ink/30"
                >
                  Book free counselling
                </a>
              </div>

              {isAuthenticated && (
                <p className="mt-4 text-sm text-muted">
                  Logged in as{" "}
                  <span className="font-semibold text-ink">{user?.email}</span>
                </p>
              )}

              <dl className="mt-12 flex max-w-md gap-8">
                {trustStats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-display text-3xl font-bold text-ink">
                      {s.value}
                    </dt>
                    <dd className="mt-1 text-sm text-muted">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* right: image */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <img
                src={heroStudent}
                alt="A student smiling while studying online on a laptop"
                draggable="false"
                className="w-full select-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- BOARDS ---------- */}
      <section id="boards" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead
          eyebrow="Choose your board"
          title="Three recognised paths, one simple admission"
          sub="Not sure which board fits you? Our counsellors recommend the right one based on your goal and timeline."
        />
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {boards.map((b) => (
            <div
              key={b.code}
              className="relative flex flex-col rounded-2xl border border-line bg-white p-6"
            >
              <div className="absolute left-0 top-6 h-10 w-1 rounded-r bg-saffron" />
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-extrabold text-ink">
                  {b.code}
                </span>
                <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-semibold text-ink">
                  {b.tag}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-ink/70">{b.name}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {b.blurb}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- COURSES ---------- */}
      <section id="courses" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead
          eyebrow="Courses"
          title="Pick a course and start your admission"
          sub="Every course below is available through open schooling. Click apply and a counsellor confirms your eligibility."
        />
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} onApply={handleApply} />
          ))}
        </div>
      </section>

      {/* ---------- COUNSELLING BAND ---------- */}
      <section id="counselling" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-ink px-6 py-12 sm:px-12">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="text-sm font-semibold text-saffron">
                Free career counselling
              </span>
              <h3 className="mt-2 font-display text-3xl font-bold text-white">
                Talk to a counsellor before you decide
              </h3>
              <p className="mt-3 text-indigo-100/80">
                Get a personalised plan — the right board, the right stream, and a
                realistic timeline to your certificate. No charge, no pressure.
              </p>
            </div>
            <button
              onClick={() => (isAuthenticated ? handleApply(null) : openAuth("register"))}
              className="shrink-0 rounded-xl bg-saffron px-6 py-3.5 text-sm font-bold text-ink transition hover:bg-saffron-600 hover:text-white"
            >
              Book my session
            </button>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-display font-bold text-ink">
            Admission<span className="text-saffron">Walla</span>
          </p>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Fillip Technologies Pvt. Ltd. · Admission
            &amp; Counselling Portal
          </p>
        </div>
      </footer>

      <AuthModal
        open={auth.open}
        mode={auth.mode}
        setMode={setMode}
        onClose={closeAuth}
      />
    </div>
  );
}

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="max-w-2xl">
      <span className="text-sm font-semibold uppercase tracking-wide text-saffron-600">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted">{sub}</p>
    </div>
  );
}