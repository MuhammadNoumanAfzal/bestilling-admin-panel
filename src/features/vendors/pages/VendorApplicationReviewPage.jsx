import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock3,
  Download,
  Eye,
  Image as ImageIcon,
  MapPin,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  approveVendorApplicationRequest,
  getAdminVendorApplicationReviewRequest,
  getVendorDocumentAccessRequest,
  rejectVendorApplicationRequest,
  requestVendorApplicationChangesRequest,
  reviewVendorDocumentRequest,
} from "../api/vendorsApi.js";

function SectionTitle({ title, subtitle = "" }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2.5">
        <span className="h-6 w-[4px] rounded-full bg-[#dc6a34]" />
        <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#1d1510]">{title}</h2>
      </div>
      {subtitle ? <p className="mt-2 text-[14px] leading-6 text-[#7a6d66]">{subtitle}</p> : null}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <div className="h-40 animate-pulse rounded-[18px] border border-[#ddd2c9] bg-white" />
      <div className="h-28 animate-pulse rounded-[16px] border border-[#ddd2c9] bg-white" />
      <div className="h-72 animate-pulse rounded-[16px] border border-[#ddd2c9] bg-white" />
    </div>
  );
}

function ChecklistItem({ item }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[12px] border border-[#eee3db] bg-[#fffdfa] px-4 py-3">
      <span className="pt-0.5">
        {item.complete ? (
          <CheckCircle2 size={14} className="text-[#de6b34]" />
        ) : item.blocking ? (
          <AlertTriangle size={14} className="text-[#c53a2f]" />
        ) : (
          <Circle size={14} className="text-[#b8aaa0]" />
        )}
      </span>
      <div>
        <p className={`text-[13px] leading-6 ${item.complete ? "text-[#6c5d54]" : "text-[#8d8078]"}`}>
          {item.label}
        </p>
        {item.blocking && !item.complete ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#c53a2f]">Blocking</p>
        ) : null}
      </div>
    </div>
  );
}

function AssetCard({ imageUrl, label }) {
  return (
    <article className="overflow-hidden rounded-[16px] border border-[#d8d0c8] bg-white shadow-[0_6px_14px_rgba(53,34,20,0.05)]">
      <div className="flex h-[220px] items-center justify-center bg-[#f5f1ed]">
        {imageUrl ? (
          <img alt={label} className="h-full w-full object-cover" src={imageUrl} />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#9f9188]">
            <ImageIcon size={22} />
            <p className="text-[13px] font-medium">Not uploaded</p>
          </div>
        )}
      </div>
      <div className="border-t border-[#eee4dd] px-4 py-3">
        <p className="text-[14px] font-bold text-[#18120f]">{label}</p>
      </div>
    </article>
  );
}

