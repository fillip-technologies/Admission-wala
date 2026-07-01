import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/auth.slice";
import { roleHome } from "../config/roles";
import { PATHS } from "./paths";

/**
 * Gate: must be logged in AND hold one of `allow` roles.
 * - not logged in  -> /login (remembering intent)
 * - wrong role     -> their own home (no dead-ends)
 */
export default function RoleRoute({ allow = [] }) {
  const { isAuthenticated, user } = useAppSelector(selectAuth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }
  if (!allow.includes(user?.role)) {
    return <Navigate to={roleHome(user?.role)} replace />;
  }
  return <Outlet />;
}
