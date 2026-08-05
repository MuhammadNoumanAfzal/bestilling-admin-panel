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

const customerSwalClasses = {
  popup: "rounded-[22px] border border-[#eaded6] bg-[#fffdfa] shadow-[0_24px_60px_rgba(56,33,17,0.18)]",
  title: "text-[22px] font-extrabold tracking-[-0.03em] text-[#201814]",
  htmlContainer: "!mx-0 !w-full !overflow-visible !px-0 text-left text-[#6c5f57]",
  confirmButton:
    "inline-flex h-10 items-center justify-center rounded-[12px] bg-[#cf6e38] px-4 text-[13px] font-bold text-white transition hover:bg-[#bc6030]",
  cancelButton:
    "inline-flex h-10 items-center justify-center rounded-[12px] border border-[#ddd2ca] bg-white px-4 text-[13px] font-bold text-[#2f241d] transition hover:bg-[#faf6f2]",
  input:
    "swal2-input !mt-0 !mb-0 !h-11 !w-full !rounded-[12px] !border !border-[#ddd4cd] !bg-white !px-4 !text-[14px] !text-[#2f241d] focus:!border-[#cf6e38] focus:!shadow-[0_0_0_3px_rgba(206,105,56,0.12)]",
  textarea:
    "swal2-textarea !mt-0 !mb-0 !min-h-[104px] !w-full !rounded-[12px] !border !border-[#ddd4cd] !bg-white !px-4 !py-3 !text-[14px] !text-[#2f241d] focus:!border-[#cf6e38] focus:!shadow-[0_0_0_3px_rgba(206,105,56,0.12)]",
  validationMessage: "!mt-3 !rounded-[12px] !bg-[#fff2ea] !px-4 !py-3 !text-left !text-[13px] !font-medium !text-[#b44d22]",
};

