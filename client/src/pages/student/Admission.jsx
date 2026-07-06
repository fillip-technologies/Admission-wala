import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { admissionApi } from "../../features/admission/admission.api";
import { boards, courses, admissionPrograms } from "../../data/courses";
import { ADMISSION_STEPS, STATUS_LABEL, stepIndex } from "../../features/admission/statuses";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const CLASS_TYPES = ["10th", "12th"];

function Timeline({ admission }) {
  const rejected = admission.status === "rejected";
  const current = stepIndex(admission.status);

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">
          {admission.board === "Other" ? admission.customBoard : admission.board} · Class {admission.classType}
          {admission.course ? ` · ${admission.course}` : ""}
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            rejected
              ? "bg-red-50 text-red-600"
              : admission.status === "approved"
                ? "bg-teal-deep/10 text-teal-deep"
                : "bg-saffron-100 text-saffron-600"
          }`}
        >
          {STATUS_LABEL[admission.status]}
        </span>
      </div>

      {rejected ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          Your application was rejected. Please contact your counsellor or re-apply.
        </p>
      ) : (
        <ol className="mt-6 space-y-4">
          {ADMISSION_STEPS.map((step, i) => {
            const done = i <= current;
            return (
              <li key={step.key} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-bold ${
                    done ? "bg-teal-deep text-white" : "bg-line text-muted"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${done ? "text-ink" : "text-muted"}`}>
                    {step.label}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {admission.documents?.length > 0 && (
        <div className="mt-6 border-t border-line pt-4">
          <p className="text-xs font-semibold text-ink">Uploaded documents</p>
          <ul className="mt-2 space-y-1">
            {admission.documents.map((doc, i) => (
              <li key={i}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-saffron-600 hover:underline"
                >
                  {doc.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Admission() {
  const [params] = useSearchParams();
  const presetCourse = params.get("course");

  const [admissions, setAdmissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    program: "",
    board: "",
    customBoard: "",
    classType: "",
    course: presetCourse || "",
  });
  const [files, setFiles] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await admissionApi.mine();
      const list = res?.data?.data ?? [];
      setAdmissions(list);
      // Show the form by default only when there are no applications yet.
      setShowForm(list.length === 0);
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

  // Courses available for the chosen board.
  const boardCourses = useMemo(
    () => (form.board ? courses.filter((c) => c.boards.includes(form.board)) : courses),
    [form.board],
  );

  const onSubmit = async () => {
    setError(null);
    if (!form.board || !form.classType) {
      setError("Please select a board and class.");
      return;
    }
    if (form.board === "Other" && !form.customBoard.trim()) {
      setError("Please enter your board name.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (form.program) fd.append("program", form.program);
      fd.append("board", form.board);
      if (form.board === "Other") fd.append("customBoard", form.customBoard.trim());
      fd.append("classType", form.classType);
      if (form.course) fd.append("course", form.course);
      files.forEach((file) => fd.append("documents", file));

      await admissionApi.create(fd);
      setForm({ program: "", board: "", customBoard: "", classType: "", course: "" });
      setFiles([]);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner className="h-4 w-4" /> Loading…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">My Admissions</h1>
          <p className="mt-1 text-sm text-muted">
            Track your applications or start a new one.
          </p>
        </div>
        {admissions.length > 0 && (
          <Button onClick={() => setShowForm((s) => !s)} className="flex-none px-4 py-2 text-sm">
            {showForm ? "Cancel" : "New application"}
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {admissions.map((a) => (
          <Timeline key={a._id} admission={a} />
        ))}

        {showForm && (
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-ink">Admission program</span>
                <select
                  name="program"
                  value={form.program}
                  onChange={onChange}
                  className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
                >
                  <option value="">Select a program</option>
                  {admissionPrograms.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-ink">Board</span>
                <select
                  name="board"
                  value={form.board}
                  onChange={onChange}
                  className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
                >
                  <option value="">Select a board</option>
                  {boards.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code} — {b.name}
                    </option>
                  ))}
                  <option value="Other">Other (enter your board)</option>
                </select>
              </label>

              {form.board === "Other" && (
                <Field
                  label="Your board name"
                  name="customBoard"
                  value={form.customBoard}
                  onChange={onChange}
                  placeholder="e.g. CBSE, State Board…"
                />
              )}

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-ink">Class</span>
                <select
                  name="classType"
                  value={form.classType}
                  onChange={onChange}
                  className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
                >
                  <option value="">Select a class</option>
                  {CLASS_TYPES.map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-ink">Course (optional)</span>
                <select
                  name="course"
                  value={form.course}
                  onChange={onChange}
                  className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
                >
                  <option value="">Select a course</option>
                  {boardCourses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-ink">
                  Documents (images or PDF, max 5MB each)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-saffron-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-saffron-600"
                />
                {files.length > 0 && (
                  <p className="mt-1 text-xs text-muted">{files.length} file(s) selected</p>
                )}
              </label>
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
                "Submit application"
              )}
            </Button>
          </div>
        )}
        {!showForm && error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
