import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchMe, selectAuth } from "../features/auth/auth.slice";
import FullScreenLoader from "../components/ui/FullScreenLoader";

// Root element: rehydrates the session once, then renders the tree.
export default function RootBoot() {
  const dispatch = useAppDispatch();
  const { bootstrapping } = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (bootstrapping) return <FullScreenLoader label="Starting up…" />;
  return <Outlet />;
}
