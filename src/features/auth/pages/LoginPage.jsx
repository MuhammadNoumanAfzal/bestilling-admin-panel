import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthCard from "../components/AuthCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";

export default function LoginPage() {
  const { t } = useTranslation();
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
        title: t("auth.login.missingTitle", { defaultValue: "Missing details" }),
        text: t("auth.login.missingText", { defaultValue: "Please enter your email and password." }),
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
        title: t("auth.login.failedTitle", { defaultValue: "Login failed" }),
        text: error?.message || t("auth.login.failedText", { defaultValue: "Please verify your admin credentials and try again." }),
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
        actionLabel={isSubmitting ? t("auth.login.signingIn", { defaultValue: "Signing in..." }) : t("auth.login.submit", { defaultValue: "Login" })}
        auxiliaryLinkLabel={t("auth.login.forgot", { defaultValue: "Forgot Password?" })}
        auxiliaryLinkTo="/auth/forgot-password"
        eyebrow={t("auth.login.access", { defaultValue: "Admin access" })}
        fields={[
          {
            autoComplete: "email",
            label: t("auth.login.email", { defaultValue: "Email Address" }),
            name: "email",
            onChange: (event) => setForm((current) => ({ ...current, email: event.target.value })),
            placeholder: t("auth.login.emailPlaceholder", { defaultValue: "Enter your admin email" }),
            type: "email",
            value: form.email,
          },
          {
            autoComplete: "current-password",
            label: t("auth.login.password", { defaultValue: "Password" }),
            name: "password",
            onChange: (event) =>
              setForm((current) => ({ ...current, password: event.target.value })),
            placeholder: t("auth.login.passwordPlaceholder", { defaultValue: "Enter your password" }),
            type: "password",
            value: form.password,
          },
        ]}
        onAction={handleLogin}
        onRememberMeChange={() => setRememberMe((current) => !current)}
        rememberMeChecked={rememberMe}
        rememberMeLabel={t("auth.login.remember", { defaultValue: "Remember me" })}
        subtitle={t("auth.login.subtitle", { defaultValue: "Sign in to manage vendors, orders, payouts, and platform activity." })}
        title={t("auth.login.welcome", { defaultValue: "Welcome back" })}
      />
    </AuthLayout>
  );
}
