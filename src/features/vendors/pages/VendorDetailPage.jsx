import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  approveVendorPayoutProfileRequest,
  requestVendorPayoutProfileChangesRequest,
} from "../../payouts/api/paymentsApi.js";
import {
  deactivateVendorRequest,
  deleteVendorRequest,
  getAdminVendorDetailRequest,
  getAdminVendorMenuDetailRequest,
  getVendorDocumentAccessRequest,
  updateVendorStatusRequest,
} from "../api/vendorsApi.js";
import VendorBusinessOverviewSection from "../components/details/VendorBusinessOverviewSection.jsx";
import VendorDangerZoneSection from "../components/details/VendorDangerZoneSection.jsx";
import VendorDetailHeader from "../components/details/VendorDetailHeader.jsx";
import VendorDetailStatCard from "../components/details/VendorDetailStatCard.jsx";
import VendorFinancialPerformanceSection from "../components/details/VendorFinancialPerformanceSection.jsx";
import VendorPublishedMenusSection from "../components/details/VendorPublishedMenusSection.jsx";
import VendorPayoutProfileSection from "../components/details/VendorPayoutProfileSection.jsx";
import VendorRecentOrdersSection from "../components/details/VendorRecentOrdersSection.jsx";
import VendorReviewsSection from "../components/details/VendorReviewsSection.jsx";
import VendorVerificationSection from "../components/details/VendorVerificationSection.jsx";

