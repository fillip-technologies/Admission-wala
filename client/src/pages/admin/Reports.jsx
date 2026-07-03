import { useEffect, useState } from "react";
import { adminApi } from "../../features/admin/admin.api";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const STAT_CARDS = [
  { key: "students", label: "Students", color: "bg-indigo-deep/10 text-indigo-deep" },
  { key: "counsellers", label: "Counsellers", color: "bg-teal-deep/10 text-teal-deep" },
  { key: "admissions", label: "Admissions", color: "bg-saffron/15 text-saffron-600" },
  { key: "pendingAdmissions", label: "Pending admissions", color: "bg-saffron-100 text-saffron-600" },
  { key: "approvedAdmissions", label: "Approved", color: "bg-teal-deep/10 text-teal-deep" },
  { key: "appointments", label: "Counselling", color: "bg-indigo-deep/10 text-indigo-deep" },
  { key: "enquiries", label: "Enquiries", color: "bg-saffron/15 text-saffron-600" },
];

const LABELS = {
  submitted: "Submitted",
  under_review: "Under Review",
  documents_verified: "Docs Verified",
  approved: "Approved",
  rejected: "Rejected",
  requested: "Requested",
  assigned: "Assigned",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

function Breakdown({ title, data }) {
  const entries = Object.entries(data || {});
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No data yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {entries.map(([key, value]) => (
            <li key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{LABELS[key] || key}</span>
                <span className="text-muted">{value}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-canvas">
                <div
                  className="h-full rounded-full bg-saffron-500"
                  style={{ width: total ? `${(value / total) * 100}%` : "0%" }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getReports();
      setReport(res?.data?.data ?? null);
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

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner className="h-4 w-4" /> Loading reports…
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Reports & Analytics</h1>
      <p className="mt-1 text-sm text-muted">Admissions, counselling and enquiry insights.</p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {report && (
        <>
          {/* stat cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAT_CARDS.map((c) => (
              <div key={c.key} className="rounded-2xl border border-line bg-white p-5">
                <p className="text-sm text-muted">{c.label}</p>
                <p className={`mt-2 inline-flex items-center rounded-lg px-3 py-1 font-display text-2xl font-bold ${c.color}`}>
                  {report.totals?.[c.key] ?? 0}
                </p>
              </div>
            ))}
          </div>

          {/* breakdowns */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Breakdown title="Admissions by status" data={report.admissionsByStatus} />
            <Breakdown title="Admissions by board" data={report.admissionsByBoard} />
            <Breakdown title="Counselling by status" data={report.counsellingByStatus} />
            <Breakdown title="Enquiries by board" data={report.enquiriesByType} />
          </div>
        </>
      )}
    </div>
  );
}
