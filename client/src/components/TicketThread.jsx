import { useEffect, useState } from "react";
import { ticketApi, TICKET_STATUS_LABEL } from "../features/ticket/ticket.api";
import Button from "./ui/Button";
import Spinner from "./ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const fmt = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

const admissionLabel = (a) =>
  !a ? null : `${a.board === "Other" ? a.customBoard : a.board} · Class ${a.classType}${a.program ? ` · ${a.program}` : ""}`;

// Shared ticket conversation panel. `isStaff` unlocks resource sharing and the
// open/close control; students get a plain reply box.
export default function TicketThread({ ticketId, isStaff = false, onChange }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [body, setBody] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceLabel, setResourceLabel] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ticketApi.get(ticketId);
      setTicket(res?.data?.data ?? null);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const send = async () => {
    if (!body.trim() && !resourceUrl.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await ticketApi.addMessage(ticketId, {
        body: body.trim() || undefined,
        resourceUrl: resourceUrl.trim() || undefined,
        resourceLabel: resourceLabel.trim() || undefined,
      });
      setBody("");
      setResourceUrl("");
      setResourceLabel("");
      await load();
      onChange?.();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (status) => {
    setBusy(true);
    setError(null);
    try {
      await ticketApi.updateStatus(ticketId, { status });
      await load();
      onChange?.();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner className="h-4 w-4" /> Loading conversation…
      </div>
    );
  }
  if (!ticket) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
        {error || "Ticket not found"}
      </p>
    );
  }

  const closed = ticket.status === "closed";

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-ink">{ticket.subject}</h3>
          {isStaff && (
            <p className="mt-0.5 text-xs text-muted">
              {ticket.student?.name} · {ticket.student?.email}
              {ticket.student?.mobile_number ? ` · ${ticket.student.mobile_number}` : ""}
            </p>
          )}
          {ticket.admission && (
            <p className="mt-0.5 text-xs text-muted">Re: {admissionLabel(ticket.admission)}</p>
          )}
        </div>
        <div className="flex flex-none items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              closed ? "bg-ink/5 text-muted" : "bg-teal-deep/10 text-teal-deep"
            }`}
          >
            {TICKET_STATUS_LABEL[ticket.status] || ticket.status}
          </span>
          {isStaff && (
            <button
              onClick={() => setStatus(closed ? "open" : "closed")}
              disabled={busy}
              className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink transition hover:border-ink/30 disabled:opacity-50"
            >
              {closed ? "Reopen" : "Close"}
            </button>
          )}
        </div>
      </div>

      {/* messages */}
      <ul className="mt-4 space-y-3 border-t border-line pt-4">
        {ticket.messages.length === 0 && (
          <li className="text-sm text-muted">No messages yet.</li>
        )}
        {ticket.messages.map((m) => {
          const fromStaff = m.senderRole === "counseller" || m.senderRole === "admin";
          return (
            <li
              key={m._id}
              className={`rounded-xl px-3.5 py-2.5 ${
                fromStaff ? "bg-saffron/10" : "bg-canvas"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-ink">
                  {m.sender?.name || (fromStaff ? "Counsellor" : "Student")}
                  <span className="ml-1 font-normal capitalize text-muted">· {m.senderRole}</span>
                </span>
                <span className="text-[11px] text-muted">{fmt(m.at)}</span>
              </div>
              {m.body && <p className="mt-1 text-sm leading-relaxed text-ink/90">{m.body}</p>}
              {m.resourceUrl && (
                <a
                  href={m.resourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-saffron/40 bg-white px-2.5 py-1 text-xs font-semibold text-saffron-600 hover:bg-saffron/10"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
                    <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
                  </svg>
                  {m.resourceLabel || "Resource"}
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
      )}

      {/* reply box */}
      {closed ? (
        <p className="mt-4 rounded-lg bg-ink/5 px-3 py-2 text-sm text-muted">
          This ticket is closed.{isStaff ? " Reopen it to continue the conversation." : ""}
        </p>
      ) : (
        <div className="mt-4 space-y-2 border-t border-line pt-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder={isStaff ? "Ask a question or reply…" : "Write your reply…"}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-ink focus:bg-white"
          />
          {isStaff && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="Resource link (optional)"
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-ink focus:bg-white"
              />
              <input
                value={resourceLabel}
                onChange={(e) => setResourceLabel(e.target.value)}
                placeholder="Resource label"
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-ink focus:bg-white sm:w-48"
              />
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={send} disabled={busy || (!body.trim() && !resourceUrl.trim())} className="px-5 py-2 text-sm">
              {busy ? <Spinner className="h-4 w-4" /> : "Send"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
