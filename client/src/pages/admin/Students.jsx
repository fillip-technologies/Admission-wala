import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getAllStudents,
  selectStudents,
  selectStudentsLoading,
  selectStudentsError,
} from "../../features/admin/admin.slice";
import Spinner from "../../components/ui/Spinner";

const COLS = ["Name", "Email", "Mobile", "Role", "Joined"];

export default function Students() {
  const dispatch = useAppDispatch();
  const students = useAppSelector(selectStudents);
  const loading  = useAppSelector(selectStudentsLoading);
  const error    = useAppSelector(selectStudentsError);

  const [search, setSearch] = useState("");

  useEffect(() => {
    // Only fetch if not already loaded (avoids redundant network call when
    // coming back from another admin tab that already fetched the list).
    if (students.length === 0) dispatch(getAllStudents());
  }, [dispatch, students.length]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.mobile_number?.includes(q),
    );
  }, [students, search]);

  return (
    <div>
      {/* header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Students</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "Loading…" : `${students.length} total · ${filtered.length} shown`}
          </p>
        </div>

        {/* search */}
        <div className="relative w-full max-w-xs">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, mobile…"
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </div>
      </div>

      {/* refresh button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => dispatch(getAllStudents())}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink/30 disabled:opacity-50"
        >
          {loading ? <Spinner className="h-3.5 w-3.5" /> : (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          )}
          Refresh
        </button>
      </div>

      {/* error */}
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {/* table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
        {loading && students.length === 0 ? (
          <div className="grid place-items-center py-20">
            <Spinner className="h-7 w-7" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted">
            {search ? "No students match your search." : "No students registered yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-canvas">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                    #
                  </th>
                  {COLS.map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((s, i) => (
                  <tr key={s._id} className="transition hover:bg-canvas/70">
                    <td className="px-4 py-3 text-xs text-muted/60">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* avatar initial */}
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-semibold text-xs text-saffron">
                          {s.name?.[0]?.toUpperCase() || "?"}
                        </span>
                        <span className="font-semibold text-ink">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{s.email}</td>
                    <td className="px-4 py-3 text-muted">{s.mobile_number}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={s.role} />
                    </td>
                    <td className="px-4 py-3 text-muted">{formatDate(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const styles = {
    student: "bg-teal-deep/10 text-teal-deep",
    admin:   "bg-saffron/15 text-saffron-600",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[role] || "bg-ink/10 text-ink"}`}>
      {role || "—"}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}