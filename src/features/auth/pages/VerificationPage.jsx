import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  requestAdminPasswordResetMail,
  verifyAdminPasswordResetCode,
} from "../api/authApi.js";
import AuthCard from "../components/AuthCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";

export default function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const identifier = location.state?.identifier || "";
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  if (!identifier) {
    return <Navigate replace to="/auth/forgot-password" />;
  }

  async function handleSubmit() {
    if (code.trim().length < 4) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid code",
        text: "Enter the verification code to continue.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await verifyAdminPasswordResetCode({
        email: identifier,
        pin: code,
      });
      await Swal.fire({
        icon: "success",
        title: "Code verified",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
      navigate("/auth/new-password", {
        state: {
          identifier,
          verificationCode: result.token || code,
        },
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Verification failed",
        text: error?.message || "Please re-check the code and try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendCode() {
    try {
      setIsResending(true);
      const result = await requestAdminPasswordResetMail({ email: identifier });
      await Swal.fire({
        icon: "success",
        title: "Code resent",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to resend code",
        text: error?.message || "Please try again in a moment.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthLayout allowScroll>
      <AuthCard
        actionDisabled={isSubmitting}
        actionLabel={isSubmitting ? "Verifying..." : "Verify Code"}
        backLinkLabel="Back to reset"
        backLinkTo="/auth/forgot-password"
        eyebrow="Verification"
        fields={[
          {
            label: "Email Address",
            name: "identifier",
            placeholder: "Enter email",
            type: "email",
            value: identifier,
            readOnly: true,
          },
          {
            label: "Verification Code",
            name: "code",
            onChange: (event) => setCode(event.target.value),
            placeholder: "Enter code",
            type: "text",
            value: code,
          },
        ]}
        footerPanel={
          <div className="flex items-center justify-between gap-4 rounded-[12px] border border-[#efe2d7] bg-[#fcf7f2] px-3.5 py-3">
            <p className="type-subpara text-[#533f31]">Didn&apos;t receive the code?</p>
            <button
              className="type-subpara shrink-0 rounded-full border border-[#e6c8b6] px-3.5 py-2 text-[#bf622f] transition hover:bg-[#fff7f2]"
              disabled={isResending}
              onClick={handleResendCode}
              type="button"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          </div>
        }
        maxWidthClassName="max-w-[430px]"
        onAction={handleSubmit}
        subtitle="Confirm the code we sent before creating your new password."
        title="Verify Code"
      />
    </AuthLayout>
  );
}
