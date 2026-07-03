import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import PageLoader from "../components/ui/PageLoader";
import { PATHS } from "../routes/paths";

// Centered card shell for /login and /signup.
export default function AuthLayout() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md">
        <Link to={PATHS.HOME} className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm font-bold text-saffron">
            SAG
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Shri Admission <span className="text-saffron">Gurukul</span>
          </span>
        </Link>
        <p className="mb-6 -mt-4 text-center text-xs text-muted">A unit of Tribac Blue</p>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-7">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
