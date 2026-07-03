import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { authApi } from "../../features/auth/auth.api";
import { PATHS } from "../../routes/paths";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const onVerify = async () => {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      await authApi.verifyEmail({ email: email.trim(), otp: otp.trim() });
      navigate(PATHS.LOGIN, {
        state: { email: email.trim(), justVerified: true },
      });
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError(null);
    setNotice(null);
    setResending(true);
    try {
      await authApi.resendOtp({ email: email.trim() });
      setNotice("A new OTP has been sent to your email.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Verify your email</h1>
      <p className="mt-1 text-sm text-muted">
        Enter the 6-digit code we sent to your email address.
      </p>

      <div className="mt-5 space-y-3">
        <Field
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Field
          label="OTP"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="6-digit code"
          inputMode="numeric"
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

      <Button onClick={onVerify} disabled={loading} className="mt-5 w-full">
        {loading ? <><Spinner className="h-4 w-4" /> Verifying…</> : "Verify email"}
      </Button>

      <p className="mt-4 text-center text-sm text-muted">
        Didn't get the code?{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={resending}
          className="font-semibold text-saffron-600 hover:underline disabled:opacity-50"
        >
          {resending ? "Sending…" : "Resend OTP"}
        </button>
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        <Link to={PATHS.LOGIN} className="font-semibold text-saffron-600 hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
