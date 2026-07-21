import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser, selectAuth } from "../features/auth/auth.slice";
import { roleHome } from "../config/roles";
import { PATHS } from "../routes/paths";
import { useAuthModal } from "./auth/AuthModalProvider";
import NotificationDrawer from "./NotificationDrawer";
import Logo from "./Logo";

const phones = [
  { display: "+91 82105 34132", tel: "+918210534132" },
  { display: "+91 62993 36404", tel: "+916299336404" },
  { display: "+91 84098 35444", tel: "+918409835444" },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { openAuth } = useAuthModal();
  const { isAuthenticated, user } = useAppSelector(selectAuth);
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  const onLogout = async () => {
    close();
    await dispatch(logoutUser());
    navigate(PATHS.HOME);
  };

  const openAuthAnd = (mode) => {
    close();
    openAuth(mode);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/80 backdrop-blur">
      {/* top contact bar */}
      <div className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-center gap-x-3 overflow-x-auto whitespace-nowrap px-1 py-2.5 text-[15px] font-extrabold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-end sm:gap-x-8 sm:px-6 sm:py-3 sm:text-[15px] sm:font-bold">
          {phones.map((phone) => (
            <a
              key={phone.tel}
              href={`tel:${phone.tel}`}
              className="flex items-center gap-1 text-white transition hover:text-saffron sm:text-white/80"
            >
              <svg viewBox="0 0 24 24" className="hidden h-3 w-3 sm:block" fill="currentColor" aria-hidden="true">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.29 21 3 13.71 3 4.5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
              </svg>
              {phone.display}
            </a>
          ))}
        </div>
      </div>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={PATHS.HOME} onClick={close} className="flex items-center gap-2.5">
          <Logo className="h-12 w-auto sm:h-14" />
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          <a className="transition hover:text-ink" href="/#boards">Boards</a>
          <a className="transition hover:text-ink" href="/#courses">Courses</a>
          <Link className="transition hover:text-ink" to={PATHS.BLOGS}>Blog</Link>
        </div>

        <div className="flex items-center gap-2">
          <NotificationDrawer />

          {/* desktop auth actions */}
          <div className="hidden items-center gap-2 md:flex">
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
                <button
                  onClick={() => openAuth("login")}
                  className="rounded-lg px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-white"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="rounded-lg bg-ink px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-ink-soft"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-line text-ink transition hover:bg-white md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* mobile menu panel */}
      {menuOpen && (
        <div className="border-t border-line/80 bg-canvas md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            <a onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-white" href="/#boards">Boards</a>
            <a onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-white" href="/#courses">Courses</a>
            <Link onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-white" to={PATHS.BLOGS}>Blog</Link>

            <div className="my-2 border-t border-line" />

            {isAuthenticated ? (
              <>
                <Link
                  onClick={close}
                  to={roleHome(user?.role)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="mt-1 rounded-lg border border-line px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => openAuthAnd("login")}
                  className="flex-1 rounded-lg border border-line px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuthAnd("register")}
                  className="flex-1 rounded-lg bg-ink px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
