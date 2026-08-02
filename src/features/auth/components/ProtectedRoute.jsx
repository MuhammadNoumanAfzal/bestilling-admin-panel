import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f3] px-4">
        <div className="rounded-[14px] border border-[#eadfd4] bg-white px-6 py-5 text-center shadow-[0_20px_48px_rgba(42,24,13,0.08)]">
          <p className="type-subpara uppercase tracking-[0.18em] text-[#cf6e38]">Admin Session</p>
          <h1 className="type-h4 mt-2 text-[#17120e]">Checking access...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/auth/login" />;
  }

  return <Outlet />;
}
