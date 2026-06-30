import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectAuth } from "../features/auth/authSlice";

export default function Navbar({ onLogin, onRegister }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(selectAuth);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm font-bold text-saffron">
            AW
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Admission<span className="text-saffron">Walla</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          <a className="transition hover:text-ink" href="#boards">
            Boards
          </a>
          <a className="transition hover:text-ink" href="#courses">
            Courses
          </a>
          <a className="transition hover:text-ink" href="#counselling">
            Counselling
          </a>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted sm:inline">
                Hi,{" "}
                <span className="font-semibold text-ink">
                  {user?.name?.split(" ")[0] || "Student"}
                </span>
              </span>
              <button
                onClick={() => dispatch(logoutUser())}
                className="rounded-lg border border-line px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Log in
              </button>
              <button
                onClick={onRegister}
                className="rounded-lg bg-ink px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-ink-soft"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}