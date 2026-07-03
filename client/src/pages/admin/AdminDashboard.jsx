import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getAllStudents,
  getAllEnquiry,
  selectStudents,
  selectStudentsLoading,
  selectEnquiries,
  selectEnquiriesLoading,
} from "../../features/admin/admin.slice";
import { PATHS } from "../../routes/paths";
import Spinner from "../../components/ui/Spinner";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();

  const students         = useAppSelector(selectStudents);
  const studentsLoading  = useAppSelector(selectStudentsLoading);
  const enquiries        = useAppSelector(selectEnquiries);
  const enquiriesLoading = useAppSelector(selectEnquiriesLoading);

  useEffect(() => {
    dispatch(getAllStudents());
    dispatch(getAllEnquiry());
  }, [dispatch]);

  const stats = [
    {
      label: "Total students",
      value: studentsLoading ? null : students.length,
      link: PATHS.ADMIN.STUDENTS,
      color: "bg-indigo-deep/10 text-indigo-deep",
    },
    {
      label: "Enquiries",
      value: enquiriesLoading ? null : enquiries.length,
      link: PATHS.ADMIN.ENQUIRY,
      color: "bg-saffron/15 text-saffron-600",
    },
    {
      label: "Pending admissions",
      value: "—",
      color: "bg-teal-deep/10 text-teal-deep",
    },
   
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Admin overview</h1>
      <p className="mt-1 text-sm text-muted">Portal activity at a glance.</p>

      {/* stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* recent students preview */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Recent students</h2>
          <Link to={PATHS.ADMIN.STUDENTS} className="text-sm font-semibold text-saffron-600 hover:underline">
            View all →
          </Link>
        </div>

        {studentsLoading ? (
          <div className="grid place-items-center rounded-2xl border border-line bg-white py-12">
            <Spinner className="h-6 w-6" />
          </div>
        ) : students.length === 0 ? (
          <EmptyBox text="No students yet." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-canvas">
                <tr>
                  {["Name", "Email", "Mobile", "Joined"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {students.slice(0, 5).map((s) => (
                  <tr key={s._id} className="transition hover:bg-canvas/60">
                    <td className="px-4 py-3 font-semibold text-ink">{s.name}</td>
                    <td className="px-4 py-3 text-muted">{s.email}</td>
                    <td className="px-4 py-3 text-muted">{s.mobile_number}</td>
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

function StatCard({ label, value, link, color }) {
  const inner = (
    <div className={`rounded-2xl border border-line bg-white p-5 transition ${link ? "cursor-pointer hover:border-ink/20 hover:shadow-sm" : ""}`}>
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-2 inline-flex items-center rounded-lg px-3 py-1 font-display text-2xl font-bold ${color}`}>
        {value === null ? <Spinner className="h-5 w-5" /> : value}
      </p>
    </div>
  );
  return link ? <Link to={link}>{inner}</Link> : inner;
}

function EmptyBox({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white py-12 text-center text-sm text-muted">
      {text}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}