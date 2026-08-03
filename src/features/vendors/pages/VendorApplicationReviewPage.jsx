import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Eye,
  MapPin,
  MessageSquare,
  Share2,
  Star,
  Clock3,
  Upload,
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

function SectionTitle({ title }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="h-6 w-[4px] rounded-full bg-[#dc6a34]" />
      <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#1d1510]">{title}</h2>
    </div>
  );
}

function InfoGrid({ items }) {
  return (
    <div className="grid gap-0 md:grid-cols-2">
      {items.map((column, index) => (
        <div
          key={index}
          className={`space-y-5 px-5 py-5 sm:px-6 ${index === 0 ? "border-b border-[#e5ddd6] md:border-b-0 md:border-r" : ""}`}
        >
          {column.map((item) => (
            <div key={item.label}>
              <p className="text-[13px] font-medium text-[#8d8078]">{item.label}</p>
              <p className="mt-1.5 text-[18px] font-bold leading-7 text-[#1d1510]">{item.value}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function OperatingDayPill({ day, active }) {
  return (
    <span
      className={[
        "inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2.5 text-[11px] font-bold",
        active ? "bg-[#f7b28c] text-[#8d3f16]" : "bg-[#f1ece7] text-[#b0a39a]",
      ].join(" ")}
    >
      {day}
    </span>
  );
}

function DocumentCard({ document, onDownload, onPreview, onReview }) {
  return (
    <article className="rounded-[16px] border border-[#d8d0c8] bg-white p-4 shadow-[0_6px_14px_rgba(53,34,20,0.05)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[16px] font-bold text-[#1c1510]">{document.title}</h3>
          <p className="mt-1 text-[12px] text-[#8d8078]">{document.subtitle}</p>
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

      <div className="mt-3 flex gap-2">
        <button
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#f3f0ed] px-3 py-2.5 text-[12px] font-bold text-[#1c1510] transition hover:bg-[#ebe6e1]"
          onClick={() => onPreview(document)}
          type="button"
        >
          <Eye size={12} />
          Preview
        </button>
        <button
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#f3f0ed] px-3 py-2.5 text-[12px] font-bold text-[#1c1510] transition hover:bg-[#ebe6e1]"
          onClick={() => onDownload(document)}
          type="button"
        >
          <Upload size={12} />
          Download
        </button>
      </div>

      <button
        className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-[#d8ccc2] px-3 py-2 text-[12px] font-bold text-[#cf6e38] transition hover:bg-[#fff2ea]"
        onClick={() => onReview(document)}
        type="button"
      >
        Review Status
      </button>
    </article>
  );
}

function MenuCard({ menu }) {
  return (
    <article className="overflow-hidden rounded-[16px] border border-[#d9d0c8] bg-white shadow-[0_8px_18px_rgba(53,34,20,0.05)]">
      <div className="relative">
        <img alt={menu.title} className="h-32 w-full object-cover" src={menu.imageUrl} />
        <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#6a5b51]">
          {menu.badge}
        </span>
      </div>
      <div className="space-y-2.5 p-4">
        <div>
          <h3 className="text-[15px] font-bold text-[#1c1510]">{menu.title}</h3>
          <p className="mt-1 text-[11px] leading-5 text-[#8a7d76]">{menu.description}</p>
        </div>
        <p className="text-[15px] font-extrabold text-[#1c1510]">{menu.price}</p>
      </div>
    </article>
  );
}

function ChecklistItem({ item }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="pt-0.5">
        {item.complete ? (
          <CheckCircle2 size={14} className="text-[#de6b34]" />
        ) : (
          <Circle size={14} className="text-[#b8aaa0]" />
        )}
      </span>
      <p className={`text-[13px] leading-6 ${item.complete ? "text-[#6c5d54]" : "text-[#8d8078]"}`}>{item.label}</p>
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

  async function handleDocumentAccess(document, kind) {
    try {
      const access = await getVendorDocumentAccessRequest(document.id);
      window.open(
        kind === "preview" ? access.previewUrl || access.downloadUrl : access.downloadUrl || access.previewUrl,
        "_blank",
        "noopener,noreferrer",
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
    const { value } = await Swal.fire({
      title: "Review vendor document",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <select id="vendor-document-status" class="swal2-select" style="display:flex;width:100%;margin:0;">
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <textarea id="vendor-document-note" class="swal2-textarea" placeholder="Optional review note"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save review",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d96834",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => ({
        status: document.getElementById ? "" : "", // noop placeholder for lint-free template execution
      }),
      didOpen: () => {
        const statusElement = window.document.getElementById("vendor-document-status");
        if (statusElement) {
          statusElement.value =
            document.status === "Verified" ? "VERIFIED" : document.status === "Rejected" ? "REJECTED" : "PENDING";
        }
      },
    });

    const status = window.document.getElementById("vendor-document-status")?.value || "";
    const note = window.document.getElementById("vendor-document-note")?.value || "";

    if (!value && !status) {
      return;
    }

    try {
      const response = await reviewVendorDocumentRequest(document.id, { status, note });
      setVendor((current) =>
        current
          ? {
              ...current,
              documents: current.documents.map((item) =>
                item.id === document.id
                  ? {
                      ...item,
                      status: response.status,
                      reviewedAt: response.reviewedAt,
                    }
                  : item,
              ),
            }
          : current,
      );

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

    const { isConfirmed } = await Swal.fire({
      title: "Approve vendor application?",
      text: `This will approve ${vendor.name} and activate the vendor.`,
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
      const response = await approveVendorApplicationRequest(vendor.id, {
        note: "Approved by admin",
        activateImmediately: true,
      });

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
          <input id="vendor-change-fields" class="swal2-input" placeholder="Fields (comma separated)" />
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
                src={vendor.logoUrl}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[40px] font-extrabold tracking-[-0.04em] text-[#17110d]">
                    {vendor.name}
                  </h1>
                  <span className="rounded-full bg-[#f2c49d] px-3 py-1.5 text-[11px] font-bold text-[#6f3a16]">
                    {vendor.applicationStatus}
                  </span>
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
              <button className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#d8ccc2] bg-white px-4 py-2.5 text-[14px] font-bold text-[#6a5c53]" onClick={handleRequestChanges} type="button">
                <MessageSquare size={13} />
                Request Changes
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#efbbb3] bg-white px-4 py-2.5 text-[14px] font-bold text-[#c53a2f]" onClick={handleReject} type="button">
                <XCircle size={13} />
                Reject
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#d76833] px-4 py-2.5 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(215,104,51,0.24)]" onClick={handleApprove} type="button">
                <CheckCircle2 size={13} />
                Approve Vendor
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[16px] border border-[#ddd2c9] bg-white px-5 py-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:px-6">
        <h2 className="text-[28px] font-extrabold italic tracking-[-0.02em] text-[#df6b34]">Administrative Verification Required</h2>
        <p className="mt-2 text-[15px] leading-7 text-[#6f6259]">
          This application is in the final stage of review. Admin must verify all legal documentation and operational
          parameters before the vendor becomes active on the consumer marketplace.
        </p>
      </section>

      <section>
        <SectionTitle title="Business Summary" />
        <div className="overflow-hidden rounded-[16px] border border-[#ddd2c9] bg-white shadow-[0_6px_16px_rgba(53,34,20,0.04)]">
          <InfoGrid items={vendor.businessSummary} />
        </div>
      </section>

      <section>
        <SectionTitle title="Business Profile" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_320px]">
          <article className="rounded-[16px] border border-[#ddd2c9] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:p-6">
            <h3 className="text-[22px] font-bold text-[#18120f]">Store Description</h3>
            <p className="mt-4 rounded-[10px] bg-[#f3f1ef] p-4 text-[15px] leading-7 text-[#65574f]">
              {vendor.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {vendor.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#d9d0c8] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#7b6e65]">
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-[16px] border border-[#ddd2c9] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:p-6">
            <h3 className="text-[22px] font-bold text-[#18120f]">Operations</h3>
            <div className="mt-3 space-y-3">
              {vendor.operations.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 text-[15px]">
                  <span className="text-[#8a7d76]">{item.label}</span>
                  <span className="font-bold text-[#18120f]">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-[15px] font-bold text-[#18120f]">Operating Days</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {vendor.operatingDays.map((day) => (
                  <OperatingDayPill key={day.label} active={day.active} day={day.day} />
                ))}
              </div>
              <p className="mt-2 text-[12px] text-[#8d8078]">{vendor.operatingHours}</p>
            </div>
          </article>
        </div>
      </section>

      <section>
        <SectionTitle title="Document Verification" />
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
      </section>

      <section>
        <SectionTitle title="Marketplace Store Preview" />
        <article className="overflow-hidden rounded-[18px] border border-[#ddd2c9] bg-white shadow-[0_8px_18px_rgba(53,34,20,0.04)]">
          <img alt={vendor.preview.name} className="h-[220px] w-full object-cover" src={vendor.preview.coverImage} />
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <img alt={vendor.preview.name} className="h-24 w-24 rounded-[14px] object-cover" src={vendor.preview.logoImage} />
              <div>
                <h3 className="text-[28px] font-extrabold text-[#18120f]">{vendor.preview.name}</h3>
                <div className="mt-2 flex items-center gap-1 text-[15px] text-[#6e6058]">
                  <Star size={12} className="fill-[#f5ad2b] text-[#f5ad2b]" />
                  <span>{vendor.preview.rating}</span>
                  <span className="text-[#5f9ad5]">({vendor.preview.reviews} reviews)</span>
                </div>
                <p className="mt-1 text-[15px] text-[#6e6058]">{vendor.preview.address}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1 rounded-full border border-[#d8ccc2] px-3.5 py-2 text-[12px] font-bold text-[#53463f]" type="button">
                <Share2 size={11} />
                Share
              </button>
            </div>
          </div>
        </article>
      </section>

      <section>
        <SectionTitle title="Submitted Menus" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vendor.submittedMenus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Verification Checklist" />
        <article className="rounded-[16px] border border-[#ddd2c9] bg-white p-5 shadow-[0_6px_16px_rgba(53,34,20,0.04)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[15px] font-bold text-[#18120f]">Review Progress</p>
              <p className="mt-1 text-[13px] text-[#8d8078]">Complete all mandatory checks before approval</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[22px] font-extrabold text-[#dd6b34]">{vendor.checklistCompleted}/{vendor.checklist.length}</p>
              <p className="text-[13px] text-[#8d8078]">Tasks Completed</p>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eee7e0]">
            <div className="h-full rounded-full bg-[#dd6b34]" style={{ width: `${vendor.progressPercent}%` }} />
          </div>

          <div className="mt-4 space-y-3">
            {vendor.checklist.map((item) => (
              <ChecklistItem key={item.label} item={item} />
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
