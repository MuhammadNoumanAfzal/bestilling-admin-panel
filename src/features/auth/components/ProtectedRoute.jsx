import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f5f3_0%,#f2ece7_100%)] px-4">
        <div className="w-full max-w-[420px] overflow-hidden rounded-[26px] border border-[#eadfd4] bg-white shadow-[0_28px_70px_rgba(42,24,13,0.10)]">
          <div className="bg-[linear-gradient(135deg,#fff6ef_0%,#fffdfa_55%,#f8fbff_100%)] px-6 py-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eed7c8] bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#bf6739]">
              Admin Session
            </div>
            <h1 className="mt-4 text-[28px] font-black tracking-[-0.05em] text-[#17120e]">
              Restoring your workspace
            </h1>
            <p className="mt-2 text-[14px] leading-7 text-[#6f645d]">
              Verifying your admin session and loading secure access.
            </p>
          </div>

          <div className="flex items-center gap-3 border-t border-[#f1e7df] px-6 py-5">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#f2d6c7] border-t-[#cf6e38]" />
            <div>
              <p className="text-[13px] font-bold text-[#2a1e18]">Please wait a moment</p>
              <p className="mt-1 text-[12px] text-[#85786f]">This usually takes only a second.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/auth/login" />;
  }

  return <Outlet />;
}
