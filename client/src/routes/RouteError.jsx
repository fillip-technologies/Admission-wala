import { useRouteError, Link } from "react-router-dom";
import { PATHS } from "./paths";

export default function RouteError() {
  const error = useRouteError();
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-4 text-center">
      <div>
        <p className="font-display text-5xl font-extrabold text-ink">Oops</p>
        <p className="mt-3 text-muted">
          {error?.statusText || error?.message || "Something went wrong."}
        </p>
        <Link
          to={PATHS.HOME}
          className="mt-6 inline-block rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
