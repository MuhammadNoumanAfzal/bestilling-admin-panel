import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  blockCustomerRequest,
  deactivateCustomerRequest,
  getAdminCustomerDetailRequest,
  unblockCustomerRequest,
  updateCustomerProfileRequest,
} from "../api/customersApi.js";
import CustomerDangerZoneCard from "../components/details/CustomerDangerZoneCard.jsx";
import CustomerDetailHeader from "../components/details/CustomerDetailHeader.jsx";
import CustomerOrderHistoryCard from "../components/details/CustomerOrderHistoryCard.jsx";
import CustomerProfileInfoCard from "../components/details/CustomerProfileInfoCard.jsx";
import CustomerReviewsCard from "../components/details/CustomerReviewsCard.jsx";
import CustomerSupportInteractionsCard from "../components/details/CustomerSupportInteractionsCard.jsx";

function LoadingCard() {
  return (
    <div className="mx-auto max-w-6xl space-y-5 px-0 sm:space-y-6">
      <div className="h-28 animate-pulse rounded-[16px] border border-[#ddd6cf] bg-white" />
      <div className="h-72 animate-pulse rounded-[16px] border border-[#ddd6cf] bg-white" />
      <div className="h-96 animate-pulse rounded-[16px] border border-[#ddd6cf] bg-white" />
    </div>
  );
}

export default function CustomerDetailPage() {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCustomer() {
      setIsLoading(true);
      setLoadError("");

      try {
        const detail = await getAdminCustomerDetailRequest(customerId);

        if (isMounted) {
          setCustomer(detail);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load this customer.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCustomer();

    return () => {
      isMounted = false;
    };
  }, [customerId]);

  async function handleContact() {
    if (!customer) {
      return;
    }

    await Swal.fire({
      title: "Customer contact details",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;background:#faf9f8;border:1px solid #eee4dd;border-radius:16px;padding:16px;">
          <p><strong>Name:</strong> ${customer.name}</p>
          <p><strong>Email:</strong> ${customer.email || "Not available"}</p>
          <p><strong>Phone:</strong> ${customer.phone || "Not available"}</p>
          <p><strong>City:</strong> ${customer.city || "Not available"}</p>
        </div>
      `,
      confirmButtonText: "Close",
      confirmButtonColor: "#d96834",
    });
  }

  async function handleEditProfile() {
    if (!customer) {
      return;
    }

    const { value } = await Swal.fire({
      title: "Edit customer profile",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <input id="customer-first-name" class="swal2-input" placeholder="First name" value="${customer.firstName || ""}">
          <input id="customer-last-name" class="swal2-input" placeholder="Last name" value="${customer.lastName || ""}">
          <input id="customer-email" class="swal2-input" placeholder="Email" value="${customer.email || ""}">
          <input id="customer-phone" class="swal2-input" placeholder="Phone" value="${customer.phone || ""}">
          <textarea id="customer-notes" class="swal2-textarea" placeholder="Admin notes">${customer.profile?.notes || ""}</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save changes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
      focusConfirm: false,
      preConfirm: () => {
        const firstName = document.getElementById("customer-first-name")?.value?.trim() || "";
        const lastName = document.getElementById("customer-last-name")?.value?.trim() || "";
        const email = document.getElementById("customer-email")?.value?.trim() || "";
        const phone = document.getElementById("customer-phone")?.value?.trim() || "";
        const notes = document.getElementById("customer-notes")?.value?.trim() || "";

        if (!firstName || !lastName || !email || !phone) {
          Swal.showValidationMessage("First name, last name, email, and phone are required.");
          return null;
        }

        return { firstName, lastName, email, phone, notes };
      },
    });

    if (!value) {
      return;
    }

    try {
      const result = await updateCustomerProfileRequest(customer.id, value);
      setCustomer((current) =>
        current
          ? {
              ...current,
              name: result.customer.fullName || current.name,
              fullName: result.customer.fullName || current.fullName,
              firstName: value.firstName,
              lastName: value.lastName,
              email: result.customer.email,
              phone: result.customer.phone,
              city: result.customer.city,
              status: result.customer.status,
              rawStatus: result.customer.rawStatus,
              profile: {
                ...current.profile,
                notes: value.notes,
              },
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to update profile",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  async function handleToggleBlock() {
    if (!customer) {
      return;
    }

    const isBlocked = customer.status === "Blocked";
    const confirmation = await Swal.fire({
      icon: "warning",
      title: isBlocked ? "Unblock customer?" : "Block customer?",
      text: isBlocked
        ? `Restore access for ${customer.name}?`
        : `Block ${customer.name} from logging in and placing new orders?`,
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Yes, unblock" : "Yes, block",
      cancelButtonText: "Cancel",
      confirmButtonColor: isBlocked ? "#2b9e62" : "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    let reason = "";
    if (!isBlocked) {
      const reasonResult = await Swal.fire({
        title: "Block reason",
        input: "text",
        inputLabel: "Optional reason",
        inputPlaceholder: "Add a note for this action",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d83f3f",
        cancelButtonColor: "#c8b9aa",
      });

      if (reasonResult.isDismissed) {
        return;
      }

      reason = reasonResult.value || "";
    }

    try {
      setIsUpdatingStatus(true);
      const result = isBlocked
        ? await unblockCustomerRequest(customer.id)
        : await blockCustomerRequest(customer.id, reason);

      setCustomer((current) =>
        current
          ? {
              ...current,
              status: result.status,
              rawStatus: result.rawStatus,
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: isBlocked ? "Customer unblocked" : "Customer blocked",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: isBlocked ? "Unable to unblock customer" : "Unable to block customer",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleDeactivate() {
    if (!customer) {
      return;
    }

    const reasonResult = await Swal.fire({
      title: "Deactivate customer?",
      text: `This will disable ${customer.name}'s access while preserving historical records.`,
      input: "text",
      inputLabel: "Reason for deactivation",
      inputPlaceholder: "Optional reason",
      showCancelButton: true,
      confirmButtonText: "Deactivate account",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    });

    if (!reasonResult.isConfirmed) {
      return;
    }

    try {
      setIsDeactivating(true);
      const result = await deactivateCustomerRequest(customer.id, reasonResult.value || "");

      setCustomer((current) =>
        current
          ? {
              ...current,
              status: result.status,
              rawStatus: result.rawStatus,
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: "Customer deactivated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to deactivate customer",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsDeactivating(false);
    }
  }

  if (isLoading) {
    return <LoadingCard />;
  }

  if (!customer) {
    return (
      <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-10 text-center text-[15px] font-medium text-[#9f4d33]">
        {loadError || "Unable to load this customer."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-0 sm:space-y-6">
      {loadError ? (
        <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-8 text-center text-[15px] font-medium text-[#9f4d33]">
          {loadError}
        </div>
      ) : null}

      <CustomerDetailHeader
        customer={customer}
        isUpdatingStatus={isUpdatingStatus}
        onContact={handleContact}
        onToggleBlock={handleToggleBlock}
      />

      <CustomerProfileInfoCard customer={customer} onEdit={handleEditProfile} />

      <CustomerOrderHistoryCard
        ordersData={customer.orderHistory.items}
        summary={customer.orderHistory.summary}
      />

      <CustomerReviewsCard reviewsData={customer.reviews.items} />

      <CustomerSupportInteractionsCard
        ticketsData={customer.supportTickets.items}
        summary={customer.supportTickets.summary}
      />

      <CustomerDangerZoneCard
        customerName={customer.name}
        isSubmitting={isDeactivating}
        onDeactivate={handleDeactivate}
      />
    </div>
  );
}
