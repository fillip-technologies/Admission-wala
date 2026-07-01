import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectIsAuthenticated } from "../features/auth/auth.slice";
import { PATHS } from "./paths";

// Gate: must be logged in. Remembers where they were headed.
export default function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }
  return <Outlet />;
}