function LoadingState() {
  return (
    <div className="mx-auto max-w-6xl space-y-5 px-0 sm:space-y-6">
      <div className="h-44 animate-pulse rounded-[18px] border border-[#ddd6cf] bg-white" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-[16px] border border-[#ddd6cf] bg-white" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-[16px] border border-[#ddd6cf] bg-white" />
    </div>
  );
}

export default function VendorDetailPage() {
  const { vendorId } = useParams();
  const [activeSection, setActiveSection] = useState("overview");
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSuspending, setIsSuspending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApprovingPayoutProfile, setIsApprovingPayoutProfile] = useState(false);
  const [isRequestingPayoutProfileChanges, setIsRequestingPayoutProfileChanges] = useState(false);
  const sectionRefs = useRef({});

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "menus", label: "Menus" },
    { id: "orders", label: "Orders" },
    { id: "earnings", label: "Earnings" },
    { id: "payout-profile", label: "Bank Profile" },
    { id: "reviews", label: "Reviews" },
    { id: "documents", label: "Documents" },
    { id: "admin-actions", label: "Admin Actions" },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadVendor() {
      setIsLoading(true);
      setLoadError("");

      try {
        const detail = await getAdminVendorDetailRequest(decodeURIComponent(vendorId || ""));

        if (isMounted) {
          setVendor(detail);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load this vendor.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVendor();

    return () => {
      isMounted = false;
    };
  }, [vendorId]);

  useEffect(() => {
    if (!vendor) {
      return;
    }

    if (window.location.hash === "#menus") {
      window.setTimeout(() => {
        sectionRefs.current.menus?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setActiveSection("menus");
      }, 0);
    }
  }, [vendor]);

  function handleSectionChange(sectionId) {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handlePreviewDocument(document) {
    try {
      const access = await getVendorDocumentAccessRequest(document.id);
      window.open(access.previewUrl || access.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to preview document",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  async function handleDownloadDocument(document) {
    try {
      const access = await getVendorDocumentAccessRequest(document.id);
      window.open(access.downloadUrl || access.previewUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to download document",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    }
  }

  async function handleViewMenu(menu) {
    return getAdminVendorMenuDetailRequest(menu.id);
  }

  async function handleSuspendVendor() {
    if (!vendor) {
      return;
    }

    if (vendor.applicationStatus === "Rejected") {
      await Swal.fire({
        icon: "info",
        title: "Application already rejected",
        text: "This vendor is currently in rejected application status. Use the review flow to approve again before changing account status.",
        confirmButtonColor: "#cf6e38",
      });
      return;
    }

    const isReactivating = vendor.status === "Suspended" || vendor.status === "Deactivated";

    const result = await Swal.fire({
      title: isReactivating ? "Reactivate vendor?" : "Suspend vendor?",
      text: isReactivating
        ? `Restore ${vendor.name} to active marketplace status?`
        : `${vendor.name} will be hidden from listings and stop receiving new orders.`,
      input: "text",
      inputLabel: "Reason",
      inputPlaceholder: isReactivating ? "Issue resolved" : "Compliance issue",
      showCancelButton: true,
      confirmButtonText: isReactivating ? "Reactivate vendor" : "Suspend vendor",
      cancelButtonText: "Cancel",
      confirmButtonColor: isReactivating ? "#2b9e62" : "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsSuspending(true);
      const response = isReactivating
        ? await updateVendorStatusRequest(vendor.id, "ACTIVE", result.value || "")
        : await deactivateVendorRequest(vendor.id, result.value || "");
      setVendor((current) =>
        current
          ? {
              ...current,
              status: response.status,
              rawStatus: response.rawStatus,
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: isReactivating ? "Vendor reactivated" : "Vendor suspended",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: isReactivating ? "Unable to reactivate vendor" : "Unable to suspend vendor",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsSuspending(false);
    }
  }

  async function handleDeactivateVendor() {
    if (!vendor) {
      return;
    }

    const result = await Swal.fire({
      title: "Deactivate vendor?",
      text: `This will deactivate ${vendor.name} while preserving historical records.`,
      input: "text",
      inputLabel: "Reason",
      inputPlaceholder: "Optional reason",
      showCancelButton: true,
      confirmButtonText: "Deactivate vendor",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deactivateVendorRequest(vendor.id, result.value || "");
      setVendor((current) =>
        current
          ? {
              ...current,
              status: response.status,
              rawStatus: response.rawStatus,
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: "Vendor deactivated",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to deactivate vendor",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleDeleteVendor() {
    if (!vendor) {
      return;
    }

    const result = await Swal.fire({
      title: "Delete vendor permanently?",
      text: `This will permanently remove ${vendor.name}. This cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Delete permanently",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d83f3f",
      cancelButtonColor: "#c8b9aa",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await deleteVendorRequest(vendor.id);
      await Swal.fire({
        icon: "success",
        title: "Vendor deleted",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
      window.location.assign("/vendors");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to delete vendor",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleApprovePayoutProfile() {
    if (!vendor?.id || vendor?.payoutProfile?.bankDetailsVerified) {
      return;
    }

    const payoutProfile = vendor.payoutProfile;
    const result = await Swal.fire({
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;color:#241a15;padding:0;">
          <div style="display:flex;flex-direction:column;gap:8px;">
            <span style="display:inline-flex;align-self:flex-start;align-items:center;gap:8px;border:1px solid #efcfbd;background:#fff4ec;color:#c96533;border-radius:999px;padding:7px 12px;font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;">
              High priority review
            </span>
            <div>
              <h2 style="margin:0;font-size:18px;font-weight:800;line-height:1.2;">Approve bank details</h2>
              <p style="margin:6px 0 0 0;font-size:13px;line-height:1.6;color:#6d5b51;">
                Confirm these payout details only after they match the vendor business records. This approval unlocks finance payout processing.
              </p>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;">
            <div style="border:1px solid #efdfd3;border-radius:18px;padding:10px 12px;background:linear-gradient(180deg,#ffffff 0%,#fcfaf8 100%);">
              <div style="font-size:10px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#a18f84;">Account holder</div>
              <div style="margin-top:6px;font-size:14px;font-weight:700;color:#1f1713;line-height:1.45;">${payoutProfile.accountHolderName || "Not provided"}</div>
            </div>
            <div style="border:1px solid #efdfd3;border-radius:18px;padding:10px 12px;background:linear-gradient(180deg,#ffffff 0%,#fcfaf8 100%);">
              <div style="font-size:10px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#a18f84;">Bank name</div>
              <div style="margin-top:6px;font-size:14px;font-weight:700;color:#1f1713;line-height:1.45;">${payoutProfile.bankName || "Not provided"}</div>
            </div>
            <div style="border:1px solid #efdfd3;border-radius:18px;padding:10px 12px;background:linear-gradient(180deg,#ffffff 0%,#fcfaf8 100%);">
              <div style="font-size:10px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#a18f84;">Account number</div>
              <div style="margin-top:6px;font-size:14px;font-weight:700;color:#1f1713;line-height:1.45;">${payoutProfile.accountNumber || "Not provided"}</div>
            </div>
          </div>

          <div style="border:1px solid #efdfd3;border-radius:22px;background:linear-gradient(180deg,#fffaf6 0%,#ffffff 100%);padding:12px;">
            <label for="vendor-payout-approve-note" style="display:block;margin-bottom:6px;font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#a57b64;">Verification note</label>
            <textarea id="vendor-payout-approve-note" class="swal2-textarea" placeholder="Example: Details matched company records and are approved for payout release." style="margin:0;width:100%;min-height:102px;border-radius:16px;border:1px solid #ead7ca;box-shadow:none;padding:12px 14px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      width: 760,
      confirmButtonText: "Approve bank details",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
      customClass: {
        popup: "w-[calc(100%-24px)] max-w-[760px] rounded-[28px] px-3 py-2 sm:px-4 sm:py-4",
        htmlContainer: "!mx-0 !px-0 !pb-0 !pt-0",
        actions: "!mt-1 flex w-full flex-col gap-2 px-2 pb-1 sm:flex-row sm:justify-center sm:px-0 sm:pb-0",
        confirmButton:
          "!m-0 !inline-flex !h-12 !w-full !items-center !justify-center !rounded-[16px] !bg-[linear-gradient(135deg,#d97342_0%,#c65b2d_100%)] !px-6 !text-[14px] !font-semibold !shadow-[0_16px_30px_rgba(198,91,45,0.24)] sm:!w-auto sm:!min-w-[190px]",
        cancelButton:
          "!m-0 !inline-flex !h-12 !w-full !items-center !justify-center !rounded-[16px] !border !border-[#e3d2c4] !bg-[#f8f1eb] !px-6 !text-[14px] !font-semibold !text-[#5f5149] sm:!w-auto sm:!min-w-[120px]",
      },
      didOpen: () => {
        const popup = Swal.getPopup();
        const textarea = document.getElementById("vendor-payout-approve-note");

        if (popup) {
          popup.style.padding = "0";
        }

        if (window.innerWidth < 640) {
          const cards = popup?.querySelectorAll("[style*='grid-template-columns']");
          cards?.forEach((card) => {
            card.style.gridTemplateColumns = "1fr";
          });
        }

        if (textarea) {
          textarea.style.fontSize = "16px";
        }
      },
      preConfirm: () => ({
        verificationNote:
          document.getElementById("vendor-payout-approve-note")?.value?.trim() || "",
      }),
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsApprovingPayoutProfile(true);
      const response = await approveVendorPayoutProfileRequest(vendor.id, result.value || {});
      setVendor((current) =>
        current
          ? {
              ...current,
              payoutProfile: {
                ...current.payoutProfile,
                ...response.payoutProfile,
              },
            }
          : current,
      );

      await Swal.fire({
        icon: "success",
        title: "Bank details approved",
        text: response.message,
        confirmButtonColor: "#cf6e38",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Unable to approve bank details",
        text: error instanceof Error ? error.message : "Please try again.",
        confirmButtonColor: "#cf6e38",
      });
    } finally {
      setIsApprovingPayoutProfile(false);
    }
  }

  async function handleRequestPayoutProfileChanges() {
    if (!vendor?.id) {
      return;
    }

    const result = await Swal.fire({
      title: "Request bank detail changes",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
          <div>
            <label for="vendor-payout-change-reason" style="display:block;margin-bottom:6px;font-size:13px;font-weight:600;">Reason</label>
            <textarea id="vendor-payout-change-reason" class="swal2-textarea" placeholder="Explain what the vendor needs to correct before payout can be verified." style="margin:0;width:100%;min-height:120px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Request changes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#cf6e38",
      cancelButtonColor: "#c8b9aa",
      preConfirm: () => {
        const reason =
          document.getElementById("vendor-payout-change-reason")?.value?.trim() || "";

        if (!reason) {
          Swal.showValidationMessage("Please add a reason for the requested changes.");
          return null;
        }

        return { reason };
      },
    });

    if (!result.isConfirmed || !result.value?.reason) {
      return;
    }

    try {
      setIsRequestingPayoutProfileChanges(true);
      const response = await requestVendorPayoutProfileChangesRequest(vendor.id, result.value);
      setVendor((current) =>
        current
          ? {
              ...current,
              payoutProfile: {
                ...current.payoutProfile,
                ...response.payoutProfile,
              },
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
    } finally {
      setIsRequestingPayoutProfileChanges(false);
    }
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!vendor) {
    return (
      <div className="rounded-[16px] border border-[#efd7cc] bg-white px-5 py-10 text-center text-[15px] font-medium text-[#9f4d33]">
        {loadError || "Unable to load this vendor."}
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

      <VendorDetailHeader
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        sections={sections}
        vendor={vendor}
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {vendor.summaryStats.map((stat) => (
          <VendorDetailStatCard key={stat.id || stat.label} {...stat} />
        ))}
      </section>

      <div ref={(node) => { sectionRefs.current.overview = node; }} className="scroll-mt-6">
        <VendorBusinessOverviewSection overview={vendor.overview} />
      </div>

      <div ref={(node) => { sectionRefs.current.menus = node; }} className="scroll-mt-6">
        <VendorPublishedMenusSection menus={vendor.publishedMenus} onViewMenu={handleViewMenu} tabs={vendor.menuTabs} />
      </div>

      <div ref={(node) => { sectionRefs.current.orders = node; }} className="scroll-mt-6">
        <VendorRecentOrdersSection orders={vendor.recentOrders} />
      </div>

      <div ref={(node) => { sectionRefs.current.earnings = node; }} className="scroll-mt-6">
        <VendorFinancialPerformanceSection financial={vendor.financial} />
      </div>

      <div ref={(node) => { sectionRefs.current["payout-profile"] = node; }} className="scroll-mt-6">
        <VendorPayoutProfileSection
          isApproving={isApprovingPayoutProfile}
          isRequestingChanges={isRequestingPayoutProfileChanges}
          onApprove={handleApprovePayoutProfile}
          onRequestChanges={handleRequestPayoutProfileChanges}
          vendor={vendor}
        />
      </div>

      <div ref={(node) => { sectionRefs.current.reviews = node; }} className="scroll-mt-6">
        <VendorReviewsSection summary={vendor.reviewsSummary} />
      </div>

      <div ref={(node) => { sectionRefs.current.documents = node; }} className="scroll-mt-6">
        <VendorVerificationSection
          documents={vendor.documents}
          onDownload={handleDownloadDocument}
          onPreview={handlePreviewDocument}
        />
      </div>

      <div ref={(node) => { sectionRefs.current["admin-actions"] = node; }} className="scroll-mt-6">
        <VendorDangerZoneSection
          dangerZone={vendor.dangerZone}
          deleteLabel="Deactivate Vendor"
          isDeleting={isDeleting}
          isSuspending={isSuspending}
          onDelete={handleDeactivateVendor}
          onSuspend={handleSuspendVendor}
          suspendLabel={
            vendor.applicationStatus === "Rejected"
              ? "Application Rejected"
              : vendor.status === "Suspended" || vendor.status === "Deactivated"
                ? "Reactivate Account"
                : "Suspend Account"
          }
          vendorName={vendor.name}
        />
      </div>
    </div>
  );
}
