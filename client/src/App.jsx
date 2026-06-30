import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe, selectAuth } from "./features/auth/authSlice";
import Home from "./pages/Home";

export default function App() {
  const dispatch = useDispatch();
  const { bootstrapping } = useSelector(selectAuth);

  // On first load, ask the backend who we are (reads the httpOnly cookie).
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (bootstrapping) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
          <span className="text-sm font-medium text-muted">Loading…</span>
        </div>
      </div>
    );
  }

  return <Home />;
}