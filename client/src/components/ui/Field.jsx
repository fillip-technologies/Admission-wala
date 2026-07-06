import { useState } from "react";

export default function Field({ label, type, ...props }) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);

  // For password fields we swap the input type on toggle and leave room on the
  // right for the eye button; everything else renders exactly as before.
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink">{label}</span>
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={`w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10 ${
            isPassword ? "pr-11" : ""
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted transition hover:text-ink"
          >
            {show ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </label>
  );
}
