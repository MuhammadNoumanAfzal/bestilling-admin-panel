import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthCard from "../components/AuthCard.jsx";
import { ADMIN_DEMO_CREDENTIALS } from "../authConfig.js";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [rememberMe, setRememberMe] = useState(true);
  const [form, setForm] = useState({
    email: ADMIN_DEMO_CREDENTIALS.email,
    password: ADMIN_DEMO_CREDENTIALS.password,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        text: error?.message || "Use the demo credentials.",
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
            Need a new account?{" "}
            <span
              className="cursor-pointer font-bold text-[#cf6e38]"
              onClick={() => navigate("/auth/register")}
              role="link"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate("/auth/register");
                }
              }}
            >
              Register here
            </span>
          </p>
        }
        fields={[
          {
            autoComplete: "email",
            label: "Email or Phone",
            name: "email",
            onChange: (event) => setForm((current) => ({ ...current, email: event.target.value })),
            placeholder: "Enter your email or phone",
            type: "email",
            value: form.email,
          },
          {
            autoComplete: "current-password",
            label: "Password",
            name: "password",
            onChange: (event) =>
              setForm((current) => ({ ...current, password: event.target.value })),
            placeholder: "Enter password",
            type: "password",
            value: form.password,
          },
        ]}
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
