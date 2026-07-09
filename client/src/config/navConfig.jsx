import { ROLES } from "./roles";
import { PATHS } from "../routes/paths";

export const navConfig = {
  [ROLES.STUDENT]: [
    { to: PATHS.STUDENT.ROOT,       label: "Dashboard",   end: true, icon: "grid"        },
    { to: PATHS.STUDENT.ADMISSION,  label: "My Admission",           icon: "doc"         },
    { to: PATHS.STUDENT.COUNSELLING, label: "Counselling",           icon: "counsellers" },
    { to: PATHS.STUDENT.TICKETS,    label: "Support",                icon: "inbox"       },
    { to: PATHS.STUDENT.PROFILE,    label: "Profile",                icon: "user"        },
  ],
  [ROLES.ADMIN]: [
    { to: PATHS.ADMIN.ROOT,         label: "Overview",    end: true, icon: "grid"       },
    { to: PATHS.ADMIN.STUDENTS,     label: "Students",              icon: "users"       },
    { to: PATHS.ADMIN.ENQUIRY,      label: "Enquiry",               icon: "inbox"       },
    { to: PATHS.ADMIN.COUNSELLERS,  label: "Counsellers",           icon: "counsellers" },
    { to: PATHS.ADMIN.ANNOUNCEMENTS, label: "Announcements",        icon: "bell"        },
    { to: PATHS.ADMIN.PROMOS,       label: "Promo Banner",          icon: "megaphone"   },
    { to: PATHS.ADMIN.PROGRAMS,     label: "Hero Programs",         icon: "tag"         },
    { to: PATHS.ADMIN.REPORTS,      label: "Reports",               icon: "chart"       },
  ],
  [ROLES.COUNSELLER]: [
    { to: PATHS.COUNSELLER.ROOT, label: "Appointments", end: true, icon: "counsellers" },
    { to: PATHS.COUNSELLER.TICKETS, label: "Support Tickets",       icon: "inbox"       },
  ],
};

export const NavIcon = ({ name, className = "h-4 w-4" }) => {
  const paths = {
    grid:        "M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 13h6v6h-6z",
    doc:         "M7 3h7l4 4v14H7zM14 3v4h4",
    user:        "M12 12a4 4 0 100-8 4 4 0 000 8zM5 21a7 7 0 0114 0",
    users:       "M9 12a4 4 0 100-8 4 4 0 000 8zM3 21a6 6 0 0112 0M17 11a3 3 0 100-6M21 21a5 5 0 00-8-4",
    inbox:       "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM2 10h20M12 14v4",
    counsellers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    chart:       "M3 3v18h18M7 15l3-4 3 3 4-6",
    bell:        "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
    megaphone:   "M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1zM14 8a4 4 0 0 1 0 8",
    tag:         "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name] || paths.grid} />
    </svg>
  );
};