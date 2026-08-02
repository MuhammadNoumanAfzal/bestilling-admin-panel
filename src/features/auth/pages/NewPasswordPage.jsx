import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { resetAdminPasswordRequest } from "../api/authApi.js";
import { validateAdminPassword } from "../authConfig.js";
import AuthCard from "../components/AuthCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const identifier = location.state?.identifier || "";
  const verificationCode = location.state?.verificationCode || "";
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  if (!identifier || !verificationCode) {
    return <Navigate replace to="/auth/forgot-password" />;
  }

  async function handleSubmit() {
    if (!form.password.trim() || !form.confirmPassword.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Missing password",
        text: "Fill both password fields to continue.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "Please confirm the same password.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    const passwordValidationError = validateAdminPassword(form.password);

    if (passwordValidationError) {
      await Swal.fire({
        icon: "warning",
        title: "Weak password",
        text: passwordValidationError,
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await resetAdminPasswordRequest({
        email: identifier,
        token: verificationCode,
        password: form.password,
      });
      await Swal.fire({
        icon: "success",
        title: "Password updated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
      navigate("/auth/login", { replace: true });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Reset failed",
        text: error?.message || "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout allowScroll>
      <AuthCard
        actionDisabled={isSubmitting}
        actionLabel={isSubmitting ? "Updating..." : "Reset Password"}
        backLinkLabel="Back to verification"
        backLinkTo="/auth/verification"
        dense
        eyebrow="New password"
        fields={[
          {
            label: "Email Address",
            name: "identifier",
            helperText: "This should match the email used in the reset flow.",
            placeholder: "Enter email",
            type: "email",
            value: identifier,
            readOnly: true,
          },
          {
            label: "Verification Code",
            name: "verificationCode",
            helperText: "Use the verified code from your email.",
            placeholder: "Enter code",
            type: "text",
            value: verificationCode,
            readOnly: true,
          },
          {
            label: "New Password",
            name: "password",
            onChange: (event) =>
              setForm((current) => ({ ...current, password: event.target.value })),
            placeholder: "Enter new password",
            type: "password",
            value: form.password,
          },
          {
            label: "Confirm Password",
            name: "confirmPassword",
            onChange: (event) =>
              setForm((current) => ({ ...current, confirmPassword: event.target.value })),
            placeholder: "Confirm password",
            type: "password",
            value: form.confirmPassword,
          },
        ]}
        belowFieldsContent={
          <div className="flex flex-wrap gap-2">
            {["8+ characters", "1 uppercase", "1 lowercase", "1 number", "1 symbol"].map((rule) => (
              <span
                key={rule}
                className="type-subpara rounded-full bg-[#f1ece7] px-2.5 py-1 text-[11px] text-[#8b7d71]"
              >
                {rule}
              </span>
            ))}
          </div>
        }
        footerPanel={
          <div className="rounded-[12px] border border-[#efe2d7] bg-[#fcf7f2] px-3.5 py-3">
            <p className="type-subpara text-[#533f31]">Almost done.</p>
            <p className="type-subpara mt-1 text-[12px] text-[#8d7e72]">
              Your password should be unique and not reused across other services.
            </p>
          </div>
        }
        maxWidthClassName="max-w-[460px]"
        onAction={handleSubmit}
        subtitle="Finish recovery by choosing a strong new password for your admin account."
        title="Set New Password"
      />
    </AuthLayout>
  );
}
