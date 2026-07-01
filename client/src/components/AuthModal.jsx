import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  clearAuthError,
  selectAuth,
} from "../features/auth/authSlice";

const emptyRegister = { name: "", email: "", mobile_number: "", password: "" };
const emptyLogin = { email: "", password: "" };

export default function AuthModal({ open, mode, setMode, onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(selectAuth);
  const [form, setForm] = useState(emptyRegister);
  const [notice, setNotice] = useState(""); // success message (e.g. after signup)

  // Reset only when the modal OPENS — not on every tab change — so the email
  // we prefill after signup survives the switch to the login tab.
  useEffect(() => {
    if (open) {
      setForm(mode === "register" ? emptyRegister : emptyLogin);
      setNotice("");
      dispatch(clearAuthError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dispatch]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (mode === "register") {
      const result = await dispatch(registerUser(form));
      if (registerUser.fulfilled.match(result)) {
        // Signup issues no cookie, so move the user to the login tab.
        setMode("login");
        setForm({ email: form.email, password: "" }); // keep their email
        setNotice("Account created. Please log in to continue.");
      }
      return;
    }

    const result = await dispatch(loginUser(form));
    if(result?.payload?.role==='admin'){
      
    }
    if (loginUser.fulfilled.match(result)) onClose(); // login DOES set cookies
  };

  // manual tab click — full reset
  const switchTo = (next) => {
    setMode(next);
    setForm(next === "register" ? emptyRegister : emptyLogin);
    setNotice("");
    dispatch(clearAuthError());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl sm:p-7">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-canvas hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2 className="font-display text-2xl font-bold text-ink">
          {mode === "register" ? "Create your account" : "Welcome back"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {mode === "register"
            ? "Start your admission journey with Admission Walla."
            : "Log in to track your admission and counselling."}
        </p>

        {/* tab switch */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => switchTo(m)}
              className={`rounded-lg py-2 text-sm font-semibold capitalize transition ${
                mode === m ? "bg-white text-ink shadow-sm" : "text-muted"
              }`}
            >
              {m === "login" ? "Log in" : "Register"}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {mode === "register" && (
            <Field
              label="Full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Govind Kumar"
            />
          )}
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          {mode === "register" && (
            <Field
              label="Mobile number"
              name="mobile_number"
              value={form.mobile_number}
              onChange={handleChange}
              placeholder="9876543210"
              inputMode="numeric"
            />
          )}
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
        </div>

        {notice && (
          <p className="mt-3 rounded-lg bg-teal-deep/10 px-3 py-2 text-sm font-medium text-teal-deep">
            {notice}
          </p>
        )}

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-ink py-3 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Please wait…"
            : mode === "register"
              ? "Create account"
              : "Log in"}
        </button>

        <p className="mt-4 text-center text-sm text-muted">
          {mode === "register" ? "Already registered? " : "New here? "}
          <button
            onClick={() => switchTo(mode === "register" ? "login" : "register")}
            className="font-semibold text-saffron-600 hover:underline"
          >
            {mode === "register" ? "Log in" : "Create an account"}
          </button>
        </p>
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