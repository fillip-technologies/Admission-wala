import { useEffect, useState } from "react";
import { programApi } from "../../features/program/program.api";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const empty = { name: "", category: "", href: "", order: 0, active: true };

export default function Programs() {
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
      const res = await programApi.listAll();
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
    if (!form.name.trim()) {
      setError("Program name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      href: form.href.trim(),
      order: Number(form.order) || 0,
      active: form.active,
    };
    try {
      if (editingId) await programApi.update(editingId, payload);
      else await programApi.create(payload);
      resetForm();
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      category: p.category || "",
      href: p.href || "",
      order: p.order ?? 0,
      active: p.active,
    });
  };

  const toggleActive = async (p) => {
    setBusyId(p._id);
    setError(null);
    try {
      await programApi.update(p._id, { active: !p.active });
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    setBusyId(p._id);
    setError(null);
    try {
      await programApi.remove(p._id);
      if (editingId === p._id) resetForm();
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Hero Programs</h1>
      <p className="mt-1 text-sm text-muted">
        Manage the moving strip of admission courses shown in the home-page hero. Only active
        programs appear; lower order numbers show first. Add or delete any course any time.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
      )}

      {/* create / edit form */}
      <div className="mt-5 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold text-ink">
          {editingId ? "Edit program" : "New program"}
        </h2>
        <div className="mt-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. NEET Admission"
            />
            <Field
              label="Category (optional)"
              name="category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="e.g. Competitive Exam"
            />
          </div>
          <Field
            label="Link (optional)"
            name="href"
            value={form.href}
            onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
            placeholder="/#courses or /signup"
          />
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
            {saving ? <Spinner className="h-4 w-4" /> : editingId ? "Save changes" : "Add program"}
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
            No programs yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((p) => (
              <li key={p._id} className="rounded-2xl border border-line bg-white p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-semibold text-muted">
                      #{p.order}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        p.active ? "bg-teal-deep/10 text-teal-deep" : "bg-ink/5 text-muted"
                      }`}
                    >
                      {p.active ? "Active" : "Hidden"}
                    </span>
                    <span className="truncate font-semibold text-ink">{p.name}</span>
                    {p.category && (
                      <span className="hidden truncate text-xs text-muted sm:inline">· {p.category}</span>
                    )}
                  </div>
                  <div className="flex flex-none items-center gap-1.5">
                    <button
                      onClick={() => toggleActive(p)}
                      disabled={busyId === p._id}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-ink/30 disabled:opacity-50"
                    >
                      {p.active ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => startEdit(p)}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-ink/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p)}
                      disabled={busyId === p._id}
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
