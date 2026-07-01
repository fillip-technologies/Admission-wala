import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/auth.slice";

export default function StudentDashboard() {
  const user = useAppSelector(selectUser);
  const cards = [
    { label: "Admission status", value: "Not started", hint: "Begin your application" },
    { label: "Counselling", value: "Not booked", hint: "Book a free session" },
    { label: "Documents", value: "0 uploaded", hint: "Upload when you apply" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">
        Welcome, {user?.name?.split(" ")[0] || "Student"} 👋
      </h1>
      <p className="mt-1 text-sm text-muted">Here's a snapshot of your admission journey.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-white p-5">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-1 font-display text-xl font-bold text-ink">{c.value}</p>
            <p className="mt-2 text-xs text-muted">{c.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