function DocumentCard({ document, onDownload, onPreview, onReview }) {
  return (
    <article className="group rounded-[22px] border border-[#e7ddd4] bg-[linear-gradient(180deg,#fffdfb_0%,#ffffff_100%)] p-5 shadow-[0_10px_30px_rgba(53,34,20,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-[#e3c9b8] hover:shadow-[0_20px_40px_rgba(53,34,20,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1c1510]">{document.title}</h3>
          <p className="mt-1 text-[12px] leading-5 text-[#8d8078]">{document.subtitle || document.type}</p>
        </div>
        <span
          className={[
            "shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em]",
            document.status === "Verified"
              ? "border-[#d9eadf] bg-[#eef8f1] text-[#287946]"
              : document.status === "Rejected"
                ? "border-[#f3c7c7] bg-[#fff5f5] text-[#b83a3a]"
                : "border-[#ead9c9] bg-[#fff8f1] text-[#8f5a2e]",
          ].join(" ")}
        >
          {document.status}
        </span>
      </div>

      <div className="mt-4 grid gap-2 rounded-[18px] border border-[#f1e8e1] bg-[#fcfaf8] p-3 text-[12px] text-[#7f7269]">
        <p><span className="font-bold text-[#3f322c]">Uploaded:</span> {document.uploadedAtLabel}</p>
        <p><span className="font-bold text-[#3f322c]">Reviewed:</span> {document.reviewedAt ? document.reviewedAtLabel : "Not reviewed yet"}</p>
        <p><span className="font-bold text-[#3f322c]">Type:</span> {document.isRequired ? "Required compliance document" : "Optional document"}</p>
      </div>

      {document.reviewNote ? (
        <div className="mt-3 rounded-[16px] border border-[#ece2da] bg-[#f7f3f0] px-3.5 py-3 text-[12px] leading-5 text-[#6f6259]">
          <span className="font-bold text-[#433630]">Review note:</span> {document.reviewNote}
        </div>
      ) : null}

      {document.rejectionReason ? (
        <div className="mt-2 rounded-[16px] border border-[#f3d2cf] bg-[#fff5f5] px-3.5 py-3 text-[12px] leading-5 text-[#b83a3a]">
          <span className="font-bold">Reason:</span> {document.rejectionReason}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#e6dbd3] bg-[#f6f1ec] px-4 py-2.5 text-[13px] font-bold text-[#1c1510] transition hover:border-[#dcc5b5] hover:bg-[#efe8e1]"
          onClick={() => onPreview(document)}
          type="button"
        >
          <Eye size={14} />
          Preview
        </button>
        <button
          className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#e6dbd3] bg-[#f6f1ec] px-4 py-2.5 text-[13px] font-bold text-[#1c1510] transition hover:border-[#dcc5b5] hover:bg-[#efe8e1]"
          onClick={() => onDownload(document)}
          type="button"
        >
          <Download size={14} />
          Download
        </button>
      </div>

      <button
        className="mt-3 inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center rounded-[14px] border border-[#e8cdbf] bg-[#fff8f3] px-4 py-2.5 text-[13px] font-bold text-[#cf6e38] transition hover:border-[#cf6e38] hover:bg-[#fff0e5]"
        onClick={() => onReview(document)}
        type="button"
      >
        Review Status
      </button>
    </article>
  );
}

function HistoryItem({ item }) {
  return (
    <div className="rounded-[14px] border border-[#ece2da] bg-[#fffdfa] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] font-bold text-[#231913]">
          {item.action}
          {item.status ? ` · ${item.status}` : ""}
        </p>
        <p className="text-[12px] text-[#8d8078]">{item.createdAtLabel}</p>
      </div>
      <p className="mt-1 text-[12px] font-medium text-[#7a6d66]">By {item.actorName}</p>
      {item.note ? <p className="mt-2 text-[13px] leading-6 text-[#5d4f47]">{item.note}</p> : null}
    </div>
  );
}

function getApplicationBadgeClass(status) {
  switch (`${status ?? ""}`.trim()) {
    case "Rejected":
      return "bg-[#fff1f0] text-[#b43c2d]";
    case "Pending Approval":
      return "bg-[#fff3df] text-[#8a5318]";
    case "Active":
      return "bg-[#edf8ef] text-[#247446]";
    default:
      return "bg-[#f2c49d] text-[#6f3a16]";
  }
}

export default function VendorApplicationReviewPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadReview() {
      setIsLoading(true);
      setLoadError("");

      try {
        const detail = await getAdminVendorApplicationReviewRequest(decodeURIComponent(vendorId || ""));

        if (isMounted) {
          setVendor(detail);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load this application.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReview();

    return () => {
      isMounted = false;
    };
  }, [vendorId]);

  function openDocumentUrl(url) {
    if (!url) {
      throw new Error("This file is not available right now.");
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleDocumentAccess(document, kind) {
    try {
      const access = await getVendorDocumentAccessRequest(document.id);
      openDocumentUrl(
        kind === "preview" ? access.previewUrl || access.downloadUrl : access.downloadUrl || access.previewUrl,
      );
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: `Unable to ${kind} document`,
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  async function handleReviewDocument(document) {
    const result = await Swal.fire({
      html: `
        <div class="flex flex-col gap-5 px-6 pb-2 pt-6 text-center sm:px-8">
          <div class="flex flex-col items-center gap-2">
            <div>
              <span class="block text-[12px] font-medium text-[#6f6761]">Document review</span>
              <h2 class="mt-1 text-[20px] font-semibold text-[#4a4a4a] sm:text-[22px]">Review vendor document</h2>
              <p class="mx-auto mt-1 max-w-[540px] text-[14px] leading-7 text-[#5d5d5d] sm:text-[15px]">
                Update the review result for <strong>${document.title}</strong> and leave a clear note for the audit trail.
              </p>
            </div>
          </div>

          <div class="space-y-5">
            <div class="space-y-1 text-center">
              <div class="text-[13px] text-[#66615b]">Uploaded <strong class="text-[15px] font-semibold text-[#434343]">${document.uploadedAtLabel || "Not available"}</strong></div>
              <div class="text-[13px] text-[#66615b]">Current state <strong class="text-[15px] font-semibold text-[#434343]">${document.status || "Pending"}</strong></div>
            </div>

            <div class="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
              <label class="flex flex-col gap-2 text-left" for="vendor-document-status">
                <span class="text-[13px] font-medium text-[#56504a]">Status</span>
                <select id="vendor-document-status" class="swal2-select !m-0 !flex !h-[50px] !w-full !rounded-[12px] !border !border-[#e1d7cf] !bg-white !px-4 !text-[15px] !font-medium !text-[#4e4943] !shadow-none focus:!border-[#cf6e38] focus:!shadow-[0_0_0_4px_rgba(207,110,56,0.12)]">
                  <option value="VERIFIED">Verified</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </label>

              <label class="flex flex-col gap-2 text-left" for="vendor-document-note">
                <span class="text-[13px] font-medium text-[#56504a]">Review note</span>
                <textarea id="vendor-document-note" class="swal2-textarea !m-0 !min-h-[136px] !w-full !resize-none !rounded-[12px] !border !border-[#e1d7cf] !bg-white !px-4 !py-3 !text-[15px] !leading-7 !text-[#413b36] !shadow-none placeholder:!text-[#c3beb8] focus:!border-[#cf6e38] focus:!shadow-[0_0_0_4px_rgba(207,110,56,0.12)]" placeholder="Add a helpful note about what was checked or what still needs attention"></textarea>
              </label>
            </div>

            <label class="hidden flex-col gap-2 text-left" id="vendor-document-reason-field" for="vendor-document-reason">
              <span class="text-[13px] font-medium text-[#56504a]">Rejection reason</span>
              <input id="vendor-document-reason" class="swal2-input !m-0 !flex !h-[50px] !w-full !rounded-[12px] !border !border-[#e1d7cf] !bg-white !px-4 !text-[14px] !font-medium !text-[#413b36] !shadow-none placeholder:!text-[#b8afa7] focus:!border-[#cf6e38] focus:!shadow-[0_0_0_4px_rgba(207,110,56,0.12)]" placeholder="Required only when the document is rejected" />
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save review",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
      width: 720,
      customClass: {
        popup:
          "vendor-document-review-modal__popup !overflow-hidden !rounded-[18px] !border !border-[#eadfd7] !bg-white !p-0 shadow-[0_30px_80px_rgba(37,22,12,0.18)]",
        htmlContainer: "vendor-document-review-modal__content !m-0 !p-0",
        actions: "vendor-document-review-modal__actions !mt-0 !gap-2 !px-6 !pb-6 !pt-0",
        confirmButton:
          "vendor-document-review-modal__confirm !m-0 !h-11 !rounded-[10px] !bg-[#db6d34] !px-5 !text-[13px] !font-bold !text-white !shadow-none hover:!bg-[#c9602c]",
        cancelButton:
          "vendor-document-review-modal__cancel !m-0 !h-11 !rounded-[10px] !border-0 !bg-[#cbb8a3] !px-5 !text-[13px] !font-bold !text-white !shadow-none hover:!bg-[#b8a38e]",
        validationMessage:
          "vendor-document-review-modal__validation !mx-6 !mb-4 !mt-0 !rounded-[12px] !bg-[#fff1ef] !px-4 !py-3 !text-[13px] !font-semibold !text-[#c83d31]",
      },
      preConfirm: () => {
        const status = window.document.getElementById("vendor-document-status")?.value || "";
        const reviewNote = window.document.getElementById("vendor-document-note")?.value?.trim() || "";
        const rejectionReason = window.document.getElementById("vendor-document-reason")?.value?.trim() || "";

        if (!status) {
          Swal.showValidationMessage("Status is required.");
          return null;
        }

        if (status === "REJECTED" && !rejectionReason) {
          Swal.showValidationMessage("Rejection reason is required for rejected documents.");
          return null;
        }

        return { status, reviewNote, rejectionReason };
      },
      didOpen: () => {
        const statusElement = window.document.getElementById("vendor-document-status");
        const noteElement = window.document.getElementById("vendor-document-note");
        const reasonElement = window.document.getElementById("vendor-document-reason");
        const reasonField = window.document.getElementById("vendor-document-reason-field");

        const syncReasonVisibility = () => {
          const isRejected = statusElement?.value === "REJECTED";

          if (reasonField) {
            reasonField.style.display = isRejected ? "flex" : "none";
          }
        };

        if (statusElement) {
          statusElement.value = document.rawStatus || "PENDING";
          statusElement.addEventListener("change", syncReasonVisibility);
        }
        if (noteElement) {
          noteElement.value = document.reviewNote || "";
        }
        if (reasonElement) {
          reasonElement.value = document.rejectionReason || "";
        }

        syncReasonVisibility();
      },
    });

    if (!result.value) {
      return;
    }

    try {
      const response = await reviewVendorDocumentRequest(document.id, result.value);
      const refreshed = await getAdminVendorApplicationReviewRequest(vendor.id);
      setVendor(refreshed);

      await Swal.fire({
        icon: "success",
        title: "Document reviewed",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to review document",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  async function handleApprove() {
    if (!vendor) {
      return;
    }

    if (!vendor.canApprove) {
      await Swal.fire({
        icon: "warning",
        title: "Approval blocked",
        text: "Some required checklist items are still incomplete.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: "Approve vendor application?",
      text: `This will approve ${vendor.name} if all readiness requirements are satisfied.`,
      showCancelButton: true,
      confirmButtonText: "Approve vendor",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d76833",
      cancelButtonColor: "#c8b9aa",
    });

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await approveVendorApplicationRequest(vendor.id, {});

      await Swal.fire({
        icon: "success",
        title: "Vendor approved",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });

      navigate(`/vendors/${encodeURIComponent(vendor.vendorId || vendor.id)}`);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to approve vendor",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  async function handleReject() {
    if (!vendor) {
      return;
    }

    const result = await Swal.fire({
      html: `
        <div class="vendor-review-alert__shell">
          <div class="vendor-review-alert__hero">
            <div class="vendor-review-alert__hero-badge">Decision Required</div>
            <h2 class="vendor-review-alert__title">Reject vendor application</h2>
            <p class="vendor-review-alert__lead">
              Share a clear reason so the team has a proper audit trail and the vendor can understand what blocked approval.
            </p>
          </div>

          <div class="vendor-review-alert__panel">
            <label class="vendor-review-alert__field" for="vendor-reject-reason">
              <span>Primary reason</span>
              <input
                id="vendor-reject-reason"
                class="swal2-input vendor-review-alert__input"
                placeholder="Compliance issue, incomplete documents, duplicate application..."
              />
            </label>

            <label class="vendor-review-alert__field" for="vendor-reject-note">
              <span>Internal note</span>
              <textarea
                id="vendor-reject-note"
                class="swal2-textarea vendor-review-alert__textarea"
                placeholder="Add extra context for your team or the support history"
              ></textarea>
            </label>

            <div class="vendor-review-alert__note">
              <span class="vendor-review-alert__note-icon">!</span>
              <p>This action marks the application as rejected. Use a precise reason so future reviews stay consistent.</p>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Reject application",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#c53a2f",
      cancelButtonColor: "#c8b9aa",
      customClass: {
        popup: "vendor-review-alert",
        htmlContainer: "vendor-review-alert__content",
        actions: "vendor-review-alert__actions",
        confirmButton: "vendor-review-alert__confirm",
        cancelButton: "vendor-review-alert__cancel",
        validationMessage: "vendor-review-alert__validation",
      },
      preConfirm: () => {
        const reason = window.document.getElementById("vendor-reject-reason")?.value?.trim() || "";
        const note = window.document.getElementById("vendor-reject-note")?.value?.trim() || "";

        if (!reason) {
          Swal.showValidationMessage("Reason is required.");
          return null;
        }

        return { reason, note };
      },
      didOpen: () => {
        const reasonInput = window.document.getElementById("vendor-reject-reason");

        if (reasonInput) {
          reasonInput.focus();
        }
      },
    });

    if (!result.value) {
      return;
    }

    try {
      const response = await rejectVendorApplicationRequest(vendor.id, result.value);
      setVendor((current) =>
        current
          ? {
              ...current,
              applicationStatus: response.applicationStatus,
              reviewedAt: response.reviewedAt,
              reviewedDate: response.reviewedAt || current.reviewedDate,
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: "Application rejected",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to reject application",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  async function handleRequestChanges() {
    if (!vendor) {
      return;
    }

    const suggestedFields = Array.isArray(vendor.missingRequirements)
      ? vendor.missingRequirements.filter((item) => item?.code && item?.label)
      : [];

    const result = await Swal.fire({
      html: `
        <div class="text-left">
          <div class="rounded-[34px] border border-[#ebddd3] bg-[linear-gradient(180deg,#fff8f3_0%,#ffffff_100%)] p-3 shadow-[0_24px_70px_rgba(37,22,12,0.08)]">
            <div class="mb-3">
              <span class="inline-flex items-center rounded-full border border-[#efd1bf] bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#bf6739]">
                Vendor Review
              </span>
              <h2 class="mt-2.5 text-[32px] font-black tracking-[-0.05em] text-[#1d1510]">
                Request application changes
              </h2>
              <p class="mt-1.5 max-w-[44ch] text-[14px] leading-6 text-[#6f6259]">
                Send a clear correction request so the vendor knows exactly what to update before approval.
              </p>
            </div>

            <div class="space-y-2.5">
              <div class="rounded-[22px] border border-[#efdfd3] bg-white/90 p-3">
                <p class="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#4b3c33]">
                  Vendor instructions
                </p>
                <p class="mt-1 text-[13px] leading-5 text-[#72655d]">
                  Tell the vendor exactly what needs to be corrected before approval.
                </p>
              </div>

              <div>
                <label class="mb-1 block text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#4b3c33]" for="vendor-change-message">
                  Message
                </label>
                <textarea
                  id="vendor-change-message"
                  class="swal2-textarea !m-0 !min-h-[88px] !w-full !rounded-[22px] !border !border-[#e4d7ce] !bg-white !px-4 !py-3 !text-[15px] !leading-7 !text-[#2a1f19] !shadow-none placeholder:!text-[#ab9c91] focus:!border-[#cf6e38] focus:!shadow-[0_0_0_4px_rgba(207,110,56,0.12)]"
                  placeholder="Explain what the vendor must update and how to fix it"
                ></textarea>
              </div>

              <div class="rounded-[22px] border border-[#efdfd3] bg-white p-3">
                <div class="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p class="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#4b3c33]">
                      Requested checklist items
                    </p>
                    <p class="mt-0.5 text-[12px] leading-4 text-[#85776e]">
                      Select the blockers the vendor must resolve.
                    </p>
                  </div>
                </div>
                <div id="vendor-change-fields" class="flex max-h-[148px] flex-col gap-2 overflow-auto pr-1">
              ${
                suggestedFields.length
                  ? suggestedFields
                      .map(
                        (item) => `
                          <label class="flex cursor-pointer items-start gap-3 rounded-[18px] border border-[#efe3d8] bg-[#fffdfa] px-3.5 py-2 transition hover:border-[#e4c9b8] hover:bg-[#fff7f1]">
                            <input type="checkbox" value="${item.code}" checked class="mt-0.5 h-4 w-4 rounded border-[#d8ccc2] text-[#d96834] focus:ring-[#cf6e38]" />
                            <span>
                              <span class="block text-[14px] font-bold text-[#231913]">${item.label}</span>
                              <span class="mt-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8b7d74]">${item.code}</span>
                            </span>
                          </label>
                        `,
                      )
                      .join("")
                  : `<p class="m-0 rounded-[14px] border border-dashed border-[#e8dad0] bg-[#fcfaf8] px-4 py-4 text-[12px] leading-6 text-[#7b6f66]">No checklist codes were returned by the API. You can still submit a free-text change request message.</p>`
              }
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Request changes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
      width: 760,
      customClass: {
        popup: "!overflow-hidden !rounded-[34px] !border !border-[#ebddd3] !p-0",
        htmlContainer: "!m-0 !p-0",
        actions: "!mt-0 !gap-3 !px-5 !pb-5 !pt-0",
        confirmButton:
          "!m-0 !h-12 !rounded-[14px] !bg-[#d96834] !px-5 !text-[13px] !font-extrabold !shadow-[0_18px_30px_rgba(217,104,52,0.24)]",
        cancelButton:
          "!m-0 !h-12 !rounded-[14px] !border !border-[#ddd1c8] !bg-[#f4ede7] !px-5 !text-[13px] !font-extrabold !text-[#6d5f56]",
        validationMessage: "!mx-6 !mb-4 !mt-0 !rounded-[14px] !bg-[#fff1ef] !px-4 !py-3 !text-[13px] !font-bold !text-[#c83d31]",
      },
      preConfirm: () => {
        const message = window.document.getElementById("vendor-change-message")?.value?.trim() || "";
        const fieldsValue = Array.from(
          window.document.querySelectorAll('#vendor-change-fields input[type="checkbox"]:checked'),
        )
          .map((element) => element.value?.trim())
          .filter(Boolean);

        if (!message) {
          Swal.showValidationMessage("A message is required.");
          return null;
        }

        return {
          message,
          fields: fieldsValue,
        };
      },
      didOpen: () => {
        const messageElement = window.document.getElementById("vendor-change-message");

        if (messageElement && suggestedFields.length) {
          messageElement.value = `Please update the following before approval:\n${suggestedFields
            .map((item) => `- ${item.label}`)
            .join("\n")}`;
        }

        if (messageElement) {
          messageElement.focus();
        }
      },
    });

    if (!result.value) {
      return;
    }

    try {
      const response = await requestVendorApplicationChangesRequest(vendor.id, result.value);
      const refreshed = await getAdminVendorApplicationReviewRequest(vendor.id);
      setVendor(refreshed);

      await Swal.fire({
        icon: "success",
        title: "Changes requested",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to request changes",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!vendor) {
    return (
      <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-10 text-center text-[15px] font-medium text-[#9f4d33]">
        {loadError || "Unable to load this vendor application."}
      </div>
    );
  }

  const reviewChecklist = Array.isArray(vendor.checklist) ? vendor.checklist : [];
  const missingRequirements = Array.isArray(vendor.missingRequirements) ? vendor.missingRequirements : [];
  const checklistTotal = reviewChecklist.length;
  const checklistCompleted = reviewChecklist.filter((item) => item.complete).length;
  const checklistProgressPercent = checklistTotal
    ? Math.round((checklistCompleted / checklistTotal) * 100)
    : 100;
  const canApproveForUi = Boolean(vendor.canApprove);

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      {loadError ? (
        <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-8 text-center text-[15px] font-medium text-[#9f4d33]">
          {loadError}
        </div>
      ) : null}

      <section className="rounded-[18px] border border-[#ddd2c9] bg-[#f6ede4] shadow-[0_8px_24px_rgba(53,34,20,0.05)]">
        <div className="flex flex-col gap-6 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#cf6e38] transition hover:underline"
              onClick={() => navigate("/vendors")}
              type="button"
            >
              <ArrowLeft size={16} />
              Back to vendors
            </button>
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div className="flex min-w-0 gap-4">
              <img
                alt={vendor.name}
                className="h-20 w-20 rounded-[16px] object-cover shadow-[0_8px_18px_rgba(53,34,20,0.14)]"
                src={vendor.assets.logoUrl || vendor.logoUrl}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[40px] font-extrabold tracking-[-0.04em] text-[#17110d]">
                    {vendor.name}
                  </h1>
                  <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${getApplicationBadgeClass(vendor.applicationStatus)}`}>
                    {vendor.applicationStatus}
                  </span>
                  {!canApproveForUi ? (
                    <span className="rounded-full bg-[#fff3f0] px-3 py-1.5 text-[11px] font-bold text-[#c53a2f]">
                      Approval Blocked
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#eef9f1] px-3 py-1.5 text-[11px] font-bold text-[#287d46]">
                      Ready to Approve
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-medium text-[#6f6259]">
                  <span>ID: {vendor.id}</span>
                  <span className="inline-flex items-center gap-1"><UserRound size={12} /> {vendor.owner}</span>
                  <span className="inline-flex items-center gap-1"><Clock3 size={12} /> Submitted {vendor.submittedDate}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12} /> {vendor.location}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#d8ccc2] bg-white px-4 py-2.5 text-[14px] font-bold text-[#6a5c53]"
                onClick={handleRequestChanges}
                type="button"
              >
                Request Changes
              </button>
              <button
                className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#efbbb3] bg-white px-4 py-2.5 text-[14px] font-bold text-[#c53a2f]"
                onClick={handleReject}
                type="button"
              >
                <XCircle size={13} />
                Reject
              </button>
              <button
                className={[
                  "inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(215,104,51,0.24)]",
                  vendor.canApprove ? "bg-[#d76833]" : "cursor-not-allowed bg-[#d9c7be]",
                ].join(" ")}
                disabled={!vendor.canApprove}
                onClick={handleApprove}
                type="button"
              >
                <CheckCircle2 size={13} />
                Approve Vendor
              </button>
            </div>
          </div>
        </div>
      </section>

      {!canApproveForUi && missingRequirements.length ? (
        <section className="rounded-[16px] border border-[#f2c7b9] bg-[#fff7f3] px-5 py-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:px-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 text-[#c53a2f]" size={18} />
            <div>
              <h2 className="text-[18px] font-bold text-[#7b251b]">Missing requirements</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {missingRequirements.map((item) => (
                  <span
                    key={`${item.code}-${item.label}`}
                    className="rounded-full border border-[#f0bcae] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#8d3f16]"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <SectionTitle title="Storefront Assets" subtitle="Logo and cover photo are returned separately from legal compliance documents." />
        <div className="grid gap-4 md:grid-cols-2">
          <AssetCard imageUrl={vendor.assets.logoUrl || vendor.logoUrl} label="Logo" />
          <AssetCard imageUrl={vendor.assets.coverImageUrl} label="Cover Image" />
        </div>
      </section>

      <section>
        <SectionTitle title="Readiness Checklist" subtitle="Approval is only allowed when all required checklist items are complete." />
        <article className="rounded-[16px] border border-[#ddd2c9] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[15px] font-bold text-[#18120f]">Review Progress</p>
              <p className="mt-1 text-[13px] text-[#8d8078]">Complete all mandatory checks before approval</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[22px] font-extrabold text-[#dd6b34]">
                {checklistCompleted}/{checklistTotal}
              </p>
              <p className="text-[13px] text-[#8d8078]">Tasks Completed</p>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eee7e0]">
            <div className="h-full rounded-full bg-[#dd6b34]" style={{ width: `${checklistProgressPercent}%` }} />
          </div>

          <div className="mt-4 space-y-3">
            {reviewChecklist.map((item) => (
              <ChecklistItem key={item.code || item.label} item={item} />
            ))}
          </div>
        </article>
      </section>

      <section>
        <SectionTitle
          title="Compliance Documents"
          subtitle="Review uploaded legal and operational documents before approving this vendor."
        />
        {vendor.documents.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {vendor.documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDownload={(item) => handleDocumentAccess(item, "download")}
                onPreview={(item) => handleDocumentAccess(item, "preview")}
                onReview={handleReviewDocument}
              />
            ))}
          </div>
        ) : (
          <article className="rounded-[16px] border border-dashed border-[#ddd2c9] bg-white px-5 py-8 text-center text-[14px] text-[#7d7068]">
            No compliance documents have been uploaded yet.
          </article>
        )}
      </section>

      <section>
        <SectionTitle title="Review History" subtitle="Audit trail of document review activity and admin actions." />
        {vendor.documentReviewHistory.length ? (
          <div className="space-y-3">
            {vendor.documentReviewHistory.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <article className="rounded-[16px] border border-dashed border-[#ddd2c9] bg-white px-5 py-8 text-center text-[14px] text-[#7d7068]">
            No review history has been recorded yet.
          </article>
        )}
      </section>

      <section className="rounded-[16px] border border-[#ddd2c9] bg-white px-5 py-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:px-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 text-[#cf6e38]" size={18} />
          <div>
            <h2 className="text-[18px] font-bold text-[#18120f]">Approval Safety</h2>
            <p className="mt-2 text-[14px] leading-7 text-[#6f6259]">
              Approval is blocked until all required checklist items are complete.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
