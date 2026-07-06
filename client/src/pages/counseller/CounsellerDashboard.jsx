import { useEffect, useState } from "react";
import {
  counsellingApi,
  COUNSELLING_STATUS_LABEL,
} from "../../features/counselling/counselling.api";
import { admissionApi } from "../../features/admission/admission.api";
import { STATUS_LABEL as ADMISSION_STATUS_LABEL } from "../../features/admission/statuses";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const STATUS_OPTIONS = ["assigned", "scheduled", "completed", "cancelled"];
const ADMISSION_STATUS_OPTIONS = [
  "submitted",
  "under_review",
  "documents_verified",
  "approved",
  "rejected",
];

export default function CounsellerDashboard() {
  const [open, setOpen] = useState([]);
  const [mine, setMine] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [noteDraft, setNoteDraft] = useState({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [openRes, mineRes, admRes] = await Promise.all([
        counsellingApi.list("open"),
        counsellingApi.list("assigned"),
        admissionApi.all(),
      ]);
      setOpen(openRes?.data?.data ?? []);
      setMine(mineRes?.data?.data ?? []);
      setAdmissions(admRes?.data?.data ?? []);
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

  const claim = async (id) => {
    setBusyId(id);
    try {
      await counsellingApi.claim(id);
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId(null);
    }
  };

  const setStatus = async (id, status) => {
    setBusyId(id);
    try {
      await counsellingApi.updateStatus(id, { status });
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId(null);
    }
  };

  const setAdmissionStatus = async (id, status) => {
    setBusyId(id);
    try {
      await admissionApi.updateStatus(id, { status });
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId(null);
    }
  };

  const addNote = async (id) => {
    const note = (noteDraft[id] || "").trim();
    if (!note) return;
    setBusyId(id);
    try {
      await counsellingApi.addNote(id, note);
      setNoteDraft((d) => ({ ...d, [id]: "" }));
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner className="h-4 w-4" /> Loading appointments…
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Counselling Appointments</h1>
      <p className="mt-1 text-sm text-muted">
        Claim open requests and manage your assigned sessions.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {/* admission applications */}
      <section className="mt-6">
        <h2 className="font-display text-lg font-bold text-ink">
          Admission applications <span className="text-muted">({admissions.length})</span>
        </h2>
        {admissions.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
            No admission applications yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {admissions.map((a) => (
              <li key={a._id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {a.program || a.course || "Admission"} · Class {a.classType}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {a.user?.name} · {a.user?.email} · {a.user?.mobile_number}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Board: {a.board === "Other" ? a.customBoard : a.board}
                    </p>
                    {a.documents?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {a.documents.map((d, i) => (
                          <a
                            key={i}
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-line px-2 py-0.5 text-[11px] font-semibold text-ink/70 hover:border-ink/30"
                          >
                            {d.label || `Document ${i + 1}`}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="flex-none rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-600">
                    {ADMISSION_STATUS_LABEL[a.status] || a.status}
                  </span>
                </div>

                {/* status controls */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {ADMISSION_STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setAdmissionStatus(a._id, s)}
                      disabled={busyId === a._id || a.status === s}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
                        a.status === s
                          ? "border-ink bg-ink text-white"
                          : "border-line text-ink hover:border-ink/30"
                      }`}
                    >
                      {ADMISSION_STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* open requests */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-ink">
          Open requests <span className="text-muted">({open.length})</span>
        </h2>
        {open.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
            No open requests right now.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {open.map((a) => (
              <li key={a._id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{a.topic || "Counselling"}</p>
                    <p className="mt-1 text-xs text-muted">
                      {a.user?.name} · {a.user?.email} · {a.mobile_number || a.user?.mobile_number}
                    </p>
                    {a.query && <p className="mt-2 text-sm text-muted">{a.query}</p>}
                  </div>
                  <Button
                    onClick={() => claim(a._id)}
                    disabled={busyId === a._id}
                    className="flex-none px-4 py-2 text-sm"
                  >
                    {busyId === a._id ? <Spinner className="h-4 w-4" /> : "Claim"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* my appointments */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-ink">
          My appointments <span className="text-muted">({mine.length})</span>
        </h2>
        {mine.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
            You haven't claimed any appointments yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {mine.map((a) => (
              <li key={a._id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{a.topic || "Counselling"}</p>
                    <p className="mt-1 text-xs text-muted">
                      {a.user?.name} · {a.user?.email} · {a.mobile_number || a.user?.mobile_number}
                    </p>
                    {a.query && <p className="mt-2 text-sm text-muted">{a.query}</p>}
                  </div>
                  <span className="flex-none rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-600">
                    {COUNSELLING_STATUS_LABEL[a.status] || a.status}
                  </span>
                </div>

                {/* status controls */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(a._id, s)}
                      disabled={busyId === a._id || a.status === s}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
                        a.status === s
                          ? "border-ink bg-ink text-white"
                          : "border-line text-ink hover:border-ink/30"
                      }`}
                    >
                      {COUNSELLING_STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>

                {/* notes */}
                {a.notes?.length > 0 && (
                  <ul className="mt-3 space-y-1 border-t border-line pt-2">
                    {a.notes.map((n, i) => (
                      <li key={i} className="text-xs text-muted">• {n.note}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 flex gap-2">
                  <input
                    value={noteDraft[a._id] || ""}
                    onChange={(e) =>
                      setNoteDraft((d) => ({ ...d, [a._id]: e.target.value }))
                    }
                    placeholder="Add a consultation / follow-up note…"
                    className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-ink focus:bg-white"
                  />
                  <button
                    onClick={() => addNote(a._id)}
                    disabled={busyId === a._id || !(noteDraft[a._id] || "").trim()}
                    className="flex-none rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink transition hover:border-ink/30 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
