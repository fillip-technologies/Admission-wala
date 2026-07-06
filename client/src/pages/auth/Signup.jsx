import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { registerUser, clearAuthError, selectAuth } from "../../features/auth/auth.slice";
import { PATHS } from "../../routes/paths";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const empty = { name: "", email: "", mobile_number: "", password: "" };

export default function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(selectAuth);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async () => {
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      // Registration sends a 6-digit OTP -> go verify the email.
      navigate(PATHS.VERIFY_EMAIL, { state: { email: form.email } });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Start your admission journey with Shree Admission Gurukul.</p>

      <div className="mt-5 space-y-3">
        <Field label="Full name" name="name" value={form.name} onChange={onChange} placeholder="Govind Kumar" />
        <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
        <Field label="Mobile number" name="mobile_number" value={form.mobile_number} onChange={onChange} placeholder="9876543210" inputMode="numeric" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={onChange} placeholder="At least 6 characters" />
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
      )}

      <Button onClick={onSubmit} disabled={loading} className="mt-5 w-full">
        {loading ? <><Spinner className="h-4 w-4" /> Please wait…</> : "Create account"}
      </Button>

      <p className="mt-4 text-center text-sm text-muted">
        Already registered?{" "}
        <Link to={PATHS.LOGIN} className="font-semibold text-saffron-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
