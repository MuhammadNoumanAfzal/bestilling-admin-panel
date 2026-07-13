import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  function handleSubmit() {
    navigate("/auth/verification", { state: { flow: "register", form } });
  }

  return (
    <AuthLayout>
      <AuthCard
        actionLabel="Create Account"
        backLinkLabel="Back to login"
        backLinkTo="/auth/login"
        eyebrow="New account"
        fields={[
          {
            label: "Full Name",
            name: "name",
            onChange: (event) => setForm((current) => ({ ...current, name: event.target.value })),
            placeholder: "Enter full name",
            type: "text",
            value: form.name,
          },
          {
            label: "Email Address",
            name: "email",
            onChange: (event) => setForm((current) => ({ ...current, email: event.target.value })),
            placeholder: "Enter email address",
            type: "email",
            value: form.email,
          },
          {
            label: "Phone Number",
            name: "phone",
            onChange: (event) => setForm((current) => ({ ...current, phone: event.target.value })),
            placeholder: "Enter phone number",
            type: "text",
            value: form.phone,
          },
        ]}
        footerLinkLabel="Login"
        footerLinkTo="/auth/login"
        footerText="Already have an account?"
        onAction={handleSubmit}
        subtitle="Create an admin account request to access the control center."
        title="Create your account"
      />
    </AuthLayout>
  );
}
