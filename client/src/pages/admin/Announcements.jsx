import { useEffect, useState } from "react";
import { announcementApi } from "../../features/announcement/announcement.api";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const empty = { text: "", tag: "", href: "", active: true };

export default function Announcements() {
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
      const res = await announcementApi.listAll();
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
    if (!form.text.trim()) {
      setError("Announcement text is required.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      text: form.text.trim(),
      tag: form.tag.trim(),
      href: form.href.trim(),
      active: form.active,
    };
    try {
      if (editingId) await announcementApi.update(editingId, payload);
      else await announcementApi.create(payload);
      resetForm();
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (a) => {
    setEditingId(a._id);
    setForm({ text: a.text, tag: a.tag || "", href: a.href || "", active: a.active });
  };

  const toggleActive = async (a) => {
    setBusyId(a._id);
    setError(null);
    try {
      await announcementApi.update(a._id, { active: !a.active });
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (a) => {
    if (!window.confirm("Delete this announcement?")) return;
    setBusyId(a._id);
    setError(null);
    try {
      await announcementApi.remove(a._id);
      if (editingId === a._id) resetForm();
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Announcements</h1>
      <p className="mt-1 text-sm text-muted">
        Manage the notifications shown in the site's notification bell. Only active ones appear.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
      )}

      {/* create / edit form */}
      <div className="mt-5 rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold text-ink">
          {editingId ? "Edit announcement" : "New announcement"}
        </h2>
        <div className="mt-3 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-ink">Text</span>
            <textarea
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              rows={2}
              maxLength={240}
              placeholder="e.g. NIOS admissions for Class 10th, 11th & 12th are now open."
              className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Tag (optional)"
              name="tag"
              value={form.tag}
              onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
              placeholder="e.g. New"
            />
            <Field
              label="Link (optional)"
              name="href"
              value={form.href}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              placeholder="/#counselling or https://…"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="h-4 w-4 rounded border-line"
            />
            Active (visible on the site)
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={save} disabled={saving} className="px-5 py-2 text-sm">
            {saving ? <Spinner className="h-4 w-4" /> : editingId ? "Save changes" : "Add announcement"}
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
            No announcements yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((a) => (
              <li key={a._id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {a.tag && (
                        <span className="rounded-full bg-saffron px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                          {a.tag}
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          a.active ? "bg-teal-deep/10 text-teal-deep" : "bg-ink/5 text-muted"
                        }`}
                      >
                        {a.active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink">{a.text}</p>
                    {a.href && <p className="mt-1 truncate text-xs text-muted">{a.href}</p>}
                  </div>
                  <div className="flex flex-none flex-col items-end gap-1.5">
                    <button
                      onClick={() => toggleActive(a)}
                      disabled={busyId === a._id}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-ink/30 disabled:opacity-50"
                    >
                      {a.active ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => startEdit(a)}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-ink/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(a)}
                      disabled={busyId === a._id}
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
