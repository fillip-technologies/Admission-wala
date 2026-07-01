import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser, selectAuth } from "../features/auth/auth.slice";
import { roleHome } from "../config/roles";
import { PATHS } from "../routes/paths";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(selectAuth);

  const onLogout = async () => {
    await dispatch(logoutUser());
    navigate(PATHS.HOME);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={PATHS.HOME} className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm font-bold text-saffron">
            AW
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Admission<span className="text-saffron">Walla</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          <a className="transition hover:text-ink" href="/#boards">Boards</a>
          <a className="transition hover:text-ink" href="/#courses">Courses</a>
          <a className="transition hover:text-ink" href="/#counselling">Counselling</a>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to={roleHome(user?.role)}
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to={PATHS.LOGIN}
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Log in
              </Link>
              <Link
                to={PATHS.SIGNUP}
                className="rounded-lg bg-ink px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-ink-soft"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