function openAdminModal(config) {
  return Swal.fire({
    ...config,
    customClass: {
      ...customerSwalClasses,
      ...(config.customClass || {}),
    },
    buttonsStyling: false,
    reverseButtons: true,
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

    await openAdminModal({
      title: "Customer contact details",
      html: `
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div style="border:1px solid #ece2da;border-radius:18px;background:linear-gradient(180deg,#fff8f3 0%,#ffffff 100%);padding:18px;">
            <div style="display:flex;flex-direction:column;gap:10px;">
              <div>
                <p style="margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#a0938b;">Customer</p>
                <p style="margin:0;font-size:24px;font-weight:800;color:#201814;">${escapeHtml(customer.name)}</p>
              </div>
              <div style="display:grid;gap:12px;">
                <div style="border:1px solid #eee4dd;border-radius:14px;background:#fff;padding:12px 14px;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#a0938b;">Email</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#2f241d;">${escapeHtml(customer.email || "Not available")}</p>
                </div>
                <div style="border:1px solid #eee4dd;border-radius:14px;background:#fff;padding:12px 14px;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#a0938b;">Phone</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#2f241d;">${escapeHtml(customer.phone || "Not available")}</p>
                </div>
                <div style="border:1px solid #eee4dd;border-radius:14px;background:#fff;padding:12px 14px;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#a0938b;">City</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#2f241d;">${escapeHtml(customer.city || "Not available")}</p>
                </div>
              </div>
            </div>
          </div>
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

    const { value } = await openAdminModal({
      title: "Edit customer profile",
      width: 520,
      html: `
        <div style="display:flex;flex-direction:column;gap:14px;width:100%;max-width:100%;overflow:hidden;text-align:left;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;border:1px solid #ece2da;border-radius:16px;background:#fff8f3;padding:14px 16px;">
            <div>
              <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#cf6e38;">Quick edit</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#7d7068;">Update contact details and internal notes.</p>
            </div>
            <div style="min-width:42px;height:42px;border-radius:12px;background:#ffffff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#cf6e38;border:1px solid #f0dfd4;">
              ${escapeHtml((customer.firstName || customer.name || "CU").slice(0, 2).toUpperCase())}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;width:100%;">
            <div>
              <label for="customer-first-name" style="display:block;margin:0 0 6px;font-size:12px;font-weight:700;color:#6f645d;">First name</label>
              <input id="customer-first-name" class="swal2-input" placeholder="First name" value="${escapeHtml(customer.firstName || "")}">
            </div>
            <div>
              <label for="customer-last-name" style="display:block;margin:0 0 6px;font-size:12px;font-weight:700;color:#6f645d;">Last name</label>
              <input id="customer-last-name" class="swal2-input" placeholder="Last name" value="${escapeHtml(customer.lastName || "")}">
            </div>
          </div>
          <div>
            <label for="customer-email" style="display:block;margin:0 0 6px;font-size:12px;font-weight:700;color:#6f645d;">Email address</label>
            <input id="customer-email" class="swal2-input" placeholder="Email" value="${escapeHtml(customer.email || "")}">
          </div>
          <div>
            <label for="customer-phone" style="display:block;margin:0 0 6px;font-size:12px;font-weight:700;color:#6f645d;">Phone number</label>
            <input id="customer-phone" class="swal2-input" placeholder="Phone" value="${escapeHtml(customer.phone || "")}">
          </div>
          <div>
            <label for="customer-notes" style="display:block;margin:0 0 6px;font-size:12px;font-weight:700;color:#6f645d;">Admin notes</label>
            <textarea id="customer-notes" class="swal2-textarea" placeholder="Add a private admin note">${escapeHtml(customer.profile?.notes || "")}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save changes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup();
        if (popup) {
          popup.style.overflow = "hidden";
        }

        const container = Swal.getHtmlContainer();
        if (container) {
          container.style.overflow = "visible";
        }

        const firstNameInput = window.document.getElementById("customer-first-name");
        if (firstNameInput) {
          firstNameInput.focus();
        }
      },
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

      await openAdminModal({
        icon: "success",
        title: "Profile updated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await openAdminModal({
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
    const confirmation = await openAdminModal({
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
      const reasonResult = await openAdminModal({
        title: "Add block reason",
        html: `
          <div style="display:flex;flex-direction:column;gap:14px;text-align:left;">
            <div style="border:1px solid #f3d8d8;border-radius:18px;background:linear-gradient(180deg,#fff6f6 0%,#ffffff 100%);padding:16px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#c53a2f;">Restricted access</p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#7d7068;">This customer will be prevented from logging in and placing new orders until the account is unblocked.</p>
            </div>
            <div>
              <label for="customer-block-reason" style="display:block;margin:0 0 6px;font-size:12px;font-weight:700;color:#6f645d;">Reason</label>
              <textarea id="customer-block-reason" class="swal2-textarea" placeholder="Add an internal note for this block action"></textarea>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d83f3f",
        cancelButtonColor: "#c8b9aa",
        preConfirm: () => window.document.getElementById("customer-block-reason")?.value?.trim() || "",
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

      await openAdminModal({
        icon: "success",
        title: isBlocked ? "Customer unblocked" : "Customer blocked",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await openAdminModal({
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

    const reasonResult = await openAdminModal({
      title: "Deactivate customer?",
      html: `
        <div style="display:flex;flex-direction:column;gap:14px;text-align:left;">
          <div style="border:1px solid #f3d8d8;border-radius:18px;background:linear-gradient(180deg,#fff6f6 0%,#ffffff 100%);padding:16px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#c53a2f;">Account deactivation</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#7d7068;">This will disable ${escapeHtml(customer.name)}'s access while preserving historical order and billing records.</p>
          </div>
          <div>
            <label for="customer-deactivate-reason" style="display:block;margin:0 0 6px;font-size:12px;font-weight:700;color:#6f645d;">Reason for deactivation</label>
            <textarea id="customer-deactivate-reason" class="swal2-textarea" placeholder="Add an optional internal reason"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Deactivate account",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d83f3f",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => window.document.getElementById("customer-deactivate-reason")?.value?.trim() || "",
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

      await openAdminModal({
        icon: "success",
        title: "Customer deactivated",
        text: result.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await openAdminModal({
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
