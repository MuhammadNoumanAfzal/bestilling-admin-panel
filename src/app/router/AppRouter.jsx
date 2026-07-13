import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout.jsx";
import { ProtectedRoute } from "../../features/auth/components/ProtectedRoute.jsx";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage.jsx";
import LoginPage from "../../features/auth/pages/LoginPage.jsx";
import NewPasswordPage from "../../features/auth/pages/NewPasswordPage.jsx";
import RegisterPage from "../../features/auth/pages/RegisterPage.jsx";
import VerificationPage from "../../features/auth/pages/VerificationPage.jsx";
import DashboardPage from "../../features/dashboard/pages/DashboardPage.jsx";
import VendorsPage from "../../features/vendors/pages/VendorsPage.jsx";
import OrdersPage from "../../features/orders/pages/OrdersPage.jsx";
import CustomersPage from "../../features/customers/pages/CustomersPage.jsx";
import PayoutsPage from "../../features/payouts/pages/PayoutsPage.jsx";
import CommissionSettingsPage from "../../features/payouts/pages/CommissionSettingsPage.jsx";
import PaymentDetailsPage from "../../features/payouts/pages/PaymentDetailsPage.jsx";
import DeliveryPage from "../../features/delivery/pages/DeliveryPage.jsx";
import DeliveryAreaDetailPage from "../../features/delivery/pages/DeliveryAreaDetailPage.jsx";
import ReportsPage from "../../features/reports/pages/ReportsPage.jsx";
import SettingsPage from "../../features/settings/pages/SettingsPage.jsx";
import SupportPage from "../../features/support/pages/SupportPage.jsx";
import SupportTicketDetailPage from "../../features/support/pages/SupportTicketDetailPage.jsx";
import NotificationsPage from "../../features/notifications/pages/NotificationsPage.jsx";
import CreateNotificationPage from "../../features/notifications/pages/CreateNotificationPage.jsx";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate replace to={isAuthenticated ? "/dashboard" : "/auth/login"} />;
}

export default function AppRouter() {
  return (
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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/payouts" element={<PayoutsPage />} />
          <Route path="/payouts/:payoutId" element={<PaymentDetailsPage />} />
          <Route path="/payouts/commission-settings" element={<CommissionSettingsPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/delivery/:areaId" element={<DeliveryAreaDetailPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/support/:ticketId" element={<SupportTicketDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/notifications/create" element={<CreateNotificationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
