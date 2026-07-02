import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  clearCreateCounsellerError,
  createCounseller,
  getAllCounsellers,
  selectCounsellers,
  selectCounsellersError,
  selectCounsellersLoading,
  selectCreateCounsellerError,
  selectCreateCounsellerLoading,
} from "../../features/admin/admin.slice";
import Spinner from "../../components/ui/Spinner";

const INITIAL_FORM = {
  name: "",
  email: "",
  mobile_number: "",
  password: "",
};

const FIELD_INPUT_CLASS =
  "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:ring-2 focus:ring-ink/10";

export default function Counsellers() {
  const dispatch = useAppDispatch();
  const counsellers = useAppSelector(selectCounsellers);
  const loading = useAppSelector(selectCounsellersLoading);
  const error = useAppSelector(selectCounsellersError);
  const creating = useAppSelector(selectCreateCounsellerLoading);
  const createError = useAppSelector(selectCreateCounsellerError);

  const [form, setForm] = useState(INITIAL_FORM);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (counsellers.length === 0) dispatch(getAllCounsellers());
  }, [dispatch, counsellers.length]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return counsellers;

    return counsellers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.mobile_number?.includes(q),
    );
  }, [counsellers, search]);

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.mobile_number.trim() &&
    form.password.trim() &&
    !creating;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setNotice("");
    setFormError("");
    if (createError) dispatch(clearCreateCounsellerError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile_number: form.mobile_number.trim(),
      password: form.password.trim(),
    };

    if (!payload.name || !payload.email || !payload.mobile_number || !payload.password) {
      setFormError("All fields are required.");
      return;
    }

    if (payload.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (!/^[0-9]{10,12}$/.test(payload.mobile_number)) {
      setFormError("Mobile number must be 10 to 12 digits.");
      return;
    }

    try {
      await dispatch(createCounseller(payload)).unwrap();
      setForm(INITIAL_FORM);
      setNotice("Counseller created and email sent.");
      dispatch(getAllCounsellers());
    } catch {
      setNotice("");
    }
  };

  const handleGeneratePassword = () => {
    updateField("password", generatePassword());
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Counsellers</h1>
          <p className="mt-1 text-sm text-muted">
            {loading
              ? "Loading..."
              : `${counsellers.length} total - ${filtered.length} shown`}
          </p>
        </div>

        <button
          onClick={() => dispatch(getAllCounsellers())}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink/30 disabled:opacity-50"
        >
          {loading ? <Spinner className="h-3.5 w-3.5" /> : <RefreshIcon />}
          Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(280px,420px)_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-white p-5"
        >
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              Create counseller
            </h2>
            <p className="mt-1 text-sm text-muted">
              The login details will be mailed after creation.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <Field label="Name">
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Full name"
                className={FIELD_INPUT_CLASS}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="name@example.com"
                className={FIELD_INPUT_CLASS}
              />
            </Field>

            <Field label="Mobile number">
              <input
                type="tel"
                value={form.mobile_number}
                onChange={(e) => updateField("mobile_number", e.target.value)}
                placeholder="9876543210"
                className={FIELD_INPUT_CLASS}
              />
            </Field>

            <Field label="Temporary password">
              <div className="flex gap-2">
                <input
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="At least 6 characters"
                  className={FIELD_INPUT_CLASS}
                />
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="shrink-0 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-ink transition hover:border-ink/30"
                >
                  Generate
                </button>
              </div>
            </Field>
          </div>

          {(formError || createError) && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {formError || createError}
            </p>
          )}

          {notice && (
            <p className="mt-4 rounded-xl bg-teal-deep/10 px-4 py-3 text-sm font-medium text-teal-deep">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating && <Spinner className="h-4 w-4 border-white/30 border-t-white" />}
            Create counseller
          </button>
        </form>

        <div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, mobile..."
              className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:ring-2 focus:ring-ink/10"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
            {loading && counsellers.length === 0 ? (
              <div className="grid place-items-center py-20">
                <Spinner className="h-7 w-7" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-sm text-muted">
                {search ? "No counsellers match your search." : "No counsellers created yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-line text-sm">
                  <thead className="bg-canvas">
                    <tr>
                      {["#", "Name", "Email", "Mobile", "Joined"].map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filtered.map((c, i) => (
                      <tr key={c._id} className="transition hover:bg-canvas/70">
                        <td className="px-4 py-3 text-xs text-muted/60">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-saffron">
                              {c.name?.[0]?.toUpperCase() || "?"}
                            </span>
                            <span className="font-semibold text-ink">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted">{c.email}</td>
                        <td className="px-4 py-3 text-muted">{c.mobile_number}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">
                          {formatDate(c.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function generatePassword() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%";
  const bytes = new Uint32Array(10);

  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => chars[byte % chars.length]).join("");
  }

  return `${Math.random().toString(36).slice(2, 8)}${Date.now()
    .toString(36)
    .slice(-4)}`;
}

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RefreshIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
