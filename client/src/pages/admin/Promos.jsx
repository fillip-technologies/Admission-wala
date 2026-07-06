import { useEffect, useState } from "react";
import { promoApi } from "../../features/promo/promo.api";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const empty = { title: "", text: "", ctaLabel: "", ctaHref: "", order: 0, active: true };

export default function Promos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await promoApi.listAll();
      setItems(res?.data?.data ?? []);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm(empty);
    setEditingId(null);
  };

  const save = async () => {
    if (!form.title.trim()) {
      setError("Slide title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title.trim(),
      text: form.text.trim(),
      ctaLabel: form.ctaLabel.trim(),
      ctaHref: form.ctaHref.trim(),
      order: Number(form.order) || 0,
      active: form.active,
    };
    try {
      if (editingId) await promoApi.update(editingId, payload);
      else await promoApi.create(payload);
      resetForm();
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setForm({
      title: s.title,
      text: s.text || "",
      ctaLabel: s.ctaLabel || "",
      ctaHref: s.ctaHref || "",
      order: s.order ?? 0,
      active: s.active,
    });
  };

  const toggleActive = async (s) => {
    setBusyId(s._id);
    setError(null);
    try {
      await promoApi.update(s._id, { active: !s.active });
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (s) => {
    if (!window.confirm("Delete this slide?")) return;
    setBusyId(s._id);
    setError(null);
    try {
      await promoApi.remove(s._id);
      if (editingId === s._id) resetForm();
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Promo Banner</h1>
      <p className="mt-1 text-sm text-muted">
        Manage the rotating banner shown below the hero on the home page. Only active slides appear;
        lower order numbers show first.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
      )}

      {/* create / edit form */}
      <div className="mt-5 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold text-ink">
          {editingId ? "Edit slide" : "New slide"}
        </h2>
        <div className="mt-3 space-y-3">
          <Field
            label="Title"
            name="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Admissions Open for 2026-27 Session"
          />
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-ink">Text</span>
            <textarea
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              rows={2}
              placeholder="Short supporting line for the slide."
              className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Button label"
              name="ctaLabel"
              value={form.ctaLabel}
              onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
              placeholder="e.g. Apply Now"
            />
            <Field
              label="Button link"
              name="ctaHref"
              value={form.ctaHref}
              onChange={(e) => setForm((f) => ({ ...f, ctaHref: e.target.value }))}
              placeholder="/signup or /#courses"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-ink">Order</span>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                className="w-24 rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              />
            </label>
            <label className="mt-5 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4 w-4 rounded border-line"
              />
              Active
            </label>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={save} disabled={saving} className="px-5 py-2 text-sm">
            {saving ? <Spinner className="h-4 w-4" /> : editingId ? "Save changes" : "Add slide"}
          </Button>
          {editingId && (
            <button
              onClick={resetForm}
              className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink/30"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* list */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Spinner className="h-4 w-4" /> Loading…
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
            No slides yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((s) => (
              <li key={s._id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-semibold text-muted">
                        #{s.order}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          s.active ? "bg-teal-deep/10 text-teal-deep" : "bg-ink/5 text-muted"
                        }`}
                      >
                        {s.active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <p className="mt-1.5 font-semibold text-ink">{s.title}</p>
                    {s.text && <p className="mt-0.5 text-sm text-muted">{s.text}</p>}
                    {s.ctaLabel && (
                      <p className="mt-1 text-xs text-muted">
                        Button: <span className="font-semibold text-ink">{s.ctaLabel}</span>
                        {s.ctaHref ? ` → ${s.ctaHref}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-none flex-col items-end gap-1.5">
                    <button
                      onClick={() => toggleActive(s)}
                      disabled={busyId === s._id}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-ink/30 disabled:opacity-50"
                    >
                      {s.active ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => startEdit(s)}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-ink/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(s)}
                      disabled={busyId === s._id}
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
