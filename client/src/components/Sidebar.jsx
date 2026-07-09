import { NavLink, useNavigate } from "react-router-dom";
import { navConfig, NavIcon } from "../config/navConfig";
import { PATHS } from "../routes/paths";
import { useAppDispatch } from "../app/hooks";
import { logoutUser } from "../features/auth/auth.slice";

export default function Sidebar({ role, onNavigate }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = navConfig[role] || [];

  const handleLogout = async () => {
    onNavigate?.();
    await dispatch(logoutUser());
    navigate(PATHS.HOME);
  };

  return (
    <div className="flex h-full flex-col">
      <NavLink to={PATHS.HOME} className="flex items-center gap-2 px-5 py-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm font-bold text-saffron">
          SAG
        </span>
        <span className="font-display text-lg font-bold tracking-tight text-ink">
          Shree Admission <span className="text-saffron">Gurukul</span>
        </span>
      </NavLink>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-ink text-white"
                  : "text-muted hover:bg-white hover:text-ink"
              }`
            }
          >
            <NavIcon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-white hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Log out
        </button>
        <p className="mt-2 px-3 text-xs capitalize text-muted/70">{role} workspace</p>
      </div>
    </div>
  );
}
