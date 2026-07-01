import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/auth.slice";

export default function Profile() {
  const user = useAppSelector(selectUser);
  const rows = [
    ["Name", user?.name],
    ["Email", user?.email],
    ["Mobile", user?.mobile_number],
    ["Role", user?.role],
  ];
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Profile</h1>
      <div className="mt-6 max-w-md rounded-2xl border border-line bg-white p-6">
        <dl className="divide-y divide-line">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between py-3 text-sm">
              <dt className="text-muted">{k}</dt>
              <dd className="font-semibold capitalize text-ink">{v || "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
