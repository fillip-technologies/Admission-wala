import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser, selectAuth } from "../features/auth/auth.slice";
import Sidebar from "../components/Sidebar";
import PageLoader from "../components/ui/PageLoader";

// Shared shell for every logged-in area. Which links appear is driven purely
// by the user's role via navConfig, so one layout serves student + admin.
export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role;

  return (
    <div className="min-h-screen bg-canvas">
      {/* fixed sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-canvas lg:block">
        <Sidebar role={role} />
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-line bg-canvas">
            <Sidebar role={role} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* content column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-canvas/80 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink lg:hidden"
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">{user?.name}</p>
              <p className="text-xs capitalize text-muted">{role}</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-bold text-saffron">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
            <button
              onClick={() => dispatch(logoutUser())}
              className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink transition hover:bg-white"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
