import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-6xl font-extrabold text-ink">404</p>
        <p className="mt-3 text-muted">We couldn't find that page.</p>
        <Link to={PATHS.HOME} className="mt-6 inline-block rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white">
          Back home
        </Link>
      </div>
    </div>
  );
}
