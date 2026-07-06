import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/auth.slice";

const initials = (name) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "U";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

function InfoCard({ icon, label, value, className = "" }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border border-line bg-white p-4 ${className}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink/5 text-ink">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 truncate font-semibold text-ink">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const user = useAppSelector(selectUser);
  const verified = !!user?.isEmailVerified;

  return (
    <div className="mx-auto max-w-3xl">
      {/* header card */}
      <div className="overflow-hidden rounded-3xl border border-line bg-white">
        <div className="h-24 bg-gradient-to-r from-ink to-ink-soft sm:h-28" />
        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-10 flex flex-col items-start gap-4 sm:-mt-12 sm:flex-row sm:items-end">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-4 border-white bg-saffron text-2xl font-bold text-ink shadow-sm sm:h-24 sm:w-24">
              {initials(user?.name)}
            </span>
            <div className="min-w-0 flex-1 pb-1">
              <h2 className="truncate font-display text-xl font-bold text-ink sm:text-2xl">
                {user?.name || "—"}
              </h2>
              <p className="truncate text-sm text-muted">{user?.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold capitalize text-ink">
                {user?.role || "student"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  verified
                    ? "bg-teal-deep/10 text-teal-deep"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${verified ? "bg-teal-deep" : "bg-amber-500"}`} />
                {verified ? "Email verified" : "Not verified"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* details */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoCard
          label="Email"
          value={user?.email}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 5L2 7" />
            </svg>
          }
        />
        <InfoCard
          label="Mobile"
          value={user?.mobile_number}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          }
        />
        <InfoCard
          label="Role"
          value={user?.role}
          className="capitalize"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />
        <InfoCard
          label="Member since"
          value={formatDate(user?.createdAt)}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
