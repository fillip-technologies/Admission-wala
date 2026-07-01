import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser, clearAuthError, selectAuth } from "../../features/auth/auth.slice";
import { roleHome } from "../../config/roles";
import { PATHS } from "../../routes/paths";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useAppSelector(selectAuth);

  // signup redirects here with { email, justRegistered }
  const prefillEmail = location.state?.email || "";
  const justRegistered = location.state?.justRegistered || false;

  const [form, setForm] = useState({ email: prefillEmail, password: "" });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async () => {
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload;
      const from = location.state?.from?.pathname;
      navigate(from || roleHome(user?.role), { replace: true });
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to track your admission and counselling.</p>

      {justRegistered && (
        <p className="mt-4 rounded-lg bg-teal-deep/10 px-3 py-2 text-sm font-medium text-teal-deep">
          Account created. Please log in to continue.
        </p>
      )}

      <div className="mt-5 space-y-3">
        <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Your password" />
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
      )}

      <Button onClick={onSubmit} disabled={loading} className="mt-5 w-full">
        {loading ? <><Spinner className="h-4 w-4" /> Please wait…</> : "Log in"}
      </Button>

      <p className="mt-4 text-center text-sm text-muted">
        New here?{" "}
        <Link to={PATHS.SIGNUP} className="font-semibold text-saffron-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
