// Single source of truth for roles — mirrors your Mongoose enum.
export const ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
};

// Where each role lands after login / when they hit a route they don't own.
export const roleHome = (role) =>
  role === ROLES.ADMIN ? "/admin" : "/student";
