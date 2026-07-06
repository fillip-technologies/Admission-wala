import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App.jsx";
import "./index.css";

// After a new deploy, a page still running the old build may try to lazy-load a
// chunk whose hash changed (now 404). Reload once to pick up the fresh build
// instead of showing the "Failed to fetch dynamically imported module" screen.
window.addEventListener("vite:preloadError", () => {
  if (!sessionStorage.getItem("reloadedOnPreloadError")) {
    sessionStorage.setItem("reloadedOnPreloadError", "1");
    window.location.reload();
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
