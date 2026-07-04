import { Fragment, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getAllEnquiry,
  selectEnquiries,
  selectEnquiriesLoading,
  selectEnquiriesError,
} from "../../features/admin/admin.slice";
import Spinner from "../../components/ui/Spinner";

// Matches your enquirySchema enums exactly
const ENQUIRY_TYPES = ["All", "NIOS", "BBOSE", "BOSSE", "Other"];
const CLASS_TYPES   = ["All", "10th", "12th"];
const ROLES         = ["All", "student", "guest"];

export default function Enquiry() {
  const dispatch  = useAppDispatch();
  const enquiries = useAppSelector(selectEnquiries);
  const loading   = useAppSelector(selectEnquiriesLoading);
  const error     = useAppSelector(selectEnquiriesError);

  const [search,      setSearch]      = useState("");
  const [filterBoard, setFilterBoard] = useState("All");
  const [filterClass, setFilterClass] = useState("All");
  const [filterRole,  setFilterRole]  = useState("All");
  const [expanded,    setExpanded]    = useState(null); // _id of expanded row

  useEffect(() => {
    if (enquiries.length === 0) dispatch(getAllEnquiry());
  }, [dispatch, enquiries.length]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((e) => {
      const matchSearch =
        !q ||
        e.email?.toLowerCase().includes(q) ||
        e.mobile_number?.includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        // user may be populated as an object from backend
        e.user?.name?.toLowerCase().includes(q) ||
        e.user?.email?.toLowerCase().includes(q);

      const matchBoard = filterBoard === "All" || e.enquiryType === filterBoard;
      const matchClass = filterClass === "All" || e.classType === filterClass;
      const matchRole  = filterRole  === "All" || e.role === filterRole;

      return matchSearch && matchBoard && matchClass && matchRole;
    });
  }, [enquiries, search, filterBoard, filterClass, filterRole]);

  const resetFilters = () => {
    setSearch(""); setFilterBoard("All"); setFilterClass("All"); setFilterRole("All");
  };
  const filtersActive = search || filterBoard !== "All" || filterClass !== "All" || filterRole !== "All";

  return (
    <div>
      {/* ── header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Enquiries</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "Loading…" : `${enquiries.length} total · ${filtered.length} shown`}
          </p>
        </div>

        <button
          onClick={() => dispatch(getAllEnquiry())}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink/30 disabled:opacity-50"
        >
          {loading
            ? <Spinner className="h-3.5 w-3.5" />
            : <RefreshIcon />}
          Refresh
        </button>
      </div>

      {/* ── filters row ── */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {/* search */}
        <div className="relative min-w-[200px] flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, mobile, description…"
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </div>

        {/* board filter */}
        <Filter label="Board" value={filterBoard} options={ENQUIRY_TYPES} onChange={setFilterBoard} />
        <Filter label="Class" value={filterClass} options={CLASS_TYPES}   onChange={setFilterClass} />
        <Filter label="Role"  value={filterRole}  options={ROLES}         onChange={setFilterRole}  />

        {filtersActive && (
          <button
            onClick={resetFilters}
            className="rounded-xl border border-line bg-white px-3 py-2.5 text-xs font-semibold text-muted transition hover:border-ink/30 hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── error ── */}
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {/* ── table ── */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        {loading && enquiries.length === 0 ? (
          <div className="grid place-items-center py-20">
            <Spinner className="h-7 w-7" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted">
            {filtersActive ? "No enquiries match your filters." : "No enquiries yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="border-b border-line bg-canvas">
                <tr>
                  {["#", "Contact", "Board", "Class", "Role", "Description", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-muted whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((e, i) => (
                  <Fragment key={e._id}>
                    <tr className="transition hover:bg-canvas/60">
                      <td className="px-4 py-4 text-xs font-medium text-muted/60">{i + 1}</td>

                      {/* contact — email + mobile_number (your actual schema fields) */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-saffron">
                            {(e.user?.name || e.email || "?")[0]?.toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            {e.user?.name && (
                              <p className="truncate font-semibold text-ink">{e.user.name}</p>
                            )}
                            <p className={`truncate ${e.user?.name ? "text-xs text-muted" : "font-semibold text-ink"}`}>
                              {e.email}
                            </p>
                            <p className="mt-0.5 text-xs text-muted">{e.mobile_number || "—"}</p>
                          </div>
                        </div>
                      </td>

                      {/* enquiryType */}
                      <td className="px-4 py-4">
                        <BoardBadge type={e.enquiryType === "Other" ? (e.customBoard || "Other") : e.enquiryType} />
                      </td>

                      {/* classType */}
                      <td className="px-4 py-4">
                        <ClassBadge type={e.classType} />
                      </td>

                      {/* role (student | guest) */}
                      <td className="px-4 py-4">
                        <RoleBadge role={e.role} />
                      </td>

                      {/* description — truncated, expandable */}
                      <td className="max-w-[240px] px-4 py-4 text-muted">
                        <p className="line-clamp-2">{e.description || "—"}</p>
                      </td>

                      {/* createdAt */}
                      <td className="px-4 py-4 text-muted whitespace-nowrap">
                        {formatDate(e.createdAt)}
                      </td>

                      {/* expand toggle (shows full description) */}
                      <td className="px-4 py-4 text-right">
                        {e.description && (
                          <button
                            onClick={() => setExpanded(expanded === e._id ? null : e._id)}
                            className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-saffron-600 transition hover:border-saffron-600/40"
                          >
                            {expanded === e._id ? "Less" : "More"}
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* expanded description row */}
                    {expanded === e._id && (
                      <tr className="bg-canvas/50">
                        <td />
                        <td colSpan={7} className="px-4 pb-4">
                          <div className="rounded-xl border border-line bg-white p-3 text-sm text-ink">
                            {e.description}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── summary chips ── */}
      {!loading && enquiries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {ENQUIRY_TYPES.slice(1).map((t) => {
            const count = enquiries.filter((e) => e.enquiryType === t).length;
            return (
              <button
                key={t}
                onClick={() => setFilterBoard(filterBoard === t ? "All" : t)}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  filterBoard === t
                    ? "bg-ink text-white"
                    : "border border-line bg-white text-ink hover:border-ink/30"
                }`}
              >
                {t}: {count}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


function BoardBadge({ type }) {
  const styles = {
    NIOS:  "bg-indigo-deep/10 text-indigo-deep",
    BBOSE: "bg-saffron/15 text-saffron-600",
    BOSSE: "bg-teal-deep/10 text-teal-deep",
  };
  if (!type) return <span className="text-muted">—</span>;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[type] || "bg-ink/10 text-ink"}`}>
      {type}
    </span>
  );
}

// Matches your classType enum: "10th" | "12th"
function ClassBadge({ type }) {
  if (!type) return <span className="text-muted">—</span>;
  return (
    <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-ink">
      {type}
    </span>
  );
}

// Matches your role enum: "student" | "guest"
function RoleBadge({ role }) {
  const styles = {
    student: "bg-teal-deep/10 text-teal-deep",
    guest:   "bg-ink/10 text-ink",
  };
  if (!role) return <span className="text-muted">—</span>;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[role] || "bg-ink/10 text-ink"}`}>
      {role}
    </span>
  );
}

// ─── Shared small components ─────────────────────────────────────────────────

function Filter({ label, value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-semibold text-ink outline-none transition hover:border-ink/30 focus:border-ink focus:ring-2 focus:ring-ink/10"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "All" ? `${label}: All` : o}
        </option>
      ))}
    </select>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}