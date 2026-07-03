import { useEffect, useState } from "react";
import {
  counsellingApi,
  COUNSELLING_STATUS_LABEL,
} from "../../features/counselling/counselling.api";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const statusStyle = (status) =>
  status === "completed"
    ? "bg-teal-deep/10 text-teal-deep"
    : status === "cancelled"
      ? "bg-red-50 text-red-600"
      : "bg-saffron-100 text-saffron-600";

const empty = { topic: "", query: "", preferredDate: "", mobile_number: "" };

export default function Counselling() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try {
      const res = await counsellingApi.mine();
      setAppointments(res?.data?.data ?? []);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async () => {
    setError(null);
    if (!form.topic.trim()) {
      setError("Please enter a topic for counselling.");
      return;
    }
    setSubmitting(true);
    try {
      await counsellingApi.request({
        topic: form.topic.trim(),
        query: form.query.trim(),
        preferredDate: form.preferredDate || undefined,
        mobile_number: form.mobile_number.trim() || undefined,
      });
      setForm(empty);
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Career Counselling</h1>
      <p className="mt-1 text-sm text-muted">
        Request a session with our counsellors and track your appointments.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* request form */}
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-ink">Request a session</h2>
          <div className="mt-4 space-y-3">
            <Field
              label="Topic"
              name="topic"
              value={form.topic}
              onChange={onChange}
              placeholder="e.g. Course selection, career guidance"
            />
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-ink">Your query</span>
              <textarea
                name="query"
                value={form.query}
                onChange={onChange}
                rows={3}
                placeholder="Tell us what you'd like help with…"
                className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
              />
            </label>
            <Field
              label="Preferred date (optional)"
              name="preferredDate"
              type="date"
              value={form.preferredDate}
              onChange={onChange}
            />
            <Field
              label="Contact number (optional)"
              name="mobile_number"
              value={form.mobile_number}
              onChange={onChange}
              placeholder="Defaults to your profile number"
              inputMode="numeric"
            />
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <Button onClick={onSubmit} disabled={submitting} className="mt-5 w-full">
            {submitting ? (
              <><Spinner className="h-4 w-4" /> Submitting…</>
            ) : (
              "Request counselling"
            )}
          </Button>
        </div>

        {/* my appointments */}
        <div>
          <h2 className="font-display text-lg font-bold text-ink">My appointments</h2>
          {loading ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted">
              <Spinner className="h-4 w-4" /> Loading…
            </div>
          ) : appointments.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
              You haven't requested any counselling yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {appointments.map((a) => (
                <li key={a._id} className="rounded-2xl border border-line bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{a.topic || "Counselling"}</p>
                      {a.query && <p className="mt-1 text-sm text-muted">{a.query}</p>}
                    </div>
                    <span className={`flex-none rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(a.status)}`}>
                      {COUNSELLING_STATUS_LABEL[a.status] || a.status}
                    </span>
                  </div>
                  {a.scheduledAt && (
                    <p className="mt-2 text-xs text-muted">
                      Scheduled: {new Date(a.scheduledAt).toLocaleString("en-IN")}
                    </p>
                  )}
                  {a.assignedCounseller && (
                    <p className="mt-1 text-xs text-muted">
                      Counsellor: {a.assignedCounseller.name}
                    </p>
                  )}
                  {a.notes?.length > 0 && (
                    <div className="mt-3 border-t border-line pt-2">
                      <p className="text-xs font-semibold text-ink">Counsellor notes</p>
                      <ul className="mt-1 space-y-1">
                        {a.notes.map((n, i) => (
                          <li key={i} className="text-xs text-muted">• {n.note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
