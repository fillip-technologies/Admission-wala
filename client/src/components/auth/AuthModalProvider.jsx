import { createContext, useCallback, useContext, useState } from "react";
import AuthModal from "./AuthModal";

const AuthModalContext = createContext(null);


export function AuthModalProvider({ children }) {
  const [view, setView] = useState(null); // null = closed | "login" | "register" | ...
  // Optional { name, email, mobile_number } to pre-fill the register form —
  // e.g. after an enquiry so the visitor doesn't retype what they just entered.
  const [prefill, setPrefill] = useState(null);

  const openAuth = useCallback((initialView = "login", prefillData = null) => {
    setPrefill(prefillData);
    setView(initialView);
  }, []);
  const closeAuth = useCallback(() => {
    setView(null);
    setPrefill(null);
  }, []);

  return (
    <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      {view && (
        <AuthModal view={view} setView={setView} onClose={closeAuth} prefill={prefill} />
      )}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within an AuthModalProvider");
  return ctx;
}
