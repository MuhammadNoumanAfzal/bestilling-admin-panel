import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthCard from "../components/AuthCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [identifier, setIdentifier] = useState("");

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  async function handleSubmit() {
    if (!identifier.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Missing email",
        text: "Enter the email linked to the admin account.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    navigate("/auth/verification", { state: { flow: "reset", identifier } });
  }

  return (
    <AuthLayout>
      <AuthCard
        actionLabel="Send Code"
        backLinkLabel="Back to login"
        backLinkTo="/auth/login"
        eyebrow="Password reset"
        fields={[
          {
            autoComplete: "email",
            label: "Email Address",
            name: "identifier",
            onChange: (event) => setIdentifier(event.target.value),
            placeholder: "Enter admin email",
            type: "email",
            value: identifier,
          },
        ]}
        onAction={handleSubmit}
        subtitle="Enter your admin email and we will send a verification code."
        title="Forgot your password?"
      />
    </AuthLayout>
  );
}
