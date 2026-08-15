import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  blockCustomerRequest,
  deactivateCustomerRequest,
  getAdminCustomerDetailRequest,
  sendCustomerAdminMessageRequest,
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

    const contactFirstName = escapeHtml(customer.firstName || customer.name || "customer");

    const result = await openAdminModal({
      title: "Contact customer",
      width: 720,
      html: `
        <style>
          #customer-contact-modal {
            display: flex;
            flex-direction: column;
            gap: 18px;
            text-align: left;
          }

          #customer-contact-modal .contact-hero {
            position: relative;
            overflow: hidden;
            border: 1px solid #f0dfd3;
            border-radius: 24px;
            background:
              radial-gradient(circle at top right, rgba(255, 208, 170, 0.9), transparent 34%),
              radial-gradient(circle at bottom left, rgba(255, 233, 215, 0.95), transparent 32%),
              linear-gradient(135deg, #fff6ef 0%, #ffffff 54%, #fff9f4 100%);
            padding: 20px;
          }

          #customer-contact-modal .contact-hero::after {
            content: "";
            position: absolute;
            inset: auto -36px -44px auto;
            width: 132px;
            height: 132px;
            border-radius: 999px;
            background: rgba(207, 110, 56, 0.08);
          }

          #customer-contact-modal .contact-hero-grid {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 16px;
            align-items: start;
          }

          #customer-contact-modal .contact-kicker {
            margin: 0 0 8px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #9b7865;
          }

          #customer-contact-modal .contact-name {
            margin: 0;
            font-size: 29px;
            font-weight: 900;
            line-height: 1.05;
            letter-spacing: -0.05em;
            color: #1f1712;
          }

          #customer-contact-modal .contact-copy {
            margin: 10px 0 0;
            max-width: 470px;
            font-size: 13px;
            line-height: 1.7;
            color: #6f635c;
          }

          #customer-contact-modal .contact-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 14px;
          }

          #customer-contact-modal .contact-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            min-height: 32px;
            padding: 0 12px;
            border: 1px solid #ecdacf;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.82);
            font-size: 12px;
            font-weight: 700;
            color: #594b42;
            backdrop-filter: blur(4px);
          }

          #customer-contact-modal .contact-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 72px;
            height: 72px;
            border-radius: 24px;
            background: linear-gradient(135deg, #cf6e38 0%, #f0a36c 100%);
            color: white;
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -0.04em;
            box-shadow: 0 18px 34px rgba(207, 110, 56, 0.22);
          }

          #customer-contact-modal .contact-form-card {
            border: 1px solid #ece2da;
            border-radius: 24px;
            background: #fffefe;
            padding: 18px;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
          }

          #customer-contact-modal .contact-form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          #customer-contact-modal .contact-field-full {
            grid-column: 1 / -1;
          }

          #customer-contact-modal .contact-label {
            display: block;
            margin: 0 0 7px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #836f62;
          }

          #customer-contact-modal .contact-select,
          #customer-contact-modal .contact-input,
          #customer-contact-modal .contact-textarea {
            width: 100%;
            margin: 0;
            border: 1px solid #ddd4cd;
            border-radius: 16px;
            background: #ffffff;
            color: #2f241d;
            box-sizing: border-box;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
          }

          #customer-contact-modal .contact-select,
          #customer-contact-modal .contact-input {
            height: 50px;
            padding: 0 15px;
            font-size: 14px;
            font-weight: 600;
          }

          #customer-contact-modal .contact-textarea {
            min-height: 148px;
            padding: 14px 15px;
            font-size: 14px;
            line-height: 1.65;
            resize: vertical;
          }

          #customer-contact-modal .contact-select:focus,
          #customer-contact-modal .contact-input:focus,
          #customer-contact-modal .contact-textarea:focus {
            border-color: #cf6e38;
            box-shadow: 0 0 0 4px rgba(207, 110, 56, 0.12);
          }

          #customer-contact-modal .contact-tips {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            margin-top: 14px;
          }

          #customer-contact-modal .contact-tip {
            border: 1px solid #efe4db;
            border-radius: 18px;
            background: linear-gradient(180deg, #fffdfa 0%, #fff7f1 100%);
            padding: 12px;
          }

          #customer-contact-modal .contact-tip-title {
            margin: 0 0 4px;
            font-size: 12px;
            font-weight: 800;
            color: #241913;
          }

          #customer-contact-modal .contact-tip-copy {
            margin: 0;
            font-size: 12px;
            line-height: 1.6;
            color: #7b6e65;
          }

          @media (max-width: 640px) {
            #customer-contact-modal .contact-hero-grid,
            #customer-contact-modal .contact-form-grid,
            #customer-contact-modal .contact-tips {
              grid-template-columns: 1fr;
            }

            #customer-contact-modal .contact-avatar {
              width: 60px;
              height: 60px;
              border-radius: 20px;
              font-size: 20px;
            }

            #customer-contact-modal .contact-name {
              font-size: 24px;
            }

            #customer-contact-modal .contact-form-card,
            #customer-contact-modal .contact-hero {
              padding: 16px;
            }
          }
        </style>
        <div id="customer-contact-modal">
          <div class="contact-hero">
            <div class="contact-hero-grid">
              <div>
                <p class="contact-kicker">Customer outreach</p>
                <p class="contact-name">${escapeHtml(customer.name)}</p>
                <p class="contact-copy">
                  Send a polished admin update across email, SMS, system notification, or in-app delivery with a cleaner communication workflow.
                </p>
                <div class="contact-badges">
                  <span class="contact-badge">${escapeHtml(customer.email || "No email on file")}</span>
                  <span class="contact-badge">${escapeHtml(customer.phone || "No phone on file")}</span>
                  <span class="contact-badge">${escapeHtml(customer.status || "Active")}</span>
                </div>
              </div>
              <div class="contact-avatar">
                ${escapeHtml((customer.name || "CU").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase() || "CU")}
              </div>
            </div>
          </div>

          <div class="contact-form-card">
            <div class="contact-form-grid">
              <div>
                <label for="customer-message-channel" class="contact-label">Delivery channel</label>
                <select id="customer-message-channel" class="contact-select">
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="SYSTEM_NOTIFICATION">System Notification</option>
                  <option value="IN_APP">In-App</option>
                </select>
              </div>

              <div>
                <label for="customer-message-tone" class="contact-label">Message type</label>
                <input id="customer-message-tone" class="contact-input" value="Important account update" readonly />
              </div>

              <div class="contact-field-full">
                <label for="customer-message-subject" class="contact-label">Subject</label>
                <input
                  id="customer-message-subject"
                  class="contact-input"
                  placeholder="Important update regarding your account"
                />
              </div>

              <div class="contact-field-full">
                <label for="customer-message-body" class="contact-label">Message</label>
                <textarea
                  id="customer-message-body"
                  class="contact-textarea"
                  placeholder="Write your message to the customer"
                ></textarea>
              </div>
            </div>

            <div class="contact-tips">
              <div class="contact-tip">
                <p class="contact-tip-title">Clear subject</p>
                <p class="contact-tip-copy">Use a short summary so the customer understands the reason immediately.</p>
              </div>
              <div class="contact-tip">
                <p class="contact-tip-title">Friendly tone</p>
                <p class="contact-tip-copy">Keep it professional, direct, and helpful for better response quality.</p>
              </div>
              <div class="contact-tip">
                <p class="contact-tip-title">Actionable next step</p>
                <p class="contact-tip-copy">Tell the customer exactly what they should do after reading your note.</p>
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
            message: "Hello ${contactFirstName},\\n\\nWe wanted to share an important update regarding your account.\\n\\nNext steps:\\n- Review the details above\\n- Reply if you need help\\n\\nBest regards,\\nAdmin team",
            tone: "Important account update",
          },
          SMS: {
            subject: "Quick account alert",
            message: "Hello ${contactFirstName}, this is a quick update from the admin team regarding your account. Reply if you need help.",
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
