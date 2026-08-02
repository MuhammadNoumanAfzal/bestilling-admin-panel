import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthCard from "../components/AuthCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitializing, login } = useAuth();
  const [rememberMe, setRememberMe] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isInitializing) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  async function handleLogin() {
    if (!form.email.trim() || !form.password.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Missing details",
        text: "Please enter your email and password.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await login(form);
      const nextPath = location.state?.from?.pathname || "/dashboard";
      navigate(nextPath, { replace: true });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error?.message || "Please verify your admin credentials and try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        actionDisabled={isSubmitting}
        actionLabel={isSubmitting ? "Signing in..." : "Login"}
        auxiliaryLinkLabel="Forgot Password?"
        auxiliaryLinkTo="/auth/forgot-password"
        eyebrow="Admin access"
        extraContent={
          <p className="type-subpara text-center text-[12px] text-[#8d7e72]">
            New admin accounts must be created by a super administrator inside the admin system.
          </p>
        }
        fields={[
          {
            autoComplete: "email",
            label: "Email Address",
            name: "email",
            onChange: (event) => setForm((current) => ({ ...current, email: event.target.value })),
            placeholder: "Enter your admin email",
            type: "email",
            value: form.email,
          },
          {
            autoComplete: "current-password",
            label: "Password",
            name: "password",
            onChange: (event) =>
              setForm((current) => ({ ...current, password: event.target.value })),
            placeholder: "Enter your password",
            type: "password",
            value: form.password,
          },
        ]}
        note="This portal only accepts administrator accounts such as admin, sub-admin, developer, editor, seo-manager, and system-manager."
        onAction={handleLogin}
        onRememberMeChange={() => setRememberMe((current) => !current)}
        rememberMeChecked={rememberMe}
        rememberMeLabel="Remember me"
        subtitle="Sign in to manage vendors, orders, payouts, and platform activity."
        title="Welcome back"
      />
    </AuthLayout>
  );
}
