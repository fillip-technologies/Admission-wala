import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../features/auth/auth.api";
import { PATHS } from "../../routes/paths";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("request"); // "request" -> "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const onRequest = async () => {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setStep("reset");
      setNotice("OTP sent. Check your email and enter it below.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      await authApi.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      navigate(PATHS.LOGIN, { state: { email: email.trim(), passwordReset: true } });
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Reset your password</h1>
      <p className="mt-1 text-sm text-muted">
        {step === "request"
          ? "Enter your email and we'll send you a 6-digit code."
          : "Enter the code and choose a new password."}
      </p>

      <div className="mt-5 space-y-3">
        <Field
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={step === "reset"}
        />
        {step === "reset" && (
          <>
            <Field
              label="OTP"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit code"
              inputMode="numeric"
            />
            <Field
              label="New password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </>
        )}
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

      <Button
        onClick={step === "request" ? onRequest : onReset}
        disabled={loading}
        className="mt-5 w-full"
      >
        {loading ? (
          <><Spinner className="h-4 w-4" /> Please wait…</>
        ) : step === "request" ? (
          "Send OTP"
        ) : (
          "Reset password"
        )}
      </Button>

      <p className="mt-4 text-center text-sm text-muted">
        <Link to={PATHS.LOGIN} className="font-semibold text-saffron-600 hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
