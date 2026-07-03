// Single source of truth for roles — mirrors your Mongoose enum.
export const ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
  COUNSELLER: "counseller",
};

// Where each role lands after login / when they hit a route they don't own.
export const roleHome = (role) => {
  if (role === ROLES.ADMIN) return "/admin";
  if (role === ROLES.COUNSELLER) return "/counseller";
  return "/student";
};
