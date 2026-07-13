import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthCard from "../components/AuthCard.jsx";
import { ADMIN_DEMO_CREDENTIALS } from "../authConfig.js";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";

export default function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const identifier = location.state?.identifier || ADMIN_DEMO_CREDENTIALS.email;
  const [code, setCode] = useState("");
  const flow = location.state?.flow || "reset";

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
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

    if (flow === "register") {
      navigate("/auth/login");
      return;
    }

    navigate("/auth/new-password", {
      state: {
        identifier,
        verificationCode: code,
      },
    });
  }

  return (
    <AuthLayout allowScroll>
      <AuthCard
        actionLabel="Verify Code"
        eyebrow="Verification"
        fields={[
          {
            label: "Email Address",
            name: "identifier",
            helperText: "Use the same email where you requested the reset code.",
            placeholder: "Enter email",
            type: "email",
            value: identifier,
            readOnly: true,
          },
          {
            label: "Verification Code",
            name: "code",
            helperText: "Enter the 4-digit code from your email.",
            onChange: (event) => setCode(event.target.value),
            placeholder: "Enter code",
            type: "text",
            value: code,
          },
        ]}
        footerPanel={
          <div className="flex items-center justify-between gap-4 rounded-[12px] border border-[#efe2d7] bg-[#fcf7f2] px-3.5 py-3">
            <div>
              <p className="type-subpara text-[#533f31]">Didn&apos;t receive the code?</p>
              <p className="type-subpara mt-1 text-[12px] text-[#8d7e72]">
                Check spam first, then request a fresh code.
              </p>
            </div>
            <button
              className="type-subpara shrink-0 rounded-full border border-[#e6c8b6] px-3.5 py-2 text-[#bf622f] transition hover:bg-[#fff7f2]"
              type="button"
            >
              Resend Code
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
