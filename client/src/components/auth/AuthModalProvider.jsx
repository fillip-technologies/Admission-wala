import { createContext, useCallback, useContext, useState } from "react";
import AuthModal from "./AuthModal";

const AuthModalContext = createContext(null);


export function AuthModalProvider({ children }) {
  const [view, setView] = useState(null); // null = closed | "login" | "register" | ...

  const openAuth = useCallback((initialView = "login") => setView(initialView), []);
  const closeAuth = useCallback(() => setView(null), []);

  return (
    <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      {view && <AuthModal view={view} setView={setView} onClose={closeAuth} />}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within an AuthModalProvider");
  return ctx;
}
