import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import PageLoader from "../components/ui/PageLoader";
import { AuthModalProvider } from "../components/auth/AuthModalProvider";

// Marketing / public site shell.
export default function PublicLayout() {
  return (
    <AuthModalProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </AuthModalProvider>
  );
}
