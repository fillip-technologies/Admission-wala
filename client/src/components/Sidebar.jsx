import { NavLink } from "react-router-dom";
import { navConfig, NavIcon } from "../config/navConfig";
import { PATHS } from "../routes/paths";

export default function Sidebar({ role, onNavigate }) {
  const items = navConfig[role] || [];

  return (
    <div className="flex h-full flex-col">
      <NavLink to={PATHS.HOME} className="flex items-center gap-2 px-5 py-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm font-bold text-saffron">
          SAG
        </span>
        <span className="font-display text-lg font-bold tracking-tight text-ink">
          Shri Admission <span className="text-saffron">Gurukul</span>
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

      <p className="px-5 py-4 text-xs text-muted/70 capitalize">{role} workspace</p>
    </div>
  );
}
