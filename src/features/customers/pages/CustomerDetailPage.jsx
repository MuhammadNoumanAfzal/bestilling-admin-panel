import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  blockCustomerRequest,
  deactivateCustomerRequest,
  getAdminCustomerDetailRequest,
  sendCustomerAdminMessageRequest,
  unblockCustomerRequest,
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

    const contactFirstName = escapeHtml(customer.firstName || customer.name || "customer");

    const result = await openAdminModal({
      title: "Contact customer",
      width: 680,
      html: `
        <div id="customer-contact-modal" class="flex flex-col gap-3 text-left m-[20px]">
          <div class="relative overflow-hidden rounded-[22px] border border-[#f0dfd3] bg-[radial-gradient(circle_at_top_right,rgba(255,208,170,0.9),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,233,215,0.95),transparent_32%),linear-gradient(135deg,#fff6ef_0%,#ffffff_54%,#fff9f4_100%)] p-4">
            <div class="pointer-events-none absolute -bottom-11 -right-9 h-[132px] w-[132px] rounded-full bg-[rgba(207,110,56,0.08)]"></div>
            <div class="relative z-[1] grid items-start gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <p class="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#9b7865]">Customer outreach</p>
                <p class="m-0 text-[22px] font-black leading-[1.05] tracking-[-0.05em] text-[#1f1712] sm:text-[26px]">${escapeHtml(customer.name)}</p>
                <p class="mt-2 max-w-[470px] text-[12.5px] leading-[1.6] text-[#6f635c]">
                  Send a polished admin update across email, SMS, system notification, or in-app delivery with a cleaner communication workflow.
                </p>
                <div class="mt-2.5 flex flex-wrap gap-[7px]">
                  <span class="inline-flex min-h-7 items-center rounded-full border border-[#ecdacf] bg-[rgba(255,255,255,0.82)] px-2.5 text-[11.5px] font-bold text-[#594b42] backdrop-blur-[4px]">${escapeHtml(customer.email || "No email on file")}</span>
                  <span class="inline-flex min-h-7 items-center rounded-full border border-[#ecdacf] bg-[rgba(255,255,255,0.82)] px-2.5 text-[11.5px] font-bold text-[#594b42] backdrop-blur-[4px]">${escapeHtml(customer.phone || "No phone on file")}</span>
                  <span class="inline-flex min-h-7 items-center rounded-full border border-[#ecdacf] bg-[rgba(255,255,255,0.82)] px-2.5 text-[11.5px] font-bold text-[#594b42] backdrop-blur-[4px]">${escapeHtml(customer.status || "Active")}</span>
                </div>
              </div>
              <div class="flex h-[54px] w-[54px] items-center justify-center self-start rounded-[18px] bg-[linear-gradient(135deg,#cf6e38_0%,#f0a36c_100%)] text-[20px] font-black tracking-[-0.04em] text-white shadow-[0_18px_34px_rgba(207,110,56,0.22)] sm:h-16 sm:w-16 sm:rounded-[20px] sm:text-[22px]">
                ${escapeHtml((customer.name || "CU").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase() || "CU")}
              </div>
            </div>
          </div>

          <div class="rounded-[22px] border border-[#ece2da] bg-[#fffefe] p-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div class="grid gap-3 sm:grid-cols-2">
              <div>
                <label for="customer-message-channel" class="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#836f62]">Delivery channel</label>
                <select id="customer-message-channel" class="h-[46px] w-full rounded-[14px] border border-[#ddd4cd] bg-white px-[14px] text-[13.5px] font-semibold text-[#2f241d] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_4px_rgba(207,110,56,0.12)]">
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="SYSTEM_NOTIFICATION">System Notification</option>
                  <option value="IN_APP">In-App</option>
                </select>
              </div>

              <div>
                <label for="customer-message-tone" class="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#836f62]">Message type</label>
                <input id="customer-message-tone" class="h-[46px] w-full rounded-[14px] border border-[#ddd4cd] bg-white px-[14px] text-[13.5px] font-semibold text-[#2f241d] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_4px_rgba(207,110,56,0.12)]" value="Important account update" readonly />
              </div>

              <div class="sm:col-span-2">
                <label for="customer-message-subject" class="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#836f62]">Subject</label>
                <input
                  id="customer-message-subject"
                  class="h-[46px] w-full rounded-[14px] border border-[#ddd4cd] bg-white px-[14px] text-[13.5px] font-semibold text-[#2f241d] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_4px_rgba(207,110,56,0.12)]"
                  placeholder="Important update regarding your account"
                />
              </div>

              <div class="sm:col-span-2">
                <label for="customer-message-body" class="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#836f62]">Message</label>
                <textarea
                  id="customer-message-body"
                  class="min-h-[112px] w-full resize-y rounded-[14px] border border-[#ddd4cd] bg-white px-[14px] py-3 text-[13.5px] leading-[1.55] text-[#2f241d] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_4px_rgba(207,110,56,0.12)]"
                  placeholder="Write your message to the customer"
                ></textarea>
              </div>
            </div>

            <div class="mt-2.5 grid gap-2 sm:grid-cols-3">
              <div class="rounded-[16px] border border-[#efe4db] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] p-2.5">
                <p class="mb-[3px] text-[11.5px] font-extrabold text-[#241913]">Clear subject</p>
                <p class="m-0 text-[11.5px] leading-[1.5] text-[#7b6e65]">Use a short summary so the customer understands the reason immediately.</p>
              </div>
              <div class="rounded-[16px] border border-[#efe4db] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] p-2.5">
                <p class="mb-[3px] text-[11.5px] font-extrabold text-[#241913]">Friendly tone</p>
                <p class="m-0 text-[11.5px] leading-[1.5] text-[#7b6e65]">Keep it professional, direct, and helpful for better response quality.</p>
              </div>
              <div class="rounded-[16px] border border-[#efe4db] bg-[linear-gradient(180deg,#fffdfa_0%,#fff7f1_100%)] p-2.5">
                <p class="mb-[3px] text-[11.5px] font-extrabold text-[#241913]">Actionable next step</p>
                <p class="m-0 text-[11.5px] leading-[1.5] text-[#7b6e65]">Tell the customer exactly what they should do after reading your note.</p>
              </div>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Send message",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
      didOpen: () => {
        const channelSelect = window.document.getElementById("customer-message-channel");
        const subjectInput = window.document.getElementById("customer-message-subject");
        const bodyTextarea = window.document.getElementById("customer-message-body");
        const toneInput = window.document.getElementById("customer-message-tone");

        const placeholdersByChannel = {
          EMAIL: {
            subject: "Important update regarding your account",
            message: `Hello ${contactFirstName},\n\nWe wanted to share an important update regarding your account.\n\nNext steps:\n- Review the details above\n- Reply if you need help\n\nBest regards,\nAdmin team`,
            tone: "Important account update",
          },
          SMS: {
            subject: "Quick account alert",
            message: `Hello ${contactFirstName}, this is a quick update from the admin team regarding your account. Reply if you need help.`,
            tone: "Short SMS alert",
          },
          SYSTEM_NOTIFICATION: {
            subject: "Platform notification",
            message: "We have posted an important platform update related to your account. Open your dashboard for more details.",
            tone: "System notification",
          },
          IN_APP: {
            subject: "In-app update",
            message: "You have a new update from the admin team inside your account. Please review it when convenient.",
            tone: "In-app message",
          },
        };

        const applyChannelPreset = () => {
          const nextPreset = placeholdersByChannel[channelSelect?.value] || placeholdersByChannel.EMAIL;

          if (toneInput) {
            toneInput.value = nextPreset.tone;
          }

          if (subjectInput && !subjectInput.value.trim()) {
            subjectInput.placeholder = nextPreset.subject;
          }

          if (bodyTextarea && !bodyTextarea.value.trim()) {
            bodyTextarea.placeholder = nextPreset.message.replace(/\\n/g, "\n");
          }
        };

        channelSelect?.addEventListener("change", applyChannelPreset);
        applyChannelPreset();
        subjectInput?.focus();
      },
      preConfirm: () => {
        const channel = window.document.getElementById("customer-message-channel")?.value || "";
        const subject = window.document.getElementById("customer-message-subject")?.value?.trim() || "";
        const message = window.document.getElementById("customer-message-body")?.value?.trim() || "";

        if (!subject || !message) {
          Swal.showValidationMessage("Subject and message are required.");
          return null;
        }

        return { channel, subject, message };
      },
    });

    if (!result.value) {
      return;
    }

    try {
      const response = await sendCustomerAdminMessageRequest(customer.id, result.value);

      await openAdminModal({
        icon: "success",
        title: "Message sent",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await openAdminModal({
        icon: "error",
        title: "Unable to send message",
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
              isBlocked: !isBlocked,
              blockedReason: !isBlocked ? reason : "",
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
              isInactive: true,
              deactivationReason: reasonResult.value || "",
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

      <CustomerProfileInfoCard customer={customer} />

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
