import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { requestAdminPasswordResetMail } from "../api/authApi.js";
import AuthCard from "../components/AuthCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  async function handleSubmit() {
    if (!identifier.trim()) {
      await Swal.fire({
        icon: "warning",
        title: t("auth.forgot.missingTitle", { defaultValue: "Missing email" }),
        text: t("auth.forgot.missingText", { defaultValue: "Enter the email linked to the admin account." }),
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await requestAdminPasswordResetMail({ email: identifier });
      await Swal.fire({
        icon: "success",
        title: t("auth.forgot.sentTitle", { defaultValue: "Code sent" }),
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
      navigate("/auth/verification", { state: { flow: "reset", identifier } });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: t("auth.forgot.failedTitle", { defaultValue: "Unable to send code" }),
        text: error?.message || t("auth.forgot.failedText", { defaultValue: "Please try again in a moment." }),
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
        actionLabel={isSubmitting ? t("auth.forgot.sending", { defaultValue: "Sending..." }) : t("auth.forgot.submit", { defaultValue: "Send Code" })}
        backLinkLabel={t("auth.forgot.back", { defaultValue: "Back to login" })}
        backLinkTo="/auth/login"
        eyebrow={t("auth.forgot.eyebrow", { defaultValue: "Password reset" })}
        fields={[
          {
            autoComplete: "email",
            label: t("auth.forgot.email", { defaultValue: "Email Address" }),
            name: "identifier",
            onChange: (event) => setIdentifier(event.target.value),
            placeholder: t("auth.forgot.emailPlaceholder", { defaultValue: "Enter admin email" }),
            type: "email",
            value: identifier,
          },
        ]}
        onAction={handleSubmit}
        subtitle={t("auth.forgot.subtitle", { defaultValue: "Enter your admin email and we will send a verification code." })}
        title={t("auth.forgot.title", { defaultValue: "Forgot your password?" })}
      />
    </AuthLayout>
  );
}
