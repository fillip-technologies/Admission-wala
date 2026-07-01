import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/auth.slice";
import { roleHome } from "../config/roles";

// Keeps logged-in users out of /login and /signup.
export default function PublicOnlyRoute() {
  const { isAuthenticated, user } = useAppSelector(selectAuth);
  if (isAuthenticated) return <Navigate to={roleHome(user?.role)} replace />;
  return <Outlet />;
}
