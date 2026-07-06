import { useEffect, useState } from "react";
import { ticketApi, TICKET_STATUS_LABEL } from "../../features/ticket/ticket.api";
import TicketThread from "../../components/TicketThread";
import Spinner from "../../components/ui/Spinner";

const getError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const admissionLabel = (a) =>
  !a ? null : `${a.board === "Other" ? a.customBoard : a.board} · Class ${a.classType}${a.program ? ` · ${a.program}` : ""}`;

const FILTERS = [
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
  { key: "", label: "All" },
];

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("open");
  const [selectedId, setSelectedId] = useState(null);

  const loadTickets = async (status = filter) => {
    const res = await ticketApi.all(status || undefined);
    setTickets(res?.data?.data ?? []);
  };

  const load = async (status = filter) => {
    setLoading(true);
    setError(null);
    try {
      await loadTickets(status);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Support Tickets</h1>
      <p className="mt-1 text-sm text-muted">
        Answer student questions and share resources on their admissions.
      </p>

      <div className="mt-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              filter === f.key ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
      )}

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted">
          <Spinner className="h-4 w-4" /> Loading tickets…
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div>
            {tickets.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
                No tickets here.
              </p>
            ) : (
              <ul className="space-y-2">
                {tickets.map((t) => (
                  <li key={t._id}>
                    <button
                      onClick={() => setSelectedId(t._id)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        selectedId === t._id ? "border-ink bg-white" : "border-line bg-white hover:border-ink/30"
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
                      <p className="mt-1 truncate text-xs text-muted">
                        {t.student?.name} · {t.student?.email}
                      </p>
                      {t.admission && (
                        <p className="mt-0.5 truncate text-xs text-muted">{admissionLabel(t.admission)}</p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            {selectedId ? (
              <TicketThread ticketId={selectedId} isStaff onChange={() => loadTickets()} />
            ) : (
              tickets.length > 0 && (
                <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
                  Select a ticket to view and reply.
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
