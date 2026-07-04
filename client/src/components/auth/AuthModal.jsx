import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  loginUser,
  registerUser,
  clearAuthError,
  selectAuth,
} from "../../features/auth/auth.slice";
import { authApi } from "../../features/auth/auth.api";
import { roleHome } from "../../config/roles";
import Field from "../ui/Field";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const emptyLogin = { email: "", password: "" };
const emptyRegister = { name: "", email: "", mobile_number: "", password: "" };

// A single modal that walks through the whole auth flow without leaving the page:
//   login ⇄ register → verify (OTP) → login ,  and  login → forgot → login
export default function AuthModal({ view, setView, onClose }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector(selectAuth);

  const [login, setLogin] = useState(emptyLogin);
  const [register, setRegister] = useState(emptyRegister);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // carried between steps
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState("request"); // request -> reset

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Reset transient messages whenever the view changes.
  useEffect(() => {
    setError("");
    setNotice("");
    dispatch(clearAuthError());
  }, [view, dispatch]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const goVerify = (mail) => {
    setEmail(mail);
    setOtp("");
    setView("verify");
  };

  // ---- actions ----
  const doLogin = async () => {
    setError("");
    const result = await dispatch(loginUser(login));
    if (loginUser.fulfilled.match(result)) {
      onClose();
      navigate(roleHome(result.payload?.role));
    } else {
      setError(result.payload || "Could not log in");
    }
  };

  const doRegister = async () => {
    setError("");
    const result = await dispatch(registerUser(register));
    if (registerUser.fulfilled.match(result)) {
      setNotice("");
      goVerify(register.email); // registration sends a 6-digit OTP
    } else {
      setError(result.payload || "Could not create account");
    }
  };

  const doVerify = async () => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await authApi.verifyEmail({ email: email.trim(), otp: otp.trim() });
      setLogin({ email: email.trim(), password: "" });
      setNotice("Email verified. Please log in to continue.");
      setView("login");
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  const doResend = async () => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await authApi.resendOtp({ email: email.trim() });
      setNotice("A new OTP has been sent to your email.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  const doForgotRequest = async () => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setForgotStep("reset");
      setNotice("OTP sent. Check your email and enter it below.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  const doForgotReset = async () => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await authApi.resetPassword({ email: email.trim(), otp: otp.trim(), newPassword });
      setLogin({ email: email.trim(), password: "" });
      setNotice("Password reset. Please log in with your new password.");
      setForgotStep("request");
      setView("login");
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  const working = busy || loading;

  const titles = {
    login: ["Welcome back", "Log in to track your admission and counselling."],
    register: ["Create your account", "Start your admission journey with Shri Admission Gurukul."],
    verify: ["Verify your email", "Enter the 6-digit code we sent to your email address."],
    forgot: [
      "Reset your password",
      forgotStep === "request"
        ? "Enter your email and we'll send you a 6-digit code."
        : "Enter the code and choose a new password.",
    ],
  };
  const [title, subtitle] = titles[view];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />

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

        <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>

        {/* Tab switch (login/register only) */}
        {(view === "login" || view === "register") && (
          <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => setView(m)}
                className={`rounded-lg py-2 text-sm font-semibold transition ${
                  view === m ? "bg-white text-ink shadow-sm" : "text-muted"
                }`}
              >
                {m === "login" ? "Log in" : "Register"}
              </button>
            ))}
          </div>
        )}

        {/* ---- fields ---- */}
        <div className="mt-5 space-y-3">
          {view === "login" && (
            <>
              <Field label="Email" name="email" type="email" value={login.email}
                onChange={(e) => setLogin((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" />
              <Field label="Password" name="password" type="password" value={login.password}
                onChange={(e) => setLogin((f) => ({ ...f, password: e.target.value }))}
                placeholder="Your password" />
              <p className="text-right text-sm">
                <button type="button" onClick={() => { setEmail(login.email); setForgotStep("request"); setView("forgot"); }}
                  className="font-semibold text-saffron-600 hover:underline">
                  Forgot password?
                </button>
              </p>
            </>
          )}

          {view === "register" && (
            <>
              <Field label="Full name" name="name" value={register.name}
                onChange={(e) => setRegister((f) => ({ ...f, name: e.target.value }))}
                placeholder="Student's full name" />
              <Field label="Email" name="email" type="email" value={register.email}
                onChange={(e) => setRegister((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" />
              <Field label="Mobile number" name="mobile_number" value={register.mobile_number}
                onChange={(e) => setRegister((f) => ({ ...f, mobile_number: e.target.value }))}
                placeholder="9876543210" inputMode="numeric" />
              <Field label="Password" name="password" type="password" value={register.password}
                onChange={(e) => setRegister((f) => ({ ...f, password: e.target.value }))}
                placeholder="At least 6 characters" />
            </>
          )}

          {view === "verify" && (
            <>
              <Field label="Email" name="email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              <Field label="OTP" name="otp" value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code" inputMode="numeric" />
            </>
          )}

          {view === "forgot" && (
            <>
              <Field label="Email" name="email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                disabled={forgotStep === "reset"} />
              {forgotStep === "reset" && (
                <>
                  <Field label="OTP" name="otp" value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit code" inputMode="numeric" />
                  <Field label="New password" name="newPassword" type="password" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" />
                </>
              )}
            </>
          )}
        </div>

        {notice && (
          <p className="mt-3 rounded-lg bg-teal-deep/10 px-3 py-2 text-sm font-medium text-teal-deep">{notice}</p>
        )}
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
        )}

        {/* ---- primary action ---- */}
        <Button
          onClick={
            view === "login" ? doLogin
            : view === "register" ? doRegister
            : view === "verify" ? doVerify
            : forgotStep === "request" ? doForgotRequest
            : doForgotReset
          }
          disabled={working}
          className="mt-5 w-full"
        >
          {working ? <><Spinner className="h-4 w-4" /> Please wait…</>
            : view === "login" ? "Log in"
            : view === "register" ? "Create account"
            : view === "verify" ? "Verify email"
            : forgotStep === "request" ? "Send OTP"
            : "Reset password"}
        </Button>

        {/* ---- footer links ---- */}
        {view === "verify" && (
          <p className="mt-4 text-center text-sm text-muted">
            Didn't get the code?{" "}
            <button type="button" onClick={doResend} disabled={working}
              className="font-semibold text-saffron-600 hover:underline disabled:opacity-50">
              Resend OTP
            </button>
          </p>
        )}
        {(view === "verify" || view === "forgot") && (
          <p className="mt-2 text-center text-sm text-muted">
            <button type="button" onClick={() => setView("login")}
              className="font-semibold text-saffron-600 hover:underline">
              Back to log in
            </button>
          </p>
        )}
        {(view === "login" || view === "register") && (
          <p className="mt-4 text-center text-sm text-muted">
            {view === "register" ? "Already registered? " : "New here? "}
            <button type="button" onClick={() => setView(view === "register" ? "login" : "register")}
              className="font-semibold text-saffron-600 hover:underline">
              {view === "register" ? "Log in" : "Create an account"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
