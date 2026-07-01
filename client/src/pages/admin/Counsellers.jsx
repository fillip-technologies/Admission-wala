// TODO: create features/counsellers/ with counsellers.api.js + counsellers.slice.js
//       following the same pattern as features/admin/.
//
// API you'll likely need:
//   GET  /admin/counsellers          -> fetch all counsellers
//   POST /admin/counsellers          -> add a counseller
//   PUT  /admin/counsellers/:id      -> update
//   DEL  /admin/counsellers/:id      -> remove

export default function Counsellers() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Counsellers</h1>
      <p className="mt-1 text-sm text-muted">
        Manage counseller accounts, lead allocation and performance tracking.
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-muted">
        Counsellers table goes here — wire up once the backend route is ready.
      </div>
    </div>
  );
}