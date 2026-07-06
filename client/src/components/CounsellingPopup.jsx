import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/auth.slice";
import { enquiryApi } from "../features/enquiry/enquiry.api";
import { admissionPrograms } from "../data/courses";
import { useAuthModal } from "./auth/AuthModalProvider";

const STORAGE_KEY = "sag_counselling_popup_seen";

const empty = {
  name: "",
  email: "",
  mobile_number: "",
  program: admissionPrograms[0],
  enquiryType: "NIOS",
  classType: "10th",
  description: "",
};

export default function CounsellingPopup({ openSignal = 0 }) {
  const { openAuth } = useAuthModal();
  const { isAuthenticated } = useAppSelector(selectAuth);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Show once per visitor (first load only).
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  // Open on demand (e.g. hero "Book free counselling" button). We reset the
  // form/success state so a re-open always starts fresh.
  useEffect(() => {
    if (openSignal > 0) {
      setForm(empty);
      setDone(false);
      setError("");
      setOpen(true);
    }
  }, [openSignal]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.mobile_number.trim()) {
      setError("Please enter your email and mobile number.");
      return;
    }

    setLoading(true);
    try {
      await enquiryApi.sendEnquiry(form);
      localStorage.setItem(STORAGE_KEY, "1");
      setDone(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not submit right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={close} />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-ink px-6 pb-6 pt-7">
          <span className="text-sm font-semibold text-saffron">Free career counselling</span>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Book your free session
          </h2>
          <p className="mt-1 text-sm text-indigo-100/80">
            Leave your details and a counsellor will call you back to plan your admission.
          </p>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal-deep/10 text-teal-deep">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">Thank you!</h3>
            <p className="mt-1 text-sm text-muted">
              We've received your details. A counsellor will reach out to you soon.
            </p>

            {!isAuthenticated ? (
              <div className="mt-5 rounded-xl border border-line bg-canvas p-4 text-left">
                <p className="text-sm font-semibold text-ink">
                  Want more detailed counselling?
                </p>
                <p className="mt-1 text-xs text-muted">
                  Create a free account to track your admission, upload documents and get
                  a personalised plan from your counsellor.
                </p>
                <button
                  onClick={() => {
                    close();
                    openAuth("register");
                  }}
                  className="mt-3 w-full rounded-xl bg-saffron py-2.5 text-sm font-bold text-ink transition hover:bg-saffron-600 hover:text-white"
                >
                  Create free account
                </button>
                <button
                  onClick={close}
                  className="mt-2 w-full text-center text-xs font-medium text-muted hover:text-ink"
                >
                  Maybe later
                </button>
              </div>
            ) : (
              <button
                onClick={close}
                className="mt-5 rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
              >
                Close
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 px-6 py-5">
            <Field
              label="Full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Student's full name"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            <Field
              label="Mobile number"
              name="mobile_number"
              value={form.mobile_number}
              onChange={handleChange}
              placeholder="9876543210"
              inputMode="numeric"
            />

            <Select label="Admission program" name="program" value={form.program} onChange={handleChange}>
              {admissionPrograms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <Select label="Board" name="enquiryType" value={form.enquiryType} onChange={handleChange}>
                <option value="NIOS">NIOS</option>
                <option value="BBOSE">BBOSE</option>
                <option value="BOSSE">BOSSE</option>
                <option value="Other">Other</option>
              </Select>
              <Select label="Class" name="classType" value={form.classType} onChange={handleChange}>
                <option value="10th">Class 10th</option>
                <option value="11th">Class 11th</option>
                <option value="12th">Class 12th</option>
              </Select>
            </div>

            <Field
              label="Message (optional)"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What would you like help with?"
            />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-saffron py-3 text-sm font-bold text-ink transition hover:bg-saffron-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Request free counselling"}
            </button>

            <button
              type="button"
              onClick={close}
              className="w-full text-center text-xs font-medium text-muted hover:text-ink"
            >
              No thanks, maybe later
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
      />
    </label>
  );
}

function Select({ label, children, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink">{label}</span>
      <select
        {...props}
        className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none transition focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
      >
        {children}
      </select>
    </label>
  );
}
