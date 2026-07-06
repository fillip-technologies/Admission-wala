import { useEffect, useState } from "react";
import { ticketApi, TICKET_STATUS_LABEL } from "../../features/ticket/ticket.api";
import { admissionApi } from "../../features/admission/admission.api";
import TicketThread from "../../components/TicketThread";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const admissionLabel = (a) =>
  `${a.board === "Other" ? a.customBoard : a.board} · Class ${a.classType}${a.program ? ` · ${a.program}` : ""}`;

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", admission: "", message: "" });
  const [creating, setCreating] = useState(false);

  const loadTickets = async () => {
    const res = await ticketApi.mine();
    setTickets(res?.data?.data ?? []);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [, admRes] = await Promise.all([
        loadTickets(),
        admissionApi.mine(),
      ]);
      setAdmissions(admRes?.data?.data ?? []);
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

  const create = async () => {
    if (!form.subject.trim()) {
      setError("Please enter a subject.");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const res = await ticketApi.create({
        subject: form.subject.trim(),
        admission: form.admission || undefined,
        message: form.message.trim() || undefined,
      });
      setForm({ subject: "", admission: "", message: "" });
      setShowForm(false);
      await loadTickets();
      setSelectedId(res?.data?.data?._id ?? null);
    } catch (err) {
      setError(getError(err));
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner className="h-4 w-4" /> Loading tickets…
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Support Tickets</h1>
          <p className="mt-1 text-sm text-muted">
            Ask questions about your admissions and get resources from your counsellor.
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} className="flex-none px-4 py-2 text-sm">
          {showForm ? "Cancel" : "New ticket"}
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
      )}

      {/* new ticket form */}
      {showForm && (
        <div className="mt-4 rounded-2xl border border-line bg-white p-5">
          <div className="space-y-3">
            <Field
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="e.g. Question about NIOS documents"
            />
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-ink">Related application (optional)</span>
              <select
                value={form.admission}
                onChange={(e) => setForm((f) => ({ ...f, admission: e.target.value }))}
                className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
              >
                <option value="">Not about a specific application</option>
                {admissions.map((a) => (
                  <option key={a._id} value={a._id}>
                    {admissionLabel(a)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-ink">Message (optional)</span>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={3}
                placeholder="Describe your question…"
                className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:bg-white focus:ring-2 focus:ring-ink/10"
              />
            </label>
          </div>
          <Button onClick={create} disabled={creating} className="mt-4 w-full">
            {creating ? <><Spinner className="h-4 w-4" /> Creating…</> : "Create ticket"}
          </Button>
        </div>
      )}

      {/* ticket list */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <div>
          {tickets.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
              No tickets yet. Create one to ask a question.
            </p>
          ) : (
            <ul className="space-y-2">
              {tickets.map((t) => (
                <li key={t._id}>
                  <button
                    onClick={() => setSelectedId(t._id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      selectedId === t._id
                        ? "border-ink bg-white"
                        : "border-line bg-white hover:border-ink/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-ink">{t.subject}</span>
                      <span
                        className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          t.status === "closed" ? "bg-ink/5 text-muted" : "bg-teal-deep/10 text-teal-deep"
                        }`}
                      >
                        {TICKET_STATUS_LABEL[t.status]}
                      </span>
                    </div>
                    {t.admission && (
                      <p className="mt-1 truncate text-xs text-muted">{admissionLabel(t.admission)}</p>
                    )}
                    <p className="mt-1 text-xs text-muted">{t.messages?.length || 0} message(s)</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          {selectedId ? (
            <TicketThread ticketId={selectedId} onChange={loadTickets} />
          ) : (
            tickets.length > 0 && (
              <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
                Select a ticket to view the conversation.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
