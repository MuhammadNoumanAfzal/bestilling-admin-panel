import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import { ProtectedRoute } from "../../features/auth/components/ProtectedRoute.jsx";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage.jsx";
import LoginPage from "../../features/auth/pages/LoginPage.jsx";
import NewPasswordPage from "../../features/auth/pages/NewPasswordPage.jsx";
import RegisterPage from "../../features/auth/pages/RegisterPage.jsx";
import VerificationPage from "../../features/auth/pages/VerificationPage.jsx";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

const DashboardPage = lazy(() => import("../../features/dashboard/pages/DashboardPage.jsx"));
const VendorsPage = lazy(() => import("../../features/vendors/pages/VendorsPage.jsx"));
const VendorDetailPage = lazy(() => import("../../features/vendors/pages/VendorDetailPage.jsx"));
const VendorApplicationReviewPage = lazy(() => import("../../features/vendors/pages/VendorApplicationReviewPage.jsx"));
const OrdersPage = lazy(() => import("../../features/orders/pages/OrdersPage.jsx"));
const OrderDetailPage = lazy(() => import("../../features/orders/pages/OrderDetailPage.jsx"));
const CustomersPage = lazy(() => import("../../features/customers/pages/CustomersPage.jsx"));
const CustomerDetailPage = lazy(() => import("../../features/customers/pages/CustomerDetailPage.jsx"));
const PayoutsPage = lazy(() => import("../../features/payouts/pages/PayoutsPage.jsx"));
const CommissionSettingsPage = lazy(() => import("../../features/payouts/pages/CommissionSettingsPage.jsx"));
const PaymentDetailsPage = lazy(() => import("../../features/payouts/pages/PaymentDetailsPage.jsx"));
const DeliveryPage = lazy(() => import("../../features/delivery/pages/DeliveryPage.jsx"));
const DeliveryAreaDetailPage = lazy(() => import("../../features/delivery/pages/DeliveryAreaDetailPage.jsx"));
const ReportsPage = lazy(() => import("../../features/reports/pages/ReportsPage.jsx"));
const SettingsPage = lazy(() => import("../../features/settings/pages/SettingsPage.jsx"));
const SupportPage = lazy(() => import("../../features/support/pages/SupportPage.jsx"));
const SupportTicketDetailPage = lazy(() => import("../../features/support/pages/SupportTicketDetailPage.jsx"));
const NotificationsPage = lazy(() => import("../../features/notifications/pages/NotificationsPage.jsx"));
const CreateNotificationPage = lazy(() => import("../../features/notifications/pages/CreateNotificationPage.jsx"));
const HomeCurationPage = lazy(() => import("../../features/home-curation/pages/HomeCurationPage.jsx"));
const VendorSettingsPage = lazy(() => import("../../features/vendor-settings/pages/VendorSettingsPage.jsx"));

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate replace to={isAuthenticated ? "/dashboard" : "/auth/login"} />;
}

function PageLoadingFallback() {
  return (
    <div className="rounded-[18px] border border-[#eadfd7] bg-white px-5 py-8 text-center shadow-[0_10px_24px_rgba(54,32,18,0.05)]">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#f1d8ca] border-t-[#cf6e38]" />
      <p className="mt-4 text-[14px] font-semibold text-[#6d5f57]">Loading admin page...</p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/verification" element={<VerificationPage />} />
        <Route path="/auth/new-password" element={<NewPasswordPage />} />
        <Route path="/auth" element={<Navigate replace to="/auth/login" />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Suspense fallback={<PageLoadingFallback />}><DashboardPage /></Suspense>} />
            <Route path="/vendors" element={<Suspense fallback={<PageLoadingFallback />}><VendorsPage /></Suspense>} />
            <Route path="/Vendors" element={<Suspense fallback={<PageLoadingFallback />}><VendorsPage /></Suspense>} />
            <Route path="/vendors/:vendorId/review" element={<Suspense fallback={<PageLoadingFallback />}><VendorApplicationReviewPage /></Suspense>} />
            <Route path="/Vendors/:vendorId/review" element={<Suspense fallback={<PageLoadingFallback />}><VendorApplicationReviewPage /></Suspense>} />
            <Route path="/vendors/:vendorId" element={<Suspense fallback={<PageLoadingFallback />}><VendorDetailPage /></Suspense>} />
            <Route path="/Vendors/:vendorId" element={<Suspense fallback={<PageLoadingFallback />}><VendorDetailPage /></Suspense>} />
            <Route path="/orders" element={<Suspense fallback={<PageLoadingFallback />}><OrdersPage /></Suspense>} />
            <Route path="/orders/:orderId" element={<Suspense fallback={<PageLoadingFallback />}><OrderDetailPage /></Suspense>} />
            <Route path="/customers" element={<Suspense fallback={<PageLoadingFallback />}><CustomersPage /></Suspense>} />
            <Route path="/customers/:customerId" element={<Suspense fallback={<PageLoadingFallback />}><CustomerDetailPage /></Suspense>} />
            <Route path="/payouts" element={<Suspense fallback={<PageLoadingFallback />}><PayoutsPage /></Suspense>} />
            <Route path="/payouts/:payoutId" element={<Suspense fallback={<PageLoadingFallback />}><PaymentDetailsPage /></Suspense>} />
            <Route path="/payouts/commission-settings" element={<Suspense fallback={<PageLoadingFallback />}><CommissionSettingsPage /></Suspense>} />
            <Route path="/delivery" element={<Suspense fallback={<PageLoadingFallback />}><DeliveryPage /></Suspense>} />
            <Route path="/delivery/:areaId" element={<Suspense fallback={<PageLoadingFallback />}><DeliveryAreaDetailPage /></Suspense>} />
            <Route path="/reports" element={<Suspense fallback={<PageLoadingFallback />}><ReportsPage /></Suspense>} />
            <Route path="/support" element={<Suspense fallback={<PageLoadingFallback />}><SupportPage /></Suspense>} />
            <Route path="/support/:ticketId" element={<Suspense fallback={<PageLoadingFallback />}><SupportTicketDetailPage /></Suspense>} />
            <Route path="/notifications" element={<Suspense fallback={<PageLoadingFallback />}><NotificationsPage /></Suspense>} />
            <Route path="/notifications/create" element={<Suspense fallback={<PageLoadingFallback />}><CreateNotificationPage /></Suspense>} />
            <Route path="/home-curation" element={<Suspense fallback={<PageLoadingFallback />}><HomeCurationPage /></Suspense>} />
            <Route path="/vendors/settings" element={<Suspense fallback={<PageLoadingFallback />}><VendorSettingsPage /></Suspense>} />
            <Route path="/settings" element={<Suspense fallback={<PageLoadingFallback />}><SettingsPage /></Suspense>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  );
}
