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
    <article className="rounded-[16px] border border-[#d8d0c8] bg-white p-4 shadow-[0_6px_14px_rgba(53,34,20,0.05)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[16px] font-bold text-[#1c1510]">{document.title}</h3>
          <p className="mt-1 text-[12px] text-[#8d8078]">{document.subtitle || document.type}</p>
        </div>
        <span
          className={[
            "rounded-full border px-2.5 py-1 text-[10px] font-bold",
            document.status === "Verified"
              ? "border-[#d9ddd8] bg-[#ffffff] text-[#1d1510]"
              : document.status === "Rejected"
                ? "border-[#f3c7c7] bg-[#fff5f5] text-[#b83a3a]"
                : "border-[#ead9c9] bg-[#fff8f1] text-[#8f5a2e]",
          ].join(" ")}
        >
          {document.status}
        </span>
      </div>

      <div className="mt-3 grid gap-2 text-[12px] text-[#8d8078]">
        <p>Uploaded: {document.uploadedAtLabel}</p>
        <p>Reviewed: {document.reviewedAt ? document.reviewedAtLabel : "Not reviewed yet"}</p>
        <p>{document.isRequired ? "Required compliance document" : "Optional document"}</p>
      </div>

      {document.reviewNote ? (
        <div className="mt-3 rounded-[12px] bg-[#f7f3f0] px-3 py-2 text-[12px] leading-5 text-[#6f6259]">
          <span className="font-bold text-[#433630]">Review note:</span> {document.reviewNote}
        </div>
      ) : null}

      {document.rejectionReason ? (
        <div className="mt-2 rounded-[12px] bg-[#fff5f5] px-3 py-2 text-[12px] leading-5 text-[#b83a3a]">
          <span className="font-bold">Reason:</span> {document.rejectionReason}
        </div>
      ) : null}

      <div className="mt-3 flex gap-2">
        <button
          className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#f3f0ed] px-3 py-2.5 text-[12px] font-bold text-[#1c1510] transition hover:bg-[#ebe6e1]"
          onClick={() => onPreview(document)}
          type="button"
        >
          <Eye size={12} />
          Preview
        </button>
        <button
          className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#f3f0ed] px-3 py-2.5 text-[12px] font-bold text-[#1c1510] transition hover:bg-[#ebe6e1]"
          onClick={() => onDownload(document)}
          type="button"
        >
          <Download size={12} />
          Download
        </button>
      </div>

      <button
        className="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-[#d8ccc2] px-3 py-2 text-[12px] font-bold text-[#cf6e38] transition hover:bg-[#fff2ea]"
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
        <p className="text-[13px] font-bold text-[#231913]">{item.action}</p>
        <p className="text-[12px] text-[#8d8078]">{item.createdAtLabel}</p>
      </div>
      <p className="mt-1 text-[12px] font-medium text-[#7a6d66]">By {item.actorName}</p>
    </div>
  );
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
      title: "Review vendor document",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <select id="vendor-document-status" class="swal2-select" style="display:flex;width:100%;margin:0;">
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <textarea id="vendor-document-note" class="swal2-textarea" placeholder="Review note"></textarea>
          <input id="vendor-document-reason" class="swal2-input" placeholder="Rejection reason (required for rejected)" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save review",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
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

        if (statusElement) {
          statusElement.value = document.rawStatus || "PENDING";
        }
        if (noteElement) {
          noteElement.value = document.reviewNote || "";
        }
        if (reasonElement) {
          reasonElement.value = document.rejectionReason || "";
        }
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
        text: "Required compliance documents or checklist items are still incomplete.",
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
      title: "Reject vendor application",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <input id="vendor-reject-reason" class="swal2-input" placeholder="Reason" />
          <textarea id="vendor-reject-note" class="swal2-textarea" placeholder="Optional note"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Reject application",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#c53a2f",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => {
        const reason = window.document.getElementById("vendor-reject-reason")?.value?.trim() || "";
        const note = window.document.getElementById("vendor-reject-note")?.value?.trim() || "";

        if (!reason) {
          Swal.showValidationMessage("Reason is required.");
          return null;
        }

        return { reason, note };
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

    const result = await Swal.fire({
      title: "Request application changes",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <textarea id="vendor-change-message" class="swal2-textarea" placeholder="Message for vendor"></textarea>
          <input id="vendor-change-fields" class="swal2-input" placeholder="Checklist codes (comma separated)" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Request changes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => {
        const message = window.document.getElementById("vendor-change-message")?.value?.trim() || "";
        const fieldsValue = window.document.getElementById("vendor-change-fields")?.value?.trim() || "";

        if (!message) {
          Swal.showValidationMessage("A message is required.");
          return null;
        }

        return {
          message,
          fields: fieldsValue
            ? fieldsValue.split(",").map((item) => item.trim()).filter(Boolean)
            : [],
        };
      },
    });

    if (!result.value) {
      return;
    }

    try {
      const response = await requestVendorApplicationChangesRequest(vendor.id, result.value);
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
                  <span className="rounded-full bg-[#f2c49d] px-3 py-1.5 text-[11px] font-bold text-[#6f3a16]">
                    {vendor.applicationStatus}
                  </span>
                  {!vendor.canApprove ? (
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

      {!vendor.canApprove && vendor.missingRequirements.length ? (
        <section className="rounded-[16px] border border-[#f2c7b9] bg-[#fff7f3] px-5 py-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:px-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 text-[#c53a2f]" size={18} />
            <div>
              <h2 className="text-[18px] font-bold text-[#7b251b]">Missing requirements</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {vendor.missingRequirements.map((item) => (
                  <span
                    key={item.code}
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
        <SectionTitle title="Compliance Documents" subtitle="Only real legal or compliance documents can be reviewed here." />
        {vendor.documents.length ? (
          <div className="grid gap-4 md:grid-cols-2">
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
            No compliance documents were returned for this application yet.
          </article>
        )}
      </section>

      <section>
        <SectionTitle title="Readiness Checklist" subtitle="Approval is only allowed when all blocking checklist items are complete." />
        <article className="rounded-[16px] border border-[#ddd2c9] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[15px] font-bold text-[#18120f]">Review Progress</p>
              <p className="mt-1 text-[13px] text-[#8d8078]">Complete all mandatory checks before approval</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[22px] font-extrabold text-[#dd6b34]">
                {vendor.checklistCompleted}/{vendor.checklistTotal}
              </p>
              <p className="text-[13px] text-[#8d8078]">Tasks Completed</p>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eee7e0]">
            <div className="h-full rounded-full bg-[#dd6b34]" style={{ width: `${vendor.progressPercent}%` }} />
          </div>

          <div className="mt-4 space-y-3">
            {vendor.checklist.map((item) => (
              <ChecklistItem key={item.code || item.label} item={item} />
            ))}
          </div>
        </article>
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
              Approval is blocked until required compliance documents are verified and all blocking checklist items are complete.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
