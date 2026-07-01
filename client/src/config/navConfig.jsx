import { ROLES } from "./roles";
import { PATHS } from "../routes/paths";

// Data-driven sidebar. Add a role's items here and the sidebar updates —
// no layout changes needed. `end` marks index routes for exact-match active.
export const navConfig = {
  [ROLES.STUDENT]: [
    { to: PATHS.STUDENT.ROOT, label: "Dashboard", end: true, icon: "grid" },
    { to: PATHS.STUDENT.ADMISSION, label: "My Admission", icon: "doc" },
    { to: PATHS.STUDENT.PROFILE, label: "Profile", icon: "user" },
  ],
  [ROLES.ADMIN]: [
    { to: PATHS.ADMIN.ROOT, label: "Overview", end: true, icon: "grid" },
    { to: PATHS.ADMIN.STUDENTS, label: "Students", icon: "users" },
    { to: PATHS.ADMIN.ENQUIRY, label: "Enquiry", icon: "doc" },
    { to: PATHS.ADMIN.COUNSELLERS, label: "Counsellers", icon: "user" },
   
  ],
  // [ROLES.COUNSELLERS]: [
  //   { to: PATHS.COUNSELLERS.ROOT, label: "Overview", end: true, icon: "grid" },
  //   { to: PATHS.COUNSELLERS.STUDENTS, label: "Students", icon: "users" },
  //   { to: PATHS.COUNSELLERS.ENQUIRY, label: "Enquiry", icon: "doc" },
   
  // ],
};

// Minimal inline icon set (24x24 stroke). Extend as needed.
export const NavIcon = ({ name, className = "h-4 w-4" }) => {
  const paths = {
    grid: "M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 13h6v6h-6z",
    doc: "M7 3h7l4 4v14H7zM14 3v4h4",
    user: "M12 12a4 4 0 100-8 4 4 0 000 8zM5 21a7 7 0 0114 0",
    users: "M9 12a4 4 0 100-8 4 4 0 000 8zM3 21a6 6 0 0112 0M17 11a3 3 0 100-6M21 21a5 5 0 00-8-4",
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
