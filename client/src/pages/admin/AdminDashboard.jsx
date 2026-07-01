import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStudents,
  selectStudents,
  
} from "../../features/admin/admin.slice";

export default function AdminDashboard() {

  const dispatch = useDispatch();

  const students = useSelector(selectStudents);
  useEffect(() => {
      dispatch(getAllStudents());
    }, [dispatch]);

  const stats = [
    { label: "Total students", value: students.length },
    { label: "Pending admissions", value: "—" },
    { label: "Counselling requests", value: "—" },
    { label: "Lead conversions", value: "—" },
  ];
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Admin overview</h1>
      <p className="mt-1 text-sm text-muted">Portal activity at a glance.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
